import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";

const SearchResultsPage = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);

  const results = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.fabric?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <main className="section search-page">
      <div className="container">
        <div className="search-page-header">
          <h1>Search Results</h1>
          <p>
            {query
              ? `Found ${results.length} product${results.length !== 1 ? "s" : ""} for "${query}"`
              : "Enter a search term to find products"}
          </p>
        </div>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="search-page-input"
            placeholder="Search for products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        {results.length > 0 ? (
          <div className="product-grid">
            {results.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <span className="product-badge">Premium</span>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">{product.price}</p>
                  <Link
                    className="btn btn-primary btn-small"
                    to={`/products/${product.id}`}
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          query && (
            <div className="search-empty" style={{ textAlign: "center", padding: "3rem" }}>
              <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
                No products match your search.
              </p>
              <Link to="/" className="btn btn-primary">
                Back to Home
              </Link>
            </div>
          )
        )}
      </div>
    </main>
  );
};

export default SearchResultsPage;
