// Extracts selected pages from PDF files.
import { PDFDocument } from "pdf-lib";

// Checks pdf file.
function isPdfFile(file: File) {
  return file.type.toLowerCase() === "application/pdf" || /\.pdf$/i.test(file.name);
}

// Extracts pdf pages.
export async function extractPdfPages(
  file: File,
  pageNumbers: number[],
): Promise<Uint8Array> {
  if (!isPdfFile(file)) {
    throw new Error(`${file.name} is not a PDF file.`);
  }

  if (pageNumbers.length === 0) {
    throw new Error("Select at least one PDF page before extracting.");
  }

  const sourcePdf = await PDFDocument.load(await file.arrayBuffer());
  const pageIndices = [...new Set(pageNumbers)]
    .sort(/* Compares items to determine their order. */ (first, second) => first - second)
    .map(/* Builds a value for each item in the collection. */ (pageNumber) => pageNumber - 1);

  if (pageIndices.some(/* Checks whether any item matches the condition. */ (pageIndex) => pageIndex < 0 || pageIndex >= sourcePdf.getPageCount())) {
    throw new Error("One or more selected pages are outside the PDF page range.");
  }

  const outputPdf = await PDFDocument.create();
  const pages = await outputPdf.copyPages(sourcePdf, pageIndices);
  pages.forEach(/* Processes each item in the collection. */ (page) => outputPdf.addPage(page));
  return outputPdf.save();
}

// Downloads extracted pdf.
export function downloadExtractedPdf(bytes: Uint8Array, fileName: string) {
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
