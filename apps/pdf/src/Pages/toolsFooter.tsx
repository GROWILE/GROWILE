import ToolsFooter from "../../../../packages/ui/src/toolsUi/toolsFooter";
import { allPdfTools, type PdfToolCategory } from "../config/pdfTools";

const categories: PdfToolCategory[] = [
  "Conversion",
  "Organize",
  "Compression",
  "Edit",
  "Security",
];

export default function PdfToolsFooter() {
  return (
    <ToolsFooter
      categories={categories.map((category) => ({
        title: category,
        tools: allPdfTools
          .filter((tool) => tool.category === category)
          .map((tool) => ({ label: tool.title, href: tool.href })),
      }))}
    />
  );
}
