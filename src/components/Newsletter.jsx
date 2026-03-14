const Newsletter = () => {
  return (
    <section className="section reveal" id="newsletter">
      <div className="container newsletter">
        <h2>Stay updated with new arrivals</h2>
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email" required />
          <button type="submit" className="btn btn-primary">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
