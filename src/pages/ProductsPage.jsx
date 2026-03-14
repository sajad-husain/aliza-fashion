import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiFilter, FiEye } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import WishlistButton from "../components/WishlistButton";
import QuickViewModal from "../components/QuickViewModal";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const categoryFromUrl = searchParams.get("category") || "";
  const [filters, setFilters] = useState({
    category: categoryFromUrl,
    minPrice: "",
    maxPrice: "",
    sort: "default",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState(null);

  const categories = [...new Set(products.map((p) => p.category))];

  useEffect(() => {
    const currentCategory = searchParams.get("category") || "";
    setFilters((prev) =>
      prev.category === currentCategory ? prev : { ...prev, category: currentCategory }
    );
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.minPrice) {
      result = result.filter(
        (p) => parseInt(p.price.replace(/[^0-9]/g, "")) >= parseInt(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      result = result.filter(
        (p) => parseInt(p.price.replace(/[^0-9]/g, "")) <= parseInt(filters.maxPrice)
      );
    }

    if (filters.sort === "price-low") {
      result.sort(
        (a, b) =>
          parseInt(a.price.replace(/[^0-9]/g, "")) -
          parseInt(b.price.replace(/[^0-9]/g, ""))
      );
    } else if (filters.sort === "price-high") {
      result.sort(
        (a, b) =>
          parseInt(b.price.replace(/[^0-9]/g, "")) -
          parseInt(a.price.replace(/[^0-9]/g, ""))
      );
    }

    return result;
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === "category") {
      if (value) {
        setSearchParams({ category: value });
      } else {
        setSearchParams({});
      }
    }
  };

  const clearFilters = () => {
    setFilters({ category: "", minPrice: "", maxPrice: "", sort: "default" });
    setSearchParams({});
  };

  const handleAddToCart = (product) => {
    addItem(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice;

  return (
    <main className="section">
      <div className="container">
        <div className="products-header">
          <div>
            <h1>All Products</h1>
            <p>{filteredProducts.length} products found</p>
          </div>
          <button
            className="btn btn-secondary filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter size={16} />
            Filters
          </button>
        </div>

        <div className={`products-layout ${showFilters ? "filters-open" : ""}`}>
          <aside className="products-sidebar">
            <div className="sidebar-header">
              <h3>Filters</h3>
              {hasActiveFilters && (
                <button className="clear-filters" onClick={clearFilters}>
                  Clear All
                </button>
              )}
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </aside>

          <div className="products-grid-container">
            {loading ? (
              <div className="loading-container">
                <div className="loader"></div>
                <p>Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products match your filters</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((product) => (
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
                      <span className="product-badge">{product.category}</span>
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </main>
  );
};

export default ProductsPage;
