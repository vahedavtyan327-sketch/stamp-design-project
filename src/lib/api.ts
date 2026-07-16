import func2url from '../../backend/func2url.json';

export const SEND_ORDER_URL = func2url['send-order'];

export interface Attachment {
  name: string;
  data: string;
}

export interface ContactPayload {
  type: 'contact';
  name: string;
  phone: string;
  message: string;
  attachment?: Attachment;
}

export interface OrderPayload {
  type: 'order';
  items: { title: string; subtitle: string; price: number }[];
  total: number;
  contact: { name: string; phone: string; address: string };
}

export const sendRequest = async (payload: ContactPayload | OrderPayload) => {
  const res = await fetch(SEND_ORDER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Не удалось отправить заявку');
  }
  return res.json();
};