/**
 * SHOP SETTINGS — edit this file to change contact details.
 *
 * WHATSAPP_NUMBER: country code + number, digits only, no "+" or spaces.
 * Example for an Indian mobile 98765 43210 → '919876543210'.
 * Until it is replaced, the checkout shows a notice and still builds the message.
 */
export const SHOP = {
  name: 'Shri Krishna Sweets',
  WHATSAPP_NUMBER: '91XXXXXXXXXX',
  phoneDisplay: '+91 XXXXX XXXXX',
  email: 'hello@shrikrishnasweets.example',
  addressLines: ['Shop address line 1', 'Area, City – PIN'],
  hours: 'Open daily · 8:00 am – 10:00 pm',
  instagramUrl: 'https://www.instagram.com/',
} as const;

/** True once a real number (10–15 digits) has been entered above. */
export const isWhatsAppConfigured = (): boolean => /^\d{10,15}$/.test(SHOP.WHATSAPP_NUMBER);
