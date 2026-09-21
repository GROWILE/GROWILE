import { PDFDocument } from "pdf-lib";

function isPdfFile(file: File) {
  return file.type.toLowerCase() === "application/pdf" || /\.pdf$/i.test(file.name);
}

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
    .sort((first, second) => first - second)
    .map((pageNumber) => pageNumber - 1);

  if (pageIndices.some((pageIndex) => pageIndex < 0 || pageIndex >= sourcePdf.getPageCount())) {
    throw new Error("One or more selected pages are outside the PDF page range.");
  }

  const outputPdf = await PDFDocument.create();
  const pages = await outputPdf.copyPages(sourcePdf, pageIndices);
  pages.forEach((page) => outputPdf.addPage(page));
  return outputPdf.save();
}

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
