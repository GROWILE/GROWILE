import { PDFDocument } from "pdf-lib";

function isPdfFile(file: File) {
  return file.type.toLowerCase() === "application/pdf" || /\.pdf$/i.test(file.name);
}

export async function deletePdfPages(
  file: File,
  pageNumbersToDelete: number[],
): Promise<Uint8Array> {
  if (!isPdfFile(file)) {
    throw new Error(`${file.name} is not a PDF file.`);
  }

  const sourcePdf = await PDFDocument.load(await file.arrayBuffer());
  const pageCount = sourcePdf.getPageCount();
  const pagesToDelete = new Set(pageNumbersToDelete);
  const remainingPageIndices = Array.from({ length: pageCount }, (_, index) => index)
    .filter((pageIndex) => !pagesToDelete.has(pageIndex + 1));

  if (remainingPageIndices.length === 0) {
    throw new Error("Keep at least one page in the PDF before deleting.");
  }

  const outputPdf = await PDFDocument.create();
  const pages = await outputPdf.copyPages(sourcePdf, remainingPageIndices);
  pages.forEach((page) => outputPdf.addPage(page));
  return outputPdf.save();
}

export function downloadDeletedPagesPdf(bytes: Uint8Array, fileName: string) {
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
