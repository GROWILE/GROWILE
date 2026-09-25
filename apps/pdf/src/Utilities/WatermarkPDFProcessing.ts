// Adds a watermark to PDF files.
import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";

export type WatermarkOptions = {
  text: string;
  color: string;
  opacity: number;
  fontSize: number;
  angle: number;
  allPages: boolean;
};

export type WatermarkPlacement = {
  pageIndex: number;
  xRatio: number;
  yRatio: number;
};

// Adds watermark to pdf.
export async function addWatermarkToPdf(file: File, options: WatermarkOptions, placements: WatermarkPlacement[]) {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const color = parseHexColor(options.color);
  const text = options.text.trim();
  if (!text) throw new Error("Enter watermark text before downloading.");
  const pages = pdf.getPages();
  const targets = options.allPages
    ? pages.map(/* Builds a value for each item in the collection. */ (_, pageIndex) => ({ pageIndex, xRatio: placements[0]?.xRatio ?? 0.5, yRatio: placements[0]?.yRatio ?? 0.5 }))
    : placements;
  for (const placement of targets) {
    const page = pages[placement.pageIndex];
    if (!page) continue;
    const { width, height } = page.getSize();
    const size = Math.max(8, Math.min(180, options.fontSize));
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: Math.max(0, Math.min(width - textWidth, width * placement.xRatio - textWidth / 2)),
      y: Math.max(0, Math.min(height - size, height * placement.yRatio - size / 2)),
      size,
      font,
      color,
      opacity: Math.max(0.05, Math.min(1, options.opacity)),
      rotate: degrees(options.angle),
    });
  }
  return pdf.save();
}

// Parses hex color.
function parseHexColor(value: string) {
  const normalized = value.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return rgb(0.5, 0.5, 0.5);
  return rgb(
    Number.parseInt(normalized.slice(0, 2), 16) / 255,
    Number.parseInt(normalized.slice(2, 4), 16) / 255,
    Number.parseInt(normalized.slice(4, 6), 16) / 255,
  );
}

// Downloads watermark pdf.
export function downloadWatermarkPdf(bytes: Uint8Array, fileName: string) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  const url = URL.createObjectURL(new Blob([buffer], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
