import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiCheckCircle, FiShield, FiTruck } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const steps = ["Details", "Review", "Place Order"];

const CheckoutPage = () => {
  const { cart, getCartPrice, clearCart } = useCart();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const total = getCartPrice();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const canGoNext =
    formData.name && formData.email && formData.phone && formData.address && formData.city;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const orderItems = cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("orders").insert({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_address: formData.address,
          customer_city: formData.city,
          items: orderItems,
          total: total,
          status: "pending",
        });

        if (error) {
          console.error("Failed to save order:", error);
        }
      } else {
        const savedOrders = JSON.parse(localStorage.getItem("aliza-orders") || "[]");
        savedOrders.push({
          id: Date.now(),
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_address: formData.address,
          customer_city: formData.city,
          items: orderItems,
          total: total,
          status: "pending",
          created_at: new Date().toISOString(),
        });
        localStorage.setItem("aliza-orders", JSON.stringify(savedOrders));
      }

      clearCart();
      setIsSubmitted(true);
    } catch (error) {
      console.error("Order error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (cart.length === 0 && !isSubmitted) {
    return (
      <main className="section">
        <div className="container checkout-empty">
          <h2>Your cart is empty</h2>
          <p>Add products to continue with checkout.</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (isSubmitted) {
    return (
      <main className="section">
        <div className="container checkout-success">
          <div className="checkout-success-icon">
            <FiCheck size={30} />
          </div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order. Our team will contact you shortly.</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <Link to="/" className="details-back">
          <FiArrowLeft /> Continue Shopping
        </Link>

        <div className="checkout-steps" role="list" aria-label="Checkout steps">
          {steps.map((label, index) => {
            const number = index + 1;
            const isActive = number === step;
            const isDone = number < step;
            return (
              <div key={label} className={`checkout-step ${isActive ? "active" : ""} ${isDone ? "done" : ""}`} role="listitem">
                <span>{isDone ? <FiCheckCircle size={14} /> : number}</span>
                <p>{label}</p>
              </div>
            );
          })}
        </div>

        <div className="checkout-layout">
          <form className="checkout-panel" onSubmit={handlePlaceOrder}>
            <h2>Checkout</h2>

            {step === 1 && (
              <div className="checkout-block">
                <h4>Personal & Shipping Details</h4>
                <div className="checkout-form-grid">
                  <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                  <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                  <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                  <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                  <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleChange} required className="checkout-address" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-block">
                <h4>Review Details</h4>
                <div className="checkout-review-grid">
                  <div><span>Name</span><strong>{formData.name}</strong></div>
                  <div><span>Email</span><strong>{formData.email}</strong></div>
                  <div><span>Phone</span><strong>{formData.phone}</strong></div>
                  <div><span>City</span><strong>{formData.city}</strong></div>
                  <div><span>Address</span><strong>{formData.address}</strong></div>
                </div>
                <div className="checkout-payment-note">
                  <FiShield size={16} /> Cash on Delivery. Online payment can be enabled later.
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="checkout-block">
                <h4>Confirm & Place Order</h4>
                <p className="checkout-confirm-note">
                  Please confirm your address and order summary before placing your order.
                </p>
              </div>
            )}

            <div className="checkout-actions-row">
              {step > 1 && (
                <button type="button" className="btn checkout-back-btn" onClick={() => setStep(step - 1)}>
                  Back
                </button>
              )}

              {step < 3 ? (
                <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)} disabled={step === 1 && !canGoNext}>
                  Continue
                </button>
              ) : (
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? "Placing Order..." : "Place Order"}
                </button>
              )}
            </div>
          </form>

          <aside className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="checkout-items">
              {cart.map((item) => (
                <div key={item.id} className="checkout-item-row">
                  <span>{item.name} x {item.quantity}</span>
                  <span>
                    Rs. {(parseInt(item.price.replace(/[^0-9]/g, "")) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="checkout-total-row">
              <strong>Total</strong>
              <strong>Rs. {total.toLocaleString()}</strong>
            </div>

            <div className="checkout-trust-badges">
              <p><FiTruck size={15} /> Fast dispatch in 24-48 hours</p>
              <p><FiShield size={15} /> Secure order confirmation</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
