import { useState } from "react";
import type { ReactNode } from "react";
import "./Navbar.css";


type NavbarLink = {
  label: string;
  href: string;
  icon?: ReactNode;
};

type NavbarLinkGroup = {
  label: string;
  icon?: ReactNode;
  items: NavbarLink[];
};

type NavbarProps = {
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

type NavbarDropdownProps = {
  label: string;
  items: NavbarLink[];
  groups?: NavbarLinkGroup[];
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
  groups,
}: NavbarDropdownProps) {
  const hasGroups = Boolean(groups?.length);
  const menuClassName = `navbar-dropdown-menu ${
    hasGroups || items.length > 10 ? "navbar-dropdown-menu-wide" : ""
  }`.trim();

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
        <div className={menuClassName}>
          {hasGroups
            ? groups?.map((group) => (
                <div className="navbar-dropdown-group" key={group.label}>
                  <h3 className="navbar-dropdown-group-title">
                    {group.icon}
                    {group.label}
                  </h3>
                  {group.items.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="navbar-dropdown-item"
                      onClick={onItemSelect}
                    >
                      {item.icon}
                      {item.label}
                    </a>
                  ))}
                </div>
              ))
            : items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="navbar-dropdown-item"
                  onClick={onItemSelect}
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
        </div>
      )}
    </div>
  );
}

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