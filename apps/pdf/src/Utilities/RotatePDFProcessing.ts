import { PDFDocument, degrees } from "pdf-lib";

function isPdfFile(file: File) {
  return file.type.toLowerCase() === "application/pdf" || /\.pdf$/i.test(file.name);
}

export async function rotatePdfPages(file: File, rotations: number[]): Promise<Uint8Array> {
  if (!isPdfFile(file)) {
    throw new Error(`${file.name} is not a PDF file.`);
  }

  const sourcePdf = await PDFDocument.load(await file.arrayBuffer());
  if (rotations.length !== sourcePdf.getPageCount()) {
    throw new Error("Every PDF page must have a rotation value.");
  }

  sourcePdf.getPages().forEach((page, index) => {
    page.setRotation(degrees(rotations[index]));
  });

  return sourcePdf.save();
}

export function downloadRotatedPdf(bytes: Uint8Array, fileName: string) {
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
