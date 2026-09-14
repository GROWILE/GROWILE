import "./About.css";
import Navbar from "../../../../packages/ui/src/Navbar";
import Footer from "../../../../packages/ui/src/Footer";
import Divider from "../../../../packages/ui/src/Divider";
import webLogo from "../../../../packages/ui/assets/growile-invoice-logo.svg";

const values = [
  {
    title: "Simplicity",
    description:
      "We keep things simple. No confusing menus, no unnecessary steps — just tools that work.",
  },
  {
    title: "Honesty",
    description:
      "We build what we promise. No hidden charges, no fake claims — just honest, useful software.",
  },
  {
    title: "Speed",
    description:
      "Your time matters. We build tools that load fast and get the job done without delay.",
  },
  {
    title: "Trust",
    description:
      "We respect your data and your time. Every tool is built to be safe, private, and reliable.",
  },
];

const approach = [
  "Build what people actually need — not extra features nobody uses.",
  "Keep it simple — every tool should be easy from the first click.",
  "Improve constantly — we listen and keep making things better.",
  "Stay honest — clear pricing, no tricks, no surprises.",
];

export default function About() {
  return (
    <>
      <Navbar
        logoAlt="Growile"
        logoSrc={webLogo}
        home={{ label: "Home", href: "/" }}
        products={{
          label: "Products",
          items: [
            { label: "Finance", href: "#finance" },
            { label: "Invoice", href: "/invoice" },
          ],
        }}
        about={{ label: "About", href: "/about" }}
      />

      <section className="about-hero">
        <h1 className="about-title">About Growile</h1>
        <p className="about-description">
          We build simple software tools that help you get everyday work
          done — faster, easier, and without the clutter. From Finance to
          invoices, Growile brings everything you need into one place, so
          you can spend less time struggling with tools and more time doing
          what matters.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">Why We Started Growile</h2>
        <p className="about-text">
          We got tired of using ten different apps just to finish one simple
          task. Most software today feels bloated, expensive, or built for
          someone else's problem — not yours. So we decided to build
          something different. Tools that are easy to open, easy to use, and
          don't ask you to learn a whole new system just to get one thing
          done. That's the whole idea behind Growile.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">Our Story</h2>
        <p className="about-text">
          Growile didn't start with a big plan. It started with a simple
          question — why is everyday software so complicated? We began by
          building one tool that actually worked well. Then another.
          Slowly, it turned into something bigger — a place where all your
          everyday tools live together, built by people who just wanted
          things to work properly.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">Our Values</h2>
        <div className="values-grid">
          {values.map((value) => (
            <div key={value.title} className="value-card">
              <h3 className="value-title">{value.title}</h3>
              <p className="value-description">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">What We're Building</h2>
        <p className="about-text">
          Growile is growing into a full set of everyday tools — starting
          with PDF, image, finance, and invoice tools, all connected under
          one platform. Instead of jumping between apps, you'll soon be
          able to handle everything you need in one simple place, built to
          grow with you.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">Our Approach</h2>
        <ul className="approach-list">
          {approach.map((point) => (
            <li key={point} className="approach-item">
              {point}
            </li>
          ))}
        </ul>
      </section>

      <Footer termsHref="/terms-of-service" />
    </>
  );
}