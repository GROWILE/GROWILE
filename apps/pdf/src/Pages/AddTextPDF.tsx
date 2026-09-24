import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, Type } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import AdSpace from "../../../../packages/ui/src/AdSpace";
import FAQ from "../../../../packages/ui/src/FAQ";
import DownloadPopup from "../../../../packages/ui/src/DownloadPopup";
import FileUploadBox from "../../../../packages/ui/src/toolsUi/fileUploadBox";
import Footer from "../../../../packages/ui/src/Footer";
import H2Section from "../../../../packages/ui/src/H2Section";
import Hero from "../../../../packages/ui/src/Hero";
import HowToUse from "../../../../packages/ui/src/HowToUse";
import PageMeta from "../../../../packages/ui/src/PageMeta";
import PdfNavBar from "./NavBar";
import PdfToolsFooter from "./toolsFooter";
import PdfIconToolCard from "./IconToolCard";
import Divider from "../../../../packages/ui/src/Divider";
import {
  addTextToPdf,
  downloadAddTextPdf,
  type TextPlacement,
} from "../Utilities/AddTextPDFProcessing";
import "./JPGtoPDF.css";
import "./EditPDF.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

type PreviewPage = {
  image: string;
  width: number;
  height: number;
};

const colors = ["#111827", "#dc2626", "#2563eb", "#16a34a", "#9333ea", "#ea580c"];
const fontFamilies = [
  { value: "Helvetica", label: "Helvetica" },
  { value: "TimesRoman", label: "Times Roman" },
  { value: "Courier", label: "Courier" },
  { value: "Arial", label: "Arial" },
  { value: "Georgia", label: "Georgia" },
  { value: "Verdana", label: "Verdana" },
  { value: "Trebuchet", label: "Trebuchet MS" },
] as const;
const weights = [
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "bold", label: "Bold" },
] as const;

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file to open its page editor." },
  { number: "2", title: "Type and click a page", description: "Enter text, choose its style, and click exactly where it should appear." },
  { number: "3", title: "Download the PDF", description: "Create and download the updated document." },
];
const seoBlocks = [
  { heading: "Insert Text into PDF Online Free", description: "It is incredibly simple to insert text into PDF online free with Growile PDF. Just upload your file, click anywhere on the page, and start typing. Your new words will perfectly blend into the file." },
  { heading: "Type on PDF Document Online Free", description: "Have a scanned file? You can easily type on PDF document online free. Our intuitive platform lets you place words exactly where you need them, allowing you to update important reports effortlessly." },
  { heading: "Fill Out PDF Form Online Free", description: "Dealing with digital paperwork? You can seamlessly fill out PDF form online free using our tool. Simply click on the blank fields, type your details, and download your completed document instantly." },
];
const faqs = [
  { question: "Is the Growile PDF typing tool completely free?", answer: "Yes, adding words to your files with Growile PDF is 100% free. You can type on unlimited documents without paying any subscription fees." },
  { question: "Can I change the font style and size of my text?", answer: "Absolutely! Our tool allows you to easily adjust the font family, size, and color of your inserted words to match the original document." },
  { question: "Can I use this tool to fill out government forms?", answer: "Yes, you can easily click on blank fields and type your information to cleanly fill out official applications or digital paperwork." },
  { question: "Do I need an app to insert paragraphs into my file?", answer: "No installation is required. You can quickly add text directly from your web browser using our online Growile PDF platform easily." },
  { question: "Are my uploaded forms and typed documents safe?", answer: "Your data is perfectly safe. Growile PDF automatically deletes your original file and the updated document from our secure servers quickly." },
  { question: "What if I also need to add my handwritten signature?", answer: <>If your form requires a signature after you type your details, you can easily use our <a href="/tools/add-signature">Add Signature</a> tool to make the document official.</> },
  { question: "Can I insert a company logo using this specific tool?", answer: <>This tool is strictly for typing words. If you need to attach a picture or logo, please use our <a href="/tools/add-image">Add Image</a> tool for the best results.</> },
  { question: "Does this typing tool work on mobile smartphones?", answer: "Yes, Growile PDF is mobile-friendly. You can comfortably tap, type, and fill out forms on your Android or iOS device while on the move." },
];

const initialPlacement: TextPlacement = {
  pageIndex: 0,
  text: "",
  x: 50,
  y: 50,
  fontSize: 18,
  color: colors[0],
  fontFamily: "Helvetica",
  fontWeight: "normal",
};

export default function AddTextPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PreviewPage[]>([]);
  const [placement, setPlacement] = useState<TextPlacement>(initialPlacement);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<Uint8Array | null>(null);
  const [popup, setPopup] = useState(false);
  const [zoom, setZoom] = useState(1);

  const update = <K extends keyof TextPlacement>(key: K, value: TextPlacement[K]) => {
    setPlacement((current) => ({ ...current, [key]: value }));
  };

  const renderPreview = async (selected: File) => {
    const pdf = await pdfjsLib.getDocument({ data: await selected.arrayBuffer() }).promise;
    const renderedPages: PreviewPage[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 0.72 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) continue;
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvas, canvasContext: context, viewport }).promise;
      renderedPages.push({
        image: canvas.toDataURL("image/jpeg", 0.86),
        width: viewport.width / 0.72,
        height: viewport.height / 0.72,
      });
    }
    setPages(renderedPages);
  };

  const handleSelection = async (files: File[]) => {
    const selected = files[0] ?? null;
    setFile(selected);
    setPages([]);
    setPlacement(initialPlacement);
    setZoom(1);
    setMessage("");
    setError("");
    if (!selected) return;
    try {
      await renderPreview(selected);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not read the PDF.");
    }
  };

  const handlePageClick = (
    event: React.MouseEvent<HTMLDivElement>,
    pageIndex: number,
    page: PreviewPage,
  ) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * page.width;
    const yFromTop = ((event.clientY - bounds.top) / bounds.height) * page.height;
    update("pageIndex", pageIndex);
    update("x", Math.max(0, Math.min(page.width, x)));
    update("y", Math.max(0, Math.min(page.height, page.height - yFromTop)));
  };

  const handleAction = async (selected: File) => {
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const bytes = await addTextToPdf(selected, placement);
      setPending(bytes);
      setPopup(true);
      setMessage("Text added to the PDF successfully.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not add text to the PDF.");
    } finally {
      setBusy(false);
    }
  };

  const closePopup = useCallback(() => {
    setPopup(false);
    setPending(null);
  }, []);

  const selectedPage = pages[placement.pageIndex];
  const previewStyle = selectedPage
    ? {
        left: `${(placement.x / selectedPage.width) * 100}%`,
        top: `${((selectedPage.height - placement.y) / selectedPage.height) * 100}%`,
      }
    : undefined;

  return (
    <>
      <PageMeta title="Add Text to PDF Document Online Free - Fast | Growile PDF" description="Use Growile PDF to add text to PDF document online free. Easily insert text, type on pages, or fill out PDF forms safely. Fast, secure, and 100% free!" canonicalPath="/tools/add-text" />
      <PdfNavBar />
      <Hero kicker="PDF Editing" title="Add Text to PDF Document Online Free" subtitle="Do you need to update a document but cannot edit it? Growile PDF helps you add text to PDF document online free in just seconds. Whether you need to fill forms, type notes, or insert paragraphs, our tool makes it easy. You do not have to install software or pay fees. Enjoy fast, secure, and unlimited typing directly on your files right from your web browser without any complex steps today." ctaText="Upload PDF" ctaHref="#add-text-upload" />
      <Divider />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="add-text-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<Type size={30} aria-hidden="true" />}
              title="Add Text to PDF"
              description="Upload one PDF to open the visual page editor."
              buttonLabel="Select PDF file"
              actionLabel={busy ? "Adding text..." : "Add Text"}
              actionDisabled={busy || !file || !placement.text.trim() || !selectedPage}
              accept=".pdf,application/pdf"
              onAction={handleAction}
              onSelectionChange={handleSelection}
              selectedContent={file ? (
                <div className="pdf-edit-content pdf-text-edit-content">
                  <div className="pdf-text-toolbar" aria-label="Text formatting controls">
                    <label className="pdf-toolbar-text">Text
                      <input value={placement.text} onChange={(event) => update("text", event.target.value)} placeholder="Type text, then click a page" />
                    </label>
                    <label>Font size
                      <select value={placement.fontSize} onChange={(event) => update("fontSize", Number(event.target.value))}>
                        {[12, 14, 16, 18, 20, 24, 28, 32, 40].map((size) => <option value={size} key={size}>{size}px</option>)}
                      </select>
                    </label>
                    <label>Font style
                      <select value={placement.fontFamily} onChange={(event) => update("fontFamily", event.target.value as TextPlacement["fontFamily"])}>
                        {fontFamilies.map((font) => <option value={font.value} key={font.value}>{font.label}</option>)}
                      </select>
                    </label>
                    <label>Weight
                      <select value={placement.fontWeight} onChange={(event) => update("fontWeight", event.target.value as TextPlacement["fontWeight"])}>
                        {weights.map((weight) => <option value={weight.value} key={weight.value}>{weight.label}</option>)}
                      </select>
                    </label>
                    <div className="pdf-color-picker"><div className="pdf-color-options">{colors.map((color) => <button type="button" key={color} className={`pdf-color-swatch ${placement.color === color ? "selected" : ""}`} style={{ backgroundColor: color }} aria-label={`Choose ${color}`} aria-pressed={placement.color === color} onClick={() => update("color", color)} />)}</div></div>
                  </div>
                  <p className="pdf-editor-hint">{placement.text.trim() ? "Click anywhere on a page to place your text." : "Type your text above, then click anywhere on a page."}</p>
                  <div className="pdf-page-carousel" aria-label="PDF page editor">
                    <button type="button" className="pdf-page-arrow" aria-label="Previous PDF page" disabled={placement.pageIndex === 0} onClick={() => update("pageIndex", placement.pageIndex - 1)}>
                      <ChevronLeft size={24} aria-hidden="true" />
                    </button>
                    {selectedPage && (
                      <div className="pdf-page-viewport">
                        <div className="pdf-page-canvas selected" style={{ transform: `scale(${zoom})` }} role="button" tabIndex={0} onClick={(event) => handlePageClick(event, placement.pageIndex, selectedPage)}>
                          <img src={selectedPage.image} alt={`PDF page ${placement.pageIndex + 1}`} />
                          {placement.text.trim() && <span className="pdf-live-text" style={{ ...previewStyle, fontSize: `${Math.max(10, placement.fontSize * 0.72)}px`, color: placement.color, fontFamily: ["Georgia", "TimesRoman"].includes(placement.fontFamily) ? "Georgia, serif" : placement.fontFamily === "Courier" ? "monospace" : "Arial, sans-serif", fontWeight: placement.fontWeight === "bold" ? 700 : placement.fontWeight === "medium" ? 500 : 400 }}>{placement.text}</span>}
                          <span className="pdf-page-label">Page {placement.pageIndex + 1} of {pages.length}</span>
                        </div>
                      </div>
                    )}
                    <button type="button" className="pdf-page-arrow" aria-label="Next PDF page" disabled={placement.pageIndex === pages.length - 1} onClick={() => update("pageIndex", placement.pageIndex + 1)}>
                      <ChevronRight size={24} aria-hidden="true" />
                    </button>
                  </div>
                  <div className="pdf-zoom-controls" aria-label="Page zoom controls">
                    <button type="button" onClick={() => setZoom((current) => Math.max(0.75, Number((current - 0.25).toFixed(2))))} disabled={zoom <= 0.75}>−</button>
                    <span>{Math.round(zoom * 100)}%</span>
                    <button type="button" onClick={() => setZoom((current) => Math.min(2.5, Number((current + 0.25).toFixed(2))))} disabled={zoom >= 2.5}>+</button>
                    <button type="button" className="pdf-zoom-reset" onClick={() => setZoom(1)} disabled={zoom === 1}>Reset</button>
                  </div>
                </div>
              ) : null}
              dropHint="or drop one PDF file here"
            />
            <AdSpace variant="vertical" />
          </div>
          {message && <p className="jpg-to-pdf-status" role="status">{message}</p>}
          {error && <p className="jpg-to-pdf-error" role="alert">{error}</p>}
        </section>
        <section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title">
          <h2 id="related-pdf-tools-title">More PDF Tools</h2>
          <div className="pdf-related-tools-grid pdf-related-tools-grid-five">
            <PdfIconToolCard toolId="add-signature" />
            <PdfIconToolCard toolId="add-image" />
            <PdfIconToolCard toolId="highlight-pdf" />
            <PdfIconToolCard toolId="add-watermark" />
            <PdfIconToolCard toolId="compress-pdf" />
          </div>
        </section>
        <HowToUse heading="How to Add Text to a PDF" steps={steps} />
        <Divider />
        <H2Section blocks={seoBlocks} />
        <Divider />
        <FAQ heading="Add Text to PDF FAQs" faqs={faqs} />
        <Divider />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: typeof faq.answer === "string" ? faq.answer : "Use the linked PDF tool for this document task." } })) }) }} />
      <PdfToolsFooter />
      <Footer />
      <AdSpace className="footer-bottom-ad-space" />
      <DownloadPopup isOpen={popup} onClose={closePopup} onTriggerDownload={() => { if (pending) downloadAddTextPdf(pending, "text-added.pdf"); }} itemName="PDF with added text" />
    </>
  );
}
