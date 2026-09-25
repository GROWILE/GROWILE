import { useMemo, useState } from "react";
import {
  Search,
} from "lucide-react";
import ToolCard from "../../../../packages/ui/src/toolsUi/toolCard";
import "./Home.css";

import { allPdfTools, pdfToolCategories, toolCardThemes, type PdfTool } from "../config/pdfTools";

type AllPdfToolsProps = {
  tools?: PdfTool[];
};

export default function AllPdfTools({ tools = allPdfTools }: AllPdfToolsProps) {
  const [activeCategory, setActiveCategory] = useState<(typeof pdfToolCategories)[number]>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory = activeCategory === "All" || tool.category === activeCategory;
      const matchesSearch =
        !query ||
        tool.title.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm, tools]);

  return (
    <section className="all-pdf-tools" aria-labelledby="all-pdf-tools-title">
      <div className="all-pdf-tools-heading">
        <div>
          <p className="all-pdf-tools-eyebrow">PDF tools</p>
          <h1 id="all-pdf-tools-title">All PDF Tools</h1>
          <p>Choose a tool to work with your PDF files.</p>
        </div>

        <label className="all-pdf-tools-search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Search PDF tools</span>
          <input
            id="pdf-tools-search"
            name="search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search tools"
          />
        </label>
      </div>

      <div className="all-pdf-tools-filters" aria-label="Tool categories">
        {pdfToolCategories.map((category) => (
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
        <div className="all-pdf-tools-grid">
          {filteredTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <ToolCard
                key={tool.id}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                icon={<Icon size={24} aria-hidden="true" />}
                colorTheme={toolCardThemes[index % toolCardThemes.length]}
              />
            );
          })}
        </div>
      ) : (
        <p className="all-pdf-tools-empty">No PDF tools found.</p>
      )}

    </section>
  );
}
