// Defines the PDF tool catalog and categories.
import {
  FileArchive,
  FileImage,
  FileOutput,
  FilePenLine,
  FileText,
  LockKeyhole,
  Scissors,
  ShieldCheck,
  Signature,
  Stamp,
  Type,
  WandSparkles,
} from "lucide-react";

export type PdfToolCategory = "Conversion" | "Organize" | "Compression" | "Edit" | "Security";

export type PdfTool = {
  id: string;
  title: string;
  category: PdfToolCategory;
  href: string;
  description?: string;
  icon: typeof FileText;
};

export const pdfToolCategories: Array<"All" | PdfToolCategory> = [
  "All", "Conversion", "Organize", "Compression", "Edit", "Security",
];

export const allPdfTools: PdfTool[] = [
  { id: "jpg-to-pdf", title: "JPG to PDF", description: "Convert JPG images into a PDF file.", category: "Conversion", href: "/pdf/jpg-to-pdf", icon: FileImage },
  { id: "png-to-pdf", title: "PNG to PDF", description: "Turn PNG images into a clean PDF document.", category: "Conversion", href: "/pdf/png-to-pdf", icon: FileImage },
  { id: "pdf-to-jpg", title: "PDF to JPG", description: "Convert PDF pages into JPG images.", category: "Conversion", href: "/pdf/pdf-to-jpg", icon: FileOutput },
  { id: "pdf-to-png", title: "PDF to PNG", description: "Export PDF pages as high-quality PNG images.", category: "Conversion", href: "/pdf/pdf-to-png", icon: FileOutput },
  { id: "pdf-to-text", title: "PDF to Text", description: "Extract readable text from PDF files.", category: "Conversion", href: "/pdf/pdf-to-text", icon: FileText },
  { id: "pdf-to-word", title: "PDF to Word", description: "Convert PDF files into editable Word documents.", category: "Conversion", href: "/pdf/pdf-to-word", icon: FileOutput },
  { id: "pdf-to-excel", title: "PDF to Excel", description: "Convert PDF files into editable Excel spreadsheets.", category: "Conversion", href: "/pdf/pdf-to-excel", icon: FileOutput },
  { id: "merge-pdf", title: "Merge PDF", description: "Combine multiple PDF files into one document.", category: "Organize", href: "/pdf/merge-pdf", icon: FileArchive },
  { id: "split-pdf", title: "Split PDF", description: "Separate a PDF into multiple smaller files.", category: "Organize", href: "/pdf/split-pdf", icon: Scissors },
  { id: "extract-pdf-pages", title: "Extract PDF Pages", description: "Save selected pages as a new PDF file.", category: "Organize", href: "/pdf/extract-pdf-pages", icon: FileText },
  { id: "delete-pdf-pages", title: "Delete PDF Pages", description: "Remove unwanted pages from your PDF.", category: "Organize", href: "/pdf/delete-pdf-pages", icon: FileText },
  { id: "reorder-pdf-pages", title: "Reorder PDF Pages", description: "Arrange PDF pages in the order you need.", category: "Organize", href: "/pdf/reorder-pdf-pages", icon: FileText },
  { id: "rotate-pdf", title: "Rotate PDF", description: "Rotate individual pages or an entire PDF.", category: "Organize", href: "/pdf/rotate-pdf", icon: WandSparkles },
  { id: "compress-pdf", title: "Compress PDF", description: "Reduce PDF file size while preserving quality.", category: "Compression", href: "/pdf/compress-pdf", icon: FileArchive },
  { id: "add-text", title: "Add Text", description: "Add text boxes to any PDF page.", category: "Edit", href: "/pdf/add-text", icon: Type },
  { id: "add-image", title: "Add Image", description: "Insert images into your PDF document.", category: "Edit", href: "/pdf/add-image", icon: FileImage },
  { id: "highlight-pdf", title: "Highlight PDF", description: "Highlight important text in your PDF.", category: "Edit", href: "/pdf/highlight-pdf", icon: FilePenLine },
  { id: "add-signature", title: "Add Signature", description: "Sign your PDF documents electronically.", category: "Edit", href: "/pdf/add-signature", icon: Signature },
  { id: "add-watermark", title: "Add Watermark", description: "Add a text or image watermark to a PDF.", category: "Edit", href: "/pdf/add-watermark", icon: Stamp },
  { id: "add-page-numbers", title: "Add Page Numbers", description: "Add page numbers to your PDF pages.", category: "Edit", href: "/pdf/add-page-numbers", icon: FileText },
  { id: "protect-pdf", title: "Protect PDF", description: "Secure your PDF with a password.", category: "Security", href: "/pdf/protect-pdf", icon: LockKeyhole },
  { id: "unlock-pdf", title: "Unlock PDF", description: "Remove password restrictions from a PDF.", category: "Security", href: "/pdf/unlock-pdf", icon: ShieldCheck },
];

export const toolCardThemes = ["blue", "orange", "green", "purple", "teal"] as const;

export const pdfIconTools = allPdfTools.map(/* Builds a value for each item in the collection. */ (tool, index) => ({
  ...tool,
  colorTheme: toolCardThemes[index % toolCardThemes.length],
}));
