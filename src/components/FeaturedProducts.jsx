import { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import WishlistButton from "./WishlistButton";
import QuickViewModal from "./QuickViewModal";

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { products } = useProducts();
  const [addedId, setAddedId] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const handleAddToCart = (product) => {
    addItem(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const safeProducts = products || [];

  if (safeProducts.length === 0) {
    return null;
  }

  return (
    <>
      <section className="section section-alt reveal" id="products">
        <div className="container">
          <div className="section-head">
            <p className="section-kicker">Featured</p>
            <h2>Premium Unstitched Picks</h2>
          </div>
          <div className="product-grid">
            {safeProducts.length === 0 ? (
              <p className="no-products">No products available.</p>
            ) : (
              safeProducts.map((product) => (
                <article
                  className="product-card"
                  key={product.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate(`/products/${product.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      navigate(`/products/${product.id}`);
                    }
                  }}
                >
                  <div className="product-image-wrap">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <span className="product-badge">Premium</span>
                    <WishlistButton product={product} />
                    <button
                      className="quickview-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                    >
                      <FiEye size={16} /> Quick View
                    </button>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="price">{product.price}</p>
                    <div className="product-meta">
                      <span>{product.fabric}</span>
                      <span>{product.inStock ? "Ready Stock" : "Sold Out"}</span>
                      <span>2-4 Day Dispatch</span>
                    </div>
                    <button
                      className={`btn btn-primary btn-small ${
                        addedId === product.id ? "btn-added" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={addedId === product.id}
                    >
                      {addedId === product.id ? "Added to Cart" : "Add to Cart"}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
};

export default FeaturedProducts;
