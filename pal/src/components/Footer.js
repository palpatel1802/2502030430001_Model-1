import "../styles/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h4>StudyHub</h4>
        <p>Share knowledge and learn together.</p>
      </div>

      <div className="footer-section">
        <h4>Quick Links</h4>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact Us</Link>
        <Link to="/services">Services</Link>
        <Link to="/help">Help &amp; Support</Link>
      </div>

      <div className="footer-section">
        <h4>Legal</h4>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms &amp; Conditions</Link>
      </div>
    </footer>
  );
}

export default Footer;
