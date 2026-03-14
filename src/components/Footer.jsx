import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>ALIZA</h3>
          <p>Premium unstitched fabric for Men, Women, and Kids.</p>
          <p className="footer-proof">4.8/5 rating from repeat customers across Pakistan.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/#categories">Categories</Link>
            </li>
            <li>
              <Link to="/#products">Products</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul className="contact-list">
            <li>
              <FiPhone /> +92 300 0000000
            </li>
            <li>
              <FiMail /> hello@aliza.pk
            </li>
            <li>
              <FiMapPin /> Lahore, Pakistan
            </li>
          </ul>
        </div>
        <div>
          <h4>Social</h4>
          <div className="socials">
            <a href="#" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="#" aria-label="Facebook">
              <FiFacebook />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ALIZA. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
