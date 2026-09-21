import { PDFDocument } from "@cantoo/pdf-lib";

function isPdfFile(file: File) {
  return file.type.toLowerCase() === "application/pdf" || /\.pdf$/i.test(file.name);
}

export async function protectPdf(file: File, password: string): Promise<Uint8Array> {
  if (!isPdfFile(file)) throw new Error(`${file.name} is not a PDF file.`);
  if (password.length < 4) throw new Error("Use a password with at least 4 characters.");

  const pdf = await PDFDocument.load(await file.arrayBuffer());
  pdf.encrypt({
    userPassword: password,
    ownerPassword: password,
    algorithm: "AES-256",
  });
  return pdf.save();
}

export function downloadProtectedPdf(bytes: Uint8Array, fileName: string) {
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
