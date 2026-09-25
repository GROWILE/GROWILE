import webLogo from "../../../../packages/ui/assets/growile-logo.svg";

export const webNavigation = {
  logoAlt: "Growile",
  logoSrc: webLogo,
  home: { label: "Home", href: "/" },
  products: {
    label: "Products",
    items: [
      { label: "PDF", href: "/pdf" },
      { label: "Invoice", href: "/invoice" },
    ],
  },
  about: { label: "About", href: "/about" },
};

export const webFooter = {
  invoiceHref: "/invoice",
  termsHref: "/terms-of-service",
  privacyHref: "/privacy-policy",
} as const;

export const homeHero = {
  title: "Web tools for the modern global workflow.",
  subtitle: "Built for freelancers, creators, and teams who move fast. Growile combines zero-signup accessibility with cross-border flexibility. Generate, create, and manage your work securely in your browser without ever compromising on privacy.",
  ctaText: "Explore Products",
  ctaHref: "/products",
} as const;
