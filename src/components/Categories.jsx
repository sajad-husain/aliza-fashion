import { memo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";

const Categories = () => {
  const { categories } = useProducts();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="section reveal" id="categories">
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">Collections</p>
          <h2>Shop by Category</h2>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Link
              className="category-card-link"
              to={`/products?category=${encodeURIComponent(category.name)}`}
              key={category.id}
            >
              <article className="category-card">
                <img src={category.image} alt={category.name} loading="lazy" />
                <div className="category-card-content">
                  <div>
                    <p className="category-index">0{index + 1}</p>
                    <h3>{category.name}</h3>
                  </div>
                  <span className="btn btn-ghost">Explore</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
