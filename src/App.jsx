import React from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  Link
} from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import SearchResults from './pages/SearchResults';

import {
  Home,
  Products,
  ProductDetails,
  Categories,
  CategoryDetails,
  Brands,
  BrandDetails,
  Cart,
  Wishlist,
  Checkout,
  Orders
} from './pages/StorePages';

import { Profile, Addresses, Settings } from './pages/AccountPages';
import ContactPage from './pages/ContactPage';


import {
  Login,
  Register,
  ForgotPassword,
  ChangePassword
} from './pages/AuthPages';

function ScrollTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Layout({ children }) {
  return (
    <div className="site-layout">
      <ScrollTop />

      <Header />

      <main className="site-main">
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/addresses" element={<Addresses />} />
              <Route path="/profile/settings" element={<Settings />} />
              <Route path="/addresses" element={<Navigate to="/profile/addresses" replace />} />
              <Route path="/settings" element={<Navigate to="/profile/settings" replace />} />



              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/forgot-password"
                element={<ForgotPassword />}
              />
              <Route
                path="/change-password"
                element={<ChangePassword />}
              />

              <Route path="/products" element={<SearchResults shop />} />
              <Route path="/search" element={<SearchResults />} />
              <Route
                path="/products/:id"
                element={<ProductDetails />}
              />

              <Route path="/categories" element={<Categories />} />
              <Route
                path="/categories/:id"
                element={<CategoryDetails />}
              />

              <Route path="/brands" element={<Brands />} />
              <Route
                path="/brands/:id"
                element={<BrandDetails />}
              />

              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/support" element={<Navigate to="/contact" replace />} />
              <Route path="/allorders" element={<Navigate to="/orders" replace />} />

              <Route
                path="*"
                element={
                  <div className="container page empty">
                    <h1>Page not found</h1>
                    <Link className="primary-btn" to="/">
                      Back Home
                    </Link>
                  </div>
                }
              />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}