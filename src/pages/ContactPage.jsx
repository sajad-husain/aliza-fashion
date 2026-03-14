import { useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiClock, FiCheck, FiSend } from "react-icons/fi";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <main className="section">
      <div className="container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>Have questions? We'd love to hear from you.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-card">
              <div className="contact-icon">
                <FiPhone size={20} />
              </div>
              <div>
                <h4>Phone</h4>
                <p>+92 300 0000000</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <FiMail size={20} />
              </div>
              <div>
                <h4>Email</h4>
                <p>hello@aliza.pk</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <FiMapPin size={20} />
              </div>
              <div>
                <h4>Address</h4>
                <p>Lahore, Pakistan</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <FiClock size={20} />
              </div>
              <div>
                <h4>Business Hours</h4>
                <p>Mon - Sat: 9AM - 8PM</p>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {isSubmitted ? (
              <div className="contact-success">
                <div className="success-icon">
                  <FiCheck size={32} />
                </div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We'll get back to you soon.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h3>Send us a Message</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Your message..."
                    rows={5}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                  <FiSend size={16} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
