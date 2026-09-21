import mammoth from "mammoth";
import JSZip from "jszip";
import ExcelJS from "exceljs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type OfficeFormat = "word" | "excel" | "powerpoint";

function extensionMatches(file: File, extensions: string[]) {
  return extensions.some((extension) => file.name.toLowerCase().endsWith(extension));
}

function wrapText(text: string, maxCharacters = 88) {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > maxCharacters && line) {
      lines.push(line);
      line = word;
    } else {
      line = `${line} ${word}`.trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function extractWordText(file: File) {
  const result = await mammoth.convertToHtml({
    arrayBuffer: await file.arrayBuffer(),
    convertImage: mammoth.images.imgElement((image) =>
      image.read("base64").then((data) =>
        ({ src: `data:${image.contentType};base64,${data}` }),
      ),
    ),
  } as Parameters<typeof mammoth.convertToHtml>[0] & {
    convertImage: ReturnType<typeof mammoth.images.imgElement>;
  });
  return result.value;
}

async function extractExcelText(file: File) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());
  return workbook.worksheets
    .map((sheet) => {
      const rows: string[] = [];
      sheet.eachRow((row) => {
        const values = row.values as unknown[];
        rows.push(values.slice(1).map((value) => String(value ?? "")).join(" | "));
      });
      return `Sheet: ${sheet.name}\n${rows.join("\n")}`;
    })
    .join("\n\n");
}

async function extractPowerPointText(file: File) {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const slidePaths = Object.keys(zip.files)
    .filter((path) => /^ppt\/slides\/slide\d+\.xml$/i.test(path))
    .sort((a, b) => Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0]));
  const slides: string[] = [];
  for (const path of slidePaths) {
    const xml = await zip.file(path)?.async("text");
    if (!xml) continue;
    const text = [...xml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)]
      .map((match) => match[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"))
      .join(" ");
    slides.push(`Slide ${slides.length + 1}\n${text}`);
  }
  return slides.join("\n\n");
}

export async function convertOfficeToPdf(file: File, format: OfficeFormat) {
  const validExtensions = {
    word: [".docx"],
    excel: [".xlsx"],
    powerpoint: [".ppt", ".pptx"],
  }[format];
  if (!extensionMatches(file, validExtensions)) {
    throw new Error(`${file.name} is not a supported ${format} file.`);
  }

  const content =
    format === "word"
      ? await extractWordText(file)
      : format === "excel"
        ? await extractExcelText(file)
        : await extractPowerPointText(file);
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const lines = format === "word"
    ? []
    : wrapText(content || "No readable content found.");
  const linesPerPage = 38;

  if (format === "word") {
    const parser = new DOMParser();
    const root = parser.parseFromString(content || "<p>No readable content found.</p>", "text/html").body;
    let page = pdf.addPage([595, 842]);
    let y = 790;
    const ensureSpace = (height: number) => {
      if (y - height < 45) {
        page = pdf.addPage([595, 842]);
        y = 790;
      }
    };
    const drawLines = (
      text: string,
      size = 11,
      options: { bold?: boolean; before?: number; after?: number; lineHeight?: number } = {},
    ) => {
      const { bold = false, before = 0, after = 8, lineHeight = size + 6 } = options;
      const wrapped = wrapText(text, size >= 16 ? 62 : 88);
      y -= before;
      for (const line of wrapped) {
        ensureSpace(lineHeight);
        page.drawText(line, {
          x: 48,
          y,
          size,
          font: bold ? boldFont : font,
          color: rgb(0.08, 0.08, 0.08),
        });
        y -= lineHeight;
      }
      y -= after;
    };

    for (const element of Array.from(root.children)) {
      if (/^H[1-6]$/i.test(element.tagName)) {
        const headingSizes: Record<string, number> = {
          H1: 22,
          H2: 18,
          H3: 16,
          H4: 14,
          H5: 12,
          H6: 11,
        };
        drawLines(element.textContent || "", headingSizes[element.tagName] || 16, {
          bold: true,
          before: element.tagName === "H1" ? 10 : 8,
          after: 8,
          lineHeight: (headingSizes[element.tagName] || 16) + 6,
        });
      } else if (element.tagName === "P" || element.tagName === "LI") {
        const image = element.querySelector("img");
        if (image?.getAttribute("src")?.startsWith("data:image/")) {
          const source = image.getAttribute("src") || "";
          const [header, encoded] = source.split(",");
          const bytes = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));
          const embedded = header.includes("image/jpeg")
            ? await pdf.embedJpg(bytes)
            : await pdf.embedPng(bytes);
          const scaled = embedded.scale(Math.min(1, 500 / embedded.width));
          ensureSpace(scaled.height + 12);
          page.drawImage(embedded, { x: 48, y: y - scaled.height, width: scaled.width, height: scaled.height });
          y -= scaled.height + 12;
        } else {
          drawLines(element.textContent || "", 11, {
            before: element.tagName === "LI" ? 2 : 5,
            after: element.tagName === "LI" ? 3 : 10,
            lineHeight: 16,
          });
        }
      } else if (element.tagName === "TABLE") {
        const rows = Array.from(element.querySelectorAll("tr"));
        for (const row of rows) {
          const cells = Array.from(row.querySelectorAll("th,td")).map((cell) => cell.textContent?.trim() || "");
          drawLines(cells.join(" | "), 10, {
            before: 2,
            after: 2,
            lineHeight: 14,
          });
        }
        y -= 10;
      } else {
        drawLines(element.textContent || "", 11, { before: 4, after: 8, lineHeight: 16 });
      }
    }
  }

  for (let index = 0; index < lines.length; index += linesPerPage) {
    const page = pdf.addPage([595, 842]);
    page.drawText(lines.slice(index, index + linesPerPage).join("\n"), {
      x: 48,
      y: 785,
      size: 11,
      lineHeight: 19,
      font,
      color: rgb(0.08, 0.08, 0.08),
      maxWidth: 500,
    });
  }

  return pdf.save();
}

export function downloadOfficePdf(bytes: Uint8Array, fileName: string) {
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
