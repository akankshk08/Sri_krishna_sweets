import type { CustomerDetails } from './whatsapp';

export type FieldErrors = Partial<Record<keyof CustomerDetails, string>>;

/** Indian mobile: optional +91 / 91 / 0 prefix, then 10 digits starting 6–9. */
export function normaliseMobile(input: string): string | null {
  const digits = input.replace(/[\s\-()]/g, '').replace(/^(\+?91|0)(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export function validateCustomer(c: CustomerDetails): FieldErrors {
  const errors: FieldErrors = {};
  const name = c.name.trim();
  if (name.length < 2) errors.name = 'Please enter your name.';
  else if (name.length > 60) errors.name = 'Please keep the name under 60 characters.';

  if (!normaliseMobile(c.mobile))
    errors.mobile = 'Enter a 10-digit Indian mobile number, e.g. 98765 43210.';

  const address = c.address.trim();
  if (address.length < 10)
    errors.address = 'Please enter the full delivery address with area and PIN code.';
  else if (address.length > 300) errors.address = 'Please keep the address under 300 characters.';

  if (c.notes.length > 300) errors.notes = 'Please keep instructions under 300 characters.';
  return errors;
}
