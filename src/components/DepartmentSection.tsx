import type { Department } from '../data/types';
import { Ornament } from './Logo';
import { ProductCard } from './ProductCard';

export function DepartmentSection({ dept, tone }: { dept: Department; tone: 'white' | 'ivory' }) {
  return (
    <section id={dept.id} className={`dept dept--${tone}`} aria-labelledby={`${dept.id}-title`}>
      <div className="container">
        <header className="section-head reveal">
          <p className="eyebrow">Our collection</p>
          <h2 id={`${dept.id}-title`} className="section-title">
            {dept.title}
          </h2>
          <Ornament />
          <p className="section-lead">{dept.intro}</p>
        </header>

        <nav className="chips" aria-label={`${dept.title} categories`}>
          {dept.categories.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="chip">
              {c.title}
            </a>
          ))}
        </nav>

        {dept.categories.map((cat) => (
          <section
            key={cat.id}
            id={cat.id}
            className="category"
            aria-labelledby={`${cat.id}-title`}
          >
            <div className="category__head reveal">
              <span className="category__kicker">{cat.kicker}</span>
              <h3 id={`${cat.id}-title`} className="category__title">
                {cat.title}
              </h3>
              <p className="category__blurb">{cat.blurb}</p>
            </div>
            <div className="grid">
              {cat.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
