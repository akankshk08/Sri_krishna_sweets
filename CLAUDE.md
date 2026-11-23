# Project rules: Shri Krishna Sweets (React + Vite + TypeScript, static site)

Follow the production-web-builder standards. The owner is not a programmer: you are responsible for security and quality by default.

- Static site: no backend, no database, no secrets. Orders go out through WhatsApp click-to-chat links (`src/lib/whatsapp.ts`).
- Shop settings (WhatsApp number, phone, address, Instagram) live only in `src/config.ts`.
- Products and prices live only in `src/data/catalog.ts`. The cart stores ids + quantity; prices are always re-read from the catalog.
- Never trust localStorage: parse it defensively (`parseStoredCart`).
- Never render user input as HTML. Customer details only go into the encoded WhatsApp message.
- Never say an order is "confirmed" in the UI; the shop confirms on WhatsApp.
- Security headers: `vercel.json` and `public/_headers` (keep CSP in sync if you add fonts/scripts).
- Keep files under ~300 lines, reuse helpers in `src/lib`, run `npm run lint && npm test && npm run build` before committing.
- New npm package? Ask first and explain why.
