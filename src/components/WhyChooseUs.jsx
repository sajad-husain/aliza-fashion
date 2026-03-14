import { FiAward, FiHeart, FiShield, FiTag } from "react-icons/fi";

const points = [
  { icon: FiAward, text: "Premium fabric quality" },
  { icon: FiTag, text: "Affordable pricing" },
  { icon: FiShield, text: "Elegant designs" },
  { icon: FiHeart, text: "Comfortable wear" },
];

const WhyChooseUs = () => {
  return (
    <section className="section reveal" id="why-us">
      <div className="container">
        <div className="section-head">
          <p className="section-kicker">Why ALIZA</p>
          <h2>Designed for Style, Built for Comfort</h2>
        </div>
        <div className="benefits-grid">
          {points.map(({ icon: Icon, text }) => (
            <article className="benefit-card" key={text}>
              <span className="benefit-icon">
                <Icon />
              </span>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
