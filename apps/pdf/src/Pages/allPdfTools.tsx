import { useMemo, useState } from "react";
import {
  FileArchive,
  FileImage,
  FileOutput,
  FilePenLine,
  FileText,
  LockKeyhole,
  Search,
  Scissors,
  ShieldCheck,
  Signature,
  Stamp,
  Type,
  WandSparkles,
} from "lucide-react";
import ToolCard from "../../../../packages/ui/src/toolsUi/toolCard";
import "./Home.css";

export type PdfToolCategory =
  | "Conversion"
  | "Organize"
  | "Compression"
  | "Edit"
  | "Security";

export type PdfTool = {
  id: string;
  title: string;
  category: PdfToolCategory;
  href: string;
  description?: string;
  icon: typeof FileText;
};

export const pdfToolCategories: Array<"All" | PdfToolCategory> = [
  "All",
  "Conversion",
  "Organize",
  "Compression",
  "Edit",
  "Security",
];

export const allPdfTools: PdfTool[] = [
  { id: "jpg-to-pdf", title: "JPG to PDF", description: "Convert JPG images into a PDF file.", category: "Conversion", href: "/tools/jpg-to-pdf", icon: FileImage },
  { id: "png-to-pdf", title: "PNG to PDF", description: "Turn PNG images into a clean PDF document.", category: "Conversion", href: "/tools/png-to-pdf", icon: FileImage },
  { id: "pdf-to-jpg", title: "PDF to JPG", description: "Convert PDF pages into JPG images.", category: "Conversion", href: "/tools/pdf-to-jpg", icon: FileOutput },
  { id: "pdf-to-png", title: "PDF to PNG", description: "Export PDF pages as high-quality PNG images.", category: "Conversion", href: "/tools/pdf-to-png", icon: FileOutput },
  { id: "pdf-to-text", title: "PDF to Text", description: "Extract readable text from PDF files.", category: "Conversion", href: "/tools/pdf-to-text", icon: FileText },
  { id: "merge-pdf", title: "Merge PDF", description: "Combine multiple PDF files into one document.", category: "Organize", href: "/tools/merge-pdf", icon: FileArchive },
  { id: "split-pdf", title: "Split PDF", description: "Separate a PDF into multiple smaller files.", category: "Organize", href: "/tools/split-pdf", icon: Scissors },
  { id: "extract-pdf-pages", title: "Extract PDF Pages", description: "Save selected pages as a new PDF file.", category: "Organize", href: "/tools/extract-pdf-pages", icon: FileText },
  { id: "delete-pdf-pages", title: "Delete PDF Pages", description: "Remove unwanted pages from your PDF.", category: "Organize", href: "/tools/delete-pdf-pages", icon: FileText },
  { id: "reorder-pdf-pages", title: "Reorder PDF Pages", description: "Arrange PDF pages in the order you need.", category: "Organize", href: "/tools/reorder-pdf-pages", icon: FileText },
  { id: "rotate-pdf", title: "Rotate PDF", description: "Rotate individual pages or an entire PDF.", category: "Organize", href: "/tools/rotate-pdf", icon: WandSparkles },
  { id: "compress-pdf", title: "Compress PDF", description: "Reduce PDF file size while preserving quality.", category: "Compression", href: "/tools/compress-pdf", icon: FileArchive },
  { id: "add-text", title: "Add Text", description: "Add text boxes to any PDF page.", category: "Edit", href: "/tools/add-text", icon: Type },
  { id: "add-image", title: "Add Image", description: "Insert images into your PDF document.", category: "Edit", href: "/tools/add-image", icon: FileImage },
  { id: "highlight-pdf", title: "Highlight PDF", description: "Highlight important text in your PDF.", category: "Edit", href: "/tools/highlight-pdf", icon: FilePenLine },
  { id: "add-signature", title: "Add Signature", description: "Sign your PDF documents electronically.", category: "Edit", href: "/tools/add-signature", icon: Signature },
  { id: "add-watermark", title: "Add Watermark", description: "Add a text or image watermark to a PDF.", category: "Edit", href: "/tools/add-watermark", icon: Stamp },
  { id: "add-page-numbers", title: "Add Page Numbers", description: "Add page numbers to your PDF pages.", category: "Edit", href: "/tools/add-page-numbers", icon: FileText },
  { id: "protect-pdf", title: "Protect PDF", description: "Secure your PDF with a password.", category: "Security", href: "/tools/protect-pdf", icon: LockKeyhole },
  { id: "unlock-pdf", title: "Unlock PDF", description: "Remove password restrictions from a PDF.", category: "Security", href: "/tools/unlock-pdf", icon: ShieldCheck },
];

type AllPdfToolsProps = {
  tools?: PdfTool[];
};

const toolCardThemes = ["blue", "orange", "green", "purple", "teal"] as const;

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
