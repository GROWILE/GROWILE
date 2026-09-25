// Adds page numbers to PDF files.
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const BOTTOM_MARGIN = 40;

// Adds page numbers to pdf.
export async function addPageNumbersToPdf(file: File): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();

  pages.forEach(/* Processes each item in the collection. */ (page, index) => {
    const { width, height } = page.getSize();
    page.setSize(width, height + BOTTOM_MARGIN);
    const label = String(index + 1);
    const fontSize = 10;
    const labelWidth = font.widthOfTextAtSize(label, fontSize);
    page.drawText(label, {
      x: (width - labelWidth) / 2,
      y: 14,
      size: fontSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  });

  return pdf.save();
}

// Downloads page numbers pdf.
export function downloadPageNumbersPdf(bytes: Uint8Array, fileName: string) {
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
