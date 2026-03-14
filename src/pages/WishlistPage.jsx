import { Link } from "react-router-dom";
import { FiHeart, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const WishlistPage = () => {
  const { wishlist, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (product) => {
    addItem(product);
    removeItem(product.id);
  };

  return (
    <main className="section">
      <div className="container">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          {wishlist.length > 0 && (
            <button className="btn btn-ghost" onClick={clearWishlist}>
              Clear All
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <FiHeart size={48} />
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite products to buy them later</p>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <span className="product-badge">Premium</span>
                  <button
                    className="wishlist-btn-remove"
                    onClick={() => removeItem(product.id)}
                    aria-label="Remove from wishlist"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">{product.price}</p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link
                      className="btn btn-primary btn-small"
                      to={`/products/${product.id}`}
                    >
                      View Details
                    </Link>
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() => handleMoveToCart(product)}
                      style={{ minWidth: "44px", padding: "0.82rem" }}
                    >
                      <FiShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default WishlistPage;
