
import "./Hero.css";

type HeroProps = {
  kicker?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
};

export default function Hero({
  kicker,
  title,
  subtitle,
  ctaText,
  ctaHref,
}: HeroProps) {
  return (
    <section className="hero">
      {kicker && <p className="kicker">{kicker}</p>}
      <h1 className="hero-title">{title}</h1>
      <p className="hero-subtitle">{subtitle}</p>
      <a href={ctaHref} className="hero-cta">
        {ctaText} <span className="hero-cta-arrow">&gt;</span>
      </a>
    </section>
  );
}