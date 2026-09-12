import { useState } from "react";
import "./FAQ.css";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQProps = {
  heading: string;
  faqs: FAQItem[];
};

export default function FAQ({ heading, faqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="faq">
      <h2 className="faq-heading">{heading}</h2>

      <div className="faq-list">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className={`faq-item ${isOpen ? "open" : ""}`}
            >
              <button
                className="faq-question"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{isOpen ? "×" : "+"}</span>
              </button>

              {isOpen && <p className="faq-answer">{faq.answer}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}