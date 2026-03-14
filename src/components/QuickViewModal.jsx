import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiX, FiShoppingBag, FiCheck, FiEye } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import WishlistButton from "./WishlistButton";

const QuickViewModal = ({ product, onClose }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (!product) return null;

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close" onClick={onClose}>
          <FiX size={20} />
        </button>

        <div className="quickview-content">
          <div className="quickview-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="quickview-details">
            <p className="quickview-category">{product.category}</p>
            <h2>{product.name}</h2>
            <p className="quickview-price">{product.price}</p>
            <p className="quickview-description">{product.description}</p>

            <div className="quickview-meta">
              <div>
                <span>Fabric</span>
                <strong>{product.fabric}</strong>
              </div>
              <div>
                <span>Length</span>
                <strong>{product.length}</strong>
              </div>
            </div>

            <div className="quickview-actions">
              <button
                className={`btn ${added ? "btn-success" : "btn-primary"}`}
                onClick={handleAddToCart}
                disabled={added}
              >
                {added ? (
                  <>
                    <FiCheck size={16} /> Added to Cart
                  </>
                ) : (
                  <>
                    <FiShoppingBag size={16} /> Add to Cart
                  </>
                )}
              </button>
              <Link
                to={`/products/${product.id}`}
                className="btn btn-secondary"
                onClick={onClose}
              >
                <FiEye size={16} /> View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
