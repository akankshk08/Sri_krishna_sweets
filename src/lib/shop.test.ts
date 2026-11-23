import { describe, expect, it } from 'vitest';
import { DEPARTMENTS, GIFT_BOXES, allProducts, kg } from '../data/catalog';
import { cartReducer, cartTotal, MAX_QTY, parseStoredCart, toRows } from './cart';
import type { CartLine } from './cart';
import { formatINR } from './format';
import { normaliseMobile, validateCustomer } from './validation';
import { buildOrderMessage, whatsappUrl } from './whatsapp';

const customer = {
  name: 'Asha Rao',
  mobile: '+91 98765 43210',
  address: '12 MG Road, Bengaluru 560001',
  notes: '',
};

describe('catalog', () => {
  it('has 4 sweet and 4 namkeen categories with 4 products each', () => {
    for (const d of DEPARTMENTS) {
      expect(d.categories).toHaveLength(4);
      d.categories.forEach((c) => expect(c.products).toHaveLength(4));
    }
  });
  it('gives every product a unique id and its own image', () => {
    const all = allProducts();
    expect(new Set(all.map((p) => p.id)).size).toBe(all.length);
    expect(new Set(all.map((p) => p.image)).size).toBe(all.length);
    expect(all.length).toBe(32 + GIFT_BOXES.length);
  });
  it('offers 100g–1kg for namkeens', () => {
    const n = DEPARTMENTS[1].categories[0].products[0];
    expect(n.options.map((o) => o.id)).toEqual(['100g', '250g', '500g', '1kg']);
  });
  it('derives pack prices from the kg price, rounded to ₹5', () => {
    expect(kg(1200, ['250g', '1kg'])).toEqual([
      { id: '250g', label: '250 g', price: 300 },
      { id: '1kg', label: '1 kg', price: 1200 },
    ]);
    expect(kg(380, ['100g'])[0].price).toBe(40);
  });
});

describe('cart reducer', () => {
  const add = (s: CartLine[], productId: string, optionId: string) =>
    cartReducer(s, { type: 'add', productId, optionId });

  it('adds, merges same product+weight, and keeps weights separate', () => {
    let s = add([], 'kaju-katli', '250g');
    s = add(s, 'kaju-katli', '250g');
    s = add(s, 'kaju-katli', '500g');
    expect(s).toEqual([
      { productId: 'kaju-katli', optionId: '250g', qty: 2 },
      { productId: 'kaju-katli', optionId: '500g', qty: 1 },
    ]);
  });
  it('ignores unknown products and options', () => {
    expect(add([], 'nope', '250g')).toEqual([]);
    expect(add([], 'kaju-katli', '100g')).toEqual([]); // sweets have no 100 g pack
  });
  it('sets quantity, removes at 0, and caps at MAX_QTY', () => {
    let s = add([], 'mixture', '250g');
    s = cartReducer(s, { type: 'setQty', productId: 'mixture', optionId: '250g', qty: 999 });
    expect(s[0].qty).toBe(MAX_QTY);
    s = cartReducer(s, { type: 'setQty', productId: 'mixture', optionId: '250g', qty: 0 });
    expect(s).toEqual([]);
  });
  it('removes and clears', () => {
    let s = add(add([], 'mixture', '250g'), 'rasgulla', '1kg');
    s = cartReducer(s, { type: 'remove', productId: 'mixture', optionId: '250g' });
    expect(s.map((l) => l.productId)).toEqual(['rasgulla']);
    expect(cartReducer(s, { type: 'clear' })).toEqual([]);
  });
  it('totals use catalog prices', () => {
    const s = [
      { productId: 'kaju-katli', optionId: '250g', qty: 2 },
      { productId: 'mysore-pak', optionId: '500g', qty: 1 },
      { productId: 'mixture', optionId: '250g', qty: 1 },
    ];
    expect(cartTotal(toRows(s))).toBe(300 * 2 + 250 + 100);
  });
});

describe('stored cart parsing', () => {
  it('survives garbage and tampering', () => {
    expect(parseStoredCart(null)).toEqual([]);
    expect(parseStoredCart('{not json')).toEqual([]);
    expect(parseStoredCart('{"a":1}')).toEqual([]);
    const raw = JSON.stringify([
      { productId: 'kaju-katli', optionId: '250g', qty: 3, price: 1 },
      { productId: 'kaju-katli', optionId: '250g', qty: 'x' },
      { productId: '<script>', optionId: '250g', qty: 1 },
      { productId: 'mixture', optionId: '1kg', qty: 9999 },
    ]);
    expect(parseStoredCart(raw)).toEqual([
      { productId: 'kaju-katli', optionId: '250g', qty: 3 },
      { productId: 'mixture', optionId: '1kg', qty: MAX_QTY },
    ]);
  });
});

describe('validation', () => {
  it('accepts common Indian mobile formats', () => {
    expect(normaliseMobile('98765 43210')).toBe('9876543210');
    expect(normaliseMobile('+91-98765-43210')).toBe('9876543210');
    expect(normaliseMobile('09876543210')).toBe('9876543210');
    expect(normaliseMobile('12345')).toBeNull();
    expect(normaliseMobile('5876543210')).toBeNull();
  });
  it('reports friendly field errors', () => {
    const e = validateCustomer({ name: '', mobile: '1', address: 'short', notes: '' });
    expect(Object.keys(e).sort()).toEqual(['address', 'mobile', 'name']);
    expect(validateCustomer(customer)).toEqual({});
  });
});

describe('WhatsApp message', () => {
  const rows = toRows([
    { productId: 'kaju-katli', optionId: '250g', qty: 2 },
    { productId: 'mixture', optionId: '250g', qty: 1 },
  ]);

  it('lists every line with weight, qty and line total, then the grand total', () => {
    const msg = buildOrderMessage(rows, customer);
    expect(msg).toContain('Customer Name: Asha Rao');
    expect(msg).toContain('1. Kaju Katli – 250 g – Qty 2 – ₹600');
    expect(msg).toContain('2. Mixture – 250 g – Qty 1 – ₹100');
    expect(msg).toContain('Total Amount: ₹700');
    expect(msg).toContain('Please confirm my order.');
    expect(msg).not.toContain('Additional Instructions');
  });
  it('includes notes and strips control characters', () => {
    const msg = buildOrderMessage(rows, {
      ...customer,
      name: 'Asha\u0007  Rao',
      notes: 'Ring bell\u0000 twice',
    });
    expect(msg).toContain('Customer Name: Asha Rao');
    expect(msg).toContain('Additional Instructions: Ring bell twice');
  });
  it('builds an encoded wa.me URL that decodes back to the message', () => {
    const msg = buildOrderMessage(rows, { ...customer, notes: 'A&B #1 ?=' });
    const url = whatsappUrl(msg, '91 98765-43210');
    expect(url.startsWith('https://wa.me/919876543210?text=')).toBe(true);
    expect(decodeURIComponent(url.split('?text=')[1])).toBe(msg);
    expect(url.split('?text=')[1]).not.toMatch(/[\s&#?=]/);
  });
  it('formats rupees with Indian grouping', () => {
    expect(formatINR(125000)).toBe('₹1,25,000');
  });
});
