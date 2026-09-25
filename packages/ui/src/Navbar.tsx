// Renders the shared site navigation bar.
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

// Renders the navbar interface.
export default function Navbar({ logoAlt, logoSrc, home, products, tools, about }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [pinnedDropdown, setPinnedDropdown] = useState<string | null>(null);

  const openDropdown = /* Opens dropdown. */ (label: string) => {
    setActiveDropdown(label);
    setPinnedDropdown(null);
  };

  const closeDropdown = /* Closes dropdown. */ (label: string) => {
    if (pinnedDropdown !== label) {
      setActiveDropdown(null);
    }
  };

  const toggleDropdown = /* Toggles dropdown. */ (label: string) => {
    if (pinnedDropdown === label) {
      setActiveDropdown(null);
      setPinnedDropdown(null);
      return;
    }

    setActiveDropdown(label);
    setPinnedDropdown(label);
  };

  const selectDropdownItem = /* Selects dropdown item. */ () => {
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
          onClick={/* Runs when the user triggers click. */ () => setIsMenuOpen(/* Runs when the user triggers click. */ (isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
          {home && (
            <a href={home.href} className="navbar-link" onClick={/* Runs when the user triggers click. */ () => setIsMenuOpen(false)}>
              {home.label}
            </a>
          )}

          <NavbarDropdown
            label={products.label}
            items={products.items}
            isOpen={activeDropdown === products.label}
            onOpen={/* Runs when the user triggers open. */ () => openDropdown(products.label)}
            onClose={/* Runs when the user triggers close. */ () => closeDropdown(products.label)}
            onToggle={/* Runs when the user triggers toggle. */ () => toggleDropdown(products.label)}
            onItemSelect={selectDropdownItem}
          />

          {tools && (
            <NavbarDropdown
              label={tools.label}
              items={tools.items}
              isOpen={activeDropdown === tools.label}
              onOpen={/* Runs when the user triggers open. */ () => openDropdown(tools.label)}
              onClose={/* Runs when the user triggers close. */ () => closeDropdown(tools.label)}
              onToggle={/* Runs when the user triggers toggle. */ () => toggleDropdown(tools.label)}
              onItemSelect={selectDropdownItem}
              groups={tools.groups}
            />
          )}

          {about && (
            <a href={about.href} className="navbar-link" onClick={/* Runs when the user triggers click. */ () => setIsMenuOpen(false)}>
              {about.label}
            </a>
          )}

        </nav>
      </div>
    </header>
  );
}