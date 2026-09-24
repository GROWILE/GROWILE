import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, FileText, RotateCcw } from "lucide-react";
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
import SoftwareApplicationSchema from "../../../../packages/ui/src/SoftwareApplicationSchema";
import PdfBreadcrumb from "./PdfBreadcrumb";
import PdfToolsFooter from "./toolsFooter";
import PdfIconToolCard from "./IconToolCard";
import Divider from "../../../../packages/ui/src/Divider";
import { addWatermarkToPdf, downloadWatermarkPdf, type WatermarkOptions, type WatermarkPlacement } from "../Utilities/WatermarkPDFProcessing";
import "./JPGtoPDF.css";
import "./EditPDF.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();
type PreviewPage = { image: string; width: number; height: number };
const colors = ["#6b7280", "#111827", "#dc2626", "#2563eb", "#16a34a", "#9333ea"];
const initialOptions: WatermarkOptions = { text: "CONFIDENTIAL", color: colors[0], opacity: 0.3, fontSize: 42, angle: 0, allPages: true };
const steps = [
  { number: "1", title: "Upload a PDF", description: "Select a PDF to preview its watermark." },
  { number: "2", title: "Customize the watermark", description: "Enter text, choose color, opacity, size, angle, and position." },
  { number: "3", title: "Download the PDF", description: "Create a copy with the watermark overlay." },
];
const faqs = [
  { question: "Is the Growile PDF watermarking tool free?", answer: "Yes, branding your documents with Growile PDF is 100% free. You can stamp unlimited files to protect your ownership without paying any fees." },
  { question: "Can I adjust the transparency of my stamp?", answer: "Absolutely! You can easily control the opacity level. This ensures your stamp is visible enough for protection but faded enough for reading." },
  { question: "Will the stamp be applied to every single page?", answer: "Yes, our tool automatically applies your custom text or logo across every sheet in your document, saving you immense time and effort." },
  { question: "Do I need software to brand my business reports?", answer: "No installation is required. You can quickly secure and brand your files directly from your web browser using our online Growile PDF tool." },
  { question: "Are my uploaded files and branded documents secure?", answer: "Your data is entirely safe. Growile PDF automatically deletes your original file and the newly stamped document from our secure servers." },
  { question: "What is the difference between this and adding an image?", answer: <>This tool fades and repeats a graphic across all pages. To insert a normal, solid picture on a specific page, please use our <a href="/pdf/add-image">Add Image</a> tool.</> },
  { question: "How can I stop people from removing my stamp?", answer: <>To ensure ultimate security, after applying your stamp, use our <a href="/pdf/protect-pdf">Protect PDF</a> tool to lock the file so no one can edit or remove your branding.</> },
  { question: "Does this document stamping tool work on mobile?", answer: "Yes, Growile PDF is mobile-friendly. You can effortlessly brand your confidential drafts using your smartphone while traveling for business." },
];

export default function WatermarkPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PreviewPage[]>([]);
  const [options, setOptions] = useState(initialOptions);
  const [placements, setPlacements] = useState<WatermarkPlacement[]>([]);
  const [draftPosition, setDraftPosition] = useState({ xRatio: 0.5, yRatio: 0.5 });
  const [currentPage, setCurrentPage] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<Uint8Array | null>(null);
  const [popup, setPopup] = useState(false);
  const [draggingWatermark, setDraggingWatermark] = useState(false);
  const update = <K extends keyof WatermarkOptions>(key: K, value: WatermarkOptions[K]) => setOptions((current) => ({ ...current, [key]: value }));

  const handleSelection = async (files: File[]) => {
    const selected = files[0] ?? null;
    setFile(selected); setPages([]); setPlacements([]); setDraftPosition({ xRatio: 0.5, yRatio: 0.5 }); setCurrentPage(0); setMessage(""); setError("");
    if (!selected) return;
    try {
      const pdf = await pdfjsLib.getDocument({ data: await selected.arrayBuffer() }).promise;
      const rendered: PreviewPage[] = [];
      for (let number = 1; number <= pdf.numPages; number += 1) {
        const page = await pdf.getPage(number);
        const viewport = page.getViewport({ scale: 0.72 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;
        canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        rendered.push({ image: canvas.toDataURL("image/jpeg", 0.86), width: viewport.width / 0.72, height: viewport.height / 0.72 });
      }
      setPages(rendered);
      setPlacements([{ pageIndex: 0, xRatio: 0.5, yRatio: 0.5 }]);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not read the PDF."); }
  };

  const handlePageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const page = pages[currentPage];
    if (!page) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const xRatio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const yRatio = Math.max(0, Math.min(1, 1 - (event.clientY - bounds.top) / bounds.height));
    setDraftPosition({ xRatio, yRatio });
    if (placements.some((placement) => placement.pageIndex === currentPage)) {
      setPlacements((current) => current.map((placement) => placement.pageIndex === currentPage ? { ...placement, xRatio, yRatio } : placement));
    }
  };
  const placeOnCurrentPage = () => {
    const existing = placements.find((placement) => placement.pageIndex === currentPage);
    if (existing) return;
    setPlacements((current) => [...current, { pageIndex: currentPage, ...draftPosition }]);
  };
  const getPointerPosition = (event: React.PointerEvent<HTMLSpanElement>) => {
    const pageElement = event.currentTarget.closest(".pdf-page-canvas");
    const page = pages[currentPage];
    if (!(pageElement instanceof HTMLElement) || !page) return null;
    const bounds = pageElement.getBoundingClientRect();
    return {
      xRatio: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)),
      yRatio: Math.max(0, Math.min(1, 1 - (event.clientY - bounds.top) / bounds.height)),
    };
  };
  const handleWatermarkPointerDown = (event: React.PointerEvent<HTMLSpanElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingWatermark(true);
    const position = getPointerPosition(event);
    if (position) {
      setDraftPosition(position);
      setPlacements((current) => current.map((item) => item.pageIndex === currentPage ? { ...item, ...position } : item));
    }
  };
  const handleWatermarkPointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (!draggingWatermark) return;
    event.preventDefault();
    event.stopPropagation();
    const position = getPointerPosition(event);
    if (!position) return;
    setDraftPosition(position);
    setPlacements((current) => current.map((item) => item.pageIndex === currentPage ? { ...item, ...position } : item));
  };
  const handleWatermarkPointerUp = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (!draggingWatermark) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const position = getPointerPosition(event);
    if (position) {
      setDraftPosition(position);
      setPlacements((current) => current.some((item) => item.pageIndex === currentPage)
        ? current.map((item) => item.pageIndex === currentPage ? { ...item, ...position } : item)
        : [...current, { pageIndex: currentPage, ...position }]);
    }
    setDraggingWatermark(false);
  };
  const changePage = (pageIndex: number) => {
    const target = placements.find((placement) => placement.pageIndex === pageIndex) ?? placements[0];
    if (target) setDraftPosition({ xRatio: target.xRatio, yRatio: target.yRatio });
    setCurrentPage(pageIndex);
  };
  const handleAction = async (selected: File) => {
    setBusy(true); setMessage(""); setError("");
    try {
      const bytes = await addWatermarkToPdf(selected, options, placements);
      setPending(bytes); setPopup(true); setMessage("Watermark added to the PDF successfully.");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not add the watermark."); }
    finally { setBusy(false); }
  };
  const closePopup = useCallback(() => { setPopup(false); setPending(null); }, []);
  const page = pages[currentPage];
  const placement = placements.find((item) => item.pageIndex === currentPage);
  const previewPlacement = placement ?? { ...draftPosition, pageIndex: currentPage };
  const previewStyle = page ? { left: `${previewPlacement.xRatio * 100}%`, top: `${(1 - previewPlacement.yRatio) * 100}%`, color: options.color, opacity: options.opacity, fontSize: `${Math.max(12, options.fontSize * 0.72)}px`, transform: `translate(-50%, -50%) rotate(${options.angle}deg)` } : undefined;

  return (
    <>
      <PageMeta title="Add Watermark to PDF Online Free - Fast | Growile PDF" description="Use Growile PDF to add watermark to PDF online free. Easily insert transparent text or a logo watermark securely. Fast, reliable, and 100% free online tool." canonicalPath="/pdf/add-watermark" />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile Add Watermark to PDF" description="Add watermarks to PDF documents online." path="/pdf/add-watermark" />
      <PdfBreadcrumb label="Add Watermark" path="add-watermark" />
      <Hero kicker="PDF Editing" title="Add Watermark to PDF Online Free" subtitle="Do you want to protect your digital files from unauthorized copying? Growile PDF helps you add watermark to PDF online free in just seconds. Whether you are stamping a confidential draft or branding a report with your logo, our tool ensures your ownership is visible. You do not need software or paid plans. Experience fast, secure, and limitless document branding directly from your web browser." ctaText="Upload PDF" ctaHref="#watermark-pdf-upload" />
      <Divider />
      <main className="jpg-to-pdf-page"><section className="jpg-to-pdf-upload-section" id="watermark-pdf-upload"><div className="jpg-to-pdf-upload-layout">
        <FileUploadBox className="jpg-to-pdf-upload-box" icon={<FileText size={30} aria-hidden="true" />} title="Add Watermark to PDF" description="Create a text overlay without replacing the original PDF content." buttonLabel="Select PDF file" actionLabel={busy ? "Preparing PDF..." : "Download Watermarked PDF"} actionDisabled={busy || !file || !page || !options.text.trim() || !placements.length} accept=".pdf,application/pdf" onAction={handleAction} onSelectionChange={handleSelection} selectedContent={file ? (
          <div className="pdf-edit-content pdf-watermark-edit-content">
            <div className="pdf-watermark-toolbar" aria-label="Watermark controls">
              <label className="pdf-watermark-text">Watermark text<input value={options.text} onChange={(event) => update("text", event.target.value)} placeholder="Enter watermark text" /></label>
              <fieldset><legend>Color</legend><div className="pdf-color-options">{colors.map((item) => <button type="button" key={item} className={`pdf-color-swatch ${options.color === item ? "selected" : ""}`} style={{ backgroundColor: item }} aria-label={`Choose ${item}`} onClick={() => update("color", item)} />)}</div></fieldset>
              <label>Opacity<input type="range" min="0.1" max="0.9" step="0.05" value={options.opacity} onChange={(event) => update("opacity", Number(event.target.value))} /><span>{Math.round(options.opacity * 100)}%</span></label>
              <label>Size<input type="range" min="12" max="96" step="1" value={options.fontSize} onChange={(event) => update("fontSize", Number(event.target.value))} /><span>{options.fontSize}px</span></label>
              <label>Angle<input type="range" min="-45" max="45" step="1" value={options.angle} onChange={(event) => update("angle", Number(event.target.value))} /><span>{options.angle}ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°</span></label>
              <label className="pdf-watermark-check"><input type="checkbox" checked={options.allPages} onChange={(event) => update("allPages", event.target.checked)} /> Apply to all pages</label>
              <button type="button" className="pdf-watermark-reset" onClick={() => setOptions(initialOptions)}><RotateCcw size={15} /> Reset</button>
            </div>
            <p className="pdf-editor-hint">Click anywhere on the page to position the watermark. It will be added as a new overlay.</p>
            <div className="pdf-page-carousel" aria-label="PDF watermark editor">
              <button type="button" className="pdf-page-arrow" aria-label="Previous PDF page" disabled={currentPage === 0} onClick={() => changePage(currentPage - 1)}><ChevronLeft size={24} /></button>
              {page && <div className="pdf-page-viewport"><div className="pdf-page-canvas selected" onClick={handlePageClick} onDoubleClick={(event) => event.preventDefault()}><img src={page.image} alt={`PDF page ${currentPage + 1}`} /><span className={`pdf-watermark-preview ${placement ? "placed" : "pending"}`} style={previewStyle} onPointerDown={handleWatermarkPointerDown} onPointerMove={handleWatermarkPointerMove} onPointerUp={handleWatermarkPointerUp} onPointerCancel={handleWatermarkPointerUp}>{options.text || "Watermark"}{!placement && <button type="button" className="pdf-watermark-place" aria-label={`Place watermark on page ${currentPage + 1}`} onClick={(event) => { event.stopPropagation(); placeOnCurrentPage(); }}>ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“</button>}</span><span className="pdf-page-label">Page {currentPage + 1} of {pages.length}</span></div></div>}
              <button type="button" className="pdf-page-arrow" aria-label="Next PDF page" disabled={currentPage === pages.length - 1} onClick={() => changePage(currentPage + 1)}><ChevronRight size={24} /></button>
            </div>
          </div>
        ) : null} dropHint="or drop one PDF file here" />
        <AdSpace variant="vertical" /></div>
        {message && <p className="jpg-to-pdf-status" role="status">{message}</p>}{error && <p className="jpg-to-pdf-error" role="alert">{error}</p>}
      </section><section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title"><h2 id="related-pdf-tools-title">More PDF Tools</h2><div className="pdf-related-tools-grid pdf-related-tools-grid-five"><PdfIconToolCard toolId="protect-pdf" /><PdfIconToolCard toolId="add-signature" /><PdfIconToolCard toolId="add-image" /><PdfIconToolCard toolId="compress-pdf" /><PdfIconToolCard toolId="merge-pdf" /></div></section><HowToUse heading="How to Add a Watermark to a PDF" steps={steps} /><Divider /><H2Section blocks={[{ heading: "Insert Transparent Watermark in PDF Free", description: "It is very simple to insert transparent watermark in PDF free using Growile PDF. Upload your file, type your text, and adjust the fading level so it protects your work without blocking the content." }, { heading: "Add Logo Watermark to PDF Online Free", description: "Building brand awareness? You can easily add logo watermark to PDF online free. Our intuitive platform lets you upload your company badge and place it elegantly across all your document pages quickly." }, { heading: "Stamp PDF Document Online Free", description: "The branding process is completely hassle-free. You can stamp PDF document online free by simply dropping your file here. Growile PDF rapidly applies your secure marks and prepares your new file." }]} /><Divider /><FAQ heading="Add Watermark to PDF FAQs" faqs={faqs} /><Divider /></main>
      <PdfToolsFooter /><Footer /><AdSpace className="footer-bottom-ad-space" />
      <DownloadPopup isOpen={popup} onClose={closePopup} onTriggerDownload={() => { if (pending) downloadWatermarkPdf(pending, "watermarked-pdf.pdf"); }} itemName="Watermarked PDF" />
    </>
  );
}
