import { PDFDocument } from "pdf-lib";

const PAGE_MARGIN = 50;

function isPngFile(file: File) {
  return file.type.toLowerCase() === "image/png" || /\.png$/i.test(file.name);
}

export async function convertPngFilesToPdf(files: File[]): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error("Select at least one PNG image before converting.");
  }

  for (const file of files) {
    if (!isPngFile(file)) {
      throw new Error(`${file.name} is not a PNG image.`);
    }
  }

  const pdf = await PDFDocument.create();
  const imageBytes = await Promise.all(files.map((file) => file.arrayBuffer()));
  const images = await Promise.all(
    imageBytes.map((bytes) => pdf.embedPng(bytes)),
  );

  for (const image of images) {
    const { width, height } = image.scale(1);
    const page = pdf.addPage([
      width + PAGE_MARGIN * 2,
      height + PAGE_MARGIN * 2,
    ]);

    page.drawImage(image, {
      x: PAGE_MARGIN,
      y: PAGE_MARGIN,
      width,
      height,
    });
  }

  return pdf.save();
}

export function downloadPngPdf(bytes: Uint8Array, fileName: string) {
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
