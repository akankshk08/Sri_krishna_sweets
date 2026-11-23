import type { Department, Product, ProductOption } from './types';

/**
 * PRICES — every price is a placeholder. Edit the number after the product name:
 * it is the price for 1 kg in rupees. Smaller packs are worked out from it and
 * rounded to the nearest ₹5. To set a pack price by hand, replace `kg(...)` with
 * a list such as [{ id: '250g', label: '250 g', price: 299 }, ...].
 */
const SWEET_SIZES = ['250g', '500g', '1kg'] as const;
const NAMKEEN_SIZES = ['100g', '250g', '500g', '1kg'] as const;
type Size = (typeof NAMKEEN_SIZES)[number];

const GRAMS: Record<Size, number> = { '100g': 100, '250g': 250, '500g': 500, '1kg': 1000 };
const LABEL: Record<Size, string> = {
  '100g': '100 g',
  '250g': '250 g',
  '500g': '500 g',
  '1kg': '1 kg',
};

export function kg(pricePerKg: number, sizes: readonly Size[]): ProductOption[] {
  return sizes.map((size) => ({
    id: size,
    label: LABEL[size],
    price: Math.round((pricePerKg * GRAMS[size]) / 1000 / 5) * 5,
  }));
}

const sweet = (id: string, name: string, perKg: number, note: string, alt: string): Product => ({
  id,
  name,
  note,
  alt,
  image: `/images/${id}.jpg`,
  options: kg(perKg, SWEET_SIZES),
});

const namkeen = (id: string, name: string, perKg: number, note: string, alt: string): Product => ({
  ...sweet(id, name, perKg, note, alt),
  options: kg(perKg, NAMKEEN_SIZES),
});

export const DEPARTMENTS: Department[] = [
  {
    id: 'sweets',
    title: 'Sweets',
    intro: 'Mithai made in small batches with milk, ghee, nuts and patience.',
    categories: [
      {
        id: 'milk-sweets',
        kicker: 'Category I',
        title: 'Milk-Based Sweets',
        blurb: 'Slow-reduced milk, gently sweetened: soft, rich and comforting.',
        products: [
          sweet(
            'kaju-milk-cake',
            'Kaju Milk Cake',
            900,
            'Grainy milk cake topped with cashew & pista',
            'Kaju milk cake topped with sliced nuts',
          ),
          sweet(
            'milk-peda',
            'Milk Peda',
            640,
            'Saffron-tinted peda with a nut crown',
            'Yellow milk pedas on a white plate',
          ),
          sweet(
            'kalakand',
            'Kalakand',
            680,
            'Moist, crumbly chhena and milk sweet',
            'Kalakand in a glass bowl',
          ),
          sweet(
            'malai-barfi',
            'Malai Barfi',
            720,
            'Creamy squares of malai and khoya',
            'Malai barfi squares on a plate',
          ),
        ],
      },
      {
        id: 'dry-fruit-sweets',
        kicker: 'Category II',
        title: 'Dry Fruit Sweets',
        blurb: 'Cashew, almond, fig and dates: our richest, most giftable sweets.',
        products: [
          sweet(
            'kaju-katli',
            'Kaju Katli',
            1200,
            'Silver-leaf cashew diamonds',
            'Kaju katli diamonds with silver leaf',
          ),
          sweet(
            'badam-katli',
            'Badam Katli',
            1400,
            'Almond fudge, delicately set',
            'Badam katli pieces arranged on a plate',
          ),
          sweet(
            'anjeer-roll',
            'Anjeer Roll',
            1600,
            'Fig and nut roll, no added sugar style',
            'Sliced anjeer dry fruit rolls',
          ),
          sweet(
            'dry-fruit-laddu',
            'Dry Fruit Laddu',
            1300,
            'Dates, nuts and seeds rolled by hand',
            'Dry fruit laddus on a steel plate',
          ),
        ],
      },
      {
        id: 'traditional-sweets',
        kicker: 'Category III',
        title: 'Traditional Indian Sweets',
        blurb: 'Festival favourites made the way they are in Indian homes.',
        products: [
          sweet(
            'mysore-pak',
            'Mysore Pak',
            500,
            'Ghee-rich gram flour classic',
            'Mysore pak on a banana leaf',
          ),
          sweet(
            'motichoor-laddu',
            'Motichoor Laddu',
            480,
            'Fine boondi laddu with almond',
            'Motichoor laddus on a steel platter',
          ),
          sweet(
            'besan-laddu',
            'Besan Laddu',
            460,
            'Roasted gram flour, ghee & cardamom',
            'Besan laddus stacked on a silver plate',
          ),
          sweet(
            'soan-papdi',
            'Soan Papdi',
            400,
            'Flaky, melt-in-the-mouth layers',
            'Close-up of soan papdi with nuts',
          ),
        ],
      },
      {
        id: 'bengali-sweets',
        kicker: 'Category IV',
        title: 'Bengali & Special Sweets',
        blurb: 'Syrupy, spongy and celebratory: the sweets of every Indian party.',
        products: [
          sweet(
            'rasgulla',
            'Rasgulla',
            360,
            'Spongy chhena balls in light syrup',
            'White rasgullas in syrup',
          ),
          sweet(
            'gulab-jamun',
            'Gulab Jamun',
            380,
            'Khoya dumplings in rose-cardamom syrup',
            'Two gulab jamuns in syrup on a white plate',
          ),
          sweet(
            'cham-cham',
            'Cham Cham',
            520,
            'Porabari-style chhena, lightly caramelised',
            'Cham cham sweets in a tray',
          ),
          sweet(
            'milk-cake',
            'Milk Cake',
            640,
            'Caramel-hearted Alwar-style milk cake',
            'Piece of grainy milk cake',
          ),
        ],
      },
    ],
  },
  {
    id: 'namkeens',
    title: 'Namkeens',
    intro: 'Crunchy, spicy and savoury snacks for tea time, travel and guests.',
    categories: [
      {
        id: 'traditional-namkeens',
        kicker: 'Category I',
        title: 'Traditional Namkeens',
        blurb: 'Time-honoured South Indian savouries, fried fresh in batches.',
        products: [
          namkeen(
            'mixture',
            'Mixture',
            400,
            'Sev, boondi, peanuts & curry leaves',
            'Bowl of colourful namkeen mixture',
          ),
          namkeen('kara-sev', 'Kara Sev', 360, 'Peppery, thick gram-flour sev', 'Bowl of kara sev'),
          namkeen('omapodi', 'Omapodi', 360, 'Fine ajwain-scented sev', 'Omapodi in a clay bowl'),
          namkeen(
            'ribbon-pakoda',
            'Ribbon Pakoda',
            380,
            'Crisp, ridged ribbons',
            'Ribbon pakoda on a plate',
          ),
        ],
      },
      {
        id: 'crispy-snacks',
        kicker: 'Category II',
        title: 'Crispy Snacks',
        blurb: 'Light, crunchy and impossible to stop at one.',
        products: [
          namkeen(
            'murukku',
            'Murukku',
            400,
            'Rice-flour spirals with sesame',
            'Three murukku spirals',
          ),
          namkeen(
            'thatte-idli-chips',
            'Thatte Idli Chips',
            420,
            'Thin, crisp rice discs',
            'Thin crisp rice chips',
          ),
          namkeen(
            'banana-chips',
            'Banana Chips',
            440,
            'Kerala-style, fried in coconut oil',
            'Banana chips in a white bowl',
          ),
          namkeen(
            'masala-peanuts',
            'Masala Peanuts',
            320,
            'Gram-flour coated, spiced peanuts',
            'Bowl of masala peanuts',
          ),
        ],
      },
      {
        id: 'spicy-snacks',
        kicker: 'Category III',
        title: 'Spicy Snacks',
        blurb: 'For those who like a little fire with their chai.',
        products: [
          namkeen(
            'aloo-bhujia',
            'Aloo Bhujia',
            380,
            'Potato and moth-bean sev',
            'Aloo bhujia in a glass bowl',
          ),
          namkeen(
            'spicy-mixture',
            'Spicy Mixture',
            400,
            'Garlic-chilli mix with peanuts',
            'Spicy mixture in a steel bowl',
          ),
          namkeen(
            'chana-dal',
            'Chana Dal',
            360,
            'Fried, salted split chickpeas',
            'Fried dal namkeen',
          ),
          namkeen(
            'garlic-sev',
            'Garlic Sev',
            380,
            'Bold garlic-flavoured sev',
            'Tray of garlic sev',
          ),
        ],
      },
      {
        id: 'special-snacks',
        kicker: 'Category IV',
        title: 'Special Snacks',
        blurb: 'Karnataka specialities and premium crunch for special days.',
        products: [
          namkeen(
            'kodubale',
            'Kodubale',
            420,
            'Crisp ring-shaped rice snack',
            'Ring-shaped kodubale',
          ),
          namkeen(
            'nippattu',
            'Nippattu',
            400,
            'Peanut & curry-leaf rice crackers',
            'Nippattu rice crackers on a plate',
          ),
          namkeen(
            'ribbon-murukku',
            'Ribbon Murukku',
            400,
            'Spiced, ridged spirals',
            'Orange ribbon murukku spirals',
          ),
          namkeen(
            'masala-kaju',
            'Masala Kaju',
            1400,
            'Roasted cashews with house masala',
            'Bowl of roasted masala cashews',
          ),
        ],
      },
    ],
  },
];

/** Gift boxes are sold per box. Edit prices here. */
export const GIFT_BOXES: Product[] = [
  {
    id: 'gift-sweet-box',
    name: 'Traditional Sweet Box',
    note: 'Assorted barfi & mithai, 500 g',
    image: '/images/gift-sweet-box.jpg',
    alt: 'Box of assorted Indian sweets',
    options: [{ id: 'box', label: '1 box', price: 450 }],
  },
  {
    id: 'gift-dry-fruit',
    name: 'Dry Fruit Gift Box',
    note: 'Dry fruit bars & laddus, 750 g',
    image: '/images/gift-dry-fruit.jpg',
    alt: 'Gold-trimmed box of dry fruit sweets',
    options: [{ id: 'box', label: '1 box', price: 1250 }],
  },
  {
    id: 'gift-hamper',
    name: 'Festival Special Hamper',
    note: 'Sweets, namkeen & dry fruits',
    image: '/images/gift-hamper.jpg',
    alt: 'Festive hamper with dry fruit sweets and gold-wrapped treats',
    options: [{ id: 'box', label: '1 hamper', price: 1800 }],
  },
  {
    id: 'gift-celebration',
    name: 'Celebration Gift Pack',
    note: 'Bengali & milk sweets, 1 kg',
    image: '/images/gift-celebration.jpg',
    alt: 'Celebration pack of Bengali and milk sweets',
    options: [{ id: 'box', label: '1 pack', price: 750 }],
  },
];

const ALL: Product[] = [
  ...DEPARTMENTS.flatMap((d) => d.categories.flatMap((c) => c.products)),
  ...GIFT_BOXES,
];
const BY_ID = new Map(ALL.map((p) => [p.id, p]));

export const findProduct = (id: string): Product | undefined => BY_ID.get(id);
export const allProducts = (): Product[] => ALL;
