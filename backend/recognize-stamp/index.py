import json
import os
import urllib.request
import urllib.error


SYSTEM_PROMPT = (
    "Ты помогаешь распознавать оттиски печатей и штампов по фото. "
    "Верни СТРОГО JSON без пояснений и markdown. Структура:\n"
    "{\n"
    '  "shape": "circle" | "square" | "triangle",\n'
    '  "topText": "текст по верхней дуге внешнего кольца",\n'
    '  "bottomText": "текст по нижней дуге внешнего кольца",\n'
    '  "innerTopText": "текст по верхней дуге внутреннего кольца (или пусто)",\n'
    '  "innerBottomText": "текст по нижней дуге внутреннего кольца (или пусто)",\n'
    '  "centerText": "первая строка в центре (фамилия/название)",\n'
    '  "centerSub": "вторая строка в центре (имя) или пусто",\n'
    '  "centerSub2": "третья строка в центре (отчество) или пусто",\n'
    '  "showInnerRing": true | false,\n'
    '  "showCenterRing": true | false,\n'
    '  "symbol": "none" | "star" | "star8" | "dot" | "diamond",\n'
    '  "border": "single" | "double" | "dashed" | "none"\n'
    "}\n"
    "Сохраняй регистр текста как на оттиске. Если поля нет — ставь пустую строку. "
    "showInnerRing=true если есть второе (внутреннее) кольцо текста. "
    "showCenterRing=true если центр обведён отдельной окружностью. "
    "symbol — разделительный значок между дугами текста (звёздочка = star)."
)


def handler(event: dict, context) -> dict:
    """Распознаёт текст и форму загруженного оттиска печати через OpenAI Vision
    и возвращает JSON для заполнения полей онлайн-редактора макета."""
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

    image = body.get('image', '')
    if not image:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Изображение не передано'})}

    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': 'Распознавание не настроено'})}

    if not image.startswith('data:'):
        image = 'data:image/png;base64,' + image

    payload = {
        'model': 'gpt-4o',
        'max_tokens': 800,
        'response_format': {'type': 'json_object'},
        'messages': [
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {
                'role': 'user',
                'content': [
                    {'type': 'text', 'text': 'Распознай этот оттиск печати и верни JSON макета.'},
                    {'type': 'image_url', 'image_url': {'url': image}},
                ],
            },
        ],
    }

    req = urllib.request.Request(
        'https://api.openai.com/v1/chat/completions',
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        detail = e.read().decode('utf-8', 'ignore')
        return {'statusCode': 502, 'headers': headers, 'body': json.dumps({'error': 'Ошибка распознавания', 'detail': detail[:300]})}
    except Exception:
        return {'statusCode': 502, 'headers': headers, 'body': json.dumps({'error': 'Сервис распознавания недоступен'})}

    try:
        content = data['choices'][0]['message']['content']
        result = json.loads(content)
    except (KeyError, IndexError, json.JSONDecodeError):
        return {'statusCode': 502, 'headers': headers, 'body': json.dumps({'error': 'Не удалось разобрать ответ'})}

    allowed_shapes = {'circle', 'square', 'triangle'}
    allowed_symbols = {'none', 'star', 'star8', 'dot', 'diamond'}
    allowed_borders = {'single', 'double', 'dashed', 'none'}

    clean = {
        'shape': result.get('shape') if result.get('shape') in allowed_shapes else 'circle',
        'topText': str(result.get('topText', '') or ''),
        'bottomText': str(result.get('bottomText', '') or ''),
        'innerTopText': str(result.get('innerTopText', '') or ''),
        'innerBottomText': str(result.get('innerBottomText', '') or ''),
        'centerText': str(result.get('centerText', '') or ''),
        'centerSub': str(result.get('centerSub', '') or ''),
        'centerSub2': str(result.get('centerSub2', '') or ''),
        'showInnerRing': bool(result.get('showInnerRing', False)),
        'showCenterRing': bool(result.get('showCenterRing', False)),
        'symbol': result.get('symbol') if result.get('symbol') in allowed_symbols else 'none',
        'border': result.get('border') if result.get('border') in allowed_borders else 'single',
    }

    return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'config': clean})}