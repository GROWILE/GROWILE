import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <h1 className="hero-title">Digital Innovation, Built for Tomorrow</h1>
      <p className="hero-subtitle">
        We create modern software solutions that combine thoughtful design,
        powerful technology, and scalable architecture to help businesses
        move faster, work smarter, and stay ready for what's next.
      </p>
      <a href="#products" className="hero-cta">
        EXPLORE PRODUCTS <span className="hero-cta-arrow">→</span>
      </a>
    </section>
  );
}