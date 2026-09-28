// Compresses PDF files.
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

// Checks pdf file.
function isPdfFile(file: File) {
  return file.type.toLowerCase() === "application/pdf" || /\.pdf$/i.test(file.name);
}

const COMPRESSION_PROFILES = [
  { scale: 1, quality: 0.58 },
  { scale: 0.65, quality: 0.28 },
] as const;
const TARGET_SIZE_RATIO = 0.55;

// Creates an image-based PDF at the requested visual quality.
async function createCompressedPdf(
  source: pdfjsLib.PDFDocumentProxy,
  scale: number,
  quality: number,
) {
  const output = await PDFDocument.create();

  for (let pageNumber = 1; pageNumber <= source.numPages; pageNumber += 1) {
    const page = await source.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    let blob: Blob | null;
    try {
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Your browser could not prepare the PDF compression canvas.");

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvas, canvasContext: context, viewport }).promise;
      blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality),
      );
    } finally {
      canvas.width = 0;
      canvas.height = 0;
      page.cleanup();
    }
    if (!blob) throw new Error(`Could not compress PDF page ${pageNumber}.`);

    const image = await output.embedJpg(await blob.arrayBuffer());
    const pageWidth = viewport.width / scale;
    const pageHeight = viewport.height / scale;
    const outputPage = output.addPage([pageWidth, pageHeight]);
    outputPage.drawImage(image, { x: 0, y: 0, width: pageWidth, height: pageHeight });
  }

  return output.save({ useObjectStreams: true });
}

// Compresses pdf.
export async function compressPdf(file: File): Promise<{ bytes: Uint8Array; targetMet: boolean }> {
  if (!isPdfFile(file)) throw new Error(`${file.name} is not a PDF file.`);

  const source = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const targetBytes = file.size * TARGET_SIZE_RATIO;
  let smallestCandidate: Uint8Array | null = null;

  try {
    for (const profile of COMPRESSION_PROFILES) {
      const candidate = await createCompressedPdf(source, profile.scale, profile.quality);

      if (!smallestCandidate || candidate.byteLength < smallestCandidate.byteLength) {
        smallestCandidate = candidate;
      }

      if (candidate.byteLength <= targetBytes) break;
    }
  } finally {
    await source.destroy();
  }

  const bytes = smallestCandidate;
  if (!bytes) throw new Error("Could not compress this PDF.");
  if (bytes.byteLength >= file.size) {
    throw new Error("This PDF could not be reduced at the selected quality limit.");
  }

  return { bytes, targetMet: bytes.byteLength <= targetBytes };
}

// Downloads compressed pdf.
export function downloadCompressedPdf(bytes: Uint8Array, fileName: string) {
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
