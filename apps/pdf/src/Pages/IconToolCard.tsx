import GlobalIconToolCard from "../../../../packages/ui/src/toolsUi/IconToolCard";
import { pdfIconTools } from "../config/pdfTools";

type PdfIconToolCardProps = {
  toolId: string;
};

export default function PdfIconToolCard({ toolId }: PdfIconToolCardProps) {
  const tool = pdfIconTools.find((item) => item.id === toolId);

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
