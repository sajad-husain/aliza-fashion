import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";

const WishlistButton = ({ product, className = "" }) => {
  const { toggleItem, isInWishlist } = useWishlist();
  const isActive = isInWishlist(product.id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <button
      className={`wishlist-btn ${isActive ? "active" : ""} ${className}`}
      onClick={handleClick}
      aria-label={isActive ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isActive ? <FaHeart size={18} /> : <FiHeart size={18} />}
    </button>
  );
};

export default WishlistButton;
