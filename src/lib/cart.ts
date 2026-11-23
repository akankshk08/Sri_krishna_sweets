import { findProduct } from '../data/catalog';

export const MAX_QTY = 50;
export const STORAGE_KEY = 'sks-cart-v1';

/** What we store: only ids and quantity. Names and prices always come from the catalog. */
export interface CartLine {
  productId: string;
  optionId: string;
  qty: number;
}

/** A cart line joined with current catalog data, ready to display. */
export interface CartRow extends CartLine {
  key: string;
  name: string;
  image: string;
  optionLabel: string;
  unitPrice: number;
  lineTotal: number;
}

export type CartAction =
  | { type: 'add'; productId: string; optionId: string; qty?: number }
  | { type: 'setQty'; productId: string; optionId: string; qty: number }
  | { type: 'remove'; productId: string; optionId: string }
  | { type: 'replace'; lines: CartLine[] }
  | { type: 'clear' };

export const lineKey = (l: Pick<CartLine, 'productId' | 'optionId'>) =>
  `${l.productId}|${l.optionId}`;

const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(0, Math.floor(n)));

function isValidLine(l: CartLine): boolean {
  const p = findProduct(l.productId);
  return !!p && p.options.some((o) => o.id === l.optionId) && l.qty >= 1;
}

export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add': {
      const line = { productId: action.productId, optionId: action.optionId, qty: action.qty ?? 1 };
      if (!isValidLine(line)) return state;
      const existing = state.find((l) => lineKey(l) === lineKey(line));
      if (existing) {
        return state.map((l) => (l === existing ? { ...l, qty: clampQty(l.qty + line.qty) } : l));
      }
      return [...state, { ...line, qty: clampQty(line.qty) }];
    }
    case 'setQty': {
      const qty = clampQty(action.qty);
      if (qty === 0) return state.filter((l) => lineKey(l) !== lineKey(action));
      return state.map((l) => (lineKey(l) === lineKey(action) ? { ...l, qty } : l));
    }
    case 'remove':
      return state.filter((l) => lineKey(l) !== lineKey(action));
    case 'replace':
      return action.lines.filter(isValidLine);
    case 'clear':
      return [];
  }
}

/** Join stored lines with the catalog. Unknown products/options are dropped. */
export function toRows(lines: CartLine[]): CartRow[] {
  const rows: CartRow[] = [];
  for (const l of lines) {
    const p = findProduct(l.productId);
    const o = p?.options.find((x) => x.id === l.optionId);
    if (!p || !o) continue;
    rows.push({
      ...l,
      key: lineKey(l),
      name: p.name,
      image: p.image,
      optionLabel: o.label,
      unitPrice: o.price,
      lineTotal: o.price * l.qty,
    });
  }
  return rows;
}

export const cartTotal = (rows: CartRow[]) => rows.reduce((sum, r) => sum + r.lineTotal, 0);
export const cartCount = (lines: CartLine[]) => lines.reduce((sum, l) => sum + l.qty, 0);

/** Parse whatever is in storage defensively: it may be old, edited by hand or corrupt. */
export function parseStoredCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const lines: CartLine[] = [];
    for (const item of data.slice(0, 100)) {
      if (!item || typeof item !== 'object') continue;
      const { productId, optionId, qty } = item as Record<string, unknown>;
      if (typeof productId !== 'string' || typeof optionId !== 'string') continue;
      if (typeof qty !== 'number' || !Number.isFinite(qty)) continue;
      const line = { productId, optionId, qty: clampQty(qty) };
      if (isValidLine(line)) lines.push(line);
    }
    return lines;
  } catch {
    return [];
  }
}
