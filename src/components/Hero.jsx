import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero reveal" id="home">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <p className="eyebrow">Premium Pakistani Fashion</p>
        <h1>ALIZA</h1>
        <p className="tagline">Elegant Unstitched Fabric for Everyone.</p>
        <div className="hero-actions">
          <Link to="/#products" className="btn btn-primary">
            Shop Collection
          </Link>
          <Link to="/#categories" className="btn btn-secondary">
            Explore Categories
          </Link>
        </div>
        <div className="hero-metrics">
          <div>
            <strong>10K+</strong>
            <span>Happy Customers</span>
          </div>
          <div>
            <strong>150+</strong>
            <span>Premium Fabrics</span>
          </div>
          <div>
            <strong>3</strong>
            <span>Family Collections</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
