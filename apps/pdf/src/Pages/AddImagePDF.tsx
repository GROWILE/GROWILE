import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, FileImage, RotateCw, Trash2 } from "lucide-react";
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
import { addImageToPdf, downloadAddImagePdf, type ImagePlacement } from "../Utilities/AddImagePDFProcessing";
import "./JPGtoPDF.css";
import "./EditPDF.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

type PreviewPage = { image: string; width: number; height: number };
type DragState = { mode: "move" | "resize"; startX: number; startY: number; placement: ImagePlacement };

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF and open its visual page editor." },
  { number: "2", title: "Upload and edit the image", description: "Drag, resize, rotate, or delete the image overlay on the selected page." },
  { number: "3", title: "Download the PDF", description: "Create and download the final PDF with the image on top of the original content." },
];
const seoBlocks = [
  { heading: "Insert Photo into PDF Online Free", description: "It is extremely easy to insert photo into PDF online free with Growile PDF. Just upload your document, choose your image, and place it anywhere on the page for a clean and professional appearance." },
  { heading: "Paste Image on PDF Document Online Free", description: "Forgot to add a chart? You can easily paste image on PDF document online free. Our tool lets you drag, resize, and perfectly position your visual elements exactly where they belong in the file." },
  { heading: "Add Picture to PDF Online Free", description: "The process is incredibly smooth for everyone. You can add picture to PDF online free by simply uploading your file here. Growile PDF seamlessly embeds your graphics, delivering the updated file." },
];
const faqs = [
  { question: "Is the Growile PDF image insertion tool free?", answer: "Yes, attaching pictures with Growile PDF is completely free. You can insert unlimited photos into your files without any hidden fees." },
  { question: "Can I resize the photo after placing it on the page?", answer: "Absolutely! Once you upload your picture, you can easily drag the corners to resize it and position it perfectly within your document." },
  { question: "Which picture formats can I upload to my document?", answer: "Our tool supports all popular image formats. You can effortlessly upload and insert JPG, PNG, or GIF files into your documents instantly." },
  { question: "Do I need software to paste a picture into my file?", answer: "No installation is needed. You can quickly add visual elements directly from your browser using our online Growile PDF platform securely." },
  { question: "Are my uploaded documents and personal photos safe?", answer: "Your privacy is fully protected. Growile PDF automatically deletes your original file and the inserted pictures from our servers instantly." },
  { question: "Can I use this tool to create a faded background logo?", answer: <>While you can add logos here, we highly recommend using our <a href="/pdf/add-watermark">Add Watermark</a> tool to perfectly fade and center logos across all your pages.</> },
  { question: "What if my file becomes too large after adding pictures?", answer: <>High-quality photos can increase file size. If your document becomes too heavy, just use our <a href="/pdf/compress-pdf">Compress PDF</a> tool to shrink it for sharing.</> },
  { question: "Does this picture tool work on mobile devices?", answer: "Yes, Growile PDF is mobile-friendly. You can easily select photos from your smartphone gallery and insert them into your files on the go." },
];

const initialPlacement: ImagePlacement = { pageIndex: 0, x: 50, y: 50, width: 180, height: 120, rotation: 0 };

export default function AddImagePDF() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [pages, setPages] = useState<PreviewPage[]>([]);
  const [placements, setPlacements] = useState<ImagePlacement[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<Uint8Array | null>(null);
  const [popup, setPopup] = useState(false);

  const placement = placements[activeImage] ?? initialPlacement;
  const update = <K extends keyof ImagePlacement>(key: K, value: ImagePlacement[K]) => {
    setPlacements((current) => current.map((item, index) => index === activeImage ? { ...item, [key]: value } : item));
  };

  const handlePdfSelection = async (files: File[]) => {
    const selected = files[0] ?? null;
    setPdfFile(selected);
    setPages([]);
    setPlacements([]);
    setActiveImage(0);
    setCurrentPage(0);
    setMessage("");
    setError("");
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
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        rendered.push({ image: canvas.toDataURL("image/jpeg", 0.86), width: viewport.width / 0.72, height: viewport.height / 0.72 });
      }
      setPages(rendered);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not read the PDF.");
    }
  };

  const handleImageSelection = async (files: File[]) => {
    const exceededLimit = imageFiles.length + files.length > 10;
    const selected = files.slice(0, 10 - imageFiles.length);
    const startIndex = imageFiles.length;
    if (selected.length === 0) return;
    setImageFiles((current) => [...current, ...selected]);
    setImagePreviews((current) => [...current, ...selected.map((file) => URL.createObjectURL(file))]);
    setPlacements((current) => [
      ...current,
      ...selected.map((_, index) => ({
        ...initialPlacement,
        pageIndex: currentPage,
        x: initialPlacement.x + (startIndex + index) * 12,
        y: initialPlacement.y + (startIndex + index) * 12,
      })),
    ]);
    setActiveImage(startIndex);
    setError(exceededLimit ? "You can upload up to 10 images." : "");
  };

  const handleOverlayPointerDown = (event: React.PointerEvent<HTMLElement>, mode: DragState["mode"]) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ mode, startX: event.clientX, startY: event.clientY, placement });
  };

  const handleOverlayPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!drag || !selectedPage) return;
    event.preventDefault();
    event.stopPropagation();
    const pageElement = event.currentTarget.closest(".pdf-page-canvas");
    if (!(pageElement instanceof HTMLElement)) return;
    const bounds = pageElement.getBoundingClientRect();
    const scaleX = selectedPage.width / bounds.width;
    const scaleY = selectedPage.height / bounds.height;
    const dx = (event.clientX - drag.startX) * scaleX;
    const dy = (event.clientY - drag.startY) * scaleY;
    if (drag.mode === "move") {
      update("x", Math.max(0, Math.min(selectedPage.width - drag.placement.width, drag.placement.x + dx)));
      update("y", Math.max(0, Math.min(selectedPage.height - drag.placement.height, drag.placement.y - dy)));
    } else {
      update("width", Math.max(24, Math.min(selectedPage.width, drag.placement.width + dx)));
      update("height", Math.max(24, Math.min(selectedPage.height, drag.placement.height + dy)));
    }
  };

  const stopDragging = (event: React.PointerEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDrag(null);
  };

  const handlePageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (imageFiles.length === 0 || drag || !selectedPage || placement.pageIndex !== currentPage) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * selectedPage.width - placement.width / 2;
    const yFromTop = ((event.clientY - bounds.top) / bounds.height) * selectedPage.height;
    update("x", Math.max(0, Math.min(selectedPage.width - placement.width, x)));
    update("y", Math.max(0, Math.min(selectedPage.height - placement.height, selectedPage.height - yFromTop - placement.height / 2)));
  };

  const handleAction = async (selected: File) => {
    if (imageFiles.length === 0) {
      setError("Upload at least one image before adding it.");
      return;
    }
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const bytes = await addImageToPdf(selected, imageFiles, placements);
      setPending(bytes);
      setPopup(true);
      setMessage("Image overlay added to the PDF successfully.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not add the image to the PDF.");
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
      <PageMeta title="Add Image to PDF Online Free Instantly - Easy | Growile PDF" description="Use Growile PDF to add image to PDF online free instantly. Easily insert photos or paste images on documents securely. Fast, unlimited, and 100% free tool!" canonicalPath="/pdf/add-image" />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile Add Image to PDF" description="Insert images into PDF documents online." path="/pdf/add-image" />
      <PdfBreadcrumb label="Add Image" path="add-image" />
      <Hero kicker="PDF Editing" title="Add Image to PDF Online Free Instantly" subtitle="Do you need to attach a picture to your digital file? Growile PDF helps you add image to PDF online free instantly in just a few clicks. Whether you are inserting a profile photo or placing a diagram in a report, our tool makes it effortless. You do not need to download heavy software or pay any fees. Enjoy fast, secure, and limitless image insertion directly from your web browser right now." ctaText="Upload PDF" ctaHref="#add-image-upload" />
      <Divider />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="add-image-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FileImage size={30} aria-hidden="true" />}
              title="Add Image to PDF"
              description="Upload one PDF and use the visual editor to place an image overlay."
              buttonLabel="Select PDF file"
              actionLabel={busy ? "Adding image..." : "Add Image"}
              actionDisabled={busy || !pdfFile || imageFiles.length === 0 || !selectedPage}
              accept=".pdf,application/pdf"
              onAction={handleAction}
              onSelectionChange={handlePdfSelection}
              selectedContent={pdfFile ? (
                <div className="pdf-edit-content pdf-image-edit-content">
                  <label className="pdf-edit-file-input pdf-image-upload-control">
                    <span className="pdf-image-upload-label">Image overlay</span>
                    <input type="file" accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp" onChange={(event) => { void handleImageSelection(Array.from(event.target.files ?? [])); }} />
                    <span className="pdf-image-file-name">{imageFiles.length ? `${imageFiles.length} image${imageFiles.length === 1 ? "" : "s"} selected` : "Choose up to 10 JPG, PNG, or WebP images"}</span>
                  </label>
                  <div className="pdf-image-toolbar" aria-label="Image overlay controls">
                    <button type="button" onClick={() => update("rotation", (placement.rotation + 90) % 360)} disabled={!imageFiles.length}><RotateCw size={16} /> Rotate</button>
                    <button type="button" onClick={() => { setImageFiles((current) => current.filter((_, index) => index !== activeImage)); setImagePreviews((current) => current.filter((_, index) => index !== activeImage)); setPlacements((current) => current.filter((_, index) => index !== activeImage)); setActiveImage((current) => Math.max(0, current - 1)); }} disabled={!imageFiles.length}><Trash2 size={16} /> Delete</button>
                    <label>Width <input type="number" min="24" value={Math.round(placement.width)} onChange={(event) => update("width", Number(event.target.value))} /></label>
                    <label>Height <input type="number" min="24" value={Math.round(placement.height)} onChange={(event) => update("height", Number(event.target.value))} /></label>
                  </div>
                  <div className="pdf-image-tabs">{imageFiles.map((file, index) => <button type="button" className={activeImage === index ? "active" : ""} key={`${file.name}-${index}`} onClick={() => setActiveImage(index)}>Image {index + 1}</button>)}</div>
                  <p className="pdf-editor-hint">{imageFiles.length ? "Select an image, then drag it to move it or use the corner handle to resize." : "Upload images to show them as overlays on the page."}</p>
                  <div className="pdf-page-carousel" aria-label="PDF page editor">
                    <button type="button" className="pdf-page-arrow" aria-label="Previous PDF page" disabled={currentPage === 0} onClick={() => setCurrentPage((page) => page - 1)}><ChevronLeft size={24} /></button>
                    {selectedPage && <div className="pdf-page-viewport"><div className="pdf-page-canvas selected" onClick={handlePageClick}>
                      <img src={selectedPage.image} alt={`PDF page ${currentPage + 1}`} />
                      {imageFiles.map((file, index) => { const item = placements[index]; const preview = imagePreviews[index]; if (!item || !preview || item.pageIndex !== currentPage) return null; const style = { left: `${(item.x / selectedPage.width) * 100}%`, bottom: `${(item.y / selectedPage.height) * 100}%`, width: `${(item.width / selectedPage.width) * 100}%`, height: `${(item.height / selectedPage.height) * 100}%`, transform: `rotate(${item.rotation}deg)` }; return <div className={`pdf-image-overlay ${activeImage === index ? "active" : ""}`} style={style} key={`${file.name}-${index}`} onClick={(event) => { event.stopPropagation(); setActiveImage(index); }} onDoubleClick={(event) => event.preventDefault()} onPointerDown={(event) => { setActiveImage(index); handleOverlayPointerDown(event, "move"); }} onPointerMove={activeImage === index ? handleOverlayPointerMove : undefined} onPointerUp={stopDragging} onPointerCancel={stopDragging}><img src={preview} alt={`Image overlay ${index + 1}`} />{activeImage === index && <><button type="button" className="pdf-image-delete" aria-label="Delete image overlay" onPointerDown={(event) => event.stopPropagation()} onClick={() => { setImageFiles((current) => current.filter((_, currentIndex) => currentIndex !== index)); setImagePreviews((current) => current.filter((_, currentIndex) => currentIndex !== index)); setPlacements((current) => current.filter((_, currentIndex) => currentIndex !== index)); setActiveImage(0); }}><Trash2 size={13} /></button><span className="pdf-image-resize" aria-label="Resize image" onPointerDown={(event) => { setActiveImage(index); handleOverlayPointerDown(event, "resize"); }} /></>}</div>; })}
                      <span className="pdf-page-label">Page {currentPage + 1} of {pages.length}</span>
                    </div></div>}
                    <button type="button" className="pdf-page-arrow" aria-label="Next PDF page" disabled={currentPage === pages.length - 1} onClick={() => setCurrentPage((page) => page + 1)}><ChevronRight size={24} /></button>
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
            <PdfIconToolCard toolId="add-text" />
            <PdfIconToolCard toolId="add-signature" />
            <PdfIconToolCard toolId="add-watermark" />
            <PdfIconToolCard toolId="compress-pdf" />
            <PdfIconToolCard toolId="merge-pdf" />
          </div>
        </section>
        <HowToUse heading="How to Add an Image to a PDF" steps={steps} />
        <Divider />
        <H2Section blocks={seoBlocks} />
        <Divider />
        <FAQ heading="Add Image to PDF FAQs" faqs={faqs} />
        <Divider />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: typeof faq.answer === "string" ? faq.answer : "Use the linked PDF tool for this document task." } })) }) }} />
      <PdfToolsFooter /><Footer /><AdSpace className="footer-bottom-ad-space" />
      <DownloadPopup isOpen={popup} onClose={closePopup} onTriggerDownload={() => { if (pending) downloadAddImagePdf(pending, "image-added.pdf"); }} itemName="PDF with image overlay" />
    </>
  );
}
