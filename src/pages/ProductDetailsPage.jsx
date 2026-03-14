import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiShoppingBag, FiStar, FiMessageSquare } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import WishlistButton from "../components/WishlistButton";

const sampleTestimonials = [
  {
    id: 1,
    name: "Fatima Ahmed",
    location: "Lahore",
    image: "https://i.pravatar.cc/100?img=1",
    text: "Fabric ki quality bohat zabardast hai. Embroidery saf sutri hai aur rang bilkul waisa hi nikla jaisa pictures mein tha.",
    rating: 5,
    verified: true
  },
  {
    id: 2,
    name: "Aisha Khan",
    location: "Karachi",
    image: "https://i.pravatar.cc/100?img=5",
    text: "Yeh mera ALIZA se teesra order hai aur har dafa result acha mila. Kapra soft hai aur garmi mein pehnay ke liye perfect hai.",
    rating: 5,
    verified: true
  },
  {
    id: 3,
    name: "Sara Malik",
    location: "Islamabad",
    image: "https://i.pravatar.cc/100?img=9",
    text: "Finishing bohat neat hai aur quality premium feel deti hai. Is collection se dobara order zaroor karungi.",
    rating: 5,
    verified: true
  }
];

const loadReviewsFromStorage = (productId) => {
  try {
    const saved = localStorage.getItem(`aliza-reviews-${productId}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveReviewsToStorage = (productId, reviews) => {
  try {
    localStorage.setItem(`aliza-reviews-${productId}`, JSON.stringify(reviews));
  } catch (e) {
    console.error("Failed to save reviews:", e);
  }
};

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const { products, loading: productsLoading } = useProducts();
  const product = products.find((item) => String(item.id) === String(productId));
  const productLoading = productsLoading && products.length === 0;
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  useEffect(() => {
    const loadReviews = async () => {
      setReviewsLoading(true);
      if (!product) {
        setReviewsLoading(false);
        return;
      }

      if (!isSupabaseConfigured || !supabase) {
        setReviews(loadReviewsFromStorage(product.id));
        setReviewsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("reviews")
        .select("id, name, rating, comment, created_at")
        .eq("product_id", product.id)
        .order("created_at", { ascending: false });

      if (error) {
        setReviews(loadReviewsFromStorage(product.id));
        setReviewsLoading(false);
        return;
      }

      const mapped = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        rating: item.rating,
        comment: item.comment,
        date: item.created_at ? item.created_at.split("T")[0] : "",
      }));

      setReviews(mapped);
      setReviewsLoading(false);
    };

    loadReviews();
  }, [product]);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!product) return;

    if (!isSupabaseConfigured || !supabase) {
      const review = {
        id: Date.now(),
        ...newReview,
        date: new Date().toISOString().split("T")[0],
      };
      const updatedReviews = [review, ...reviews];
      setReviews(updatedReviews);
      saveReviewsToStorage(product.id, updatedReviews);
      setNewReview({ name: "", rating: 5, comment: "" });
      setShowReviewForm(false);
      return;
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        product_id: product.id,
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
      })
      .select("id, name, rating, comment, created_at")
      .single();

    if (error) {
      console.error("Failed to save review:", error.message);
      return;
    }

    const inserted = {
      id: data.id,
      name: data.name,
      rating: data.rating,
      comment: data.comment,
      date: data.created_at ? data.created_at.split("T")[0] : "",
    };

    setReviews((prev) => [inserted, ...prev]);
    setNewReview({ name: "", rating: 5, comment: "" });
    setShowReviewForm(false);
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (productLoading) {
    return (
      <main className="section">
        <div className="container">
          <div className="page-loading">
            <div className="loader"></div>
            <p>Loading product...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="section">
        <div className="container details-empty">
          <h2>Product not found</h2>
          <p>The product you are looking for does not exist.</p>
          <Link className="btn btn-primary" to="/">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section details-page">
      <div className="container">
        <Link className="details-back" to="/#products">
          <FiArrowLeft /> Back to products
        </Link>

        <section className="details-layout">
          <div className="details-image-wrap">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="details-content">
            <p className="section-kicker">{product.category}</p>
            <h1>{product.name}</h1>
            <p className="details-price">{product.price}</p>
            <p className="details-description">{product.description}</p>

            <div className="details-meta">
              <div>
                <span>Fabric</span>
                <strong>{product.fabric}</strong>
              </div>
              <div>
                <span>Length</span>
                <strong>{product.length}</strong>
              </div>
              <div>
                <span>Care</span>
                <strong>{product.care}</strong>
              </div>
            </div>

            <div className="details-benefits">
              {[
                "Soft and breathable premium fabric",
                "Ideal for all-day comfort",
                "Elegant finish with durable quality",
              ].map((benefit) => (
                <p key={benefit}>
                  <FiCheckCircle /> {benefit}
                </p>
              ))}
            </div>

            <div className="details-actions">
              <button
                className={`btn ${added ? "btn-success" : "btn-primary"}`}
                onClick={handleAddToCart}
                disabled={added}
              >
                {added ? (
                  <>
                    <FiCheckCircle /> Added to Cart
                  </>
                ) : (
                  <>
                    <FiShoppingBag /> Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <section className="testimonials-section">
          <div className="testimonials-header">
            <FiMessageSquare className="quote-icon" />
            <h2>Customer Love</h2>
          </div>
          <div className="testimonials-grid">
            {sampleTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} size={14} color={star <= testimonial.rating ? "#f1c40f" : "#ddd"} />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.image} alt={testimonial.name} className="testimonial-avatar" />
                  <div>
                    <h4>
                      {testimonial.name}
                      {testimonial.verified && <span className="verified-badge">Verified</span>}
                    </h4>
                    <span className="testimonial-location">{testimonial.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="reviews-section">
          <div className="reviews-header">
            <h2>Customer Reviews</h2>
            <div className="reviews-summary">
              <div className="rating-big">{averageRating}</div>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  star <= Math.round(averageRating) ? (
                    <FaStar key={star} size={18} color="#f1c40f" />
                  ) : (
                    <FiStar key={star} size={18} />
                  )
                ))}
              </div>
              <span className="reviews-count">{reviews.length} reviews</span>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              Write a Review
            </button>
          </div>

          {showReviewForm && (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <h3>Write Your Review</h3>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-select">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${newReview.rating >= star ? "active" : ""}`}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    >
                      <FaStar size={20} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                  placeholder="Share your experience with this product"
                  rows={4}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          )}

          <div className="reviews-list">
            {reviewsLoading ? (
              <div className="loading-container">
                <div className="loader"></div>
                <p>Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        review.rating >= star ? (
                          <FaStar key={star} size={14} color="#f1c40f" />
                        ) : (
                          <FiStar key={star} size={14} />
                        )
                      ))}
                    </div>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <h4 className="review-author">{review.name}</h4>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2>You May Also Like</h2>
            <div className="product-grid">
              {relatedProducts.map((item) => (
                <article className="product-card" key={item.id}>
                  <div className="product-image-wrap">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    <WishlistButton product={item} />
                  </div>
                  <div className="product-info">
                    <h3>{item.name}</h3>
                    <p className="price">{item.price}</p>
                    <Link
                      className="btn btn-primary btn-small"
                      to={`/products/${item.id}`}
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="mobile-sticky-cta">
          <div>
            <small>Starting from</small>
            <strong>{product.price}</strong>
          </div>
          <button className="btn btn-primary" onClick={handleAddToCart} disabled={added}>
            {added ? "Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailsPage;
