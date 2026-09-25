// Splits PDF files into separate documents.
import { PDFDocument } from "pdf-lib";

export type SplitPdfPart = {
  startPage: number;
  endPage: number;
  bytes: Uint8Array;
};

// Checks pdf file.
function isPdfFile(file: File) {
  return file.type.toLowerCase() === "application/pdf" || /\.pdf$/i.test(file.name);
}

// Gets pdf page count.
export async function getPdfPageCount(file: File): Promise<number> {
  if (!isPdfFile(file)) {
    throw new Error(`${file.name} is not a PDF file.`);
  }

  const sourcePdf = await PDFDocument.load(await file.arrayBuffer());
  return sourcePdf.getPageCount();
}

// Splits pdf by range.
export async function splitPdfByRange(
  file: File,
  startPage: number,
  endPage: number,
): Promise<SplitPdfPart[]> {
  if (!isPdfFile(file)) {
    throw new Error(`${file.name} is not a PDF file.`);
  }

  const sourcePdf = await PDFDocument.load(await file.arrayBuffer());
  const pageCount = sourcePdf.getPageCount();
  if (
    !Number.isInteger(startPage) ||
    !Number.isInteger(endPage) ||
    startPage < 1 ||
    endPage > pageCount ||
    startPage >= endPage
  ) {
    throw new Error("Choose a valid page range with at least one page before and after it.");
  }

  const ranges = [
    [1, startPage - 1],
    [startPage, endPage],
    [endPage + 1, pageCount],
  ].filter(/* Keeps items that match the condition. */ ([rangeStart, rangeEnd]) => rangeStart <= rangeEnd);

  return Promise.all(
    ranges.map(/* Builds a value for each item in the collection. */ async ([rangeStart, rangeEnd]) => {
      const outputPdf = await PDFDocument.create();
      const pages = await outputPdf.copyPages(
        sourcePdf,
        Array.from({ length: rangeEnd - rangeStart + 1 }, /* Handles pages work. */ (_, index) => rangeStart - 1 + index),
      );
      pages.forEach(/* Processes each item in the collection. */ (page) => outputPdf.addPage(page));
      return {
        startPage: rangeStart,
        endPage: rangeEnd,
        bytes: await outputPdf.save(),
      };
    }),
  );
}

// Downloads split pdf.
export function downloadSplitPdf(bytes: Uint8Array, fileName: string) {
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
