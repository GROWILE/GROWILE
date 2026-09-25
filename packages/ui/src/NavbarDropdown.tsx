import type { ReactNode } from "react";
import "./NavbarDropdown.css";

export type NavbarLink = {
  label: string;
  href: string;
  icon?: ReactNode;
};

export type NavbarLinkGroup = {
  label: string;
  icon?: ReactNode;
  items: NavbarLink[];
};

export type NavbarDropdownProps = {
  label: string;
  items: NavbarLink[];
  groups?: NavbarLinkGroup[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  onItemSelect: () => void;
};

export default function NavbarDropdown({
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
