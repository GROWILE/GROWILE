import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import logo from "../assets/growile-logo.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsHovered, setIsProductsHovered] = useState(false);
  const [isProductsPinned, setIsProductsPinned] = useState(false);
  const isProductsOpen = isProductsHovered || isProductsPinned;

  return (
    <header className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <img src={logo} alt="Growile" />
        </a>

        <button
          className={`navbar-menu-toggle ${isMenuOpen ? "open" : ""}`}
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
          <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
             Home
          </Link>

          <div
            className="navbar-dropdown"
            onMouseEnter={() => setIsProductsHovered(true)}
            onMouseLeave={() => setIsProductsHovered(false)}
          >
            <button
              className="navbar-link navbar-dropdown-trigger"
              onClick={() => setIsProductsPinned((isPinned) => !isPinned)}
              aria-expanded={isProductsOpen}
            >
              Products
              <span className={`navbar-arrow ${isProductsOpen ? "open" : ""}`}>
                ▾
              </span>
            </button>

            {isProductsOpen && (
              <div className="navbar-dropdown-menu">
                <a href="#finance" className="navbar-dropdown-item">
                  Finance
                </a>
                <a href="#invoice" className="navbar-dropdown-item">
                  Invoice
                </a>
              </div>
            )}
          </div>

          <Link to="/about" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
             About
          </Link>

        </nav>
      </div>
    </header>
  );
}