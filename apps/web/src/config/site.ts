// Defines shared navigation and footer settings for the web app.
import webLogo from "../../../../packages/ui/assets/growile-logo.svg";
import { getProductNavigationLinks } from "../../../../packages/ui/src/productNavigation";

export const webNavigation = {
  logoAlt: "Growile",
  logoSrc: webLogo,
  home: { label: "Home", href: "/" },
  products: {
    label: "Products",
    items: getProductNavigationLinks("/invoice"),
  },
  about: { label: "About", href: "/about" },
};

export const webFooter = {
  invoiceHref: "/invoice",
  termsHref: "/terms-of-service",
  privacyHref: "/privacy-policy",
  reserveBottomAdSpace: false,
} as const;

export const homeHero = {
  title: "Web tools for the modern global workflow.",
  subtitle: "Built for freelancers, creators, and teams who move fast. Growile combines zero-signup accessibility with cross-border flexibility. Generate, create, and manage your work securely in your browser without ever compromising on privacy.",
  ctaText: "Explore Products",
  ctaHref: "/products",
} as const;
