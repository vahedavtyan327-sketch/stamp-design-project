import base64
import json
import os
import smtplib
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email import encoders


def handler(event: dict, context) -> dict:
    """Принимает заявки из формы контактов и заказы из корзины,
    отправляет их на почту zakaz@stampcopy.com через SMTP Mail.ru.
    Поддерживает вложение файла (например, оттиска печати) в base64."""
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    if method != 'POST':
        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}

    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Invalid JSON'})}

    req_type = body.get('type')

    sender = 'info@stampcopy.com'
    recipient = 'zakaz@stampcopy.com'
    password = os.environ.get('SMTP_PASSWORD')

    if not password:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': 'SMTP не настроен'})}

    if req_type == 'contact':
        name = body.get('name', '')
        phone = body.get('phone', '')
        message = body.get('message', '')
        if not name or not phone or not message:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Заполните все поля'})}

        subject = f'Новое сообщение с сайта от {name}'
        html = f"""
        <h2>Новое сообщение с формы обратной связи</h2>
        <p><b>Имя:</b> {name}</p>
        <p><b>Телефон:</b> {phone}</p>
        <p><b>Сообщение:</b> {message}</p>
        """

    elif req_type == 'order':
        items = body.get('items', [])
        total = body.get('total', 0)
        contact = body.get('contact', {})
        if not items:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Корзина пуста'})}

        rows = ''.join(
            f"<tr><td>{i.get('title','')}</td><td>{i.get('subtitle','')}</td><td>{i.get('price',0)} ₽</td></tr>"
            for i in items
        )
        subject = f'Новый заказ с сайта · {total} ₽'
        html = f"""
        <h2>Новый заказ из корзины</h2>
        <p><b>Имя:</b> {contact.get('name','—')}</p>
        <p><b>Телефон:</b> {contact.get('phone','—')}</p>
        <p><b>Адрес доставки:</b> {contact.get('address','—')}</p>
        <table border="1" cellpadding="6" cellspacing="0">
          <tr><th>Товар</th><th>Описание</th><th>Цена</th></tr>
          {rows}
        </table>
        <p><b>Итого: {total} ₽</b></p>
        """
    else:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Неизвестный тип заявки'})}

    msg = MIMEMultipart('mixed')
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    attachment = body.get('attachment')
    if attachment and attachment.get('data'):
        raw = attachment['data']
        if ',' in raw and raw.strip().startswith('data:'):
            raw = raw.split(',', 1)[1]
        try:
            file_bytes = base64.b64decode(raw)
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(file_bytes)
            encoders.encode_base64(part)
            filename = attachment.get('name', 'attachment')
            part.add_header('Content-Disposition', f'attachment; filename="{filename}"')
            msg.attach(part)
        except (ValueError, TypeError):
            pass

    with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
        server.login(sender, password)
        server.sendmail(sender, [recipient], msg.as_string())

    return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True})}
