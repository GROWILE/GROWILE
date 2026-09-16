import { ReactNode } from "react";
import Divider from "./Divider";
import Footer from "./Footer";
import Navbar from "./Navbar";
import PageMeta from "./PageMeta";

export type NavbarLink = {
  label: string;
  href: string;
};

export type TermsLayoutProps = {
  pageTitle: string;
  pageDescription: string;
  heroTitle: string;
  lastUpdated?: string;
  
  // Ithu thaan error-a fix panra antha magic prop!
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
};

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
}: TermsLayoutProps) {
  
  return (
    <>
      <PageMeta
        title={pageTitle}
        description={pageDescription}
        canonicalPath={typeof window !== "undefined" ? window.location.pathname : "/"}
      />

      <Navbar
        logoAlt={logoAlt}
        logoSrc={logoSrc}
        home={home}
        products={products}
        tools={tools}
        about={about}
      />

      <section className="about-hero">
        <h1 className="about-title">{heroTitle}</h1>
        <p className="about-description">Last Updated: {lastUpdated}</p>
      </section>

      <Divider />

      {/* --- INGA THAAN UNGA PRODUCT SPECIFIC TERMS TEXT VARUM --- */}
      <div className="terms-content">
        {children}
      </div>

      <Footer
        invoiceHref={footerInvoiceHref}
        termsHref={footerTermsHref}
        privacyHref={footerPrivacyHref}
      />
    </>
  );
}