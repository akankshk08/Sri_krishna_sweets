import { SHOP } from '../config';
import type { CartRow } from './cart';
import { cartTotal } from './cart';
import { formatINR } from './format';

export interface CustomerDetails {
  name: string;
  mobile: string;
  address: string;
  notes: string;
}

/** Remove control characters and collapse whitespace so the message stays tidy. */
function clean(value: string, max: number, keepNewlines = false): string {
  const noCtrl = Array.from(value, (ch) => {
    const code = ch.charCodeAt(0);
    const isCtrl = code < 32 || code === 127;
    return isCtrl && !(keepNewlines && ch === '\n') ? ' ' : ch;
  }).join('');
  const collapsed = keepNewlines
    ? noCtrl
        .split('\n')
        .map((l) => l.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .join('\n')
    : noCtrl.replace(/\s+/g, ' ').trim();
  return collapsed.slice(0, max);
}

export function buildOrderMessage(rows: CartRow[], c: CustomerDetails): string {
  const lines = [
    `Hello ${SHOP.name}!`,
    'I would like to place an order.',
    '',
    `Customer Name: ${clean(c.name, 60)}`,
    `Mobile: ${clean(c.mobile, 20)}`,
    `Delivery Address: ${clean(c.address, 300, true)}`,
    '',
    'Order Details:',
    ...rows.map(
      (r, i) => `${i + 1}. ${r.name} – ${r.optionLabel} – Qty ${r.qty} – ${formatINR(r.lineTotal)}`,
    ),
    '',
    `Total Amount: ${formatINR(cartTotal(rows))}`,
  ];
  const notes = clean(c.notes, 300, true);
  if (notes) lines.push('', `Additional Instructions: ${notes}`);
  lines.push('', 'Please confirm my order.', 'Thank you!');
  return lines.join('\n');
}

export function whatsappUrl(message: string, number: string = SHOP.WHATSAPP_NUMBER): string {
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

/** Plain chat link (no order) for footer / enquiry buttons. */
export function whatsappChatUrl(text = `Hello ${SHOP.name}! I have a question.`): string {
  return whatsappUrl(text);
}
