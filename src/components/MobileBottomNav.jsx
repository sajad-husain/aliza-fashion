import { Link, useLocation } from "react-router-dom";
import { FiHome, FiSearch, FiHeart, FiShoppingBag, FiUser } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

const MobileBottomNav = ({ onCartOpen }) => {
  const location = useLocation();
  const { getCartTotal } = useCart();
  const { getWishlistTotal } = useWishlist();
  const { isAuthenticated } = useAuth();

  const cartCount = getCartTotal();
  const wishlistCount = getWishlistTotal();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile quick navigation">
      <Link to="/" className={`mobile-bottom-link ${location.pathname === "/" ? "active" : ""}`}>
        <FiHome size={18} />
        <span>Home</span>
      </Link>
      <Link to="/search" className={`mobile-bottom-link ${location.pathname === "/search" ? "active" : ""}`}>
        <FiSearch size={18} />
        <span>Search</span>
      </Link>
      <Link to="/wishlist" className={`mobile-bottom-link ${location.pathname === "/wishlist" ? "active" : ""}`}>
        <div className="mobile-bottom-icon-wrap">
          <FiHeart size={18} />
          {wishlistCount > 0 && <small>{wishlistCount}</small>}
        </div>
        <span>Wishlist</span>
      </Link>
      <button className="mobile-bottom-link mobile-cart-btn" onClick={onCartOpen}>
        <div className="mobile-bottom-icon-wrap">
          <FiShoppingBag size={18} />
          {cartCount > 0 && <small>{cartCount}</small>}
        </div>
        <span>Cart</span>
      </button>
      <Link to={isAuthenticated ? "/profile" : "/login"} className={`mobile-bottom-link ${location.pathname === "/profile" || location.pathname === "/login" ? "active" : ""}`}>
        <FiUser size={18} />
        <span>Account</span>
      </Link>
    </nav>
  );
};

export default MobileBottomNav;
