import { ArrowIcon } from './Icons';
import { FeatherMark } from './Logo';

export function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <div className="hero__copy reveal">
          <p className="eyebrow">
            <FeatherMark size={16} /> Authentic Indian mithai &amp; namkeen
          </p>
          <h1 id="hero-title" className="hero__title">
            Sweetness of Tradition, <em>Taste of Happiness</em>
          </h1>
          <p className="hero__lead">
            Discover the authentic flavours of India, crafted with love and tradition.
          </p>
          <div className="hero__cta">
            <a className="btn btn--primary" href="#sweets">
              Explore Sweets <ArrowIcon width={18} height={18} />
            </a>
            <a className="btn btn--outline" href="#namkeens">
              Shop Namkeens
            </a>
          </div>
          <ul className="hero__points" aria-label="Highlights">
            <li>32 sweets &amp; snacks</li>
            <li>Festive gift boxes</li>
            <li>Easy WhatsApp ordering</li>
          </ul>
        </div>

        <div className="hero__visual reveal">
          <div className="hero__arch">
            <img
              src="/images/hero.jpg"
              alt="A gold-trimmed box of dry fruit sweets and foil-wrapped laddus"
              width={760}
              height={950}
              fetchPriority="high"
            />
          </div>
          <div className="hero__badge" aria-hidden="true">
            <span>Festive</span>
            <strong>Gift Boxes</strong>
          </div>
          <div className="hero__thumb" aria-hidden="true">
            <img src="/images/kaju-katli.jpg" alt="" width={800} height={600} />
          </div>
        </div>
      </div>
    </section>
  );
}
