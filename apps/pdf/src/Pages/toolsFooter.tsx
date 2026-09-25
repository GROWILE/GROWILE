// Renders links to related PDF tools.
import ToolsFooter from "../../../../packages/ui/src/toolsUi/toolsFooter";
import { allPdfTools, type PdfToolCategory } from "../config/pdfTools";

const categories: PdfToolCategory[] = [
  "Conversion",
  "Organize",
  "Compression",
  "Edit",
  "Security",
];

// Renders the pdf tools footer interface.
export default function PdfToolsFooter() {
  return (
    <ToolsFooter
      categories={categories.map(/* Builds a value for each item in the collection. */ (category) => ({
        title: category,
        tools: allPdfTools
          .filter(/* Keeps items that match the condition. */ (tool) => tool.category === category)
          .map(/* Builds a value for each item in the collection. */ (tool) => ({ label: tool.title, href: tool.href })),
      }))}
    />
  );
}
