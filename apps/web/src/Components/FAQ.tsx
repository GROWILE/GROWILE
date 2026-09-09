import { useState } from "react";
import "./FAQ.css";

const faqs = [
  {
    question: "Who are you and what do you do?",
    answer:
      "We're a software company building simple, browser-based tools that help people handle everyday digital tasks — without the clutter, cost, or complexity most software comes with.",
  },
  {
    question: "Why did you start this company?",
    answer:
      "We saw people paying for bloated software full of features they never use, so we set out to build simple tools that just work.",
  },
  {
    question: "Are you a new company?",
    answer:
      "Yes, we're a newly founded company — but our tools are already live and being actively improved.",
  },
  {
    question: "Do I need to create an account to use your products?",
    answer:
      "No, most of our tools work without an account. Signing up just lets you save your history and preferences.",
  },
  {
    question: "Do I need to create an account to use your products?",
    answer:
      "No, most of our tools work without an account. Signing up just lets you save your history and preferences.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="faq">
      <h2 className="faq-heading">Frequently Asked Questions &gt;</h2>

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