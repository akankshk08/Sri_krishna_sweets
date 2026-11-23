import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { CartAction, CartLine, CartRow } from '../lib/cart';
import {
  STORAGE_KEY,
  cartCount,
  cartReducer,
  cartTotal,
  parseStoredCart,
  toRows,
} from '../lib/cart';

interface CartContextValue {
  rows: CartRow[];
  count: number;
  total: number;
  dispatch: (a: CartAction) => void;
  add: (productId: string, optionId: string, name: string) => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toast: string | null;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartLine[] {
  try {
    return parseStoredCart(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return []; // storage blocked (private mode etc.) — start with an empty cart
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, undefined, loadCart);
  const [isOpen, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable: cart still works for this visit */
    }
  }, [lines]);

  // Keep tabs in sync when the cart changes in another tab.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) dispatch({ type: 'replace', lines: parseStoredCart(e.newValue) });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const add = useCallback((productId: string, optionId: string, name: string) => {
    dispatch({ type: 'add', productId, optionId });
    setToast(`${name} added to your cart`);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const rows = toRows(lines);
    return {
      rows,
      count: cartCount(lines),
      total: cartTotal(rows),
      dispatch,
      add,
      isOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      toast,
    };
  }, [lines, add, isOpen, toast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
