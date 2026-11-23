import { useState } from 'react';
import type { FormEvent } from 'react';
import { isWhatsAppConfigured } from '../config';
import type { CartRow } from '../lib/cart';
import { formatINR } from '../lib/format';
import type { FieldErrors } from '../lib/validation';
import { normaliseMobile, validateCustomer } from '../lib/validation';
import type { CustomerDetails } from '../lib/whatsapp';
import { buildOrderMessage, whatsappUrl } from '../lib/whatsapp';
import { WhatsAppIcon } from './Icons';

const DRAFT_KEY = 'sks-checkout-draft-v1';
const EMPTY: CustomerDetails = { name: '', mobile: '', address: '', notes: '' };

function loadDraft(): CustomerDetails {
  try {
    const d = JSON.parse(
      window.sessionStorage.getItem(DRAFT_KEY) ?? 'null',
    ) as Partial<CustomerDetails> | null;
    if (!d || typeof d !== 'object') return EMPTY;
    const pick = (k: keyof CustomerDetails) =>
      typeof d[k] === 'string' ? (d[k] as string).slice(0, 400) : '';
    return {
      name: pick('name'),
      mobile: pick('mobile'),
      address: pick('address'),
      notes: pick('notes'),
    };
  } catch {
    return EMPTY;
  }
}

interface Props {
  rows: CartRow[];
  total: number;
  onBack: () => void;
  onSent: () => void;
}

export function CheckoutForm({ rows, total, onBack, onSent }: Props) {
  const [values, setValues] = useState<CustomerDetails>(loadDraft);
  const [errors, setErrors] = useState<FieldErrors>({});
  const configured = isWhatsAppConfigured();

  const update = (k: keyof CustomerDetails) => (e: { target: { value: string } }) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
    try {
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next)); // this tab only, cleared when closed
    } catch {
      /* ignore */
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateCustomer(values);
    setErrors(found);
    const firstBad = (Object.keys(found) as (keyof CustomerDetails)[])[0];
    if (firstBad) {
      document.getElementById(`co-${firstBad}`)?.focus();
      return;
    }
    const mobile = normaliseMobile(values.mobile) ?? values.mobile;
    const url = whatsappUrl(buildOrderMessage(rows, { ...values, mobile: `+91 ${mobile}` }));
    // Opening synchronously inside the click keeps pop-up blockers happy; fall back to same tab.
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url;
    onSent();
  };

  const field = (k: keyof CustomerDetails) => ({
    id: `co-${k}`,
    name: k,
    value: values[k],
    onChange: update(k),
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `co-${k}-err` : undefined,
  });
  const err = (k: keyof CustomerDetails) =>
    errors[k] ? (
      <p id={`co-${k}-err`} className="field__error">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form className="checkout" onSubmit={submit} noValidate>
      <div className="checkout__body">
        <div className="checkout__summary">
          <span>
            {rows.length} product{rows.length === 1 ? '' : 's'}
          </span>
          <strong>{formatINR(total)}</strong>
        </div>

        <div className="field">
          <label htmlFor="co-name">Full name</label>
          <input {...field('name')} autoComplete="name" maxLength={60} required />
          {err('name')}
        </div>
        <div className="field">
          <label htmlFor="co-mobile">Mobile number</label>
          <input
            {...field('mobile')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            maxLength={16}
            required
          />
          {err('mobile')}
        </div>
        <div className="field">
          <label htmlFor="co-address">Delivery address</label>
          <textarea
            {...field('address')}
            rows={3}
            autoComplete="street-address"
            placeholder="House no., street, area, city, PIN"
            maxLength={300}
            required
          />
          {err('address')}
        </div>
        <div className="field">
          <label htmlFor="co-notes">
            Additional instructions <span className="muted">(optional)</span>
          </label>
          <textarea
            {...field('notes')}
            rows={2}
            placeholder="Delivery time, gift message, less sugar…"
            maxLength={300}
          />
          {err('notes')}
        </div>

        {!configured && (
          <p className="notice" role="note">
            Demo mode: the shop's WhatsApp number has not been set yet, so the chat will not reach
            the shop.
          </p>
        )}
        <p className="muted small">
          Your details are used only to write the WhatsApp message. Nothing is sent until you press
          Send in WhatsApp, and the order is confirmed when the shop replies.
        </p>
      </div>

      <div className="drawer__foot">
        <button type="submit" className="btn btn--whatsapp btn--block">
          <WhatsAppIcon /> Place Order on WhatsApp
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={onBack}>
          Back to cart
        </button>
      </div>
    </form>
  );
}
