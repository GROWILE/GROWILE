import "./MissionVision.css";

const items = [
  {
    title: "Mission",
    description:
      "Our mission is to build simple, browser-based software that solves everyday work problems — without the complexity, cost, or privacy trade-offs that come with most tools today. We build for people who just want to get their work done, not learn another platform.",
    accentClass: "accent-orange",
  },
  {
    title: "Vision",
    description:
      "We envision a future where every everyday tool — documents, images, finance, invoicing — works together on one connected platform, processed locally, built with the same simplicity and care. A place people return to not because they have to, but because it just works.",
    accentClass: "accent-blue",
  },
];

export default function MissionVision() {
  return (
    <section className="mission-vision">
      <div className="mission-vision-grid">
        {items.map((item) => (
          <div key={item.title} className="mission-vision-card">
            <h3 className="mission-vision-title">{item.title}</h3>
            <div className={`mission-vision-underline ${item.accentClass}`} />
            <p className="mission-vision-description">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}