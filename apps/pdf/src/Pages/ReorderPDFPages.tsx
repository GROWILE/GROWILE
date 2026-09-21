import { useCallback, useState } from "react";
import { FileText } from "lucide-react";
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
import { downloadReorderedPdf, reorderPdfPages } from "../Utilities/ReorderPDFPagesProcessing";
import "./JPGtoPDF.css";
import "./SplitPDF.css";
import "./ExtractPDFPages.css";
import "./ReorderPDFPages.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Arrange the pages", description: "Drag pages or use the left and right arrows to set the order." },
  { number: "3", title: "Reorder and download", description: "Create and download a PDF with your new page order." },
];

const seoBlocks = [
  { heading: "Reorder PDF Pages Online", description: "Arrange PDF pages in the order you need directly in your browser." },
  { heading: "Drag or Move Pages", description: "Drag page thumbnails or use the arrow controls above each page to reorder your document." },
  { heading: "Simple PDF Page Reordering", description: "Reorder PDF pages without installing desktop software or uploading your document to a server." },
];

const faqs = [
  { question: "How do I reorder PDF pages?", answer: "Upload one PDF, drag pages into a new order or use the left and right arrows, then click Reorder PDF." },
  { question: "Can I move pages with arrows?", answer: "Yes. Every page has left and right arrow controls above it for precise positioning." },
  { question: "Will all pages be included?", answer: "Yes. Reordering keeps every page and changes only its position." },
  { question: "Can I drag PDF pages?", answer: "Yes. Drag any page thumbnail and drop it where you want it in the preview." },
  { question: "Can I upload more than one PDF?", answer: "This Reorder PDF Pages tool accepts one PDF file at a time." },
  { question: "Will my PDF be uploaded to a server?", answer: "No. The reordering is processed directly in your browser." },
  { question: "Is the Reorder PDF Pages tool free?", answer: "Yes. You can reorder PDF pages online with Growile for free." },
  { question: "What happens after I click Reorder PDF?", answer: "A new PDF with the arranged page order is created and prepared for download." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const contentSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Reorder PDF Pages",
  hasPart: seoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

export default function ReorderPDFPages() {
  const [isReordering, setIsReordering] = useState(false);
  const [reorderMessage, setReorderMessage] = useState("");
  const [reorderError, setReorderError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [pendingPdf, setPendingPdf] = useState<Uint8Array | null>(null);
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);

  const triggerDownload = useCallback(() => {
    if (pendingPdf) downloadReorderedPdf(pendingPdf, "reordered-pages.pdf");
  }, [pendingPdf]);

  const closeDownloadPopup = useCallback(() => {
    setIsDownloadPopupOpen(false);
    setPendingPdf(null);
  }, []);

  const handleSelectionChange = async (files: File[]) => {
    const file = files[0] ?? null;
    setSelectedFile(file);
    setPageOrder([]);
    setPageImages([]);
    setReorderMessage("");
    setReorderError("");
    if (!file) return;

    try {
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const images: string[] = [];
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 0.35 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        images.push(canvas.toDataURL("image/jpeg", 0.8));
      }
      setPageImages(images);
      setPageOrder(Array.from({ length: pdf.numPages }, (_, index) => index + 1));
    } catch (error) {
      setReorderError(error instanceof Error ? error.message : "Could not read the PDF pages.");
    }
  };

  const handleAction = async (file: File) => {
    setIsReordering(true);
    setReorderMessage("");
    setReorderError("");
    try {
      const pdfBytes = await reorderPdfPages(file, pageOrder);
      setPendingPdf(pdfBytes);
      setIsDownloadPopupOpen(true);
      setReorderMessage("PDF pages reordered successfully.");
    } catch (error) {
      setReorderError(error instanceof Error ? error.message : "PDF page reordering failed.");
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Reorder PDF Pages Online"
        description="Rearrange PDF pages online with Growile's browser-based Reorder PDF Pages tool."
        canonicalPath="/tools/reorder-pdf-pages"
      />
      <PdfNavBar />
      <Hero
        kicker="PDF Organization"
        title="Reorder PDF Pages"
        subtitle="Arrange your PDF pages in the order you need."
        ctaText="Upload PDF"
        ctaHref="#reorder-pdf-pages-upload"
      />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="reorder-pdf-pages-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FileText size={30} aria-hidden="true" />}
              title="Reorder PDF Pages"
              description="Drag pages or use the arrows to arrange your PDF."
              buttonLabel="Select PDF file"
              actionLabel={isReordering ? "Reordering..." : "Reorder PDF"}
              actionDisabled={isReordering || pageOrder.length === 0}
              accept=".pdf,application/pdf"
              onAction={handleAction}
              onSelectionChange={handleSelectionChange}
              selectedContent={
                selectedFile ? (
                  <ReorderPagePreview
                    pageOrder={pageOrder}
                    pageImages={pageImages}
                    onPageOrderChange={setPageOrder}
                  />
                ) : null
              }
              dropHint="or drop one PDF file here"
            />
            <AdSpace variant="vertical" />
          </div>
          {reorderMessage && <p className="jpg-to-pdf-status" role="status">{reorderMessage}</p>}
          {reorderError && <p className="jpg-to-pdf-error" role="alert">{reorderError}</p>}
        </section>
        <HowToUse heading="How to Reorder PDF Pages" steps={steps} />
        <H2Section blocks={seoBlocks} />
        <FAQ heading="Reorder PDF Pages FAQs" faqs={faqs} />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contentSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PdfToolsFooter />
      <Footer />
      <AdSpace className="footer-bottom-ad-space" />
      <DownloadPopup
        isOpen={isDownloadPopupOpen}
        onClose={closeDownloadPopup}
        onTriggerDownload={triggerDownload}
        itemName="reordered PDF"
      />
    </>
  );
}

function ReorderPagePreview({
  pageOrder,
  pageImages,
  onPageOrderChange,
}: {
  pageOrder: number[];
  pageImages: string[];
  onPageOrderChange: (order: number[]) => void;
}) {
  const [draggedPage, setDraggedPage] = useState<number | null>(null);

  const movePage = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= pageOrder.length) return;
    const nextOrder = [...pageOrder];
    [nextOrder[index], nextOrder[targetIndex]] = [nextOrder[targetIndex], nextOrder[index]];
    onPageOrderChange(nextOrder);
  };

  const dropPage = (targetIndex: number) => {
    if (draggedPage === null || draggedPage === targetIndex) return;
    const nextOrder = [...pageOrder];
    const [movedPage] = nextOrder.splice(draggedPage, 1);
    nextOrder.splice(targetIndex, 0, movedPage);
    onPageOrderChange(nextOrder);
    setDraggedPage(null);
  };

  return (
    <div className="split-pdf-preview reorder-pdf-preview">
      <div className="split-pdf-preview-heading">
        <strong>Arrange PDF pages</strong>
        <span>{pageOrder.length} pages</span>
      </div>
      <div className="split-pdf-selection-help" role="status">
        <strong>Reorder the pages</strong>
        <span>Drag a page or use the left and right arrows above each thumbnail.</span>
      </div>
      <div className="split-pdf-page-grid">
        {pageOrder.map((pageNumber, index) => (
          <div
            className="reorder-pdf-page-item"
            key={pageNumber}
            draggable
            onDragStart={() => setDraggedPage(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => dropPage(index)}
          >
            <div className="reorder-pdf-page-controls">
              <button type="button" onClick={() => movePage(index, -1)} disabled={index === 0} aria-label={`Move page ${pageNumber} left`}>←</button>
              <span>Order {index + 1}</span>
              <button type="button" onClick={() => movePage(index, 1)} disabled={index === pageOrder.length - 1} aria-label={`Move page ${pageNumber} right`}>→</button>
            </div>
            <img src={pageImages[pageNumber - 1]} alt={`PDF page ${pageNumber}`} />
            <span>Page {pageNumber}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
