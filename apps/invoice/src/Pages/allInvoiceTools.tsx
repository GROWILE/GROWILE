// Lists invoice tools and filters them by type or search text.
import { useMemo, useState } from "react";
import ToolCard from "../../../../packages/ui/src/toolsUi/toolCard";
import {
  allInvoiceTools,
  invoiceToolCategories,
  toolCardThemes,
} from "../config/invoiceTools";
import "./Home.css";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

type InvoiceToolsProps = {
  invoiceBaseHref: string;
};

// Renders the all invoice tools interface.
export default function InvoiceTools({ invoiceBaseHref }: InvoiceToolsProps) {
  const [activeCategory, setActiveCategory] =
    useState<(typeof invoiceToolCategories)[number]>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const exactCategory = invoiceToolCategories.find(
      (category) => category.toLowerCase() === query,
    );

    if (exactCategory && exactCategory !== "All") {
      return allInvoiceTools.filter(
        (tool) => tool.category === exactCategory,
      );
    }

    return allInvoiceTools.filter((tool) => {
      const matchesCategory =
        activeCategory === "All" || tool.category === activeCategory;
      const matchesSearch =
        !query ||
        tool.title.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  return (
    <section
      className="all-invoice-tools"
      aria-labelledby="all-invoice-tools-title"
    >
      <div className="all-invoice-tools-heading">
        <div>
          <p className="all-invoice-tools-eyebrow">Invoice tools</p>
          <h2 id="all-invoice-tools-title">Choose an Invoice</h2>
          <p>Select the invoice format that fits your business.</p>
        </div>

        <label className="all-invoice-tools-search">
          <SearchIcon />
          <span className="sr-only">Search invoice tools</span>
          <input
            id="invoice-tools-search"
            name="search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search invoices"
          />
        </label>
      </div>

      <div className="all-invoice-tools-filters" aria-label="Invoice types">
        {invoiceToolCategories.map((category) => (
          <button
            key={category}
            type="button"
            className={activeCategory === category ? "active" : ""}
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredTools.length > 0 ? (
        <div className="all-invoice-tools-grid">
          {filteredTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <ToolCard
                key={tool.id}
                title={tool.title}
                description={tool.description}
                href={`${invoiceBaseHref}${tool.path}`}
                icon={<Icon />}
                colorTheme={toolCardThemes[index % toolCardThemes.length]}
              />
            );
          })}
        </div>
      ) : (
        <p className="all-invoice-tools-empty">No invoice tools found.</p>
      )}
    </section>
  );
}
