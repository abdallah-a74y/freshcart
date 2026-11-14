import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';

const SUBJECTS = [
  'General Inquiry',
  'Order Support',
  'Shipping Question',
  'Returns & Refunds',
  'Product Information',
  'Feedback & Suggestions',
  'Other'
];

const SUPPORT_EMAIL = 'support@freshcart.com';

export default function ContactPage() {
  const { user } = useStore();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = key => e => {
    setSent(false);
    setForm({ ...form, [key]: e.target.value });
    setErrors({ ...errors, [key]: '' });
  };

  const submit = e => {
    e.preventDefault();
    const er = {};
    if (form.name.trim().length < 2) er.name = 'Please enter your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) er.email = 'Enter a valid email address';
    if (!form.subject) er.subject = 'Please choose a subject';
    if (form.message.trim().length < 10) er.message = 'Message should be at least 10 characters';
    setErrors(er);
    if (Object.keys(er).length) return;

    // The API has no contact endpoint, so the form only confirms on screen (nothing is stored or emailed).
    setSent(true);
    setForm({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
  };

  return (
    <div className="ctc-page">
      <section className="ctc-hero">
        <div className="container">
          <div className="breadcrumbs"><Link to="/">Home</Link> / Contact Us</div>
          <div className="ctc-hero-row">
            <span className="ctc-hero-icon"><i className="fa-solid fa-headset" /></span>
            <div>
              <h1>Contact Us</h1>
              <p>We'd love to hear from you. Get in touch with our team.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container ctc-layout">
        <aside className="ctc-side">
          <a className="ctc-card" href="tel:+18001234567">
            <span className="ctc-ico"><i className="fa-solid fa-phone" /></span>
            <div><b>Phone</b><small>Mon-Fri from 8am to 6pm</small><strong>+1 (800) 123-4567</strong></div>
          </a>

          <a className="ctc-card" href={`mailto:${SUPPORT_EMAIL}`}>
            <span className="ctc-ico"><i className="fa-solid fa-envelope" /></span>
            <div><b>Email</b><small>We'll respond within 24 hours</small><strong>{SUPPORT_EMAIL}</strong></div>
          </a>

          <div className="ctc-card">
            <span className="ctc-ico"><i className="fa-solid fa-location-dot" /></span>
            <div><b>Office</b><small>123 Commerce Street<br />New York, NY 10001<br />United States</small></div>
          </div>

          <div className="ctc-card">
            <span className="ctc-ico"><i className="fa-solid fa-clock" /></span>
            <div><b>Business Hours</b><small>Monday - Friday: 8am - 6pm<br />Saturday: 9am - 4pm<br />Sunday: Closed</small></div>
          </div>

          <div className="ctc-card follow">
            <div>
              <b>Follow Us</b>
              <div className="ctc-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fa-brands fa-facebook-f" /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fa-brands fa-twitter" /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in" /></a>
              </div>
            </div>
          </div>
        </aside>

        <div className="ctc-main">
          <form className="ctc-form" onSubmit={submit} noValidate>
            <header>
              <span className="ctc-ico"><i className="fa-solid fa-headset" /></span>
              <div><h2>Send us a Message</h2><p>Fill out the form and we'll get back to you</p></div>
            </header>

            {sent && (
              <div className="ctc-success" role="status">
                <span><i className="fa-solid fa-check" /></span>
                <div>
                  <b>Message sent successfully!</b>
                  <small>We'll get back to you as soon as possible.</small>
                </div>
              </div>
            )}

            <div className="ctc-row">
              <label>
                <span>Full Name</span>
                <input className={errors.name ? 'err' : ''} value={form.name} onChange={set('name')} placeholder="John Doe" />
                {errors.name && <small>{errors.name}</small>}
              </label>
              <label>
                <span>Email Address</span>
                <input className={errors.email ? 'err' : ''} type="email" value={form.email} onChange={set('email')} placeholder="john@example.com" />
                {errors.email && <small>{errors.email}</small>}
              </label>
            </div>

            <label>
              <span>Subject</span>
              <select className={errors.subject ? 'err' : ''} value={form.subject} onChange={set('subject')}>
                <option value="">Select a subject</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.subject && <small>{errors.subject}</small>}
            </label>

            <label>
              <span>Message</span>
              <textarea className={errors.message ? 'err' : ''} rows="6" value={form.message} onChange={set('message')} placeholder="How can we help you?" />
              {errors.message && <small>{errors.message}</small>}
            </label>

            <button className="ctc-send"><i className="fa-solid fa-paper-plane" /> Send Message</button>
          </form>

          <div className="ctc-help">
            <span className="ctc-help-icon"><i className="fa-solid fa-question" /></span>
            <div>
              <b>Looking for quick answers?</b>
              <p>Check out our Help Center for frequently asked questions about orders, shipping, returns, and more.</p>
              <a href={`mailto:${SUPPORT_EMAIL}?subject=Help%20Center`}>Visit Help Center <i className="fa-solid fa-arrow-right" /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="container ctc-perks">
        <div><i className="fa-solid fa-truck" /><span><b>Free Shipping</b><small>On orders over 500 EGP</small></span></div>
        <div><i className="fa-solid fa-rotate-left" /><span><b>Easy Returns</b><small>14-day return policy</small></span></div>
        <div><i className="fa-solid fa-shield-halved" /><span><b>Secure Payment</b><small>100% secure checkout</small></span></div>
        <div><i className="fa-solid fa-headset" /><span><b>24/7 Support</b><small>Contact us anytime</small></span></div>
      </div>
    </div>
  );
}
