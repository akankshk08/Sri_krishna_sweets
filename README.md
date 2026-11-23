# Shri Krishna Sweets: premium sweet shop website

A responsive React website for an Indian sweet shop with 4 sweet and 4 namkeen categories (32 products), festive gift boxes, a working cart saved in the browser, and ordering through WhatsApp.

## Run it

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173).

## Things to edit before launch

| What | Where |
|---|---|
| WhatsApp number, phone, email, address, hours, Instagram | `src/config.ts` |
| Product names, descriptions and prices (price per 1 kg; packs are calculated) | `src/data/catalog.ts` |
| Gift box prices | `GIFT_BOXES` in `src/data/catalog.ts` |
| Product photos | `public/images/<product-id>.jpg` (800×600, 4:3) |
| Privacy notice | `public/privacy.html` |

WhatsApp number format: country code + number, digits only, e.g. `919876543210`.
Until it is set, the checkout shows a "demo mode" notice.

## Photos

The current photos are real photographs from Wikimedia Commons under Creative Commons licences
(see `public/credits.html`, linked in the footer). CC BY-SA requires keeping that credit page while
they are used. Replace them with your own studio photos for the best result. A few are close
substitutes (Thatte Idli Chips, Chana Dal, Kodubale, Kaju Milk Cake) because no exact photo was available.

## Checks

```bash
npm run lint
npm test
npm run build
```

## Deploy

Any static host works. On Vercel or Netlify: build command `npm run build`, output folder `dist`.
Security headers are already configured in `vercel.json` (Vercel) and `public/_headers` (Netlify).
