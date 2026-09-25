// Renders the shared site footer and its navigation links.
import AdSpace from "./AdSpace";
import "./Footer.css";

type FooterProps = {
  invoiceHref?: string;
  termsHref?: string;
  privacyHref?: string;
  showAdSpace?: boolean;
  reserveBottomAdSpace?: boolean;
};

// Creates footer columns.
function createFooterColumns(invoiceHref: string) {
  return [
  {
    title: "Products",
    links: [
      { label: "PDF", href: "/pdf" },
      { label: "Invoice", href: invoiceHref },
    ],
  },
  {
    title: "Company",
    links: [{ label: "About Us", href: "/about" }],
  },
  ];
}

// Renders the footer interface.
export default function Footer({
  invoiceHref = "/invoice",
  termsHref = "#",
  privacyHref = "/privacy-policy",
  showAdSpace = false,
  reserveBottomAdSpace = true,
}: FooterProps) {
  const footerColumns = createFooterColumns(invoiceHref);

  return (
    <footer className={`footer${reserveBottomAdSpace ? "" : " footer--no-bottom-ad-space"}`}>
      {showAdSpace && <AdSpace compact className="footer-ad-space" />}

      <div className="footer-cta">
        <h2 className="footer-cta-title">Simplify Your Workflow with Growile's Free Toolkit.</h2>
        <p className="footer-cta-subtitle">Create professional documents instantly with tools designed for speed and global privacy.</p>
        <a href="/products" className="footer-cta-button">
            EXPLORE OUR PRODUCTS <span className="footer-cta-arrow">&gt;</span>
        </a>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-columns">
        {footerColumns.map(/* Builds a value for each item in the collection. */ (column) => (
          <div key={column.title} className="footer-column">
           <h3 className="footer-column-title">{column.title}</h3>
            <ul className="footer-column-links">
              {column.links.map(/* Builds a value for each item in the collection. */ (link) => (
              <li key={link.label}>
              <a href={link.href}>{link.label}</a>
              </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="footer-column">
          <h3 className="footer-column-title">Contact</h3>
          <p className="footer-contact-label">Email</p>
          <a href="mailto:growile.groups@gmail.com" className="footer-contact-email">
            growile.groups@gmail.com
          </a>
        </div>
      </div>

      <div className="footer-legal">
        <a href={termsHref}>Terms of Service</a>
        <a href={privacyHref}>Privacy Policy</a>
      </div>

      <div className="footer-bottom">
        <p>Copyright © {new Date().getFullYear()} GROWILE . All Rights Reserved.</p>
      </div>
    </footer>
  );
}