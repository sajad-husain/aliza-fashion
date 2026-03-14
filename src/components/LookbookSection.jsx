import { Link } from "react-router-dom";

const looks = [
  {
    id: 1,
    title: "Festive Ivory",
    description: "Soft jacquard shirt with statement dupatta styling",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=60&fm=webp",
    category: "Women",
  },
  {
    id: 2,
    title: "Classic Men Edit",
    description: "Minimal cotton set for formal + day wear",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=60&fm=webp",
    category: "Men",
  },
  {
    id: 3,
    title: "Kids Festive Pop",
    description: "Lightweight colorful fabric for all-day comfort",
    image: "https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=600&q=60&fm=webp",
    category: "Kids",
  },
];

const LookbookSection = () => {
  return (
    <section className="section lookbook reveal">
      <div className="container">
        <div className="section-head lookbook-head">
          <p className="section-kicker">Shop The Look</p>
          <h2>Ready Styling Inspirations</h2>
        </div>
        <div className="lookbook-grid">
          {looks.map((look) => (
            <article className="lookbook-card" key={look.id}>
              <div className="lookbook-image-wrap">
                <img src={look.image} alt={look.title} loading="lazy" />
              </div>
              <div className="lookbook-content">
                <span>{look.category}</span>
                <h3>{look.title}</h3>
                <p>{look.description}</p>
                <Link to={`/products?category=${encodeURIComponent(look.category)}`} className="lookbook-link">
                  Explore Look
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LookbookSection;
