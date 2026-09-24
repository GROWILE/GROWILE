import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, FilePenLine, Trash2, Undo2 } from "lucide-react";
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
import { downloadHighlightPdf, highlightPdf, type HighlightPlacement } from "../Utilities/HighlightPDFProcessing";
import "./JPGtoPDF.css";
import "./EditPDF.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

type PreviewPage = { image: string; width: number; height: number };
type DragState = { startX: number; startY: number };
const colors = ["#facc15", "#f97316", "#4ade80", "#60a5fa", "#f472b6", "#c084fc"];
const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF to open its visual page editor." },
  { number: "2", title: "Draw your highlights", description: "Choose a color and drag across text or any area on one or more pages." },
  { number: "3", title: "Download the PDF", description: "Export a copy with transparent highlight overlays." },
];
const seoBlocks = [
  { heading: "Annotate PDF Document Online Free", description: "It is highly intuitive to annotate PDF document online free using Growile PDF. Just upload your file, select the bright colors you prefer, and smoothly draw over the crucial lines for easy reading." },
  { heading: "Add Highlights to PDF Online Free", description: "Reading a long report? You can quickly add highlights to PDF online free. Our smart platform allows you to emphasize key data points seamlessly, ensuring you never miss vital information again." },
  { heading: "Markup PDF Files Online Free", description: "The editing process is totally stress-free. You can markup PDF files online free by simply dropping your document here. Growile PDF applies your colorful strokes and prepares the file instantly." },
];
const faqs = [
  { question: "Is the Growile PDF highlighter tool completely free?", answer: "Yes, marking up your files with Growile PDF is 100% free. You can emphasize unlimited sentences without paying any subscription fees." },
  { question: "Can I choose different colors for my annotations?", answer: "Absolutely! Our tool provides a vibrant color palette, allowing you to color-code different sections of your document for better studying." },
  { question: "Will the highlighted text remain readable?", answer: "Yes, the markup acts like a real fluorescent marker. It applies a bright, semi-transparent color over the words, keeping them fully readable." },
  { question: "Do I need an app to annotate my study materials?", answer: "No installation is required. You can easily draw over important paragraphs directly from your web browser using our Growile PDF tool." },
  { question: "Are my uploaded files and annotated documents safe?", answer: "Your data is entirely secure. Growile PDF automatically deletes your original document and the marked-up file from our servers quickly." },
  { question: "Can I type extra study notes next to my highlights?", answer: <>This tool is specifically for drawing marker lines. If you need to type extra paragraphs or notes, please use our <a href="/pdf/add-text">Add Text</a> tool instead.</> },
  { question: "What if I only want to keep the marked pages?", answer: <>Once you finish annotating, you can save the file and then use our <a href="/pdf/extract-pdf-pages">Extract PDF Pages</a> tool to pull out only the pages containing your notes.</> },
  { question: "Does this markup tool work well on smartphones?", answer: "Yes, Growile PDF is highly mobile-friendly. You can easily use your touchscreen to swipe and mark important text on your Android or iOS device." },
];

export default function HighlightPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PreviewPage[]>([]);
  const [highlights, setHighlights] = useState<HighlightPlacement[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [color, setColor] = useState(colors[0]);
  const [opacity, setOpacity] = useState(0.35);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<Uint8Array | null>(null);
  const [popup, setPopup] = useState(false);

  const renderPreview = async (selected: File) => {
    const pdf = await pdfjsLib.getDocument({ data: await selected.arrayBuffer() }).promise;
    const rendered: PreviewPage[] = [];
    for (let number = 1; number <= pdf.numPages; number += 1) {
      const page = await pdf.getPage(number);
      const viewport = page.getViewport({ scale: 0.72 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) continue;
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvas, canvasContext: context, viewport }).promise;
      rendered.push({ image: canvas.toDataURL("image/jpeg", 0.86), width: viewport.width / 0.72, height: viewport.height / 0.72 });
    }
    setPages(rendered);
  };

  const handleSelection = async (files: File[]) => {
    const selected = files[0] ?? null;
    setFile(selected);
    setPages([]);
    setHighlights([]);
    setSelectedHighlight(null);
    setCurrentPage(0);
    setMessage("");
    setError("");
    if (!selected) return;
    try {
      await renderPreview(selected);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not read the PDF.");
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const page = pages[currentPage];
    if (!page) return;
    event.preventDefault();
    const bounds = event.currentTarget.getBoundingClientRect();
    setDrag({ startX: (event.clientX - bounds.left) * (page.width / bounds.width), startY: (event.clientY - bounds.top) * (page.height / bounds.height) });
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const finishDrawing = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    event.preventDefault();
    const page = pages[currentPage];
    const bounds = event.currentTarget.getBoundingClientRect();
    const endX = (event.clientX - bounds.left) * (page.width / bounds.width);
    const endY = (event.clientY - bounds.top) * (page.height / bounds.height);
    const x = Math.max(0, Math.min(drag.startX, endX));
    const top = Math.max(0, Math.min(drag.startY, endY));
    const width = Math.min(page.width - x, Math.abs(endX - drag.startX));
    const height = Math.min(page.height - top, Math.abs(endY - drag.startY));
    if (width >= 8 && height >= 8) {
      setHighlights((current) => {
        const next = [...current, { pageIndex: currentPage, x, y: page.height - top - height, width, height }];
        setSelectedHighlight(next.length - 1);
        return next;
      });
    }
    setDrag(null);
  };

  const preventPageSelection = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeSelected = () => {
    if (selectedHighlight === null) return;
    setHighlights((current) => current.filter((_, index) => index !== selectedHighlight));
    setSelectedHighlight(null);
  };
  const undo = () => {
    setHighlights((current) => current.slice(0, -1));
    setSelectedHighlight(null);
  };

  const handleAction = async (selected: File) => {
    if (!highlights.length) {
      setError("Draw at least one highlight before downloading.");
      return;
    }
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const bytes = await highlightPdf(selected, highlights, color, opacity);
      setPending(bytes);
      setPopup(true);
      setMessage("Highlights added to the PDF successfully.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not highlight the PDF.");
    } finally {
      setBusy(false);
    }
  };

  const closePopup = useCallback(() => {
    setPopup(false);
    setPending(null);
  }, []);
  const selectedPage = pages[currentPage];

  return (
    <>
      <PageMeta title="Highlight Text in PDF Online Free - Markup | Growile PDF" description="Use Growile PDF to highlight text in PDF online free. Easily annotate documents and markup PDF files securely. Fast, safe, and 100% free highlighting tool!" canonicalPath="/pdf/highlight-pdf" />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile Highlight PDF" description="Highlight text in PDF documents online." path="/pdf/highlight-pdf" />
      <PdfBreadcrumb label="Highlight PDF" path="highlight-pdf" />
      <Hero kicker="PDF Editing" title="Highlight Text in PDF Online Free" subtitle="Do you want to mark important sentences in your study materials? Growile PDF helps you highlight text in PDF online free in just seconds. Whether you need to annotate a research paper or emphasize a contract clause, our tool makes it simple. You do not have to install any apps or pay hidden charges. Enjoy fast, secure, and unlimited document markup directly from your web browser very easily." ctaText="Upload PDF" ctaHref="#highlight-pdf-upload" />
      <Divider />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="highlight-pdf-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FilePenLine size={30} aria-hidden="true" />}
              title="Highlight PDF"
              description="Upload one PDF and draw transparent highlight overlays without changing its original text."
              buttonLabel="Select PDF file"
              actionLabel={busy ? "Preparing PDF..." : "Download Highlighted PDF"}
              actionDisabled={busy || !file || !highlights.length || !selectedPage}
              accept=".pdf,application/pdf"
              onAction={handleAction}
              onSelectionChange={handleSelection}
              selectedContent={file ? (
                <div className="pdf-edit-content pdf-highlight-edit-content">
                  <div className="pdf-highlight-toolbar" aria-label="Highlight controls">
                    <fieldset><legend>Highlight color</legend><div className="pdf-color-options">{colors.map((item) => <button type="button" key={item} className={`pdf-color-swatch ${color === item ? "selected" : ""}`} style={{ backgroundColor: item }} aria-label={`Choose ${item} highlight`} aria-pressed={color === item} onClick={() => setColor(item)} />)}</div></fieldset>
                    <label>Opacity<input type="range" min="0.1" max="0.9" step="0.05" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} /><span>{Math.round(opacity * 100)}%</span></label>
                    <div className="pdf-highlight-actions"><button type="button" onClick={undo} disabled={!highlights.length}><Undo2 size={16} /> Undo</button><button type="button" onClick={removeSelected} disabled={selectedHighlight === null}><Trash2 size={16} /> Delete selected</button></div>
                  </div>
                  <p className="pdf-editor-hint">Drag across text or any area to add a highlight. Click a highlight to select it for deletion.</p>
                  <div className="pdf-page-carousel" aria-label="PDF highlight editor">
                    <button type="button" className="pdf-page-arrow" aria-label="Previous PDF page" disabled={currentPage === 0} onClick={() => { setCurrentPage((page) => page - 1); setSelectedHighlight(null); }}><ChevronLeft size={24} /></button>
                    {selectedPage && <div className="pdf-page-viewport"><div className="pdf-page-canvas selected" onPointerDown={handlePointerDown} onPointerUp={finishDrawing} onDoubleClick={preventPageSelection}>
                      <img src={selectedPage.image} alt={`PDF page ${currentPage + 1}`} />
                      {highlights.map((item, index) => item.pageIndex === currentPage ? <button type="button" key={`${item.pageIndex}-${index}`} className={`pdf-highlight-overlay ${selectedHighlight === index ? "active" : ""}`} style={{ left: `${(item.x / selectedPage.width) * 100}%`, top: `${((selectedPage.height - item.y - item.height) / selectedPage.height) * 100}%`, width: `${(item.width / selectedPage.width) * 100}%`, height: `${(item.height / selectedPage.height) * 100}%`, backgroundColor: color, opacity }} aria-label={`Highlight ${index + 1}`} onPointerDown={(event) => { event.stopPropagation(); setSelectedHighlight(index); }} /> : null)}
                      <span className="pdf-page-label">Page {currentPage + 1} of {pages.length}</span>
                    </div></div>}
                    <button type="button" className="pdf-page-arrow" aria-label="Next PDF page" disabled={currentPage === pages.length - 1} onClick={() => { setCurrentPage((page) => page + 1); setSelectedHighlight(null); }}><ChevronRight size={24} /></button>
                  </div>
                  <p className="pdf-highlight-count">{highlights.length} highlight{highlights.length === 1 ? "" : "s"} added</p>
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
            <PdfIconToolCard toolId="add-text" />
            <PdfIconToolCard toolId="add-signature" />
            <PdfIconToolCard toolId="compress-pdf" />
            <PdfIconToolCard toolId="protect-pdf" />
            <PdfIconToolCard toolId="add-image" />
          </div>
        </section>
        <HowToUse heading="How to Highlight a PDF" steps={steps} />
        <Divider />
        <H2Section blocks={seoBlocks} />
        <Divider />
        <FAQ heading="Highlight PDF FAQs" faqs={faqs} />
        <Divider />
      </main>
      <PdfToolsFooter />
      <Footer />
      <AdSpace className="footer-bottom-ad-space" />
      <DownloadPopup isOpen={popup} onClose={closePopup} onTriggerDownload={() => { if (pending) downloadHighlightPdf(pending, "highlighted-pdf.pdf"); }} itemName="Highlighted PDF" />
    </>
  );
}
