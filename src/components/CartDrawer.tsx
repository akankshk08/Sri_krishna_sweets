import { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { MAX_QTY } from '../lib/cart';
import { formatINR } from '../lib/format';
import { CheckoutForm } from './CheckoutForm';
import { BagIcon, CloseIcon, MinusIcon, PlusIcon, TrashIcon, WhatsAppIcon } from './Icons';

type View = 'cart' | 'checkout' | 'sent';

export function CartDrawer() {
  const { rows, total, count, dispatch, isOpen, closeCart } = useCart();
  const [view, setView] = useState<View>('cart');
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus management, Escape to close, background scroll lock, simple focus trap.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.classList.add('no-scroll');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
      if (e.key !== 'Tab' || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input,textarea',
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      previous?.focus?.();
    };
  }, [isOpen, closeCart]);

  // Reopening after sending starts at the cart again.
  useEffect(() => {
    if (!isOpen && view !== 'cart') {
      const t = window.setTimeout(() => setView('cart'), 300);
      return () => window.clearTimeout(t);
    }
  }, [isOpen, view]);

  const title =
    view === 'checkout' ? 'Delivery details' : view === 'sent' ? 'Almost done' : 'Your cart';

  return (
    <div className={`drawer${isOpen ? ' is-open' : ''}`} aria-hidden={!isOpen}>
      <div className="drawer__scrim" onClick={closeCart} />
      <div
        ref={panelRef}
        className="drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="drawer__head">
          <h2 id="drawer-title">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            className="icon-btn"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {view === 'cart' &&
          (rows.length === 0 ? (
            <div className="drawer__empty">
              <BagIcon width={44} height={44} />
              <p>Your cart is empty.</p>
              <p className="muted">Add some sweets or namkeens to get started.</p>
              <a className="btn btn--primary" href="#sweets" onClick={closeCart}>
                Browse sweets
              </a>
            </div>
          ) : (
            <>
              <ul className="lines" aria-label="Items in cart">
                {rows.map((r) => (
                  <li key={r.key} className="line">
                    <img src={r.image} alt="" width={72} height={54} loading="lazy" />
                    <div className="line__info">
                      <p className="line__name">{r.name}</p>
                      <p className="line__meta">
                        {r.optionLabel} · {formatINR(r.unitPrice)} each
                      </p>
                      <div className="qty" role="group" aria-label={`Quantity of ${r.name}`}>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch({
                              type: 'setQty',
                              productId: r.productId,
                              optionId: r.optionId,
                              qty: r.qty - 1,
                            })
                          }
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon width={16} height={16} />
                        </button>
                        <span aria-live="polite">{r.qty}</span>
                        <button
                          type="button"
                          disabled={r.qty >= MAX_QTY}
                          onClick={() =>
                            dispatch({
                              type: 'setQty',
                              productId: r.productId,
                              optionId: r.optionId,
                              qty: r.qty + 1,
                            })
                          }
                          aria-label="Increase quantity"
                        >
                          <PlusIcon width={16} height={16} />
                        </button>
                      </div>
                    </div>
                    <div className="line__end">
                      <p className="line__total">{formatINR(r.lineTotal)}</p>
                      <button
                        type="button"
                        className="link-btn"
                        onClick={() =>
                          dispatch({ type: 'remove', productId: r.productId, optionId: r.optionId })
                        }
                        aria-label={`Remove ${r.name} ${r.optionLabel}`}
                      >
                        <TrashIcon width={16} height={16} /> Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="drawer__foot">
                <dl className="totals">
                  <div>
                    <dt>
                      Subtotal ({count} item{count === 1 ? '' : 's'})
                    </dt>
                    <dd>{formatINR(total)}</dd>
                  </div>
                  <div className="totals__grand">
                    <dt>Total</dt>
                    <dd>{formatINR(total)}</dd>
                  </div>
                </dl>
                <p className="muted small">
                  Delivery charges, if any, will be confirmed by the shop on WhatsApp.
                </p>
                <button
                  type="button"
                  className="btn btn--primary btn--block"
                  onClick={() => setView('checkout')}
                >
                  Proceed to checkout
                </button>
                <button type="button" className="btn btn--ghost btn--block" onClick={closeCart}>
                  Continue shopping
                </button>
              </div>
            </>
          ))}

        {view === 'checkout' && (
          <CheckoutForm
            rows={rows}
            total={total}
            onBack={() => setView('cart')}
            onSent={() => setView('sent')}
          />
        )}

        {view === 'sent' && (
          <div className="drawer__empty">
            <WhatsAppIcon width={44} height={44} className="wa-green" />
            <p>WhatsApp has opened with your order.</p>
            <p className="muted">
              Press <strong>Send</strong> in WhatsApp to share it with us. Your order is confirmed
              only when the shop replies on WhatsApp.
            </p>
            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={() => {
                dispatch({ type: 'clear' });
                closeCart();
              }}
            >
              I've sent it, clear my cart
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--block"
              onClick={() => setView('checkout')}
            >
              WhatsApp didn't open? Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
