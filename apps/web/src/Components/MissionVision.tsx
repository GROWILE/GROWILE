// Renders the mission and vision content.
import "./MissionVision.css";

const items = [
  {
    title: "Mission",
    paragraphs: [
      "To build simple, reliable products that make everyday digital work easier for people and businesses, while developing the systems that power them.",
      "We do this by solving real problems, keeping every experience simple, and building trust into everything we make.",
    ],
    accentClass: "accent-orange",
  },
  {
    title: "Vision",
    paragraphs: [
      "We are building toward a technology ecosystem where products, platforms, and underlying technology work together to create better digital experiences at scale.",
      "Growile's future is not limited to a single category or type of product. As our technology evolves, so will the products and possibilities built on top of it.",
      "Our ambition is simple:",
      "Build technology that can grow into something much bigger than where it starts.",
    ],
    accentClass: "accent-blue",
  },
];

// Renders the mission vision interface.
export default function MissionVision() {
  return (
    <section className="mission-vision">
      <div className="mission-vision-grid">
        {items.map(/* Builds a value for each item in the collection. */ (item) => (
          <div key={item.title} className="mission-vision-card">
            <h3 className="mission-vision-title">{item.title}</h3>
            <div className={`mission-vision-underline ${item.accentClass}`} />
            <div className="mission-vision-description">
              {item.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}