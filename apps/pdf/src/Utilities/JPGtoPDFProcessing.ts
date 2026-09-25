// Converts JPG images to PDF files.
import { PDFDocument } from "pdf-lib";

const JPEG_TYPES = new Set(["image/jpeg", "image/jpg"]);
const PAGE_MARGIN = 50;

// Checks jpeg file.
function isJpegFile(file: File) {
  return (
    JPEG_TYPES.has(file.type.toLowerCase()) ||
    /\.(jpe?g)$/i.test(file.name)
  );
}

// Converts jpg files to pdf.
export async function convertJpgFilesToPdf(files: File[]): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error("Select at least one JPG image before converting.");
  }

  for (const file of files) {
    if (!isJpegFile(file)) {
      throw new Error(`${file.name} is not a JPG image.`);
    }
  }

  const pdf = await PDFDocument.create();
  const imageBytes = await Promise.all(files.map(/* Builds a value for each item in the collection. */ (file) => file.arrayBuffer()));
  const images = await Promise.all(
    imageBytes.map(/* Builds a value for each item in the collection. */ (bytes) => pdf.embedJpg(bytes)),
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

// Downloads pdf.
export function downloadPdf(bytes: Uint8Array, fileName: string) {
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
