import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, unwrap } from '../services/api';
const StoreContext = createContext(null);
const readUser = () => { try { const u = JSON.parse(localStorage.getItem('freshcart_user')); return u && u.name ? u : null; } catch { return null; } };
const userFromToken = t => {
  try {
    const b = t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(Array.from(atob(b), c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''));
    const { name } = JSON.parse(json);
    return name ? { name } : null;
  } catch { return null; }
};
export const useStore = () => useContext(StoreContext);
export function StoreProvider({ children }) {
  const [cart, setCart] = useState({ products: [], totalCartPrice: 0, _id: null });
  const [wishlist, setWishlist] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('freshcart_token');
    // "Keep me signed in" unchecked: drop the token once the browser session ends
    if (t && localStorage.getItem('freshcart_remember') === '0' && !sessionStorage.getItem('freshcart_active')) {
      localStorage.removeItem('freshcart_token');
      localStorage.removeItem('freshcart_user');
      return '';
    }
    return t || '';
  });
  const [user, setUser] = useState(() => readUser() || userFromToken(localStorage.getItem('freshcart_token') || ''));
  const notify = message => { setToast(message); window.clearTimeout(window.__freshToast); window.__freshToast = window.setTimeout(() => setToast(''), 2600); };
  const refreshCart = async () => { if (!localStorage.getItem('freshcart_token')) return; try { setCartLoading(true); setCart(unwrap(await api.get('/cart')) || { products: [] }); } catch { } finally { setCartLoading(false); } };
  const refreshWishlist = async () => { if (!localStorage.getItem('freshcart_token')) return; try { const data = unwrap(await api.get('/wishlist')); setWishlist(Array.isArray(data) ? data : data?.products || []); } catch { } };
  useEffect(() => { refreshCart(); refreshWishlist(); }, []);
  const addToCart = async productId => { try { await api.post('/cart', { productId }); await refreshCart(); notify('Added to cart successfully'); } catch (e) { notify(e.response?.data?.message || 'Please login to add products'); } };
  const removeFromCart = async productId => { try { setCart(unwrap(await api.delete(`/cart/${productId}`)) || { products: [] }); await refreshCart(); notify('Product removed from cart'); } catch { notify('Could not remove product'); } };
  const updateCart = async (productId, count) => { if (count < 1) return removeFromCart(productId); try { setCart(unwrap(await api.put(`/cart/${productId}`, { count })) || cart); await refreshCart(); } catch { notify('Could not update quantity'); } };
  const addToWishlist = async productId => { try { await api.post('/wishlist', { productId }); await refreshWishlist(); notify('Added to wishlist'); } catch (e) { notify(e.response?.data?.message || 'Please login first'); } };
  const removeFromWishlist = async productId => { try { await api.delete(`/wishlist/${productId}`); setWishlist(w => w.filter(p => p._id !== productId)); await refreshWishlist(); notify('Removed from wishlist'); } catch { notify('Could not remove item'); } };
  const login = (newToken, remember = true, newUser = null) => {
    const u = newUser?.name ? { name: newUser.name, email: newUser.email } : userFromToken(newToken);
    if (u) localStorage.setItem('freshcart_user', JSON.stringify(u)); else localStorage.removeItem('freshcart_user');
    setUser(u);
    localStorage.setItem('freshcart_token', newToken);
    localStorage.setItem('freshcart_remember', remember ? '1' : '0');
    sessionStorage.setItem('freshcart_active', '1');
    setToken(newToken);
    refreshCart();
    refreshWishlist();
  };
  const logout = () => {
    localStorage.removeItem('freshcart_token');
    localStorage.removeItem('freshcart_remember');
    localStorage.removeItem('freshcart_user');
    sessionStorage.removeItem('freshcart_active');
    setToken('');
    setUser(null);
    setCart({ products: [], totalCartPrice: 0, _id: null });
    setWishlist([]);
    notify('Signed out successfully');
  };
  const value = useMemo(() => ({ token, user, login, logout, cart, wishlist, cartLoading, toast, notify, refreshCart, refreshWishlist, addToCart, removeFromCart, updateCart, addToWishlist, removeFromWishlist }), [token, user, cart, wishlist, cartLoading, toast]);
  return <StoreContext.Provider value={value}>{children}{toast && <div className="toast"><i className="fa-solid fa-circle-check" /> {toast}</div>}</StoreContext.Provider>;
}