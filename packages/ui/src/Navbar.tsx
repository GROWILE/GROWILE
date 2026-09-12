import { useState } from "react";
import "./Navbar.css";
import logo from "../assets/growile-logo.png";

type NavbarLink = {
  label: string;
  href: string;
};

type NavbarProps = {
  logoAlt: string;
  home: NavbarLink;
  products: {
    label: string;
    items: NavbarLink[];
  };
  tools?: {
    label: string;
    items: NavbarLink[];
  };
  about: NavbarLink;
};

type NavbarDropdownProps = {
  label: string;
  items: NavbarLink[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  onItemSelect: () => void;
};

function NavbarDropdown({
  label,
  items,
  isOpen,
  onOpen,
  onClose,
  onToggle,
  onItemSelect,
}: NavbarDropdownProps) {
  return (
    <div
      className="navbar-dropdown"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        className="navbar-link navbar-dropdown-trigger"
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {label}
        <span className={`navbar-arrow ${isOpen ? "open" : ""}`}>▾</span>
      </button>

      {isOpen && (
        <div className="navbar-dropdown-menu">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="navbar-dropdown-item"
              onClick={onItemSelect}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar({ logoAlt, home, products, tools, about }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [pinnedDropdown, setPinnedDropdown] = useState<string | null>(null);

  const openDropdown = (label: string) => {
    setActiveDropdown(label);
    setPinnedDropdown(null);
  };

  const closeDropdown = (label: string) => {
    if (pinnedDropdown !== label) {
      setActiveDropdown(null);
    }
  };

  const toggleDropdown = (label: string) => {
    if (pinnedDropdown === label) {
      setActiveDropdown(null);
      setPinnedDropdown(null);
      return;
    }

    setActiveDropdown(label);
    setPinnedDropdown(label);
  };

  const selectDropdownItem = () => {
    setActiveDropdown(null);
    setPinnedDropdown(null);
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <img src={logo} alt={logoAlt} />
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
           <a href={home.href} className="navbar-link" onClick={() => setIsMenuOpen(false)}>
             {home.label}
           </a>

          <NavbarDropdown
            label={products.label}
            items={products.items}
            isOpen={activeDropdown === products.label}
            onOpen={() => openDropdown(products.label)}
            onClose={() => closeDropdown(products.label)}
            onToggle={() => toggleDropdown(products.label)}
            onItemSelect={selectDropdownItem}
          />

          {tools && (
            <NavbarDropdown
              label={tools.label}
              items={tools.items}
              isOpen={activeDropdown === tools.label}
              onOpen={() => openDropdown(tools.label)}
              onClose={() => closeDropdown(tools.label)}
              onToggle={() => toggleDropdown(tools.label)}
              onItemSelect={selectDropdownItem}
            />
          )}

           <a href={about.href} className="navbar-link" onClick={() => setIsMenuOpen(false)}>
             {about.label}
           </a>

        </nav>
      </div>
    </header>
  );
}