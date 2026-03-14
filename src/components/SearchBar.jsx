import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useProducts } from "../context/ProductsContext";

const SearchBar = () => {
  const { products } = useProducts();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const results = query.length > 1
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setIsOpen(false);
    }
  };

  return (
    <div className="search-container" ref={wrapperRef}>
      <form onSubmit={handleSubmit}>
        <FiSearch className="search-icon" size={16} />
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </form>
      {isOpen && query.length > 0 && (
        <div className="search-results">
          {results.length > 0 ? (
            <>
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="search-result-item"
                  onClick={() => {
                    setQuery("");
                    setIsOpen(false);
                  }}
                >
                  <img src={product.image} alt={product.name} />
                  <div className="search-result-info">
                    <h4>{product.name}</h4>
                    <p>{product.price}</p>
                  </div>
                </Link>
              ))}
              <Link
                to={`/search?q=${encodeURIComponent(query)}`}
                className="search-view-all"
                onClick={() => {
                  setQuery("");
                  setIsOpen(false);
                }}
              >
                View all results
              </Link>
            </>
          ) : (
            <div className="search-no-results">No products found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
