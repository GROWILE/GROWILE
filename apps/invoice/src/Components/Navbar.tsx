import { useState } from "react";
import logo from "../assets/growile-invoice-logo.png";
import "./Navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <a href="#top" className="navbar-logo" onClick={closeMenu}>
          <img src={logo} alt="Growile Invoice" />
        </a>
        <button
          className={`navbar-menu-toggle ${isMenuOpen ? "open" : ""}`}
          type="button"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
          <a href="#top" className="navbar-link" onClick={closeMenu}>
            Home
          </a>
          <div className="navbar-dropdown">
            <button
              className="navbar-link navbar-dropdown-trigger"
              type="button"
              aria-expanded={isProductsOpen}
              onClick={() => setIsProductsOpen((isOpen) => !isOpen)}
            >
              Invoices{" "}
              <span className={`navbar-arrow ${isProductsOpen ? "open" : ""}`}>
                ▾
              </span>
            </button>
            {isProductsOpen && (
              <div className="navbar-dropdown-menu">
                <a
                  href="#without-gst-invoice"
                  className="navbar-dropdown-item"
                  onClick={closeMenu}
                >
                  Without GST
                </a>
                <a
                  href="#gst-invoice"
                  className="navbar-dropdown-item"
                  onClick={closeMenu}
                >
                  With GST
                </a>
              </div>
            )}
          </div>
          <a href="#about" className="navbar-link" onClick={closeMenu}>
            About
          </a>
        </nav>
      </div>
    </header>
  );
}
