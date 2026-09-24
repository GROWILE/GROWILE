import { PDFDocument } from "pdf-lib";

export type SignaturePlacement = {
  pageIndex: number;
  imageDataUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export async function signPdf(file: File, placements: SignaturePlacement[]) {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const imageCache = new Map<string, Awaited<ReturnType<PDFDocument["embedPng"]>>>();
  for (const placement of placements) {
    const page = pdf.getPages()[placement.pageIndex];
    if (!page) continue;
    let image = imageCache.get(placement.imageDataUrl);
    if (!image) {
      image = await pdf.embedPng(placement.imageDataUrl);
      imageCache.set(placement.imageDataUrl, image);
    }
    page.drawImage(image, {
      x: Math.max(0, placement.x),
      y: Math.max(0, placement.y),
      width: Math.max(16, placement.width),
      height: Math.max(16, placement.height),
    });
  }
  return pdf.save();
}

export function downloadSignedPdf(bytes: Uint8Array, fileName: string) {
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
