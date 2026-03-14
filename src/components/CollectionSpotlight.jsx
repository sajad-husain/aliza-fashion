import { Link } from "react-router-dom";

const CollectionSpotlight = () => {
  return (
    <section className="section collection-spotlight reveal">
      <div className="container collection-layout">
        <div className="collection-copy">
          <p className="section-kicker">New Collection</p>
          <h2>Spring Edit 2026</h2>
          <p>
            Nazuk embroidery, soft premium lawn aur modern silhouettes. Is season ka curated
            edit jo rozmarra aur festive dono looks cover karta hai.
          </p>
          <div className="collection-actions">
            <Link to="/products" className="btn btn-primary">Shop The Edit</Link>
            <Link to="/products?category=Women" className="btn collection-link-btn">Women Line</Link>
          </div>
        </div>
        <div className="collection-image-wrap">
          <img
            src="/springcollection.png"
            alt="ALIZA spring collection"
            loading="lazy"
          />
          <span className="collection-tag">Limited Launch</span>
        </div>
      </div>
    </section>
  );
};

export default CollectionSpotlight;
