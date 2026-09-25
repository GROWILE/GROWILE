// Converts PDF content to Word documents.
import { Document, ImageRun, Packer, Paragraph } from "docx";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

// Checks pdf file.
function isPdfFile(file: File) {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

// Converts pdf to word.
export async function convertPdfToWord(file: File): Promise<Blob> {
  if (!isPdfFile(file)) {
    throw new Error(`${file.name} is not a PDF file.`);
  }

  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const sections = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = globalThis.document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Your browser could not prepare the Word document.");
    }

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvas, canvasContext: context, viewport }).promise;

    const imageBlob = await new Promise<Blob | null>(/* Handles image blob work. */ (resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );

    if (!imageBlob) {
      throw new Error(`Could not prepare PDF page ${pageNumber} for Word.`);
    }

    const imageBuffer = await imageBlob.arrayBuffer();
    const imageWidth = 600;
    const imageHeight = Math.round((imageWidth / viewport.width) * viewport.height);

    sections.push({
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children: [
        new Paragraph({
          children: [
            new ImageRun({
              data: new Uint8Array(imageBuffer),
              type: "png",
              transformation: { width: imageWidth, height: imageHeight },
            }),
          ],
          pageBreakBefore: pageNumber > 1,
          spacing: { after: 0 },
        }),
      ],
    });
  }

  const wordDocument = new Document({
    sections,
  });

  return Packer.toBlob(wordDocument);
}

// Downloads word file.
export function downloadWordFile(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
