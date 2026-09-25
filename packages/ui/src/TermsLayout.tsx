// Renders the shared terms page layout around page-specific content.
import type { ReactNode } from "react";
import Divider from "./Divider";
import Footer from "./Footer";
import Navbar from "./Navbar";
import PageMeta from "./PageMeta";
import Breadcrumb from "./Breadcrumb";
import BreadcrumbSchema from "./BreadcrumbSchema";

export type NavbarLink = {
  label: string;
  href: string;
};

export type TermsLayoutProps = {
  pageTitle: string;
  pageDescription: string;
  heroTitle: string;
  lastUpdated?: string;
  
  // Allows page-specific content inside the shared terms layout.
  children: ReactNode; 
  
  logoAlt: string;
  logoSrc: string;
  home: NavbarLink;
  products: {
    label: string;
    items: NavbarLink[];
  };
  tools?: {
    label: string;
    items: NavbarLink[];
  };
  about?: NavbarLink;
  footerInvoiceHref?: string;
  footerTermsHref?: string;
  footerPrivacyHref?: string;
  reserveBottomAdSpace?: boolean;
};

// Renders the terms layout interface.
export default function TermsLayout({
  pageTitle,
  pageDescription,
  heroTitle,
  lastUpdated = "September 14, 2026",
  children,
  logoAlt,
  logoSrc,
  home,
  products,
  tools,
  about,
  footerInvoiceHref = "/invoice",
  footerTermsHref = "/terms-of-service",
  footerPrivacyHref = "/privacy-policy",
  reserveBottomAdSpace = true,
}: TermsLayoutProps) {
  
  return (
    <>
      <PageMeta
        title={pageTitle}
        description={pageDescription}
        canonicalPath={typeof window !== "undefined" ? window.location.pathname : "/"}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `https://growile.com${home.href === "/" ? "/" : home.href}` },
          { name: heroTitle, url: `https://growile.com${typeof window !== "undefined" ? window.location.pathname : home.href}` },
        ]}
      />

      <Navbar
        logoAlt={logoAlt}
        logoSrc={logoSrc}
        home={home}
        products={products}
        tools={tools}
        about={about}
      />

      <Breadcrumb
      items={[
        { label: home.label, href: home.href },
        { label: heroTitle, href: typeof window !== "undefined" ? window.location.pathname : home.href }
      ]}
      />

      <section className="about-hero">
        <h1 className="about-title">{heroTitle}</h1>
        <p className="about-description">Last Updated: {lastUpdated}</p>
      </section>

      <Divider />

      {/* Page-specific terms content is inserted here. */}
      <div className="terms-content">
        {children}
      </div>

      <Footer
        invoiceHref={footerInvoiceHref}
        termsHref={footerTermsHref}
        privacyHref={footerPrivacyHref}
        reserveBottomAdSpace={reserveBottomAdSpace}
      />
    </>
  );
}