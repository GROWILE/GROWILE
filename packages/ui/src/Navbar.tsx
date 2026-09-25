import { useState } from "react";
import "./Navbar.css";
import NavbarDropdown from "./NavbarDropdown";
import type { NavbarLink, NavbarLinkGroup } from "./NavbarDropdown";

export type NavbarProps = {
  logoAlt: string;
  logoSrc: string;
  home?: NavbarLink;
  products: {
    label: string;
    items: NavbarLink[];
  };
  tools?: {
    label: string;
    items: NavbarLink[];
    groups?: NavbarLinkGroup[];
  };
  about?: NavbarLink;
};

export default function Navbar({ logoAlt, logoSrc, home, products, tools, about }: NavbarProps) {
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
        {home ? (
          <a href={home.href} className="navbar-logo">
            <img src={logoSrc} alt={logoAlt} />
          </a>
        ) : (
          <div className="navbar-logo">
            <img src={logoSrc} alt={logoAlt} />
          </div>
        )}

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
          {home && (
            <a href={home.href} className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              {home.label}
            </a>
          )}

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
              groups={tools.groups}
            />
          )}

          {about && (
            <a href={about.href} className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              {about.label}
            </a>
          )}

        </nav>
      </div>
    </header>
  );
}