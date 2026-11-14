import React, { useEffect, useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { api } from '../services/api';

function AccountShell({ children }) {
  const { token } = useStore();
  if (!token) return <Navigate to="/login" replace />;
  return (
    <>
    <div className="account-banner">
      <div className="container account-banner-inner">
        <span className="account-banner-icon"><i className="fa-solid fa-user" /></span>
        <div>
          <h2>My Account</h2>
          <p>Manage your addresses and account settings</p>
        </div>
      </div>
    </div>
    <div className="container page account-layout">
      <aside className="account-sidebar">
        <h3>My Account</h3>
        <nav>
          <NavLink to="/profile/addresses">
            <span className="account-nav-icon"><i className="fa-solid fa-location-dot" /></span>
            <span>My Addresses</span>
            <i className="fa-solid fa-chevron-right account-nav-arrow" />
          </NavLink>
          <NavLink to="/profile/settings">
            <span className="account-nav-icon"><i className="fa-solid fa-gear" /></span>
            <span>Settings</span>
            <i className="fa-solid fa-chevron-right account-nav-arrow" />
          </NavLink>
        </nav>
      </aside>
      <section className="account-content">{children}</section>
    </div>
    </>
  );
}

// "My Profile" and the old /addresses, /settings URLs all land on the addresses page
export function Profile() {
  return <Navigate to="/profile/addresses" replace />;
}

const emptyForm = { name: '', details: '', phone: '', city: '' };

export function Addresses() {
  const { notify } = useStore();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const res = await api.get('/addresses');
      setList(res.data?.data || []);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = a => {
    setEditing(a);
    setForm({ name: a.name || '', details: a.details || '', phone: a.phone || '', city: a.city || '' });
    setOpen(true);
  };
  const close = () => { setOpen(false); setEditing(null); setForm(emptyForm); };

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      // the API has no update endpoint: add the new version first, then drop the old one
      await api.post('/addresses', form);
      if (editing) await api.delete(`/addresses/${editing._id}`);
      notify(editing ? 'Address updated successfully' : 'Address added successfully');
      close();
      await load();
    } catch (err) {
      notify(err.response?.data?.message || 'Could not save address');
    } finally {
      setSaving(false);
    }
  };

  const remove = async id => {
    try {
      await api.delete(`/addresses/${id}`);
      notify('Address removed');
      await load();
    } catch {
      notify('Could not remove address');
    }
  };

  return (
    <AccountShell>
      <div className="addr-head">
        <div>
          <h1>My Addresses</h1>
          <p>Manage your saved delivery addresses</p>
        </div>
        <button className="primary-btn" onClick={openAdd}>
          <i className="fa-solid fa-plus" /> Add Address
        </button>
      </div>

      {loading ? (
        <p className="account-note">Loading...</p>
      ) : list.length === 0 ? (
        <div className="addr-empty">
          <span className="addr-empty-icon"><i className="fa-solid fa-location-dot" /></span>
          <h3>No Addresses Yet</h3>
          <p>Add your first delivery address to make checkout faster and easier.</p>
          <button className="primary-btn" onClick={openAdd}>
            <i className="fa-solid fa-plus" /> Add Your First Address
          </button>
        </div>
      ) : (
        <div className="addr-list">
          {list.map(a => (
            <div className="addr-card" key={a._id}>
              <span className="addr-pin"><i className="fa-solid fa-location-dot" /></span>
              <div className="addr-info">
                <h4>{a.name}</h4>
                <p>{a.details}</p>
                <div className="addr-meta">
                  <span><i className="fa-solid fa-phone" /> {a.phone}</span>
                  <span><i className="fa-solid fa-city" /> {a.city}</span>
                </div>
              </div>
              <div className="addr-icons">
                <button title="Edit" onClick={() => openEdit(a)}><i className="fa-solid fa-pen" /></button>
                <button title="Delete" onClick={() => remove(a._id)}><i className="fa-solid fa-trash" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="addr-modal" onClick={close}>
          <form className="addr-form" onClick={e => e.stopPropagation()} onSubmit={save}>
            <div className="addr-form-head">
              <h3>{editing ? 'Edit Address' : 'Add New Address'}</h3>
              <button type="button" className="addr-close" onClick={close} aria-label="Close"><i className="fa-solid fa-xmark" /></button>
            </div>
            <label>Address Name<input name="name" value={form.name} onChange={change} placeholder="e.g. Home, Office" required autoFocus /></label>
            <label>Full Address<textarea name="details" value={form.details} onChange={change} placeholder="Street, building, apartment..." rows={4} required /></label>
            <div className="addr-row">
              <label>Phone Number<input name="phone" value={form.phone} onChange={change} placeholder="01xxxxxxxxx" pattern="01[0125][0-9]{8}" title="Egyptian phone number" required /></label>
              <label>City<input name="city" value={form.city} onChange={change} placeholder="Cairo" required /></label>
            </div>
            <div className="addr-actions">
              <button type="button" className="addr-cancel" onClick={close}>Cancel</button>
              <button className="primary-btn" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Address'}</button>
            </div>
          </form>
        </div>
      )}
    </AccountShell>
  );
}

const tokenInfo = t => {
  try {
    return JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
};

function PasswordField({ label, hint, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <label className="set-field">
      {label}
      <span className="set-pass">
        <input type={show ? 'text' : 'password'} {...props} />
        <button type="button" onClick={() => setShow(!show)} aria-label="Toggle password visibility">
          <i className={`fa-regular ${show ? 'fa-eye-slash' : 'fa-eye'}`} />
        </button>
      </span>
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Settings() {
  const { user, token, login, notify } = useStore();
  const info = tokenInfo(token || '');
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', phone: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [pass, setPass] = useState({ currentPassword: '', password: '', rePassword: '' });
  const [savingPass, setSavingPass] = useState(false);
  const remember = localStorage.getItem('freshcart_remember') !== '0';

  const saveProfile = async e => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const body = { name: profile.name, email: profile.email };
      if (profile.phone) body.phone = profile.phone;
      const res = await api.put('/users/updateMe/', body);
      const u = res.data?.user || body;
      login(token, remember, { name: u.name || profile.name, email: u.email || profile.email });
      notify('Profile updated successfully');
    } catch (err) {
      notify(err.response?.data?.errors?.msg || err.response?.data?.message || 'Could not update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const savePass = async e => {
    e.preventDefault();
    if (pass.password.length < 6) return notify('Password must be at least 6 characters');
    if (pass.password !== pass.rePassword) return notify('Passwords do not match');
    setSavingPass(true);
    try {
      const res = await api.put('/users/changeMyPassword', pass);
      if (res.data?.token) login(res.data.token, remember, user);
      setPass({ currentPassword: '', password: '', rePassword: '' });
      notify('Password changed successfully');
    } catch (err) {
      notify(err.response?.data?.errors?.msg || err.response?.data?.message || 'Could not change password');
    } finally {
      setSavingPass(false);
    }
  };

  const p = e => setProfile({ ...profile, [e.target.name]: e.target.value });
  const q = e => setPass({ ...pass, [e.target.name]: e.target.value });

  return (
    <AccountShell>
      <div className="addr-head">
        <div>
          <h1>Account Settings</h1>
          <p>Update your profile information and change your password</p>
        </div>
      </div>

      <div className="set-card">
        <div className="set-card-head">
          <span className="set-icon green"><i className="fa-solid fa-user" /></span>
          <div>
            <h3>Profile Information</h3>
            <p>Update your personal details</p>
          </div>
        </div>
        <form onSubmit={saveProfile}>
          <label className="set-field">Full Name
            <input name="name" value={profile.name} onChange={p} placeholder="Enter your full name" required />
          </label>
          <label className="set-field">Email Address
            <input type="email" name="email" value={profile.email} onChange={p} placeholder="Enter your email" required />
          </label>
          <label className="set-field">Phone Number
            <input name="phone" value={profile.phone} onChange={p} placeholder="01xxxxxxxxx" pattern="01[0125][0-9]{8}" title="Egyptian phone number" />
          </label>
          <button className="primary-btn set-btn" disabled={savingProfile}>
            <i className="fa-solid fa-floppy-disk" /> {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <div className="set-info">
          <h4>Account Information</h4>
          <div><span>User ID</span><strong>{info.id || '—'}</strong></div>
          <div><span>Role</span><em className="set-badge">{info.role ? info.role[0].toUpperCase() + info.role.slice(1) : 'User'}</em></div>
        </div>
      </div>

      <div className="set-card">
        <div className="set-card-head">
          <span className="set-icon orange"><i className="fa-solid fa-lock" /></span>
          <div>
            <h3>Change Password</h3>
            <p>Update your account password</p>
          </div>
        </div>
        <form onSubmit={savePass}>
          <PasswordField label="Current Password" name="currentPassword" value={pass.currentPassword} onChange={q} placeholder="Enter your current password" required />
          <PasswordField label="New Password" name="password" value={pass.password} onChange={q} placeholder="Enter your new password" hint="Must be at least 6 characters" minLength={6} required />
          <PasswordField label="Confirm New Password" name="rePassword" value={pass.rePassword} onChange={q} placeholder="Confirm your new password" required />
          <button className="primary-btn set-btn orange" disabled={savingPass}>
            <i className="fa-solid fa-lock" /> {savingPass ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </AccountShell>
  );
}
