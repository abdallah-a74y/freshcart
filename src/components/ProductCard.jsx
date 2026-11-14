import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { currency, imageOf } from '../helpers/format';

function Stars({ value }) {
  const full = Math.round(value || 0);
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map(k => (
        <i key={k} className={`${k <= full ? 'fa-solid' : 'fa-regular'} fa-star`} />
      ))}
    </span>
  );
}

// Same card as the Home page "Featured Products" (fp-card), shared by every product grid.
export default function ProductCard({ product }) {
  const { addToCart, addToWishlist, removeFromWishlist, wishlist, notify } = useStore();
  const wished = wishlist.some(p => p._id === product._id);
  const price = product.priceAfterDiscount || product.price;

  return (
    <article className="fp-card">
      <div className="fp-img">
        <Link to={`/products/${product._id}`}>
          <img src={imageOf(product)} alt={product.title} loading="lazy" />
        </Link>
        <div className="fp-actions">
          <button
            className={wished ? 'on' : ''}
            onClick={() => (wished ? removeFromWishlist(product._id) : addToWishlist(product._id))}
            aria-label="Add to wishlist"
          >
            <i className={`${wished ? 'fa-solid' : 'fa-regular'} fa-heart`} />
          </button>
          <button onClick={() => notify('Compare is coming soon')} aria-label="Compare">
            <i className="fa-solid fa-arrows-rotate" />
          </button>
          <Link to={`/products/${product._id}`} aria-label="Quick view">
            <i className="fa-regular fa-eye" />
          </Link>
        </div>
      </div>

      <div className="fp-body">
        <small>{product.category?.name || 'Fresh products'}</small>
        <Link className="fp-title" to={`/products/${product._id}`}>{product.title}</Link>
        <div className="fp-rate">
          <Stars value={product.ratingsAverage} />
          <span>{product.ratingsAverage || 4.5} ({product.ratingsQuantity || 0})</span>
        </div>
        <div className="fp-bottom">
          <div>
            <b>{currency(price)}</b>
            {product.priceAfterDiscount && <del>{currency(product.price)}</del>}
          </div>
          <button className="fp-add" onClick={() => addToCart(product._id)} aria-label="Add to cart">
            <i className="fa-solid fa-plus" />
          </button>
        </div>
      </div>
    </article>
  );
}
