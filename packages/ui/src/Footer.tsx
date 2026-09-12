import "./Footer.css";

const footerColumns = [
  {
    title: "Products",
    links: [
      { label: "Finance", href: "#" },
      { label: "Invoice", href: "#" },
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

const socialLinks = [
  { label: "X", href: "#" },
  { label: "FB", href: "#" },
  { label: "YT", href: "#" },
  { label: "IN", href: "#" },
  { label: "IG", href: "#" },
]; 

const legalLinks = [
  "Terms and Conditions",
  "Privacy Policy",
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cta">
        <h2 className="footer-cta-title">Ready to do your best work?</h2>
        <p className="footer-cta-subtitle">Let's get you started.</p>
        <a href="#signup" className="footer-cta-button">
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

      <div className="footer-social">
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
      </div>

      <div className="footer-legal">
        {legalLinks.map((link) => (
          <a key={link} href="#">
            {link}
          </a>
        ))}
      </div>

      <div className="footer-bottom">
        <p>Copyright © {new Date().getFullYear()} GROWILE . All Rights Reserved.</p>
      </div>
    </footer>
  );
}