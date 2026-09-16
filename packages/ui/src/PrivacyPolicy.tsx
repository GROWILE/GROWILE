// File: packages/ui/src/PrivacyPolicy.tsx
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

export type PrivacyPolicyProps = {
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

export default function PrivacyPolicy({
  logoAlt,
  logoSrc,
  home,
  products,
  tools,
  about,
  footerInvoiceHref = "/invoice",
  footerTermsHref = "/terms-of-service",
  footerPrivacyHref = "/privacy-policy",
}: PrivacyPolicyProps) {
  const pageTitle = "Privacy Policy for Growile | Growile";
  const pageDescription =
    "Read the Growile Privacy Policy to learn how we collect, protect, and process personal data across our tools and ecosystem.";

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/privacy-policy";
  const fullUrl = `https://growile.com${currentPath}`;

  return (
    <>
      <PageMeta
        title={pageTitle}
        description={pageDescription}
        canonicalPath={typeof window !== "undefined" ? window.location.pathname : "/"}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://growile.com" },
          { name: "Privacy Policy", url: fullUrl }
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

      {/* Breadcrumb container with top padding offset so sticky navbar never overlaps text */}
      <div style={{ paddingTop: "10px" }}>
        <Breadcrumb
          items={[
            { label: home.label, href: home.href },
            { label: "Privacy Policy", href: currentPath }
          ]}
        />
      </div>

      <section className="about-hero">
        <h1 className="about-title">Privacy Policy for Growile</h1>
        <p className="about-description">Last Updated: September 14, 2026</p>
      </section>

      <Divider />

      <section className="about-section">
        <p className="about-text">
          Welcome to Growile! This Privacy Policy explains how we collect, use, and
          protect your information when you use our website and our ecosystem of free
          digital tools (including our invoice generator, and upcoming utilities).
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">1. Information We Collect</h2>
        <p className="about-text">
          To provide you with the best experience, we collect the following types of
          information:
        </p>
        <ul className="approach-list">
          <li className="approach-item">
            <strong>Personal Information:</strong> When you use certain features of our
            platform, we may collect basic details such as your Name, Mobile Number,
            and Email Address.
          </li>
          <li className="approach-item">
            <strong>Usage &amp; Analytics Data:</strong> We use tools like Google
            Analytics and Google Search Console to understand how users interact with
            our website. This includes collecting non-personal data such as browser
            type, device information, and pages visited, helping us improve our
            platform's performance.
          </li>
        </ul>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">2. How We Process Your Data (Tool-Specific Privacy)</h2>
        <p className="about-text">
          We are committed to a privacy-first approach across our ecosystem:
        </p>
        <ul className="approach-list">
          <li className="approach-item">
            <strong>Growile Invoice Creator:</strong> All invoice generation,
            calculation, and PDF formatting happen locally within your web browser.
            <strong> We do not collect, transmit, or store your generated invoices,
            business financial data, or client details on our servers.</strong>
          </li>
          <li className="approach-item">
            <strong>Future Tools (PDFs, Images, etc.):</strong> As we introduce new
            tools that may require server-side processing, any files uploaded (such as
            images or PDFs) will be stored only temporarily for the purpose of
            processing and will be automatically and permanently deleted from our
            servers shortly after.
          </li>
        </ul>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">3. Cookies and Tracking Technologies</h2>
        <p className="about-text">
          We use cookies to improve your browsing experience, analyze site traffic,
          and understand where our audience is coming from. You can control or disable
          cookies through your browser settings, though some features of our site may
          not function properly without them.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">4. Affiliate Links and Third-Party Services</h2>
        <p className="about-text">
          Growile may contain links to third-party websites, including affiliate links
          and promotional offers. If you click on these links, you will be directed to
          external websites that operate under their own privacy policies. We do not
          control and are not responsible for the privacy practices or content of these
          third-party sites.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">5. Data Sharing and Security</h2>
        <p className="about-text">
          We do not sell, rent, or trade your personal information to third parties.
          We implement reasonable security measures to protect the minimal personal
          data we hold against unauthorized access, alteration, or destruction.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">6. Your Data Rights (Data Deletion)</h2>
        <p className="about-text">
          You have full control over your personal information. If you wish to view,
          update, or permanently delete the personal data (Name, Email, Mobile Number)
          you have provided to us, please send a data deletion request to
          <a href="mailto:growile.groups@gmail.com"> growile.groups@gmail.com</a>.
          We will process your request promptly.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">7. Changes to This Privacy Policy</h2>
        <p className="about-text">
          We may update this Privacy Policy periodically to reflect changes in our
          ecosystem or legal requirements. Any updates will be posted on this page with
          a revised "Last Updated" date.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">8. Contact Us</h2>
        <p className="about-text">
          If you have any questions, concerns, or requests regarding this Privacy
          Policy, please contact us at:
          <a href="mailto:growile.groups@gmail.com"> growile.groups@gmail.com</a>
        </p>
      </section>

      <Footer
        invoiceHref={footerInvoiceHref}
        termsHref={footerTermsHref}
        privacyHref={footerPrivacyHref}
      />
    </>
  );
}