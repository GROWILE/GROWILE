// Processes add text pdf for PDF files.
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export type TextPlacement = {
  pageIndex: number;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: "Helvetica" | "TimesRoman" | "Courier" | "Arial" | "Georgia" | "Verdana" | "Trebuchet";
  fontWeight: "normal" | "medium" | "bold";
};

// Adds text to pdf.
export async function addTextToPdf(file: File, placement: TextPlacement): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const page = pdf.getPages()[placement.pageIndex];
  if (!page) throw new Error("Select a valid PDF page.");
  if (!placement.text.trim()) throw new Error("Enter text before adding it.");

  const fontName = getFontName(placement.fontFamily, placement.fontWeight);
  const font = await pdf.embedFont(fontName);
  page.drawText(placement.text.trim(), {
    x: Math.max(0, placement.x),
    y: Math.max(0, placement.y),
    size: Math.max(6, Math.min(96, placement.fontSize)),
    font,
    color: parseHexColor(placement.color),
  });
  return pdf.save();
}

// Gets font name.
function getFontName(
  family: TextPlacement["fontFamily"],
  weight: TextPlacement["fontWeight"],
) {
  if (family === "TimesRoman" || family === "Georgia") {
    return weight === "bold" ? StandardFonts.TimesRomanBold : StandardFonts.TimesRoman;
  }
  if (family === "Courier") {
    return weight === "bold" ? StandardFonts.CourierBold : StandardFonts.Courier;
  }
  return weight === "bold" ? StandardFonts.HelveticaBold : StandardFonts.Helvetica;
}

// Parses hex color.
function parseHexColor(value: string) {
  const normalized = value.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return rgb(0, 0, 0);
  return rgb(
    Number.parseInt(normalized.slice(0, 2), 16) / 255,
    Number.parseInt(normalized.slice(2, 4), 16) / 255,
    Number.parseInt(normalized.slice(4, 6), 16) / 255,
  );
}

// Downloads add text pdf.
export function downloadAddTextPdf(bytes: Uint8Array, fileName: string) {
  downloadPdf(bytes, fileName);
}

// Downloads pdf.
function downloadPdf(bytes: Uint8Array, fileName: string) {
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
