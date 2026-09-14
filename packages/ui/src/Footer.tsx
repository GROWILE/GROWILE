import AdSpace from "./AdSpace";
import "./Footer.css";

type FooterProps = {
  invoiceHref?: string;
  termsHref?: string;
  privacyHref?: string;
  showAdSpace?: boolean;
};

function createFooterColumns(invoiceHref: string) {
  return [
  {
    title: "Products",
    links: [
      { label: "Finance", href: "/finance" },
      { label: "Invoice", href: invoiceHref },
    ],
  },
  /* {
    title: "Resources",
    links: [
      { label: "FAQ", href: "#" },
      { label: "Help Center", href: "#" },
    ],
  }, */
  {
    title: "Company",
    links: [{ label: "About Us", href: "/about" }],
  },
  ];
}

/* const socialLinks = [
  { label: "X", href: "#" },
  { label: "FB", href: "#" },
  { label: "YT", href: "#" },
  { label: "IN", href: "#" },
  { label: "IG", href: "#" },
]; */

export default function Footer({ invoiceHref = "/invoice", termsHref = "#", privacyHref = "/privacy-policy", showAdSpace = false }: FooterProps) {
  const footerColumns = createFooterColumns(invoiceHref);

  return (
    <footer className="footer">
      {showAdSpace && <AdSpace compact className="footer-ad-space" />}

      <div className="footer-cta">
        <h2 className="footer-cta-title">Ready to do your best work?</h2>
        <p className="footer-cta-subtitle">Let's get you started.</p>
        <a href="/products" className="footer-cta-button">
            EXPLORE OUR PRODUCTS <span className="footer-cta-arrow">&gt;</span>
        </a>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-columns">
        {footerColumns.map((column) => (
          <div key={column.title} className="footer-column">
           <h3 className="footer-column-title">{column.title}</h3>
            <ul className="footer-column-links">
              {column.links.map((link) => (
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
          <a href="mailto:contact@growile.com" className="footer-contact-email">
            contact@growile.com
          </a>
        </div>
      </div>

      { /* <div className="footer-social">
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            className="footer-social-icon"
            aria-label={social.label}
          >
            {social.label}
          </a>
        ))}
      </div> */ }

      <div className="footer-legal">
        <a href={termsHref}>Terms and Conditions</a>
        <a href={privacyHref}>Privacy Policy</a>
      </div>

      <div className="footer-bottom">
        <p>Copyright © {new Date().getFullYear()} GROWILE . All Rights Reserved.</p>
      </div>
    </footer>
  );
}