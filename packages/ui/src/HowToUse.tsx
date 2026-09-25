// Renders step-by-step instructions for using a tool.
import "./HowToUse.css";

type Step = {
  number: string;
  title: string;
  description: string;
};

type HowToUseProps = {
  heading: string;
  steps: Step[];
};

// Renders the how to use interface.
export default function HowToUse({ heading, steps }: HowToUseProps) {
  return (
    <section className="how-to-use">
      <h2 className="how-to-use-heading">{heading}</h2>

      <div className="how-to-use-steps">
        {steps.map(/* Builds a value for each item in the collection. */ (step) => (
          <div key={step.number} className="how-to-use-step">
            <div className="how-to-use-number">{step.number}</div>
            <h3 className="how-to-use-title">{step.title}</h3>
            <p className="how-to-use-description">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}