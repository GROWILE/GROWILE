import { createElement } from "react";
import DocumentIcon from "./DocumentIcon";
import type { NavbarLink } from "./NavbarDropdown";

export function getProductNavigationLinks(invoiceHref: string): NavbarLink[] {
  return [
    {
      label: "PDF",
      href: "/pdf",
      icon: createElement(DocumentIcon, { label: "PDF" }),
      colorTheme: "blue",
    },
    {
      label: "Invoice",
      href: invoiceHref,
      icon: createElement(DocumentIcon),
      colorTheme: "orange",
    },
  ];
}
