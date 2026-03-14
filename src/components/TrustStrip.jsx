const proofItems = [
  "Trusted by 10,000+ customers",
  "Rated 4.8/5 by repeat buyers",
  "Fast nationwide dispatch",
  "Premium quality check on every order",
];

const TrustStrip = () => {
  return (
    <section className="section trust-strip reveal">
      <div className="container">
        <div className="trust-grid">
          {proofItems.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
