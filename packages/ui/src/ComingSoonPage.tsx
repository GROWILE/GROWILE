import "./ComingSoonPage.css";
import Divider from "./Divider";
import Footer from "./Footer";
import Navbar from "./Navbar";
import PageMeta from "./PageMeta";

export type ComingSoonPageProps = {
  title?: string;
  description?: string;
  badge?: string;
  ctaHref?: string;
  ctaLabel?: string;
  logoAlt: string;
  logoSrc: string;
  home: { label: string; href: string };
  products: { label: string; items: { label: string; href: string }[] };
  about?: { label: string; href: string };
  tools?: { label: string; items: { label: string; href: string }[] };
  footerInvoiceHref?: string;
  footerTermsHref?: string;
  footerPrivacyHref?: string;
};

export default function ComingSoonPage({
  title = "Finance",
  description = "Our Finance product is currently in active development. We are building a simpler, smarter experience for tracking and managing financial tasks.",
  badge = "Coming Soon",
  ctaHref = "/",
  ctaLabel = "Back to Home",
  logoAlt,
  logoSrc,
  home,
  products,
  about,
  tools,
  footerInvoiceHref = "/invoice",
  footerTermsHref = "/terms-of-service",
  footerPrivacyHref = "/privacy-policy",
}: ComingSoonPageProps) {
  return (
    <div className="coming-soon-page">
      <PageMeta
        title={`${title} - Coming Soon | Growile`}
        description={description}
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

      <section className="coming-soon-hero">
        <span className="coming-soon-badge">{badge}</span>
        <h1 className="coming-soon-title">{title}</h1>
        <p className="coming-soon-subtitle">{description}</p>
      </section>

      <Divider />

      <section className="about-section">
        <div className="coming-soon-card">
          <p className="about-text">
            We’re crafting a cleaner, more useful finance experience for future
            releases. Until then, you can keep exploring the rest of the Growile
            ecosystem.
          </p>
          <a href={ctaHref} className="product-button" style={{ marginTop: "24px" }}>
            {ctaLabel} <span className="product-arrow" aria-hidden="true">-&gt;</span>
          </a>
        </div>
      </section>

      <Footer
        invoiceHref={footerInvoiceHref}
        termsHref={footerTermsHref}
        privacyHref={footerPrivacyHref}
      />
    </div>
  );
}
