import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Eraser, FileSignature, Trash2 } from "lucide-react";
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
import { downloadSignedPdf, signPdf, type SignaturePlacement } from "../Utilities/SignPDFProcessing";
import "./PdfUploadLayout.css";
import "./PdfEditorStyles.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

type PreviewPage = { image: string; width: number; height: number };
type SignatureDrag = { offsetX: number; offsetY: number; placementIndex: number; placement: SignaturePlacement };
const initialSize = { width: 180, height: 80 };
const steps = [
  { number: "1", title: "Draw your signature", description: "Use the signature pad to draw your signature." },
  { number: "2", title: "Upload a PDF and place it", description: "Place the signature on any page where it is needed." },
  { number: "3", title: "Download the signed PDF", description: "Export a copy with your signature as an image overlay." },
];
const faqs = [
  { question: "Is the Growile PDF signing tool totally free?", answer: "Yes, authorizing documents with Growile PDF is 100% free. You can sign unlimited contracts and invoices without paying any hidden fees." },
  { question: "Can I draw my name using my smartphone screen?", answer: "Absolutely! Our tool is fully touch-optimized. You can easily use your finger or a stylus to draw your handwriting directly on your screen." },
  { question: "Can I upload a picture of my real handwriting?", answer: "Yes, if you already have a scanned picture of your handwriting, you can upload it into our tool and place it seamlessly on the dotted line." },
  { question: "Do I need an app to sign my digital contracts?", answer: "No software is needed. You can quickly approve official paperwork directly from your web browser using our secure online Growile PDF tool." },
  { question: "Are my uploaded contracts and private marks safe?", answer: "Your privacy is strictly protected. Growile PDF automatically deletes your original paperwork and the signed file from our servers instantly." },
  { question: "How can I prevent others from altering my signed file?", answer: <>After approving your document, we highly recommend using our <a href="/pdf/protect-pdf">Protect PDF</a> tool to lock the file with a password for maximum legal security.</> },
  { question: "What if I also need to type the date next to my name?", answer: <>If your contract requires a printed date or printed name, simply use our <a href="/pdf/add-text">Add Text</a> tool to type those details before or after signing.</> },
  { question: "Does this electronic signer work on mobile devices?", answer: "Yes, Growile PDF is mobile-friendly. You can comfortably approve urgent business contracts on the go using any Android or iOS smartphone." },
];

export default function AddSignature() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PreviewPage[]>([]);
  const [signature, setSignature] = useState("");
  const [placements, setPlacements] = useState<SignaturePlacement[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const draggedSignatureRef = useRef(false);
  const [signatureDrag, setSignatureDrag] = useState<SignatureDrag | null>(null);
  const signatureDragRef = useRef<SignatureDrag | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<Uint8Array | null>(null);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.lineWidth = 2.5;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#111827";
  }, []);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
  };
  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const context = canvas.getContext("2d");
    if (!context) return;
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    const bounds = canvas.getBoundingClientRect();
    context.beginPath();
    context.moveTo((event.clientX - bounds.left) * (canvas.width / bounds.width), (event.clientY - bounds.top) * (canvas.height / bounds.height));
    drawingRef.current = true;
    lastPointRef.current = {
      x: (event.clientX - bounds.left) * (canvas.width / bounds.width),
      y: (event.clientY - bounds.top) * (canvas.height / bounds.height),
    };
  };
  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = event.currentTarget;
    const context = canvas.getContext("2d");
    if (!context) return;
    event.preventDefault();
    const bounds = canvas.getBoundingClientRect();
    const nextPoint = {
      x: (event.clientX - bounds.left) * (canvas.width / bounds.width),
      y: (event.clientY - bounds.top) * (canvas.height / bounds.height),
    };
    const lastPoint = lastPointRef.current ?? nextPoint;
    context.quadraticCurveTo(lastPoint.x, lastPoint.y, (lastPoint.x + nextPoint.x) / 2, (lastPoint.y + nextPoint.y) / 2);
    context.stroke();
    lastPointRef.current = nextPoint;
  };
  const finishDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    drawingRef.current = false;
    lastPointRef.current = null;
    setSignature(event.currentTarget.toDataURL("image/png"));
  };

  const handleSelection = async (files: File[]) => {
    const selected = files[0] ?? null;
    setFile(selected); setPages([]); setPlacements([]); setCurrentPage(0); setMessage(""); setError("");
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
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not read the PDF."); }
  };

  const placeSignature = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!signature || !pages[currentPage] || signatureDrag || draggedSignatureRef.current) {
      draggedSignatureRef.current = false;
      return;
    }
    const hasPageSignature = placements.some((item) => item.pageIndex === currentPage);
    const isMobile = window.matchMedia("(max-width: 600px)").matches;
    if (hasPageSignature && !isMobile && event.detail < 2) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const page = pages[currentPage];
    const width = Math.min(initialSize.width, page.width);
    const height = Math.min(initialSize.height, page.height);
    const x = Math.max(0, Math.min(page.width - width, ((event.clientX - bounds.left) / bounds.width) * page.width - width / 2));
    const y = Math.max(0, Math.min(page.height - height, page.height - ((event.clientY - bounds.top) / bounds.height) * page.height - height / 2));
    setPlacements((current) => [...current, { pageIndex: currentPage, imageDataUrl: signature, x, y, width, height }]);
  };
  const handleSignaturePointerDown = (event: React.PointerEvent<HTMLDivElement>, placementToDrag: SignaturePlacement, placementIndex: number) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const pageElement = event.currentTarget.closest(".pdf-page-canvas");
    if (!(pageElement instanceof HTMLElement) || !page) return;
    const bounds = pageElement.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) * (page.width / bounds.width);
    const pointerY = page.height - (event.clientY - bounds.top) * (page.height / bounds.height);
    const nextDrag = {
      offsetX: pointerX - placementToDrag.x,
      offsetY: pointerY - placementToDrag.y,
      placementIndex,
      placement: placementToDrag,
    };
    signatureDragRef.current = nextDrag;
    setSignatureDrag(nextDrag);
  };
  const handleSignaturePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const activeDrag = signatureDragRef.current;
    if (!activeDrag || !page) return;
    event.preventDefault();
    event.stopPropagation();
    draggedSignatureRef.current = true;
    const pageElement = event.currentTarget.closest(".pdf-page-canvas");
    if (!(pageElement instanceof HTMLElement)) return;
    const bounds = pageElement.getBoundingClientRect();
    const scaleX = page.width / bounds.width;
    const scaleY = page.height / bounds.height;
    const pointerX = (event.clientX - bounds.left) * scaleX;
    const pointerY = page.height - (event.clientY - bounds.top) * scaleY;
    const nextX = Math.max(0, Math.min(page.width - activeDrag.placement.width, pointerX - activeDrag.offsetX));
    const nextY = Math.max(0, Math.min(page.height - activeDrag.placement.height, pointerY - activeDrag.offsetY));
    event.currentTarget.style.left = `${(nextX / page.width) * 100}%`;
    event.currentTarget.style.top = `${((page.height - nextY - activeDrag.placement.height) / page.height) * 100}%`;
  };
  const handleSignaturePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!signatureDragRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    if (draggedSignatureRef.current) {
      window.setTimeout(() => {
        draggedSignatureRef.current = false;
      }, 250);
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const pageElement = event.currentTarget.closest(".pdf-page-canvas");
    if (pageElement instanceof HTMLElement && page) {
      const bounds = pageElement.getBoundingClientRect();
      const scaleX = page.width / bounds.width;
      const scaleY = page.height / bounds.height;
      const pointerX = (event.clientX - bounds.left) * scaleX;
      const pointerY = page.height - (event.clientY - bounds.top) * scaleY;
      const activeDrag = signatureDragRef.current;
      if (activeDrag) {
        const nextX = Math.max(0, Math.min(page.width - activeDrag.placement.width, pointerX - activeDrag.offsetX));
        const nextY = Math.max(0, Math.min(page.height - activeDrag.placement.height, pointerY - activeDrag.offsetY));
        setPlacements((current) => current.map((item, index) => index === activeDrag.placementIndex ? { ...item, x: nextX, y: nextY } : item));
      }
    }
    signatureDragRef.current = null;
    setSignatureDrag(null);
  };
  const preventPageSelection = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const handlePageDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(max-width: 600px)").matches) placeSignature(event);
    else preventPageSelection(event);
  };
  const removePlacement = (placementIndex: number) => setPlacements((current) => current.filter((_, index) => index !== placementIndex));
  const handleAction = async (selected: File) => {
    if (!signature || !placements.length) { setError("Draw a signature and place it on at least one page."); return; }
    setBusy(true); setMessage(""); setError("");
    try { const bytes = await signPdf(selected, placements); setPending(bytes); setPopup(true); setMessage("Signature added to the PDF successfully."); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Could not sign the PDF."); }
    finally { setBusy(false); }
  };
  const closePopup = useCallback(() => { setPopup(false); setPending(null); }, []);
  const page = pages[currentPage];
  const pagePlacements = placements.map((item, index) => ({ item, index })).filter(({ item }) => item.pageIndex === currentPage);

  return (
    <>
      <PageMeta title="Add Signature to PDF Online Free - Secure | Growile PDF" description="Use Growile PDF to add signature to PDF online free. Easily draw or insert an electronic signature in your document. Safe, fast, and 100% free signer tool!" canonicalPath="/pdf/add-signature" />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile Add Signature to PDF" description="Add an electronic signature to PDF documents online." path="/pdf/add-signature" />
      <PdfBreadcrumb label="Add Signature" path="add-signature" />
      <Hero kicker="PDF Editing" title="Add Signature to PDF Online Free" subtitle="Do you need to sign paperwork without printing it out? Growile PDF helps you add signature to PDF online free in just a few clicks. Whether you are authorizing a business contract or approving an invoice, our tool creates legally binding marks. You do not need to install software or pay subscription fees. Enjoy fast, secure, and limitless electronic signing right from your web browser today." ctaText="Upload PDF" ctaHref="#add-signature-upload" />
      <Divider />
      <main className="jpg-to-pdf-page"><section className="jpg-to-pdf-upload-section" id="add-signature-upload"><div className="jpg-to-pdf-upload-layout">
        <FileUploadBox className="jpg-to-pdf-upload-box" icon={<FileSignature size={30} aria-hidden="true" />} title="Add Signature to PDF" description="Draw your signature, then upload a PDF and click a page to place it." buttonLabel="Select PDF file" actionLabel={busy ? "Preparing PDF..." : "Download Signed PDF"} actionDisabled={busy || !file || !signature || !placements.length} accept=".pdf,application/pdf" onAction={handleAction} onSelectionChange={handleSelection} selectedContent={file ? (
          <div className="pdf-edit-content pdf-sign-edit-content">
            <div className="pdf-signature-pad-wrap"><div className="pdf-signature-pad-heading"><strong>Draw signature</strong><button type="button" onClick={clearSignature}><Eraser size={15} /> Clear</button></div><canvas ref={canvasRef} width={600} height={180} className="pdf-signature-pad" onPointerDown={startDrawing} onPointerMove={draw} onPointerUp={finishDrawing} onPointerCancel={finishDrawing} /><p>Use your mouse or touch to draw.</p></div>
            <p className="pdf-editor-hint">{signature ? "Click to place on mobile. On desktop, double-click to add another signature. Clear the pad to draw a different signature." : "Draw your signature above first."}</p>
            <div className="pdf-page-carousel" aria-label="PDF signature editor"><button type="button" className="pdf-page-arrow" aria-label="Previous PDF page" disabled={currentPage === 0} onClick={() => setCurrentPage((value) => value - 1)}><ChevronLeft size={24} /></button>{page && <div className="pdf-page-viewport"><div className="pdf-page-canvas selected pdf-signature-page-canvas" onClick={placeSignature} onDoubleClick={handlePageDoubleClick}><img src={page.image} alt={`PDF page ${currentPage + 1}`} />{pagePlacements.map(({ item, index }) => <div className="pdf-signature-preview" key={`${item.pageIndex}-${index}`} style={{ left: `${(item.x / page.width) * 100}%`, top: `${((page.height - item.y - item.height) / page.height) * 100}%`, width: `${(item.width / page.width) * 100}%`, height: `${(item.height / page.height) * 100}%` }} onPointerDown={(event) => handleSignaturePointerDown(event, item, index)} onPointerMove={handleSignaturePointerMove} onPointerUp={handleSignaturePointerUp} onPointerCancel={handleSignaturePointerUp} onClick={(event) => event.stopPropagation()}><img src={item.imageDataUrl} alt={`Signature ${index + 1}`} /><button type="button" className="pdf-signature-delete" aria-label={`Delete signature ${index + 1}`} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); removePlacement(index); }}><Trash2 size={14} /></button></div>)}<span className="pdf-page-label">Page {currentPage + 1} of {pages.length}</span></div></div>}<button type="button" className="pdf-page-arrow" aria-label="Next PDF page" disabled={currentPage === pages.length - 1} onClick={() => setCurrentPage((value) => value + 1)}><ChevronRight size={24} /></button></div>
            <p className="pdf-signature-count">{placements.length} signature{placements.length === 1 ? "" : "s"} placed</p>
          </div>
        ) : null} dropHint="or drop one PDF file here" /><AdSpace variant="vertical" /></div>{message && <p className="jpg-to-pdf-status" role="status">{message}</p>}{error && <p className="jpg-to-pdf-error" role="alert">{error}</p>}</section><section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title"><h2 id="related-pdf-tools-title">More PDF Tools</h2><div className="pdf-related-tools-grid pdf-related-tools-grid-five"><PdfIconToolCard toolId="add-text" /><PdfIconToolCard toolId="protect-pdf" /><PdfIconToolCard toolId="add-watermark" /><PdfIconToolCard toolId="compress-pdf" /><PdfIconToolCard toolId="highlight-pdf" /></div></section><HowToUse heading="How to Add a Signature to a PDF" steps={steps} /><Divider /><H2Section blocks={[{ heading: "Sign PDF Document Online Free", description: "It is incredibly simple to sign PDF document online free with Growile PDF. Just upload your paperwork, create your custom mark, and place it exactly on the dotted line for a professional finish." }, { heading: "Draw Signature on PDF Online Free", description: "Prefer a handwritten touch? You can easily draw signature on PDF online free using your mouse or touchscreen. Our tool accurately captures your unique handwriting, making your digital file official." }, { heading: "Insert Electronic Signature in PDF Free", description: "The approval process is highly efficient. You can insert electronic signature in PDF free by simply uploading your file. Growile PDF seamlessly embeds your mark, delivering your signed file fast." }]} /><Divider /><FAQ heading="Add Signature to PDF FAQs" faqs={faqs} /><Divider /></main>
      <PdfToolsFooter /><Footer /><AdSpace className="footer-bottom-ad-space" /><DownloadPopup isOpen={popup} onClose={closePopup} onTriggerDownload={() => { if (pending) downloadSignedPdf(pending, "signed-pdf.pdf"); }} itemName="Signed PDF" />
    </>
  );
}
