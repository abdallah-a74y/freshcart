import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../contexts/StoreContext";

function Header() {
    const [openCategories, setOpenCategories] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { token, user, logout, cart, wishlist } = useStore();
    const cartCount = (cart?.products || []).reduce((n, r) => n + (r.count || 1), 0);
    const wishCount = wishlist?.length || 0;
    const [openUser, setOpenUser] = useState(false);
    const userRef = useRef(null);

    useEffect(() => {
        if (!openUser) return;
        const onClick = (e) => {
            if (userRef.current && !userRef.current.contains(e.target)) setOpenUser(false);
        };
        const onKey = (e) => {
            if (e.key === "Escape") setOpenUser(false);
        };
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, [openUser]);

    const handleLogout = () => {
        setOpenUser(false);
        logout();
        navigate("/");
    };

    const categories = [
        { name: "All Categories", path: "/categories" },
        { name: "Electronics", path: "/search?q=Electronics" },
        { name: "Women's Fashion", path: "/search?q=Women's%20Fashion" },
        { name: "Men's Fashion", path: "/search?q=Men's%20Fashion" },
        { name: "Beauty & Health", path: "/search?q=Beauty%20%26%20Health" },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?q=${encodeURIComponent(search.trim())}`);
        }
    };

    return (
        <header className="header">

            {/* Top Bar */}
            <div className="top-strip">
                <div className="container strip-inner">
                    <div>
                        <span>
                            <i className="fa-solid fa-truck-fast"></i>
                            Free Shipping on Orders 500 EGP
                        </span>

                        <span className="lang">
                            <i className="fa-solid fa-gift"></i>
                            New Arrivals Daily
                        </span>
                    </div>

                    <div>
                        <a href="tel:+18001234567" className="strip-link">
                            <i className="fa-solid fa-phone"></i>
                            +1 (800) 123-4567
                        </a>

                        <a href="mailto:support@freshcart.com" className="lang strip-link">
                            <i className="fa-regular fa-envelope"></i>
                            support@freshcart.com
                        </a>

                        {token ? (
                            <>
                                {user?.name && (
                                    <Link to="/profile" className="lang strip-link" title="My Account">
                                        <i className="fa-regular fa-user"></i> {user.name}
                                    </Link>
                                )}
                                <button type="button" className="lang strip-btn" onClick={handleLogout}>
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="lang">
                                    <i className="fa-regular fa-user"></i> Sign In
                                </Link>

                                <Link to="/register" className="lang">
                                    <i className="fa-solid fa-user-plus"></i> Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="header-main container">

                {/* Logo */}
                <Link to="/" className="brand-logo">
                    <span className="logo-mark">
                        <i className="fa-solid fa-cart-shopping"></i>
                    </span>
                    <span>Fresh<span>Cart</span></span>
                </Link>

                {/* Search */}
                <form className="search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search for products, brands and more..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button type="submit">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </form>

                {/* Header Actions */}
                <div className="header-actions">

                    <Link to="/wishlist" className="icon-link">
                        <i className="fa-regular fa-heart"></i>
                        {token && wishCount > 0 && <b className="wish-count">{wishCount > 99 ? '99+' : wishCount}</b>}
                    </Link>

                    <Link to="/cart" className="icon-link">
                        <i className="fa-solid fa-cart-shopping"></i>
                        {token && cartCount > 0 && <b>{cartCount > 99 ? '99+' : cartCount}</b>}
                    </Link>

                    {token ? (
                        <div className={`user-menu ${openUser ? "show" : ""}`} ref={userRef}>
                            <button
                                type="button"
                                className="icon-link user-toggle"
                                onClick={() => setOpenUser((o) => !o)}
                                aria-haspopup="menu"
                                aria-expanded={openUser}
                                aria-label="Account menu"
                            >
                                <i className="fa-regular fa-circle-user"></i>
                            </button>

                            <div className="user-dropdown" role="menu">
                                <div className="user-dropdown-head">
                                    <span className="user-avatar">
                                        <i className="fa-regular fa-circle-user"></i>
                                    </span>
                                    <div>
                                        <strong>{user?.name || "My Account"}</strong>
                                        {user?.email && <small>{user.email}</small>}
                                    </div>
                                </div>

                                <Link to="/profile/addresses" role="menuitem" onClick={() => setOpenUser(false)}>
                                    <i className="fa-regular fa-user"></i> My Profile
                                </Link>
                                <Link to="/orders" role="menuitem" onClick={() => setOpenUser(false)}>
                                    <i className="fa-solid fa-box-open"></i> My Orders
                                </Link>
                                <Link to="/wishlist" role="menuitem" onClick={() => setOpenUser(false)}>
                                    <i className="fa-regular fa-heart"></i> My Wishlist
                                </Link>
                                <Link to="/profile/addresses" role="menuitem" onClick={() => setOpenUser(false)}>
                                    <i className="fa-regular fa-address-card"></i> Addresses
                                </Link>
                                <Link to="/profile/settings" role="menuitem" onClick={() => setOpenUser(false)}>
                                    <i className="fa-solid fa-gear"></i> Settings
                                </Link>

                                <button type="button" className="user-signout" role="menuitem" onClick={handleLogout}>
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="header-signin">
                            <i className="fa-regular fa-user"></i>
                            Sign In
                        </Link>
                    )}

                </div>
            </div>

            {/* Navigation */}
            <div className="container nav-row">

                <nav>
                    <Link to="/" className="active">Home</Link>

                    <Link to="/products">Shop</Link>

                    {/* Categories Dropdown */}
                    <div
                        className={`categories-dropdown ${openCategories ? "show" : ""}`}
                        onMouseEnter={() => setOpenCategories(true)}
                        onMouseLeave={() => setOpenCategories(false)}
                    >
                        <button
                            type="button"
                            className="categories-toggle"
                            onClick={() => setOpenCategories(!openCategories)}
                            aria-expanded={openCategories}
                        >
                            Categories

                            <i
                                className={`fa-solid fa-chevron-down ${openCategories ? "rotate" : ""}`}
                            ></i>
                        </button>

                        <div className="categories-menu">
                            {categories.map((category, index) => (
                                <Link
                                    key={index}
                                    to={category.path}
                                    onClick={() => setOpenCategories(false)}
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <Link to="/brands">Brands</Link>
                </nav>

                <Link to="/contact" className="deal-link">
                    <i className="fa-solid fa-headset"></i>
                    Support 24/7 Help
                </Link>

            </div>
        </header>
    );
}

export default Header;