import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer" id="about">
      <div className="footer-cta">
        <h2 className="footer-cta-title">Ready to simplify your invoicing?</h2>
        <p className="footer-cta-subtitle">
          Create clear, professional invoices in minutes.
        </p>
        <a href="#without-gst-invoice" className="footer-cta-button">
          CREATE AN INVOICE <span className="footer-cta-arrow">&gt;</span>
        </a>
      </div>
      <div className="footer-divider" />
      <div className="footer-columns">
        <div className="footer-column">
          <h3 className="footer-column-title">Invoice</h3>
          <div className="footer-column-links">
            <a href="#without-gst-invoice">Without GST</a>
            <a href="#gst-invoice">With GST</a>
          </div>
        </div>
        <div className="footer-column">
          <h3 className="footer-column-title">Company</h3>
          <div className="footer-column-links">
            <a href="#about">About Us</a>
          </div>
        </div>
        <div className="footer-column">
          <h3 className="footer-column-title">Contact</h3>
          <p className="footer-contact-label">Email</p>
          <a href="mailto:contact@growile.com" className="footer-contact-email">
            contact@growile.com
          </a>
        </div>
      </div>
      <div className="footer-social">
        <a href="#about" className="footer-social-icon" aria-label="X">
          X
        </a>
        <a href="#about" className="footer-social-icon" aria-label="LinkedIn">
          IN
        </a>
        <a href="#about" className="footer-social-icon" aria-label="Instagram">
          IG
        </a>
      </div>
      <div className="footer-legal">
        <a href="#about">Terms and Conditions</a>
        <a href="#about">Privacy Policy</a>
      </div>
      <div className="footer-bottom">
        <p>
          Copyright © {new Date().getFullYear()} GROWILE . All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
