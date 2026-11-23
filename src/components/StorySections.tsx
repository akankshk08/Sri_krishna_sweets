import { GIFT_BOXES } from '../data/catalog';
import { ArrowIcon, AwardIcon, FlameIcon, GiftIcon, LeafIcon } from './Icons';
import { Ornament } from './Logo';
import { ProductCard } from './ProductCard';

export function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="container about__inner">
        <div className="about__media reveal">
          <img
            src="/images/shop.jpg"
            alt="Shelves of a sweet shop filled with trays of colourful mithai"
            width={900}
            height={675}
            loading="lazy"
          />
          <img
            className="about__inset"
            src="/images/mysore-pak.jpg"
            alt=""
            width={800}
            height={600}
            loading="lazy"
          />
        </div>
        <div className="about__copy reveal">
          <p className="eyebrow">Our story</p>
          <h2 id="about-title" className="section-title section-title--left">
            A Tradition of Sweetness
          </h2>
          <Ornament />
          <p>
            At Shri Krishna Sweets, we believe every celebration deserves something special.
            Inspired by India's rich culinary traditions, we bring you a delightful collection of
            authentic sweets and savoury snacks, prepared with care and a passion for quality.
          </p>
          <p>
            Our name is a small offering to Lord Krishna, the makhan-loving child of Vrindavan,
            whose stories are full of butter, milk and joy. That spirit guides our kitchen: honest
            ingredients, recipes handed down through families, and sweets made to be shared.
          </p>
          <ul className="about__list">
            <li>
              <strong>Made in small batches</strong> so every box reaches you fresh.
            </li>
            <li>
              <strong>Packed with care</strong> in clean, food-safe boxes for travel and gifting.
            </li>
            <li>
              <strong>Prepared on order</strong> for large festive and wedding requirements.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    Icon: AwardIcon,
    title: 'Authentic Taste',
    text: 'Traditional Indian flavours, true to the recipes we grew up with.',
  },
  {
    Icon: LeafIcon,
    title: 'Quality Ingredients',
    text: 'Carefully selected milk, ghee, flours, nuts and spices.',
  },
  {
    Icon: FlameIcon,
    title: 'Freshly Prepared',
    text: 'Delicious products made with care, in small daily batches.',
  },
  {
    Icon: GiftIcon,
    title: 'Made for Celebrations',
    text: 'Perfect for festivals, gifting and every special occasion.',
  },
];

export function WhyUs() {
  return (
    <section className="why" aria-labelledby="why-title">
      <div className="container">
        <header className="section-head reveal">
          <p className="eyebrow">The Shri Krishna promise</p>
          <h2 id="why-title" className="section-title">
            Why Choose Us
          </h2>
          <Ornament />
        </header>
        <ul className="why__grid">
          {FEATURES.map(({ Icon, title, text }) => (
            <li key={title} className="why__card reveal">
              <span className="why__icon">
                <Icon width={26} height={26} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Gifting() {
  return (
    <section id="gifting" className="gifting" aria-labelledby="gifting-title">
      <div className="container">
        <div className="gifting__banner reveal">
          <div className="gifting__copy">
            <p className="eyebrow eyebrow--light">Festive &amp; gifting</p>
            <h2
              id="gifting-title"
              className="section-title section-title--light section-title--left"
            >
              Gifts wrapped in gold, filled with joy
            </h2>
            <p>
              Traditional sweet boxes, dry fruit gift boxes, festival hampers and celebration packs
              for Diwali, Raksha Bandhan, weddings and corporate gifting. Custom quantities on
              request.
            </p>
            <a className="btn btn--gold" href="#gift-boxes">
              Explore Gift Boxes <ArrowIcon width={18} height={18} />
            </a>
          </div>
          <div className="gifting__media">
            <img src="/images/gift-dry-fruit.jpg" alt="" width={800} height={600} loading="lazy" />
          </div>
        </div>
        <div id="gift-boxes" className="grid grid--gifts">
          {GIFT_BOXES.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
