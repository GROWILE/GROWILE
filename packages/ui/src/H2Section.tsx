// Renders reusable heading and description sections.
import "./H2Section.css";

// ---------- Types ----------

type H2Block = {
  heading: string;
  description: string;
};

type H2SectionProps = {
  blocks: H2Block[];
};

// ---------- Component ----------
// A simple, reusable H2 + description block, repeated for SEO content.
// Pass 1 or more { heading, description } blocks as props — this
// component just renders them. Content lives with the page using it,
// not inside this file, so the same component works for every
// product pages and future tools.

export default function H2Section({ blocks }: H2SectionProps) {
  return (
    <section className="h2-section">
      {blocks.map(/* Builds a value for each item in the collection. */ (block) => (
        <div key={block.heading} className="h2-block">
          <h2 className="h2-block-heading">{block.heading}</h2>
          <p className="h2-block-description">{block.description}</p>
        </div>
      ))}
    </section>
  );
}