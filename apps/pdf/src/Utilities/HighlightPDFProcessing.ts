// Highlights selected content in PDF files.
import { PDFDocument, rgb } from "pdf-lib";

export type HighlightPlacement = {
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

// Handles highlight pdf work.
export async function highlightPdf(file: File, highlights: HighlightPlacement[], color: string, opacity: number) {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const fill = parseHexColor(color);
  for (const highlight of highlights) {
    const page = pdf.getPages()[highlight.pageIndex];
    if (!page || highlight.width <= 0 || highlight.height <= 0) continue;
    page.drawRectangle({
      x: Math.max(0, highlight.x),
      y: Math.max(0, highlight.y),
      width: highlight.width,
      height: highlight.height,
      color: fill,
      opacity: Math.max(0.05, Math.min(1, opacity)),
      borderWidth: 0,
    });
  }
  return pdf.save();
}

// Parses hex color.
function parseHexColor(value: string) {
  const normalized = value.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return rgb(1, 0.86, 0.08);
  return rgb(
    Number.parseInt(normalized.slice(0, 2), 16) / 255,
    Number.parseInt(normalized.slice(2, 4), 16) / 255,
    Number.parseInt(normalized.slice(4, 6), 16) / 255,
  );
}

// Downloads highlight pdf.
export function downloadHighlightPdf(bytes: Uint8Array, fileName: string) {
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
