// Renders the Growile about page.
import "./About.css";
import Navbar from "../../../../packages/ui/src/Navbar";
import Footer from "../../../../packages/ui/src/Footer";
import Divider from "../../../../packages/ui/src/Divider";
import { webNavigation } from "../config/site";
import Breadcrumb from "../../../../packages/ui/src/Breadcrumb";
import BreadcrumbSchema from "../../../../packages/ui/src/BreadcrumbSchema";

const principles = [
  {
    title: "Purpose over complexity",
    description:
      "We focus on solving meaningful problems rather than adding complexity for the sake of features.",
  },
  {
    title: "Our own technology",
    description:
      "We build the underlying technology alongside the products, giving us greater control over performance, reliability, and future possibilities.",
  },
  {
    title: "Simple experiences",
    description:
      "Complex technology should result in simple experiences. Our users should not need to understand what's happening underneath to get things done.",
  },
  {
    title: "Built to evolve",
    description:
      "Growile is designed for the long term. Products, systems, and technology will continue to evolve as we learn and grow.",
  },
  {
    title: "Trust by design",
    description:
      "We believe privacy, transparency, reliability, and responsible technology should be fundamental—not afterthoughts.",
  },
];

// Renders the about interface.
export default function About() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://growile.com" },
          { name: "About Us", url: "https://growile.com/about" }
          ]}
        />
      <Navbar {...webNavigation} />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" }
        ]}
      />


      <section className="about-hero">
        <h1 className="about-title">About Growile</h1>
        <p className="about-description">
          Growile is a technology company building a growing ecosystem of digital products, platforms, and technology.
        </p>
        <p className="about-description">
          We design products that simplify how people and businesses work, while building the systems behind them.
        </p>
        <p className="about-description">
          Our focus is not on building one product for one problem. We are building a foundation that can support many products, technologies, and experiences as Growile evolves.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">Why We Started</h2>
        <p className="about-text">
          Technology should make progress easier, not add another layer of complexity.
        </p>
        <p className="about-text">
          Yet much of today's digital experience is fragmented across disconnected products, platforms, and services. We believe there is an opportunity to build technology that feels more connected, accessible, and purposeful.
        </p>
        <p className="about-text">
          That belief is what started Growile.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">What We're Building</h2>
        <p className="about-text">
          Growile is building a portfolio of technology products designed around real-world needs, for students, small businesses, and enterprises.
        </p>
        <p className="about-text">
          Each product is built to stand on its own, while contributing to a broader ecosystem that can grow over time.
        </p>
        <p className="about-text">
          Beyond the products themselves, we are investing in the technology behind them — developing purpose-built processing engines, infrastructure, and systems that allow us to build faster, improve continuously, and scale with the needs of our users.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">How We Build</h2>
        <div className="values-grid">
          {principles.map((principle) => (
            <div key={principle.title} className="value-card">
              <h3 className="value-title">{principle.title}</h3>
              <p className="value-description">{principle.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">Our Vision</h2>
        <p className="about-text">
          We are building toward a technology ecosystem where products, platforms, and underlying technology work together to create better digital experiences at scale.
        </p>
        <p className="about-text">
          Growile's future is not limited to a single category or type of product. As our technology evolves, so will the products and possibilities built on top of it.
        </p>
        <p className="about-text about-vision-statement">
          Our ambition is simple:
          <strong>Build technology that can grow into something much bigger than where it starts.</strong>
        </p>
      </section>

      <Divider />

      <section className="about-section about-founder">
        <h2 className="about-heading">Founder &amp; CEO</h2>
        <h3 className="about-founder-name">Jegadeeshwaran S</h3>
        <p className="about-text">Founder &amp; CEO, Growile</p>
        <blockquote className="about-founder-quote">
          <p>"What starts as a product can evolve into a platform. What starts as an idea can grow into an ecosystem."</p>
          <cite>— Jegadeeshwaran S</cite>
        </blockquote>
      </section>

      <Footer termsHref="/terms-of-service" reserveBottomAdSpace={false} />
    </>
  );
}