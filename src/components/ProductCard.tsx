import { useId, useState } from 'react';
import type { Product } from '../data/types';
import { useCart } from '../context/CartContext';
import { formatINR } from '../lib/format';
import { PlusIcon } from './Icons';

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const groupId = useId();
  // Start on the popular 250 g pack when the product has one.
  const [optionId, setOptionId] = useState(
    (product.options.find((o) => o.id === '250g') ?? product.options[0]).id,
  );
  const option = product.options.find((o) => o.id === optionId) ?? product.options[0];
  const hasChoice = product.options.length > 1;

  return (
    <article className="card">
      <div className="card__media">
        <img
          src={product.image}
          alt={product.alt}
          width={800}
          height={600}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="card__body">
        <h4 className="card__title">{product.name}</h4>
        <p className="card__note">{product.note}</p>

        {hasChoice ? (
          <fieldset className="sizes">
            <legend className="visually-hidden">Choose weight for {product.name}</legend>
            {product.options.map((o) => (
              <label key={o.id} className={`size${o.id === optionId ? ' is-selected' : ''}`}>
                <input
                  type="radio"
                  name={groupId}
                  value={o.id}
                  checked={o.id === optionId}
                  onChange={() => setOptionId(o.id)}
                />
                {o.label}
              </label>
            ))}
          </fieldset>
        ) : (
          <p className="card__unit">{option.label}</p>
        )}

        <div className="card__foot">
          <p className="price">
            {formatINR(option.price)}
            {hasChoice && <span className="price__unit"> / {option.label}</span>}
          </p>
          <button
            type="button"
            className="btn btn--add"
            onClick={() => add(product.id, option.id, `${product.name} (${option.label})`)}
            aria-label={`Add ${product.name}, ${option.label}, to cart`}
          >
            <PlusIcon width={16} height={16} /> Add
          </button>
        </div>
      </div>
    </article>
  );
}
