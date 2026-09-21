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
import { downloadExtractedPdf, extractPdfPages } from "../Utilities/ExtractPDFPagesProcessing";
import "./JPGtoPDF.css";
import "./SplitPDF.css";
import "./ExtractPDFPages.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Choose pages", description: "Click the pages you want to include in the new PDF." },
  { number: "3", title: "Extract and download", description: "Create and download a new PDF containing only the selected pages." },
];

const seoBlocks = [
  { heading: "Extract PDF Pages Online", description: "Select specific pages from a PDF and create a new PDF document directly in your browser." },
  { heading: "Choose Only the Pages You Need", description: "Select any pages from your PDF preview, including non-consecutive pages such as 2, 5, and 8." },
  { heading: "Simple PDF Page Extraction", description: "Extract pages without installing desktop software or uploading your document to a server." },
];

const faqs = [
  { question: "How do I extract pages from a PDF?", answer: "Upload one PDF, click the pages you want in the preview, and click Extract PDF." },
  { question: "Can I select non-consecutive pages?", answer: "Yes. You can select pages such as 2, 5, and 8 in any order." },
  { question: "Will the selected pages keep their original order?", answer: "Yes. The extracted PDF keeps the selected pages in their original document order." },
  { question: "Can I select all PDF pages?", answer: "Yes. Click every page in the preview to create a copy containing all selected pages." },
  { question: "Can I upload more than one PDF?", answer: "This Extract PDF Pages tool accepts one PDF file at a time." },
  { question: "Will my PDF be uploaded to a server?", answer: "No. The extraction is processed directly in your browser." },
  { question: "Is the Extract PDF Pages tool free?", answer: "Yes. You can extract PDF pages online with Growile for free." },
  { question: "What happens after I click Extract PDF?", answer: "A new PDF containing only your selected pages is created and prepared for download." },
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
  name: "Extract PDF Pages",
  hasPart: seoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

export default function ExtractPDFPages() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractMessage, setExtractMessage] = useState("");
  const [extractError, setExtractError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [pendingPdf, setPendingPdf] = useState<Uint8Array | null>(null);
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);

  const triggerDownload = useCallback(() => {
    if (pendingPdf) downloadExtractedPdf(pendingPdf, "extracted-pages.pdf");
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
    setExtractMessage("");
    setExtractError("");
    if (!file) return;

    try {
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      setPageCount(pdf.numPages);
    } catch (error) {
      setExtractError(error instanceof Error ? error.message : "Could not read the PDF pages.");
    }
  };

  const handleAction = async (file: File) => {
    setIsExtracting(true);
    setExtractMessage("");
    setExtractError("");

    try {
      const pdfBytes = await extractPdfPages(file, selectedPages);
      setPendingPdf(pdfBytes);
      setIsDownloadPopupOpen(true);
      setExtractMessage(`${selectedPages.length} page${selectedPages.length === 1 ? "" : "s"} extracted successfully.`);
    } catch (error) {
      setExtractError(error instanceof Error ? error.message : "PDF page extraction failed.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Extract PDF Pages Online"
        description="Extract specific pages from a PDF and create a new document online with Growile's browser-based tool."
        canonicalPath="/tools/extract-pdf-pages"
      />
      <PdfNavBar />
      <Hero
        kicker="PDF Organization"
        title="Extract PDF Pages"
        subtitle="Choose specific pages from your PDF and create a new document."
        ctaText="Upload PDF"
        ctaHref="#extract-pdf-pages-upload"
      />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="extract-pdf-pages-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FileText size={30} aria-hidden="true" />}
              title="Extract PDF Pages"
              description="Select the pages you need and create a new PDF file."
              buttonLabel="Select PDF file"
              actionLabel={isExtracting ? "Extracting..." : "Extract PDF"}
              actionDisabled={isExtracting || selectedPages.length === 0}
              accept=".pdf,application/pdf"
              onAction={handleAction}
              onSelectionChange={handleSelectionChange}
              selectedContent={
                selectedFile && pageCount > 0 ? (
                  <ExtractPagePreview
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
          {extractMessage && <p className="jpg-to-pdf-status" role="status">{extractMessage}</p>}
          {extractError && <p className="jpg-to-pdf-error" role="alert">{extractError}</p>}
        </section>
        <HowToUse heading="How to Extract PDF Pages" steps={steps} />
        <H2Section blocks={seoBlocks} />
        <FAQ heading="Extract PDF Pages FAQs" faqs={faqs} />
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
        itemName="extracted PDF"
      />
    </>
  );
}

function ExtractPagePreview({
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
        <span>{pageCount} pages</span>
      </div>
      <div className="split-pdf-selection-help" role="status">
        <div className="extract-pdf-selected-count">
          <strong>{selectedPages.length}</strong>
          <span>{selectedPages.length === 1 ? "page selected" : "pages selected"}</span>
        </div>
        <div className="extract-pdf-selection-instruction">
          <strong>Choose the pages to extract</strong>
          <span>Click any page to include or remove it from the new PDF.</span>
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
              aria-label={`${isSelected ? "Remove" : "Select"} page ${pageNumber}`}
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
