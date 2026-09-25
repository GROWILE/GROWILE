// Processes add image pdf for PDF files.
import { PDFDocument, degrees } from "pdf-lib";

export type ImagePlacement = {
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

// Adds image to pdf.
export async function addImageToPdf(pdfFile: File, imageFiles: File[], placements: ImagePlacement[]): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(await pdfFile.arrayBuffer());
  for (const [index, imageFile] of imageFiles.entries()) {
    const placement = placements[index];
    const page = pdf.getPages()[placement.pageIndex];
    if (!page) throw new Error("Select a valid PDF page.");
    const isPng = imageFile.type === "image/png" || /\.png$/i.test(imageFile.name);
    const isWebp = imageFile.type === "image/webp" || /\.webp$/i.test(imageFile.name);
    const imageBytes = isWebp ? await convertImageToPng(imageFile) : await imageFile.arrayBuffer();
    const image = isPng || isWebp ? await pdf.embedPng(imageBytes) : await pdf.embedJpg(imageBytes);
    page.drawImage(image, {
      x: Math.max(0, placement.x),
      y: Math.max(0, placement.y),
      width: Math.max(10, placement.width),
      height: Math.max(10, placement.height),
      rotate: degrees(placement.rotation),
    });
  }
  return pdf.save();
}

// Converts image to png.
async function convertImageToPng(file: File): Promise<ArrayBuffer> {
  const image = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not prepare the WebP image.");
  context.drawImage(image, 0, 0);
  image.close();
  const blob = await new Promise<Blob | null>(/* Handles blob work. */ (resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Could not convert the WebP image.");
  return blob.arrayBuffer();
}

// Downloads add image pdf.
export function downloadAddImagePdf(bytes: Uint8Array, fileName: string) {
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
