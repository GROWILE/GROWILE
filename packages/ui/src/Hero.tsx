// Renders a page hero section with its main call to action.

import "./Hero.css";
import type { MouseEvent } from "react";

type HeroProps = {
  kicker?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  onCtaClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

// Renders the hero interface.
export default function Hero({
  kicker,
  title,
  subtitle,
  ctaText,
  ctaHref,
  onCtaClick,
}: HeroProps) {
  return (
    <section className="hero">
      {kicker && <p className="kicker">{kicker}</p>}
      <h1 className="hero-title">{title}</h1>
      <p className="hero-subtitle">{subtitle}</p>
      <a href={ctaHref} className="hero-cta" onClick={onCtaClick}>
        {ctaText} <span className="hero-cta-arrow">&gt;</span>
      </a>
    </section>
  );
}