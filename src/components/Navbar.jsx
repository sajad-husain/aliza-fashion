import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiHeart, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import CartIcon from "./CartIcon";
import SearchBar from "./SearchBar";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onCartOpen }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getWishlistTotal } = useWishlist();
  const { logout, isAuthenticated, isAdmin } = useAuth();
  const wishlistCount = getWishlistTotal();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          ALIZA
        </Link>
        <nav className="nav-links">
          <Link to="/#categories">Categories</Link>
          <Link to="/products">Shop All</Link>
          <Link to="/#products">Featured</Link>
          <Link to="/#about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="nav-actions">
          <SearchBar />
          <Link to="/wishlist" className="wishlist-icon-btn" aria-label="Wishlist">
            <FiHeart size={20} />
            {wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
          </Link>
          {isAuthenticated ? (
            <div className="user-menu">
              {isAdmin && (
                <Link to="/admin" className="user-icon-btn" aria-label="Admin Dashboard">
                  <FiSettings size={20} />
                </Link>
              )}
              <Link to="/profile" className="user-icon-btn" aria-label="Profile">
                <FiUser size={20} />
              </Link>
              <button className="user-icon-btn" onClick={logout} aria-label="Logout">
                <FiLogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="user-icon-btn" aria-label="Login">
              <FiUser size={20} />
            </Link>
          )}
          <CartIcon onClick={onCartOpen} />
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu size={24} />
          </button>
        </div>
      </div>

      <div
        className={`mobile-menu-overlay ${
          isMobileMenuOpen ? "active" : ""
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <aside className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="brand" onClick={() => setIsMobileMenuOpen(false)}>
            ALIZA
          </Link>
          <button
            className="mobile-menu-close"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="mobile-menu-content">
          <ul className="mobile-menu-links">
            <li>
              <Link to="/#categories" onClick={() => setIsMobileMenuOpen(false)}>
                Categories
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>
                Shop All Products
              </Link>
            </li>
            <li>
              <Link to="/#products" onClick={() => setIsMobileMenuOpen(false)}>
                Featured
              </Link>
            </li>
            <li>
              <Link to="/#about" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </Link>
            </li>
            {isAuthenticated && isAdmin && (
              <li>
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="mobile-menu-actions">
          <Link
            to="/search"
            className="btn btn-secondary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Search Products
          </Link>
        </div>
      </aside>
    </header>
  );
};

export default Navbar;
