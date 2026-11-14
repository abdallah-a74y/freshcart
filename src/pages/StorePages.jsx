import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { api, unwrap } from '../services/api';
import { useStore } from '../contexts/StoreContext';
import ProductCard from '../components/ProductCard';
import { currency, imageOf } from '../helpers/format';

const fallbackCats = [
  { _id: '1', name: 'Vegetables & Fruits', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600' },
  { _id: '2', name: 'Dairy & Eggs', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600' },
  { _id: '3', name: 'Meat & Seafood', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600' },
  { _id: '4', name: 'Snacks', image: 'https://images.unsplash.com/photo-1621939514649-280e2aa2f0e3?w=600' },
  { _id: '5', name: 'Beverages', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600' },
  { _id: '6', name: 'Bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600' }
];

function useLoad(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    setLoading(true);

    api.get(url)
      .then(r => {
        if (live) {
          const d = unwrap(r);
          setData(
            Array.isArray(d)
              ? d
              : d?.products || d?.categories || d?.brands || []
          );
        }
      })
      .catch(() => setData([]))
      .finally(() => live && setLoading(false));

    return () => {
      live = false;
    };
  }, [url]);

  return { data, loading, setData };
}

// ================= HOME =================

const heroSlides = [
  {
    title: ['Fresh Products Delivered', 'to your Door'],
    text: 'Get 20% off your first order',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600'
  },
  {
    title: ['Organic Fruits & Veggies', 'Straight from the Farm'],
    text: 'Hand-picked daily for the best taste',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1600'
  },
  {
    title: ['Free Delivery', 'on Orders over 500 EGP'],
    text: 'Fast, fresh and reliable service',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1600'
  }
];

function HeroSlider() {
  const [i, setI] = useState(0);
  const n = heroSlides.length;

  useEffect(() => {
    const t = window.setInterval(() => setI(v => (v + 1) % n), 5000);
    return () => window.clearInterval(t);
  }, [n]);

  const s = heroSlides[i];
  return (
    <div className="container hero-wrap">
      <div className="hs" style={{ backgroundImage: `url(${s.image})` }}>
        <div className="hs-overlay" />
        <div className="hs-copy">
          <h1>{s.title[0]}<br />{s.title[1]}</h1>
          <p>{s.text}</p>
          <div className="hs-btns">
            <Link to="/products" className="hs-btn solid">Shop Now</Link>
            <Link to="/products" className="hs-btn ghost">View Deals</Link>
          </div>
        </div>
        <button className="hs-arrow left" onClick={() => setI((i - 1 + n) % n)} aria-label="Previous slide">
          <i className="fa-solid fa-chevron-left" />
        </button>
        <button className="hs-arrow right" onClick={() => setI((i + 1) % n)} aria-label="Next slide">
          <i className="fa-solid fa-chevron-right" />
        </button>
        <div className="hs-dots">
          {heroSlides.map((_, k) => (
            <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

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

function Newsletter() {
  const { notify } = useStore();
  const [email, setEmail] = useState('');
  const submit = e => {
    e.preventDefault();
    notify('Thanks for subscribing!');
    setEmail('');
  };
  return (
    <section className="container nl-wrap">
      <div className="nl-left">
        <div className="nl-top">
          <span className="nl-icon"><i className="fa-regular fa-envelope" /></span>
          <div>
            <b>NEWSLETTER</b>
            <small>50,000+ subscribers</small>
          </div>
        </div>
        <h2>Get the Freshest Updates<br /><em>Delivered Free</em></h2>
        <p>Weekly recipes, seasonal offers &amp; exclusive member perks.</p>
        <div className="nl-pills">
          <span><i className="fa-solid fa-leaf" /> Fresh Picks Weekly</span>
          <span><i className="fa-solid fa-truck" /> Free Delivery Codes</span>
          <span><i className="fa-solid fa-tag" /> Members-Only Deals</span>
        </div>
        <form className="nl-form" onSubmit={submit}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          <button className="primary-btn">Subscribe <i className="fa-solid fa-arrow-right" /></button>
        </form>
        <small className="nl-note"><i className="fa-solid fa-wand-magic-sparkles" /> Unsubscribe anytime. No spam, ever.</small>
      </div>

      <div className="nl-app">
        <span className="nl-badge"><i className="fa-solid fa-mobile-screen" /> MOBILE APP</span>
        <h3>Shop Faster on Our App</h3>
        <p>Get app-exclusive deals &amp; 15% off your first order.</p>
        <a href="#app-store" className="store-btn">
          <i className="fa-brands fa-apple" />
          <span><small>DOWNLOAD ON</small><b>App Store</b></span>
        </a>
        <a href="#google-play" className="store-btn">
          <i className="fa-brands fa-google-play" />
          <span><small>GET IT ON</small><b>Google Play</b></span>
        </a>
        <div className="nl-rating"><span>★★★★★</span> 4.9 · 100K+ downloads</div>
      </div>
    </section>
  );
}

export function Home() {
  const { data: products } = useLoad('/products?limit=10');
  const { data: cats } = useLoad('/categories');

  return (
    <>
      <HeroSlider />

      <div className="container perks">
        <div><span className="perk-i blue"><i className="fa-solid fa-truck" /></span><section><b>Free Shipping</b><small>On orders over 500 EGP</small></section></div>
        <div><span className="perk-i green"><i className="fa-solid fa-shield" /></span><section><b>Secure Payment</b><small>100% secure transactions</small></section></div>
        <div><span className="perk-i orange"><i className="fa-solid fa-rotate-left" /></span><section><b>Easy Returns</b><small>14-day return policy</small></section></div>
        <div><span className="perk-i purple"><i className="fa-solid fa-headset" /></span><section><b>24/7 Support</b><small>Dedicated support team</small></section></div>
      </div>

      <section className="container hm-section">
        <div className="hm-heading">
          <h2><span className="bar" />Shop By <em>Category</em></h2>
          <Link to="/categories" className="hm-link">View All Categories <i className="fa-solid fa-arrow-right" /></Link>
        </div>
        <div className="cat-row">
          {(cats.length ? cats : fallbackCats).map(c => (
            <Link to={`/categories/${c._id}`} className="cat-pill" key={c._id}>
              <img src={c.image || 'https://placehold.co/200x200?text=Category'} alt="" loading="lazy" />
              <b>{c.name}</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="container deals">
        <div className="deal green">
          <span className="deal-tag"><i className="fa-solid fa-fire" /> Deal of the Day</span>
          <h3>Fresh Organic Fruits</h3>
          <p>Get up to 40% off on selected organic fruits</p>
          <div className="deal-off"><strong>40% OFF</strong><span>Use code: <b>ORGANIC40</b></span></div>
          <Link to="/products" className="deal-btn">Shop Now <i className="fa-solid fa-arrow-right" /></Link>
        </div>
        <div className="deal orange">
          <span className="deal-tag"><i className="fa-solid fa-wand-magic-sparkles" /> New Arrivals</span>
          <h3>Exotic Vegetables</h3>
          <p>Discover our latest collection of premium vegetables</p>
          <div className="deal-off"><strong>25% OFF</strong><span>Use code: <b>FRESH25</b></span></div>
          <Link to="/products" className="deal-btn">Explore Now <i className="fa-solid fa-arrow-right" /></Link>
        </div>
      </section>

      <section className="container hm-section">
        <div className="hm-heading">
          <h2><span className="bar" />Featured <em>Products</em></h2>
          <Link to="/products" className="hm-link">View All Products <i className="fa-solid fa-arrow-right" /></Link>
        </div>
        <div className="fp-grid">
          {products.slice(0, 10).map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      <Newsletter />
    </>
  );
}

// ================= PRODUCTS =================

export function Products() {
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);

  const keyword = params.get('keyword') || '';
  const subcategory = params.get('subcategory') || '';

  const query = new URLSearchParams({ limit: '40' });

  if (keyword) query.set('keyword', keyword);
  if (subcategory) query.set('subcategory', subcategory);

  const { data, loading } = useLoad(`/products?${query.toString()}`);

  return (
    <main className="container page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / Shop
      </div>

      <h1>{subcategory ? 'Subcategory Products' : 'All Products'}</h1>

      <p className="muted">
        Discover our fresh products and everyday essentials.
      </p>

      {!loading && <p className="showing">Showing {data.length} products</p>}

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="product-grid">
          {data.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {!loading && !data.length && (
        <div className="empty">No products found.</div>
      )}
    </main>
  );
}

// ================= PRODUCT DETAILS =================

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('details');
  const [related, setRelated] = useState([]);
  const [busy, setBusy] = useState(false);

  const { addToWishlist, removeFromWishlist, wishlist, refreshCart, notify } = useStore();

  useEffect(() => {
    let live = true;
    setLoading(true);
    setActiveImg(0);
    setQty(1);
    setTab('details');
    api.get(`/products/${id}`)
      .then(r => { if (live) setP(unwrap(r)); })
      .catch(() => live && setP(null))
      .finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [id]);

  useEffect(() => {
    if (!p?.category?._id) return;
    let live = true;
    api.get(`/products?category[in]=${p.category._id}&limit=8`)
      .then(r => {
        const d = unwrap(r);
        if (live) setRelated((Array.isArray(d) ? d : d?.products || []).filter(x => x._id !== p._id).slice(0, 4));
      })
      .catch(() => live && setRelated([]));
    return () => { live = false; };
  }, [p?._id]);

  if (loading) return <div className="container loading">Loading product...</div>;
  if (!p) return <div className="container empty">Product not found</div>;

  const images = [p.imageCover, ...(p.images || [])].filter(Boolean);
  const gallery = images.length ? images : [imageOf(p)];
  const unit = p.priceAfterDiscount || p.price;
  const stock = Number(p.quantity) || 0;
  const maxQty = stock > 0 ? stock : 99;
  const wished = wishlist.some(w => w._id === p._id);
  const rating = Number(p.ratingsAverage) || 0;
  const reviewsCount = p.ratingsQuantity || 0;

  // The API has no per-star breakdown, so the bars are an estimate built from the average.
  const dist = [5, 4, 3, 2, 1].map(star => {
    const w = Math.max(0, 1 - Math.abs(star - rating) / 2);
    return w;
  });
  const sum = dist.reduce((a, b) => a + b, 0) || 1;
  const percents = dist.map(w => Math.round((w / sum) * 100));

  // POST /cart adds 1 item, so the chosen quantity is applied with PUT /cart/:id
  const addWithQty = async () => {
    await api.post('/cart', { productId: p._id });
    if (qty > 1) await api.put(`/cart/${p._id}`, { count: qty });
    await refreshCart();
  };

  const handleAdd = async () => {
    try {
      setBusy(true);
      await addWithQty();
      notify('Added to cart successfully');
    } catch (e) {
      notify(e.response?.data?.message || 'Please login to add products');
    } finally { setBusy(false); }
  };

  const handleBuyNow = async () => {
    try {
      setBusy(true);
      await addWithQty();
      navigate('/checkout');
    } catch (e) {
      notify(e.response?.data?.message || 'Please login to continue');
    } finally { setBusy(false); }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: p.title, url });
      else { await navigator.clipboard.writeText(url); notify('Link copied'); }
    } catch { }
  };

  return (
    <div className="container page pd-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <Link to="/products">Products</Link> / {p.title}
      </div>

      <div className="pd-layout">
        <div className="pd-gallery">
          <div className="pd-main-img">
            <img src={gallery[activeImg]} alt={p.title} />
          </div>
          {gallery.length > 1 && (
            <div className="pd-thumbs">
              {gallery.map((src, i) => (
                <button key={src + i} className={i === activeImg ? 'active' : ''} onClick={() => setActiveImg(i)}>
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pd-info">
          <div className="pd-tags">
            {p.category?.name && <Link to={`/categories/${p.category._id}`}>{p.category.name}</Link>}
            {p.brand?.name && <Link to={`/brands/${p.brand._id}`}>{p.brand.name}</Link>}
          </div>

          <h1>{p.title}</h1>

          <div className="pd-rating">
            <Stars value={rating} />
            <span>{rating.toFixed(1)} ({reviewsCount} reviews)</span>
          </div>

          <div className="pd-price">
            {currency(unit)}
            {p.priceAfterDiscount && <del>{currency(p.price)}</del>}
          </div>

          <span className={`pd-stock ${stock > 0 ? 'in' : 'out'}`}>
            <i /> {stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>

          <p className="pd-desc">{p.description}</p>

          <div className="pd-qty-label">Quantity</div>
          <div className="pd-qty-row">
            <div className="pd-qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease"><i className="fa-solid fa-minus" /></button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => Math.min(maxQty, q + 1))} aria-label="Increase"><i className="fa-solid fa-plus" /></button>
            </div>
            {stock > 0 && <span className="pd-available">{stock} available</span>}
          </div>

          <div className="pd-total">
            <span>Total Price:</span>
            <b>{currency(unit * qty)}</b>
          </div>

          <div className="pd-actions">
            <button className="pd-add" disabled={busy || stock < 1} onClick={handleAdd}>
              <i className="fa-solid fa-cart-shopping" /> Add to Cart
            </button>
            <button className="pd-buy" disabled={busy || stock < 1} onClick={handleBuyNow}>
              <i className="fa-solid fa-bolt" /> Buy Now
            </button>
          </div>

          <div className="pd-actions2">
            <button className="pd-wish" onClick={() => (wished ? removeFromWishlist(p._id) : addToWishlist(p._id))}>
              <i className={`${wished ? 'fa-solid' : 'fa-regular'} fa-heart`} /> {wished ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
            <button className="pd-share" onClick={handleShare} aria-label="Share"><i className="fa-solid fa-share-nodes" /></button>
          </div>

          <div className="pd-perks">
            <div><i className="fa-solid fa-truck-fast" /><span><b>Free Delivery</b><small>Orders over $50</small></span></div>
            <div><i className="fa-solid fa-rotate-left" /><span><b>30 Days Return</b><small>Money back</small></span></div>
            <div><i className="fa-solid fa-shield-halved" /><span><b>Secure Payment</b><small>100% Protected</small></span></div>
          </div>
        </div>
      </div>

      <div className="pd-tabs">
        <button className={tab === 'details' ? 'active' : ''} onClick={() => setTab('details')}><i className="fa-solid fa-box" /> Product Details</button>
        <button className={tab === 'reviews' ? 'active' : ''} onClick={() => setTab('reviews')}><i className="fa-solid fa-star" /> Reviews ({reviewsCount})</button>
        <button className={tab === 'shipping' ? 'active' : ''} onClick={() => setTab('shipping')}><i className="fa-solid fa-truck" /> Shipping &amp; Returns</button>
      </div>

      <div className="pd-tab-body">
        {tab === 'details' && (
          <>
            <h3>About this Product</h3>
            <p>{p.description}</p>
            <div className="pd-details-grid">
              <div>
                <h4>Product Information</h4>
                <dl>
                  <dt>Category</dt><dd>{p.category?.name || '-'}</dd>
                  <dt>Subcategory</dt><dd>{p.subcategory?.[0]?.name || '-'}</dd>
                  <dt>Brand</dt><dd>{p.brand?.name || '-'}</dd>
                  <dt>Items Sold</dt><dd>{p.sold ?? 0}+ sold</dd>
                </dl>
              </div>
              <div>
                <h4>Key Features</h4>
                <ul className="pd-checks">
                  <li>Premium Quality Product</li>
                  <li>100% Authentic Guarantee</li>
                  <li>Fast &amp; Secure Packaging</li>
                  <li>Quality Tested</li>
                </ul>
              </div>
            </div>
          </>
        )}

        {tab === 'reviews' && (
          <>
            <div className="pd-reviews">
              <div className="pd-score">
                <b>{rating.toFixed(1)}</b>
                <Stars value={rating} />
                <small>Based on {reviewsCount} reviews</small>
              </div>
              <div className="pd-bars">
                {[5, 4, 3, 2, 1].map((star, i) => (
                  <div key={star}>
                    <span>{star} star</span>
                    <div className="bar"><i style={{ width: `${percents[i]}%` }} /></div>
                    <em>{percents[i]}%</em>
                  </div>
                ))}
              </div>
            </div>
            <div className="pd-empty-reviews">
              <i className="fa-regular fa-star" />
              <p>Customer reviews will be displayed here.</p>
            </div>
          </>
        )}

        {tab === 'shipping' && (
          <>
            <div className="pd-ship-grid">
              <div>
                <h4><i className="fa-solid fa-truck" /> Shipping Information</h4>
                <ul className="pd-checks">
                  <li>Free shipping on orders over $50</li>
                  <li>Standard delivery: 3-5 business days</li>
                  <li>Express delivery available (1-2 business days)</li>
                  <li>Track your order in real-time</li>
                </ul>
              </div>
              <div>
                <h4><i className="fa-solid fa-rotate-left" /> Returns &amp; Refunds</h4>
                <ul className="pd-checks">
                  <li>30-day hassle-free returns</li>
                  <li>Full refund or exchange available</li>
                  <li>Free return shipping on defective items</li>
                  <li>Easy online return process</li>
                </ul>
              </div>
            </div>
            <div className="pd-guarantee">
              <i className="fa-solid fa-shield-halved" />
              <div>
                <b>Buyer Protection Guarantee</b>
                <p>Get a full refund if your order doesn't arrive or isn't as described. We ensure your shopping experience is safe and secure.</p>
              </div>
            </div>
          </>
        )}
      </div>

      {related.length > 0 && (
        <section className="pd-related">
          <h2><span /> You May Also <em>Like</em></h2>
          <div className="product-grid">
            {related.map(r => <ProductCard key={r._id} product={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}

// ================= CATEGORIES =================

export function Categories() {
  const { data, loading } = useLoad('/categories');

  return (
    <div className="container page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / Categories
      </div>

      <h1>Shop By Category</h1>
      <p className="muted">Explore our wide range of categories</p>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="category-grid category-grid-large">
          {data.map(c => (
            <Link
              className="category-card"
              to={`/categories/${c._id}`}
              key={c._id}
            >
              <img
                src={c.image || 'https://placehold.co/400x300'}
                alt=""
              />
              <b>{c.name}</b>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ================= CATEGORY DETAILS =================

export function CategoryDetails() {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError('');

    Promise.all([
      api.get(`/categories/${id}`),
      api.get(`/categories/${id}/subcategories`)
    ])
      .then(([categoryResponse, subcategoryResponse]) => {
        if (!active) return;

        const categoryResult = unwrap(categoryResponse);
        const subcategoryResult = unwrap(subcategoryResponse);

        const categoryData =
          categoryResult?.category ||
          categoryResult?.data?.category ||
          categoryResult;

        const subcategoryData = Array.isArray(subcategoryResult)
          ? subcategoryResult
          : subcategoryResult?.subcategories ||
            subcategoryResult?.data?.subcategories ||
            subcategoryResult?.data ||
            [];

        setCategory(categoryData);

        setSubcategories(
          Array.isArray(subcategoryData) ? subcategoryData : []
        );
      })
      .catch(err => {
        if (!active) return;

        setError(
          err.response?.data?.message ||
          'Unable to load this category. Please try again.'
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container loading">
        Loading subcategories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page">
        <div className="empty">{error}</div>
      </div>
    );
  }

  return (
    <main className="category-details-page">

      <section className="category-details-banner">
        <div className="container category-banner-inner">

          <div className="category-banner-image">
            <img
              src={
                category?.image ||
                'https://placehold.co/100x100?text=Category'
              }
              alt={category?.name || 'Category'}
            />
          </div>

          <div>
            <h1>{category?.name || 'Category'}</h1>
            <p>Choose a subcategory to browse products</p>
          </div>

        </div>
      </section>

      <section className="container category-subcategories">

        <Link to="/categories" className="back-categories">
          <i className="fa-solid fa-arrow-left" />
          Back to Categories
        </Link>

        <h2>
          {subcategories.length} Subcategories in{' '}
          {category?.name || 'this category'}
        </h2>

        {subcategories.length ? (
          <div className="subcategory-grid">

            {subcategories.map(sub => (
              <Link
                key={sub._id}
                to={`/products?subcategory=${encodeURIComponent(sub._id)}`}
                className="subcategory-card"
              >
                <div className="subcategory-icon">
                  <i className="fa-solid fa-folder-open" />
                </div>

                <h3>{sub.name}</h3>

                <span className="browse-products">
                  Browse Products
                  <i className="fa-solid fa-arrow-right" />
                </span>
              </Link>
            ))}

          </div>
        ) : (
          <div className="empty">
            <i className="fa-solid fa-folder-open" />
            <h2>No subcategories found</h2>
          </div>
        )}

      </section>
    </main>
  );
}

// ================= BRANDS =================

export function Brands() {
  const { data, loading } = useLoad('/brands');

  return (
    <div className="container page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / Brands
      </div>

      <h1>Our Brands</h1>
      <p className="muted">Shop products from your favorite brands</p>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="brand-grid">
          {data.map(b => (
            <Link
              to={`/brands/${b._id}`}
              key={b._id}
              className="brand-card"
            >
              <img
                src={b.image || 'https://placehold.co/300x180'}
                alt=""
              />
              <b>{b.name}</b>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ================= BRAND DETAILS =================

export function BrandDetails() {
  const { id } = useParams();

  const { data: products, loading } = useLoad(
    `/products?brand=${id}&limit=40`
  );

  const [brand, setBrand] = useState(null);

  useEffect(() => {
    api.get(`/brands/${id}`)
      .then(r => setBrand(unwrap(r)))
      .catch(() => {});
  }, [id]);

  return (
    <div className="container page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> /
        <Link to="/brands">Brands</Link> / {brand?.name}
      </div>

      <h1>{brand?.name || 'Brand Products'}</h1>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="product-grid">
          {products.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

// ================= CART =================

const FREE_SHIPPING_FROM = 500;
const SHIPPING_FEE = 50;

export function Cart() {
  const { cart, updateCart, removeFromCart, cartLoading, refreshCart, notify } = useStore();
  const nav = useNavigate();
  const products = cart.products || [];
  const [promoOpen, setPromoOpen] = useState(false);
  const [promo, setPromo] = useState('');

  const count = products.reduce((n, r) => n + (r.count || 1), 0);
  const subtotal = Number(cart.totalCartPrice) || 0;
  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const remaining = Math.max(0, FREE_SHIPPING_FROM - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100);

  const clearAll = async () => {
    try { await api.delete('/cart'); await refreshCart(); notify('Cart cleared'); }
    catch { notify('Could not clear cart'); }
  };

  const applyPromo = e => {
    e.preventDefault();
    notify(promo.trim() ? 'This promo code is not valid' : 'Enter a promo code');
  };

  return (
    <div className="container page ct-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / Shopping Cart
      </div>

      <div className="ct-head">
        <span className="ct-head-icon"><i className="fa-solid fa-cart-shopping" /></span>
        <div>
          <h1>Shopping Cart</h1>
          {products.length > 0 && <p>You have <b>{count} {count === 1 ? 'item' : 'items'}</b> in your cart</p>}
        </div>
      </div>

      {cartLoading && !products.length ? (
        <div className="loading">Loading cart...</div>
      ) : !products.length ? (
        <div className="empty">
          <i className="fa-solid fa-cart-shopping" />
          <h2>Your cart is empty</h2>
          <Link className="primary-btn" to="/products">Continue Shopping</Link>
        </div>
      ) : (
        <div className="ct-layout">
          <div className="ct-main">
            {products.map(row => {
              const p = row.product || row;
              const unit = row.price ?? p.price;
              return (
                <article className="ct-row" key={p._id}>
                  <div className="ct-img">
                    <Link to={`/products/${p._id}`}><img src={imageOf(p)} alt={p.title} /></Link>
                    <span className="ct-stock"><i className="fa-solid fa-check" /> In Stock</span>
                  </div>

                  <div className="ct-info">
                    <Link className="ct-name" to={`/products/${p._id}`}>{p.title}</Link>
                    <div className="ct-tags">
                      {p.category?.name && <span className="ct-cat">{p.category.name}</span>}
                      <span>SKU: {String(p._id).slice(-6).toUpperCase()}</span>
                    </div>
                    <div className="ct-unit"><b>{currency(unit)}</b> <small>per unit</small></div>

                    <div className="ct-qty">
                      <button onClick={() => updateCart(p._id, row.count - 1)} disabled={row.count <= 1} aria-label="Decrease"><i className="fa-solid fa-minus" /></button>
                      <b>{row.count}</b>
                      <button className="plus" onClick={() => updateCart(p._id, row.count + 1)} aria-label="Increase"><i className="fa-solid fa-plus" /></button>
                    </div>
                  </div>

                  <div className="ct-side">
                    <div className="ct-total"><small>Total</small><b>{Number(unit * row.count)} <em>EGP</em></b></div>
                    <button className="ct-remove" onClick={() => removeFromCart(p._id)} aria-label="Remove"><i className="fa-solid fa-trash" /></button>
                  </div>
                </article>
              );
            })}

            <div className="ct-foot">
              <Link to="/products"><i className="fa-solid fa-arrow-left" /> Continue Shopping</Link>
              <button onClick={clearAll}><i className="fa-solid fa-trash" /> Clear all items</button>
            </div>
          </div>

          <aside className="ct-summary">
            <header>
              <h3><i className="fa-solid fa-bag-shopping" /> Order Summary</h3>
              <p>{count} {count === 1 ? 'item' : 'items'} in your cart</p>
            </header>
            <div className="ct-sum-body">
              {remaining > 0 ? (
                <div className="ct-free">
                  <span><i className="fa-solid fa-truck" /> Add {remaining} EGP for free shipping</span>
                  <div className="bar"><i style={{ width: `${progress}%` }} /></div>
                </div>
              ) : (
                <div className="ct-free ok"><span><i className="fa-solid fa-circle-check" /> You got free shipping!</span></div>
              )}

              <div className="ct-line"><span>Subtotal</span><b>{currency(subtotal)}</b></div>
              <div className="ct-line"><span>Shipping</span><b>{shipping ? currency(shipping) : 'Free'}</b></div>
              <div className="ct-line total"><span>Total</span><b>{total} <small>EGP</small></b></div>

              {promoOpen ? (
                <form className="ct-promo-form" onSubmit={applyPromo}>
                  <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Promo code" autoFocus />
                  <button>Apply</button>
                </form>
              ) : (
                <button className="ct-promo" onClick={() => setPromoOpen(true)}><i className="fa-solid fa-tag" /> Apply Promo Code</button>
              )}

              <button className="ct-checkout" onClick={() => nav('/checkout')}><i className="fa-solid fa-lock" /> Secure Checkout</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

// ================= WISHLIST =================

export function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart, cart } = useStore();
  const inCart = id => (cart.products || []).some(r => (r.product?._id || r._id) === id);

  return (
    <div className="container page wl-page">
      <div className="wl-head">
        <span className="wl-head-icon"><i className="fa-solid fa-heart" /></span>
        <div>
          <h1>My Wishlist</h1>
          <p>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
        </div>
      </div>

      {!wishlist.length ? (
        <div className="empty">
          <i className="fa-regular fa-heart" />
          <h2>Your wishlist is empty</h2>
          <Link className="primary-btn" to="/products">Explore Products</Link>
        </div>
      ) : (
        <>
          <div className="wl-table">
            <div className="wl-row wl-th">
              <span>Product</span><span>Price</span><span>Status</span><span>Actions</span>
            </div>

            {wishlist.map(p => {
              const added = inCart(p._id);
              return (
                <div className="wl-row" key={p._id}>
                  <div className="wl-product">
                    <Link to={`/products/${p._id}`}><img src={imageOf(p)} alt={p.title} /></Link>
                    <div>
                      <Link to={`/products/${p._id}`}><b>{p.title}</b></Link>
                      {p.category?.name && <small>{p.category.name}</small>}
                    </div>
                  </div>

                  <div className="wl-price">{currency(p.priceAfterDiscount || p.price)}</div>

                  <div>
                    {added
                      ? <span className="wl-status in"><i className="fa-solid fa-cart-shopping" /> In Cart</span>
                      : <span className="wl-status">Not in cart</span>}
                  </div>

                  <div className="wl-actions">
                    {added
                      ? <Link className="wl-btn" to="/cart"><i className="fa-solid fa-check" /> View Cart</Link>
                      : <button className="wl-btn add" onClick={() => addToCart(p._id)}><i className="fa-solid fa-cart-plus" /> Add to Cart</button>}
                    <button className="wl-del" onClick={() => removeFromWishlist(p._id)} aria-label="Remove"><i className="fa-solid fa-trash" /></button>
                  </div>
                </div>
              );
            })}
          </div>

          <Link className="wl-continue" to="/products"><i className="fa-solid fa-arrow-left" /> Continue Shopping</Link>
        </>
      )}
    </div>
  );
}

// ================= CHECKOUT =================

export function Checkout() {
  const { cart, refreshCart, notify } = useStore();
  const [method, setMethod] = useState('cash');
  const [address, setAddress] = useState({ details: '', phone: '', city: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const items = cart.products || [];
  const count = items.reduce((n, r) => n + (r.count || 1), 0);
  const subtotal = Number(cart.totalCartPrice) || 0;
  const SHIPPING = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE; // display only, the API does not add it
  const total = subtotal + SHIPPING;

  const set = key => e => {
    setAddress({ ...address, [key]: e.target.value });
    setErrors({ ...errors, [key]: '' });
  };

  const validate = () => {
    const er = {};
    if (!address.city.trim()) er.city = 'City is required';
    if (address.details.trim().length < 6) er.details = 'Please enter a detailed address';
    if (!/^01[0125][0-9]{8}$/.test(address.phone.trim())) er.phone = 'Enter a valid Egyptian phone number';
    setErrors(er);
    return !Object.keys(er).length;
  };

  const submit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      if (method === 'online') {
        const r = await api.post(
          `/orders/checkout-session/${cart._id}?url=${encodeURIComponent(window.location.origin)}`,
          { shippingAddress: address }
        );
        const d = unwrap(r);
        if (d?.url) window.location.href = d.url;
        else throw new Error('Payment URL was not returned');
      } else {
        await api.post(`/orders/${cart._id}`, { shippingAddress: address });
        await refreshCart();
        notify('Order placed successfully');
        nav('/orders');
      }
    } catch (err) {
      notify(err.response?.data?.message || err.message || 'Checkout failed. Please login and try again.');
    } finally {
      setBusy(false);
    }
  };

  if (!items.length) {
    return (
      <div className="container page empty">
        <h1>Your cart is empty</h1>
        <Link className="primary-btn" to="/products">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container page co-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <Link to="/cart">Cart</Link> / Checkout
      </div>

      <div className="co-head">
        <div className="co-title">
          <span className="co-title-icon"><i className="fa-solid fa-clipboard-list" /></span>
          <div>
            <h1>Complete Your Order</h1>
            <p>Review your items and complete your purchase</p>
          </div>
        </div>
        <Link className="co-back" to="/cart"><i className="fa-solid fa-arrow-left" /> Back to Cart</Link>
      </div>

      <form className="co-layout" onSubmit={submit} noValidate>
        <div className="co-main">
          <section className="co-card">
            <header className="co-card-head">
              <h3><i className="fa-solid fa-house" /> Shipping Address</h3>
              <p>Where should we deliver your order?</p>
            </header>
            <div className="co-card-body">
              <div className="co-info">
                <i className="fa-solid fa-circle-info" />
                <div>
                  <b>Delivery Information</b>
                  <small>Please ensure your address is accurate for smooth delivery</small>
                </div>
              </div>

              <label className="co-field">
                <span>City <em>*</em></span>
                <div className={`co-input ${errors.city ? 'err' : ''}`}>
                  <i className="fa-solid fa-city" />
                  <input value={address.city} onChange={set('city')} placeholder="e.g. Cairo, Alexandria, Giza" />
                </div>
                {errors.city && <small className="co-err">{errors.city}</small>}
              </label>

              <label className="co-field">
                <span>Street Address <em>*</em></span>
                <div className={`co-input area ${errors.details ? 'err' : ''}`}>
                  <i className="fa-solid fa-location-dot" />
                  <textarea rows="3" value={address.details} onChange={set('details')} placeholder="Street name, building number, floor, apartment..." />
                </div>
                {errors.details && <small className="co-err">{errors.details}</small>}
              </label>

              <label className="co-field">
                <span>Phone Number <em>*</em></span>
                <div className={`co-input ${errors.phone ? 'err' : ''}`}>
                  <i className="fa-solid fa-phone" />
                  <input inputMode="tel" value={address.phone} onChange={set('phone')} placeholder="01xxxxxxxxx" />
                  <small className="co-hint">Egyptian numbers only</small>
                </div>
                {errors.phone && <small className="co-err">{errors.phone}</small>}
              </label>
            </div>
          </section>

          <section className="co-card">
            <header className="co-card-head">
              <h3><i className="fa-solid fa-wallet" /> Payment Method</h3>
              <p>Choose how you'd like to pay</p>
            </header>
            <div className="co-card-body">
              <div className={`co-pay ${method === 'cash' ? 'active' : ''}`} onClick={() => setMethod('cash')} role="radio" aria-checked={method === 'cash'} tabIndex={0}>
                <span className="co-pay-icon"><i className="fa-solid fa-money-bill-wave" /></span>
                <div>
                  <b>Cash on Delivery</b>
                  <small>Pay when your order arrives at your doorstep</small>
                </div>
                <span className="co-radio">{method === 'cash' && <i className="fa-solid fa-check" />}</span>
              </div>

              <div className={`co-pay ${method === 'online' ? 'active' : ''}`} onClick={() => setMethod('online')} role="radio" aria-checked={method === 'online'} tabIndex={0}>
                <span className="co-pay-icon"><i className="fa-solid fa-credit-card" /></span>
                <div>
                  <b>Pay Online</b>
                  <small>Secure payment with Credit/Debit Card via Stripe</small>
                  <div className="co-cards">
                    <i className="fa-brands fa-cc-visa" /><i className="fa-brands fa-cc-mastercard" /><i className="fa-brands fa-cc-amex" />
                  </div>
                </div>
                <span className="co-radio">{method === 'online' && <i className="fa-solid fa-check" />}</span>
              </div>

              <div className="co-secure">
                <i className="fa-solid fa-shield-halved" />
                <div>
                  <b>Secure &amp; Encrypted</b>
                  <small>Your payment info is protected with 256-bit SSL encryption</small>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="co-summary">
          <header className="co-card-head">
            <h3><i className="fa-solid fa-bag-shopping" /> Order Summary</h3>
            <p>{count} {count === 1 ? 'item' : 'items'}</p>
          </header>
          <div className="co-card-body">
            <div className="co-items">
              {items.map(row => {
                const p = row.product || row;
                return (
                  <div className="co-item" key={p._id}>
                    <img src={imageOf(p)} alt="" />
                    <div>
                      <b>{p.title}</b>
                      <small>{row.count || 1} × {currency(row.price)}</small>
                    </div>
                    <span>{Number((row.price || 0) * (row.count || 1))}</span>
                  </div>
                );
              })}
            </div>

            <div className="co-line"><span>Subtotal</span><b>{currency(subtotal)}</b></div>
            <div className="co-line"><span><i className="fa-solid fa-truck" /> Shipping</span><b>{SHIPPING ? currency(SHIPPING) : 'Free'}</b></div>
            <div className="co-line total"><span>Total</span><b>{total} <small>EGP</small></b></div>

            <button className="co-submit" disabled={busy}>
              <i className="fa-solid fa-lock" /> {busy ? 'Processing...' : method === 'cash' ? 'Place Order' : 'Pay Online'}
            </button>

            <div className="co-badges">
              <span><i className="fa-solid fa-shield-halved" /> Secure</span>
              <span><i className="fa-solid fa-truck-fast" /> Fast Delivery</span>
              <span><i className="fa-solid fa-rotate-left" /> Easy Returns</span>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

// ================= ORDERS =================

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    // The user id lives inside the JWT payload ({ id, name, role })
    const idFromToken = () => {
      try {
        const b = (localStorage.getItem('freshcart_token') || '').split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(b)).id;
      } catch { return null; }
    };
    const load = async () => {
      try {
        let id = idFromToken();
        if (!id) {
          const profile = unwrap(await api.get('/users/profile-data'));
          id = profile?.user?._id || profile?._id;
        }
        const d = unwrap(await api.get(`/orders/user/${id}`));
        const list = Array.isArray(d) ? d : [];
        // newest first
        setOrders([...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusOf = o => (o.isDelivered
    ? { label: 'Delivered', cls: 'done', icon: 'fa-circle-check' }
    : { label: 'Processing', cls: 'processing', icon: 'fa-clock' });

  return (
    <div className="container page or-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / My Orders
      </div>

      <div className="or-head">
        <div className="or-title">
          <span className="or-title-icon"><i className="fa-solid fa-bag-shopping" /></span>
          <div>
            <h1>My Orders</h1>
            <p>Track and manage your {orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
          </div>
        </div>
        <Link className="or-continue" to="/products"><i className="fa-solid fa-bag-shopping" /> Continue Shopping</Link>
      </div>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : !orders.length ? (
        <div className="empty">
          <i className="fa-solid fa-box-open" />
          <h2>No orders yet</h2>
          <Link className="primary-btn" to="/products">Start Shopping</Link>
        </div>
      ) : (
        <div className="or-list">
          {orders.map(o => {
            const items = o.cartItems || [];
            const itemsCount = items.reduce((n, it) => n + (it.count || 1), 0);
            const first = items[0]?.product;
            const st = statusOf(o);
            const isOpen = open === o._id;
            const cash = o.paymentMethodType !== 'card';
            return (
              <article className="or-card" key={o._id}>
                <div className="or-main">
                  <div className="or-thumb">
                    <img src={imageOf(first)} alt={first?.title || 'Order item'} />
                    {items.length > 1 && <span>+{items.length - 1}</span>}
                  </div>

                  <div className="or-info">
                    <span className={`or-status ${st.cls}`}><i className={`fa-solid ${st.icon}`} /> {st.label}</span>
                    <h3><em>#</em> {o.id || o._id?.slice(-8)}</h3>
                    <div className="or-meta">
                      <span><i className="fa-regular fa-calendar" /> {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span><i className="fa-solid fa-box" /> {itemsCount} {itemsCount === 1 ? 'item' : 'items'}</span>
                      {o.shippingAddress?.city && <span><i className="fa-solid fa-location-dot" /> {o.shippingAddress.city}</span>}
                    </div>
                    <div className="or-total">{Number(o.totalOrderPrice)} <small>EGP</small></div>
                  </div>

                  <div className="or-side">
                    <span className="or-pay" title={cash ? 'Cash on Delivery' : 'Paid by card'}>
                      <i className={`fa-solid ${cash ? 'fa-money-bill-wave' : 'fa-credit-card'}`} />
                    </span>
                    <button className="or-details-btn" onClick={() => setOpen(isOpen ? null : o._id)} aria-expanded={isOpen}>
                      Details <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`} />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="or-more">
                    <div className="or-items">
                      {items.map(it => (
                        <div className="or-item" key={it._id || it.product?._id}>
                          <img src={imageOf(it.product)} alt="" />
                          <div>
                            <b>{it.product?.title || 'Product'}</b>
                            <small>{it.count || 1} × {currency(it.price)}</small>
                          </div>
                          <span>{Number((it.price || 0) * (it.count || 1))} EGP</span>
                        </div>
                      ))}
                    </div>
                    <div className="or-facts">
                      <div><small>Payment</small><b>{cash ? 'Cash on Delivery' : 'Online (Card)'}</b></div>
                      <div><small>Payment status</small><b>{o.isPaid ? 'Paid' : 'Pay on delivery'}</b></div>
                      <div><small>Phone</small><b>{o.shippingAddress?.phone || '-'}</b></div>
                      <div><small>Address</small><b>{o.shippingAddress?.details || '-'}{o.shippingAddress?.city ? `, ${o.shippingAddress.city}` : ''}</b></div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <div className="or-perks">
        <div><i className="fa-solid fa-truck" /><span><b>Free Shipping</b><small>On orders over 500 EGP</small></span></div>
        <div><i className="fa-solid fa-rotate-left" /><span><b>Easy Returns</b><small>14-day return policy</small></span></div>
        <div><i className="fa-solid fa-shield-halved" /><span><b>Secure Payment</b><small>100% secure checkout</small></span></div>
        <div><i className="fa-solid fa-headset" /><span><b>24/7 Support</b><small>Contact us anytime</small></span></div>
      </div>
    </div>
  );
}
