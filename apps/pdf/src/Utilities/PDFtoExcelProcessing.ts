import ExcelJS from "exceljs";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

function isPdfFile(file: File) {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return globalThis.btoa(binary);
}

export async function convertPdfToExcel(file: File): Promise<Blob> {
  if (!isPdfFile(file)) {
    throw new Error(`${file.name} is not a PDF file.`);
  }

  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Growile";
  workbook.created = new Date();
  const worksheet = workbook.addWorksheet("PDF Content");

  worksheet.columns = [
    { header: "Page", key: "page", width: 12 },
    { header: "Extracted content", key: "content", width: 90 },
    { header: "Source preview", key: "preview", width: 28 },
  ];
  worksheet.getRow(1).font = { bold: true };
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  let rowNumber = 2;

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const textItems = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .filter(Boolean);
    const pageText = textItems.join(" ").replace(/\s+/g, " ").trim();

    worksheet.addRow({
      page: `Page ${pageNumber}`,
      content: pageText || "[No selectable text found on this page]",
    });
    worksheet.getCell(`B${rowNumber}`).alignment = {
      wrapText: true,
      vertical: "top",
    };

    const viewport = page.getViewport({ scale: 1.25 });
    const canvas = globalThis.document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Your browser could not prepare the Excel workbook.");
    }

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    const previewBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );

    if (!previewBlob) {
      throw new Error(`Could not prepare PDF page ${pageNumber} for Excel.`);
    }

    const imageBytes = new Uint8Array(await previewBlob.arrayBuffer());
    const imageId = workbook.addImage({
      base64: `data:image/png;base64,${bytesToBase64(imageBytes)}`,
      extension: "png",
    });
    worksheet.addImage(imageId, {
      tl: { col: 3, row: rowNumber - 1 },
      ext: { width: 300, height: Math.round((300 / viewport.width) * viewport.height) },
    });
    worksheet.getRow(rowNumber).height = 190;
    rowNumber += 1;
  }

  const output = await workbook.xlsx.writeBuffer();
  const buffer = new ArrayBuffer(output.byteLength);
  new Uint8Array(buffer).set(new Uint8Array(output));
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export function downloadExcelFile(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
