import { useCallback, useEffect, useState } from "react";
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
import { deletePdfPages, downloadDeletedPagesPdf } from "../Utilities/DeletePDFPagesProcessing";
import "./JPGtoPDF.css";
import "./SplitPDF.css";
import "./ExtractPDFPages.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Choose pages to delete", description: "Click every page you want to remove from the PDF." },
  { number: "3", title: "Delete and download", description: "Create and download a new PDF with the remaining pages." },
];

const seoBlocks = [
  { heading: "Delete PDF Pages Online", description: "Remove unwanted pages from a PDF and create a new document directly in your browser." },
  { heading: "Choose the Pages to Remove", description: "Select any pages in the PDF preview, including non-consecutive pages, before deleting them." },
  { heading: "Simple PDF Page Deletion", description: "Delete PDF pages without installing desktop software or uploading your document to a server." },
];

const faqs = [
  { question: "How do I delete pages from a PDF?", answer: "Upload one PDF, click the pages you want to remove, and click Delete PDF Pages." },
  { question: "Can I delete non-consecutive pages?", answer: "Yes. You can select any combination of pages in the preview." },
  { question: "Can I delete every page?", answer: "No. At least one page must remain in the PDF." },
  { question: "Will the remaining pages keep their order?", answer: "Yes. The remaining pages stay in their original document order." },
  { question: "Can I upload more than one PDF?", answer: "This Delete PDF Pages tool accepts one PDF file at a time." },
  { question: "Will my PDF be uploaded to a server?", answer: "No. The deletion is processed directly in your browser." },
  { question: "Is the Delete PDF Pages tool free?", answer: "Yes. You can delete PDF pages online with Growile for free." },
  { question: "What happens after I click Delete PDF Pages?", answer: "A new PDF containing all pages except the selected pages is created and prepared for download." },
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
  name: "Delete PDF Pages",
  hasPart: seoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

export default function DeletePDFPages() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [pendingPdf, setPendingPdf] = useState<Uint8Array | null>(null);
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);

  const triggerDownload = useCallback(() => {
    if (pendingPdf) downloadDeletedPagesPdf(pendingPdf, "pages-deleted.pdf");
  }, [pendingPdf]);

  const closeDownloadPopup = useCallback(() => {
    setIsDownloadPopupOpen(false);
    setPendingPdf(null);
  }, []);

  const handleSelectionChange = async (files: File[]) => {
    const file = files[0] ?? null;
    setSelectedFile(file);
    setSelectedPages([]);
    setPageCount(0);
    setDeleteMessage("");
    setDeleteError("");
    if (!file) return;

    try {
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      setPageCount(pdf.numPages);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Could not read the PDF pages.");
    }
  };

  const handleAction = async (file: File) => {
    setIsDeleting(true);
    setDeleteMessage("");
    setDeleteError("");

    try {
      const pdfBytes = await deletePdfPages(file, selectedPages);
      setPendingPdf(pdfBytes);
      setIsDownloadPopupOpen(true);
      setDeleteMessage(`${selectedPages.length} page${selectedPages.length === 1 ? "" : "s"} selected for deletion.`);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "PDF page deletion failed.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Delete PDF Pages Online"
        description="Delete unwanted pages from a PDF online with Growile's browser-based Delete PDF Pages tool."
        canonicalPath="/tools/delete-pdf-pages"
      />
      <PdfNavBar />
      <Hero
        kicker="PDF Organization"
        title="Delete PDF Pages"
        subtitle="Select unwanted pages and create a cleaner PDF document."
        ctaText="Upload PDF"
        ctaHref="#delete-pdf-pages-upload"
      />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="delete-pdf-pages-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FileText size={30} aria-hidden="true" />}
              title="Delete PDF Pages"
              description="Select the pages you want to remove from your PDF."
              buttonLabel="Select PDF file"
              actionLabel={isDeleting ? "Deleting..." : "Delete PDF Pages"}
              actionDisabled={isDeleting || selectedPages.length === 0}
              accept=".pdf,application/pdf"
              onAction={handleAction}
              onSelectionChange={handleSelectionChange}
              selectedContent={
                selectedFile && pageCount > 0 ? (
                  <DeletePagePreview
                    file={selectedFile}
                    pageCount={pageCount}
                    selectedPages={selectedPages}
                    onSelectedPagesChange={setSelectedPages}
                  />
                ) : null
              }
              dropHint="or drop one PDF file here"
            />
            <AdSpace variant="vertical" />
          </div>
          {deleteMessage && <p className="jpg-to-pdf-status" role="status">{deleteMessage}</p>}
          {deleteError && <p className="jpg-to-pdf-error" role="alert">{deleteError}</p>}
        </section>
        <HowToUse heading="How to Delete PDF Pages" steps={steps} />
        <H2Section blocks={seoBlocks} />
        <FAQ heading="Delete PDF Pages FAQs" faqs={faqs} />
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
        itemName="updated PDF"
      />
    </>
  );
}

function DeletePagePreview({
  file,
  pageCount,
  selectedPages,
  onSelectedPagesChange,
}: {
  file: File;
  pageCount: number;
  selectedPages: number[];
  onSelectedPagesChange: (pages: number[]) => void;
}) {
  const [pageImages, setPageImages] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const renderPages = async () => {
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
      if (!cancelled) setPageImages(images);
    };
    void renderPages();
    return () => {
      cancelled = true;
    };
  }, [file]);

  const togglePage = (pageNumber: number) => {
    onSelectedPagesChange(
      selectedPages.includes(pageNumber)
        ? selectedPages.filter((page) => page !== pageNumber)
        : [...selectedPages, pageNumber].sort((first, second) => first - second),
    );
  };

  return (
    <div className="split-pdf-preview extract-pdf-preview">
      <div className="split-pdf-preview-heading">
        <strong>PDF pages</strong>
        <span>{selectedPages.length} to delete of {pageCount}</span>
      </div>
      <div className="split-pdf-selection-help" role="status">
        <div className="extract-pdf-selected-count">
          <strong>{selectedPages.length}</strong>
          <span>{selectedPages.length === 1 ? "page selected" : "pages selected"}</span>
        </div>
        <div className="extract-pdf-selection-instruction">
          <strong>Choose the pages to delete</strong>
          <span>Click any page to include or remove it from deletion.</span>
        </div>
      </div>
      <div className="split-pdf-page-grid">
        {pageImages.map((image, index) => {
          const pageNumber = index + 1;
          const isSelected = selectedPages.includes(pageNumber);
          return (
            <button
              type="button"
              className={`split-pdf-page-thumbnail ${isSelected ? "selected" : ""}`}
              key={pageNumber}
              onClick={() => togglePage(pageNumber)}
              aria-pressed={isSelected}
              aria-label={`${isSelected ? "Keep" : "Delete"} page ${pageNumber}`}
            >
              <img src={image} alt={`PDF page ${pageNumber}`} />
              <span>Page {pageNumber}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
