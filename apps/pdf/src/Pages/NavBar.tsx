import { FileArchive, FileEdit, FileImage, FolderKanban, LockKeyhole } from "lucide-react";
import Navbar from "../../../../packages/ui/src/Navbar";
import pdfLogo from "../../../../packages/ui/assets/growile-logo.svg";
import { allPdfTools } from "./allPdfTools";

const pdfToolCategories = ["Conversion", "Organize", "Compression", "Edit", "Security"] as const;

const pdfToolCategoryIcons = {
  Conversion: FileImage,
  Organize: FolderKanban,
  Compression: FileArchive,
  Edit: FileEdit,
  Security: LockKeyhole,
};

const toolIconColors = [
  "var(--color-tool-blue)",
  "var(--color-tool-orange)",
  "var(--color-tool-green)",
  "var(--color-tool-purple)",
  "var(--color-tool-teal)",
] as const;

const pdfNavToolGroups = pdfToolCategories.map((category, categoryIndex) => {
  const CategoryIcon = pdfToolCategoryIcons[category];

  return {
    label: category,
    icon: (
      <CategoryIcon
        size={15}
        aria-hidden="true"
        style={{ color: toolIconColors[categoryIndex % toolIconColors.length] }}
      />
    ),
    items: allPdfTools
      .filter((tool) => tool.category === category)
      .map((tool) => {
        const ToolIcon = tool.icon;
        const toolIndex = allPdfTools.indexOf(tool);

        return {
          label: tool.title,
          href: tool.href,
          icon: (
            <ToolIcon
              size={16}
              aria-hidden="true"
              style={{ color: toolIconColors[toolIndex % toolIconColors.length] }}
            />
          ),
        };
      }),
  };
});

export default function PdfNavBar() {
  return (
    <Navbar
      logoAlt="Growile PDF tools"
      logoSrc={pdfLogo}
      home={{ label: "Home", href: "/pdf/" }}
      products={{
        label: "Products",
        items: [
          { label: "Invoice", href: "/invoice" },
          { label: "PDF", href: "/pdf/" },
        ],
      }}
      tools={{ label: "All Tools", items: [], groups: pdfNavToolGroups }}
    />
  );
}
