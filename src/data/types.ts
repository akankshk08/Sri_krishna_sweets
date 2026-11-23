/** One buyable size of a product, e.g. "250 g" for ₹300. */
export interface ProductOption {
  id: string;
  label: string;
  /** Price in whole rupees for this option. */
  price: number;
}

export interface Product {
  id: string;
  name: string;
  note: string;
  image: string;
  alt: string;
  options: ProductOption[];
}

export interface Category {
  id: string;
  title: string;
  kicker: string;
  blurb: string;
  products: Product[];
}

export interface Department {
  id: 'sweets' | 'namkeens';
  title: string;
  intro: string;
  categories: Category[];
}
