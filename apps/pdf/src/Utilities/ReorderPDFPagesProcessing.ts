// Reorders pages in PDF files.
import { PDFDocument } from "pdf-lib";

// Checks pdf file.
function isPdfFile(file: File) {
  return file.type.toLowerCase() === "application/pdf" || /\.pdf$/i.test(file.name);
}

// Moves pdf pages.
export async function reorderPdfPages(file: File, pageOrder: number[]): Promise<Uint8Array> {
  if (!isPdfFile(file)) {
    throw new Error(`${file.name} is not a PDF file.`);
  }

  const sourcePdf = await PDFDocument.load(await file.arrayBuffer());
  const pageCount = sourcePdf.getPageCount();
  if (pageOrder.length !== pageCount || new Set(pageOrder).size !== pageCount) {
    throw new Error("Every PDF page must be included exactly once.");
  }

  const pageIndices = pageOrder.map(/* Builds a value for each item in the collection. */ (pageNumber) => pageNumber - 1);
  if (pageIndices.some(/* Checks whether any item matches the condition. */ (pageIndex) => pageIndex < 0 || pageIndex >= pageCount)) {
    throw new Error("The selected page order is invalid.");
  }

  const outputPdf = await PDFDocument.create();
  const pages = await outputPdf.copyPages(sourcePdf, pageIndices);
  pages.forEach(/* Processes each item in the collection. */ (page) => outputPdf.addPage(page));
  return outputPdf.save();
}

// Downloads reordered pdf.
export function downloadReorderedPdf(bytes: Uint8Array, fileName: string) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  const blob = new Blob([buffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
