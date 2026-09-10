import "./Hero.css";

export default function Hero() {
  return (
    <section className="invoice-hero" id="top">
      <p className="invoice-hero-kicker">GROWILE INVOICE</p>
      <h1 className="invoice-hero-title">
        Professional invoices, built for your business.
      </h1>
      <p className="invoice-hero-subtitle">
        Create clean, accurate invoices in minutes. Choose the format that fits
        your business and keep every payment moving forward.
      </p>
      <a href="#invoice-options" className="invoice-hero-cta">
        CREATE AN INVOICE <span>→</span>
      </a>
    </section>
  );
}
