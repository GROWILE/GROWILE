// Renders the icon tool card PDF tool page.
import GlobalIconToolCard from "../../../../packages/ui/src/toolsUi/IconToolCard";
import { pdfIconTools } from "../config/pdfTools";

type PdfIconToolCardProps = {
  toolId: string;
};

// Renders the pdf icon tool card interface.
export default function PdfIconToolCard({ toolId }: PdfIconToolCardProps) {
  const tool = pdfIconTools.find(/* Checks items until it finds a match. */ (item) => item.id === toolId);

  if (!tool) {
    return null;
  }

  const Icon = tool.icon;

  return (
    <GlobalIconToolCard
      title={tool.title}
      href={tool.href}
      icon={<Icon size={30} aria-hidden="true" />}
      colorTheme={tool.colorTheme}
    />
  );
}
