// Footer.js
import './Footer.css';
import logo from '../assets/logo3.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          {/* Add the logo here */}
          <img src={logo} alt="BusinessCompanion Logo" className="footer-logo" />
          <p>We're dedicated to providing the best tools and resources for your business journey. Empowering entrepreneurs one step at a time.</p>
        </div>
        <div className="footer-links-column">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>
        <div className="footer-links-column">
          <h3>Follow Us</h3>
          <div className="social-media-icons">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        <div className="footer-newsletter">
          <h3>Newsletter</h3>
          <p>Stay up-to-date with our latest news and offers.</p>
          <form>
            <input type="email" placeholder="Your email address" aria-label="Email for newsletter" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BusinessCompanion. All rights reserved.</p>
        <div className="footer-legal-links">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}