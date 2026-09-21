import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

export type CompressionTarget = "default" | "1mb" | "500kb" | "200kb" | "100kb";

const TARGET_BYTES: Record<Exclude<CompressionTarget, "default">, number> = {
  "1mb": 1024 * 1024,
  "500kb": 500 * 1024,
  "200kb": 200 * 1024,
  "100kb": 100 * 1024,
};

function isPdfFile(file: File) {
  return file.type.toLowerCase() === "application/pdf" || /\.pdf$/i.test(file.name);
}

async function createCompressedPdf(file: File, scale: number, quality: number) {
  const source = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const output = await PDFDocument.create();

  for (let pageNumber = 1; pageNumber <= source.numPages; pageNumber += 1) {
    const page = await source.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not prepare the PDF compression canvas.");

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (!blob) throw new Error(`Could not compress PDF page ${pageNumber}.`);

    const image = await output.embedJpg(await blob.arrayBuffer());
    const outputPage = output.addPage([viewport.width / scale, viewport.height / scale]);
    outputPage.drawImage(image, {
      x: 0,
      y: 0,
      width: viewport.width / scale,
      height: viewport.height / scale,
    });
  }

  return output.save();
}

export async function compressPdf(file: File, target: CompressionTarget): Promise<Uint8Array> {
  if (!isPdfFile(file)) throw new Error(`${file.name} is not a PDF file.`);

  const targetBytes =
    target === "default"
      ? Math.max(1, Math.floor(file.size * 0.25))
      : TARGET_BYTES[target];
  const scales = [1.25, 1, 0.8, 0.6, 0.45];
  const qualities = [0.9, 0.75, 0.6, 0.45, 0.3, 0.2, 0.12];
  let best: Uint8Array | null = null;

  for (const scale of scales) {
    for (const quality of qualities) {
      const candidate = await createCompressedPdf(file, scale, quality);
      if (!best || candidate.byteLength < best.byteLength) best = candidate;
      if (candidate.byteLength <= targetBytes) return candidate;
    }
  }

  if (!best) throw new Error("Could not compress this PDF.");
  return best;
}

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
