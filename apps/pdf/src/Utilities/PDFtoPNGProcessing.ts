import JSZip from "jszip";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

function isPdfFile(file: File) {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

export async function convertPdfToPngZip(file: File): Promise<Uint8Array> {
  if (!isPdfFile(file)) {
    throw new Error(`${file.name} is not a PDF file.`);
  }

  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const zip = new JSZip();

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Your browser could not prepare the PNG canvas.");
    }

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvas, canvasContext: context, viewport }).promise;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );

    if (!blob) {
      throw new Error(`Could not create PNG for PDF page ${pageNumber}.`);
    }

    zip.file(`page-${pageNumber}.png`, await blob.arrayBuffer());
  }

  return zip.generateAsync({ type: "uint8array" });
}

export function downloadPngZip(bytes: Uint8Array, fileName: string) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  const blob = new Blob([buffer], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
