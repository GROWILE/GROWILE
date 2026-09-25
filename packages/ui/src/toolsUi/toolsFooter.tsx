// Renders categorized links to related tools.
import "./toolsFooter.css";

export type ToolsFooterLink = {
  label: string;
  href: string;
};

export type ToolsFooterCategory = {
  title: string;
  tools: ToolsFooterLink[];
};

export type ToolsFooterProps = {
  categories: ToolsFooterCategory[];
  className?: string;
};

// Renders the tools footer interface.
export default function ToolsFooter({ categories, className = "" }: ToolsFooterProps) {
  return (
    <section className={`tools-footer ${className}`.trim()} aria-label="PDF tools">
      <div className="tools-footer-inner">
        {categories.map(/* Builds a value for each item in the collection. */ (category) => (
          <div className="tools-footer-category" key={category.title}>
            <h2 className="tools-footer-category-title">{category.title}</h2>
            <ul className="tools-footer-list">
              {category.tools.map(/* Builds a value for each item in the collection. */ (tool) => (
                <li key={tool.label}>
                  <a href={tool.href}>{tool.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
