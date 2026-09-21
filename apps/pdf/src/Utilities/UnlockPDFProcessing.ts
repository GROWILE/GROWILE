import { PDFDocument } from "@cantoo/pdf-lib";

function isPdfFile(file: File) {
  return file.type.toLowerCase() === "application/pdf" || /\.pdf$/i.test(file.name);
}

export async function unlockPdf(file: File, password: string): Promise<Uint8Array> {
  if (!isPdfFile(file)) throw new Error(`${file.name} is not a PDF file.`);
  if (!password) throw new Error("Enter the PDF password before unlocking.");

  const pdf = await PDFDocument.load(await file.arrayBuffer(), { password });
  return pdf.save();
}

export function downloadUnlockedPdf(bytes: Uint8Array, fileName: string) {
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
