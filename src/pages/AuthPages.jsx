import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, unwrap } from '../services/api';
import { useStore } from '../contexts/StoreContext';
import '../styles.css';

function AuthShell({ title, subtitle, children }) {
  return (
    <div className="auth-page">

      <section className="auth-visual">

        <div className="auth-visual-image">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000"
            alt="FreshCart fresh groceries"
          />
        </div>

        <div className="auth-visual-content">

          <h2>
            FreshCart - Your One-Stop Shop
            for Fresh Products
          </h2>

          <p>
            Join thousands of happy customers
            who trust FreshCart for their daily
            grocery needs.
          </p>

          <div className="auth-features">

            <div>
              <i className="fa-solid fa-truck-fast"></i>
              <span>
                <b>Free Delivery</b>
                <small>On orders over $50</small>
              </span>
            </div>

            <div>
              <i className="fa-solid fa-shield-halved"></i>
              <span>
                <b>Secure Payment</b>
                <small>100% secure payment</small>
              </span>
            </div>

            <div>
              <i className="fa-solid fa-headset"></i>
              <span>
                <b>24/7 Support</b>
                <small>Dedicated support</small>
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="auth-card">

        <Link to="/" className="brand-logo">
          <span className="logo-mark">
            <i className="fa-solid fa-leaf"></i>
          </span>

          <span>
            Fresh<span>Cart</span>
          </span>
        </Link>

        <h1>{title}</h1>

        <p className="muted">
          {subtitle}
        </p>

        {children}

      </section>

    </div>
  );
}


// ================= LOGIN =================

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const { login } = useStore();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      const d = unwrap(await api.post('/auth/signin', form));
      login(d.token, remember, d.user);
      nav('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to login. Check your details.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="li-page">
      <div className="li-grid">

        {/* LEFT */}
        <section className="li-left">
          <div className="li-image">
            {/* replace with your own illustration: src/assets/login-cart.png */}
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000"
              alt="Basket full of fresh vegetables"
            />
          </div>

          <h1>FreshCart - Your One-Stop Shop for Fresh Products</h1>
          <p>
            Join thousands of happy customers who trust FreshCart for their
            daily grocery needs
          </p>

          <div className="li-points">
            <span><i className="fa-solid fa-truck"></i> Free Delivery</span>
            <span><i className="fa-solid fa-shield-halved"></i> Secure Payment</span>
            <span><i className="fa-solid fa-clock"></i> 24/7 Support</span>
          </div>
        </section>

        {/* RIGHT */}
        <section className="li-card">
          <Link to="/" className="li-logo">
            Fresh<span>Cart</span>
          </Link>

          <h2>Welcome Back!</h2>
          <p className="li-sub">
            Sign in to continue your fresh shopping experience
          </p>

          <button type="button" className="li-social">
            <i className="fa-brands fa-google li-google"></i>
            Continue with Google
          </button>
          <button type="button" className="li-social">
            <i className="fa-brands fa-facebook li-facebook"></i>
            Continue with Facebook
          </button>

          <div className="li-or"><span>OR CONTINUE WITH EMAIL</span></div>

          <form onSubmit={submit} className="li-form">
            <label>
              <span className="li-label">Email Address</span>
              <div className="li-field">
                <i className="fa-solid fa-envelope"></i>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </label>

            <label>
              <span className="li-label li-label-row">
                Password
                <Link to="/forgot-password">Forgot Password?</Link>
              </span>
              <div className="li-field">
                <i className="fa-solid fa-lock"></i>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  className="li-eye"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  <i className={`fa-regular ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </label>

            <label className="li-check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Keep me signed in
            </label>

            {error && <p className="error li-error">{error}</p>}

            <button type="submit" className="li-submit" disabled={busy}>
              {busy ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="li-foot">
            New to FreshCart? <Link to="/register">Create an account</Link>
          </p>
        </section>
      </div>
    </div>
  );
}


// ================= REGISTER =================

export function Register() {
  const { login } = useStore();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    phone: ''
  });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  // password strength: length, number, symbol, upper+lower
  const checks = [
    form.password.length >= 8,
    /\d/.test(form.password),
    /[^A-Za-z0-9]/.test(form.password),
    /[a-z]/.test(form.password) && /[A-Z]/.test(form.password)
  ];
  const score = form.password ? checks.filter(Boolean).length : 0;
  const strength = ['', 'Weak', 'Weak', 'Medium', 'Strong'][score];

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!(checks[0] && checks[1] && checks[2])) {
      setError('Password must be at least 8 characters with numbers and symbols');
      return;
    }
    if (form.password !== form.rePassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agree) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setBusy(true);
    try {
      const d = unwrap(await api.post('/auth/signup', form));
      login(d.token, true, d.user);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="su-page">
      <div className="su-grid">

        {/* LEFT */}
        <section className="su-left">
          <h1>Welcome to <span>FreshCart</span></h1>
          <p className="su-lead">
            Join thousands of happy customers who enjoy fresh groceries
            delivered right to their doorstep.
          </p>

          <ul className="su-points">
            <li>
              <i className="fa-solid fa-star"></i>
              <div>
                <h3>Premium Quality</h3>
                <p>Premium quality products sourced from trusted suppliers.</p>
              </div>
            </li>
            <li>
              <i className="fa-solid fa-truck-fast"></i>
              <div>
                <h3>Fast Delivery</h3>
                <p>Same-day delivery available in most areas</p>
              </div>
            </li>
            <li>
              <i className="fa-solid fa-shield-halved"></i>
              <div>
                <h3>Secure Shopping</h3>
                <p>Your data and payments are completely secure</p>
              </div>
            </li>
          </ul>

          <div className="su-review">
            <div className="su-review-head">
              <img src="https://i.pravatar.cc/80?img=47" alt="Sarah Johnson" />
              <div>
                <b>Sarah Johnson</b>
                <div className="su-stars">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star"></i>
                  ))}
                </div>
              </div>
            </div>
            <p>
              "FreshCart has transformed my shopping experience. The quality of
              the products is outstanding, and the delivery is always on time.
              Highly recommend!"
            </p>
          </div>
        </section>

        {/* RIGHT */}
        <section className="su-card">
          <h2>Create Your Account</h2>
          <p className="su-sub">Start your fresh journey with us today</p>

          <div className="su-social">
            <button type="button" className="su-social-btn">
              <i className="fa-brands fa-google su-google"></i> Google
            </button>
            <button type="button" className="su-social-btn">
              <i className="fa-brands fa-facebook su-facebook"></i> Facebook
            </button>
          </div>

          <div className="su-or"><span>or</span></div>

          <form onSubmit={submit} className="su-form" noValidate>
            <label>
              <span>Name<em>*</em></span>
              <input
                type="text"
                placeholder="Ali"
                required
                value={form.name}
                onChange={set('name')}
              />
            </label>

            <label>
              <span>Email<em>*</em></span>
              <input
                type="email"
                placeholder="ali@example.com"
                required
                value={form.email}
                onChange={set('email')}
              />
            </label>

            <label>
              <span>Password<em>*</em></span>
              <input
                type="password"
                placeholder="create a strong password"
                required
                value={form.password}
                onChange={set('password')}
              />
              <div className="su-strength">
                <div className="su-bar">
                  <i className={`s${score}`}></i>
                </div>
                <b className={`s${score}`}>{strength || 'Weak'}</b>
              </div>
              <small>Must be at least 8 characters with numbers and symbols</small>
            </label>

            <label>
              <span>Confirm Password<em>*</em></span>
              <input
                type="password"
                placeholder="confirm your password"
                required
                value={form.rePassword}
                onChange={set('rePassword')}
              />
            </label>

            <label>
              <span>Phone Number<em>*</em></span>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                required
                value={form.phone}
                onChange={set('phone')}
              />
            </label>

            <label className="su-check">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>
                I agree to the <a href="#terms">Terms of Service</a> and{' '}
                <a href="#privacy">Privacy Policy</a> <em>*</em>
              </span>
            </label>

            {error && <p className="error su-error">{error}</p>}

            <button type="submit" className="su-submit" disabled={busy}>
              <i className="fa-solid fa-user-plus"></i>
              {busy ? 'Creating Account...' : 'Create My Account'}
            </button>
          </form>

          <p className="su-foot">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </section>
      </div>

      {/* BOTTOM STRIP */}
      <div className="su-strip">
        <div>
          <i className="fa-solid fa-truck"></i>
          <span><b>Free Shipping</b><small>On orders over 500 EGP</small></span>
        </div>
        <div>
          <i className="fa-solid fa-rotate-left"></i>
          <span><b>Easy Returns</b><small>14-day return policy</small></span>
        </div>
        <div>
          <i className="fa-solid fa-shield-halved"></i>
          <span><b>Secure Payment</b><small>100% secure checkout</small></span>
        </div>
        <div>
          <i className="fa-solid fa-headset"></i>
          <span><b>24/7 Support</b><small>Contact us anytime</small></span>
        </div>
      </div>
    </div>
  );
}


// ================= FORGOT PASSWORD =================

export function ForgotPassword() {
  const { login } = useStore();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    email: '',
    resetCode: '',
    newPassword: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');
    setBusy(true);

    try {

      if (step === 1) {

        const d = unwrap(
          await api.post('/auth/forgotPasswords', {
            email: form.email
          })
        );

        setMessage(
          d?.message ||
          'Reset code sent. Check your email.'
        );

        setStep(2);

      } else if (step === 2) {

        const d = unwrap(
          await api.post('/auth/verifyResetCode', {
            resetCode: form.resetCode
          })
        );

        setMessage(
          d?.message ||
          'Code verified. Choose a new password.'
        );

        setStep(3);

      } else {

        const d = unwrap(
          await api.put('/auth/resetPassword', {
            email: form.email,
            newPassword: form.newPassword
          })
        );

        if (d?.token) login(d.token);

        setMessage(
          d?.message ||
          'Password reset successfully. You can sign in now.'
        );

      }

    } catch (e) {

      setError(
        e.response?.data?.message ||
        'Something went wrong. Please try again.'
      );

    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title={
        step === 1
          ? 'Forgot Password?'
          : step === 2
          ? 'Verify Reset Code'
          : 'Create New Password'
      }
      subtitle={
        step === 1
          ? 'Enter your email and we will send you a reset code.'
          : step === 2
          ? 'Enter the reset code sent to your email.'
          : 'Choose a strong password for your account.'
      }
    >

      <form
        className="auth-form"
        onSubmit={submit}
      >

        {step === 1 && (
          <label>
            Email Address

            <input
              type="email"
              placeholder="Enter your email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
            />
          </label>
        )}

        {step === 2 && (
          <label>
            Reset Code

            <input
              type="text"
              placeholder="Enter verification code"
              required
              value={form.resetCode}
              onChange={(e) =>
                setForm({
                  ...form,
                  resetCode: e.target.value
                })
              }
            />
          </label>
        )}

        {step === 3 && (
          <label>
            New Password

            <input
              type="password"
              placeholder="Enter your new password"
              minLength="6"
              required
              value={form.newPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  newPassword: e.target.value
                })
              }
            />
          </label>
        )}

        {message && (
          <p className="success">
            {message}
          </p>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="primary-btn full"
          disabled={busy}
        >
          {busy
            ? 'Please wait...'
            : step === 1
            ? 'Send Reset Code'
            : step === 2
            ? 'Verify Code'
            : 'Reset Password'
          }
        </button>

      </form>

      <p className="auth-foot">
        <Link to="/login">
          Back to Sign In
        </Link>
      </p>

    </AuthShell>
  );
}


// ================= CHANGE PASSWORD =================

export function ChangePassword() {
  const { login } = useStore();

  const [form, setForm] = useState({
    currentPassword: '',
    password: '',
    rePassword: ''
  });

  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setError('');
    setOk('');

    if (form.password !== form.rePassword) {
      setError('New passwords do not match');
      return;
    }

    setBusy(true);

    try {

      const d = unwrap(
        await api.put('/users/changeMyPassword', form)
      );

      if (d?.token) login(d.token);

      setOk('Password changed successfully');

      setForm({
        currentPassword: '',
        password: '',
        rePassword: ''
      });

    } catch (e) {

      setError(
        e.response?.data?.message ||
        'Could not change password'
      );

    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Change Password"
      subtitle="Update your password to keep your account secure."
    >

      <form
        className="auth-form"
        onSubmit={submit}
      >

        <label>
          Current Password

          <input
            type="password"
            placeholder="Enter current password"
            required
            value={form.currentPassword}
            onChange={(e) =>
              setForm({
                ...form,
                currentPassword: e.target.value
              })
            }
          />
        </label>

        <label>
          New Password

          <input
            type="password"
            placeholder="Enter new password"
            minLength="6"
            required
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
          />
        </label>

        <label>
          Confirm New Password

          <input
            type="password"
            placeholder="Confirm new password"
            required
            value={form.rePassword}
            onChange={(e) =>
              setForm({
                ...form,
                rePassword: e.target.value
              })
            }
          />
        </label>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {ok && (
          <p className="success">
            {ok}
          </p>
        )}

        <button
          type="submit"
          className="primary-btn full"
          disabled={busy}
        >
          {busy ? 'Updating...' : 'Change Password'}
        </button>

      </form>

      <p className="auth-foot">
        <Link to="/">
          Back to Home
        </Link>
      </p>

    </AuthShell>
  );
}