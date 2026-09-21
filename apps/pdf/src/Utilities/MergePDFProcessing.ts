import { PDFDocument } from "pdf-lib";

function isPdfFile(file: File) {
  return file.type.toLowerCase() === "application/pdf" || /\.pdf$/i.test(file.name);
}

export async function mergePdfFiles(files: File[]): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error("Select at least two PDF files before merging.");
  }

  for (const file of files) {
    if (!isPdfFile(file)) {
      throw new Error(`${file.name} is not a PDF file.`);
    }
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const sourcePdf = await PDFDocument.load(await file.arrayBuffer());
    const pages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  return mergedPdf.save();
}

export function downloadMergedPdf(bytes: Uint8Array, fileName: string) {
  const pdfBuffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(pdfBuffer).set(bytes);
  const blob = new Blob([pdfBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
