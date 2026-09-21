import { useCallback, useEffect, useRef, useState } from "react";
import { Scissors } from "lucide-react";
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
import {
  downloadSplitPdf,
  getPdfPageCount,
  splitPdfByRange,
  type SplitPdfPart,
} from "../Utilities/SplitPDFProcessing";
import "./JPGtoPDF.css";
import "./SplitPDF.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Choose a page range", description: "Select the starting and ending pages for the section you want to split." },
  { number: "3", title: "Download a split PDF", description: "Review the resulting PDF sections and download only the one you need." },
];

const seoBlocks = [
  { heading: "Split PDF Files Online", description: "Separate every page of a PDF into individual PDF files directly in your browser." },
  { heading: "Split a Selected Page Range", description: "Choose a starting and ending page to create up to three separate PDF sections." },
  { heading: "Simple PDF Splitting", description: "Split PDFs without installing desktop software or uploading your documents to a server." },
];

const faqs = [
  { question: "How do I split a PDF?", answer: "Upload one PDF, choose a starting and ending page, and click Split PDF. The pages before, within, and after that range become separate PDF files." },
  { question: "Can I upload more than one PDF?", answer: "This Split PDF tool accepts one PDF file at a time." },
  { question: "Can I download only one split PDF?", answer: "Yes. After splitting, each resulting page range has its own Download button." },
  { question: "Will the page order stay the same?", answer: "Yes. Each PDF is named and arranged in the same order as the source document." },
  { question: "Do I need to install software?", answer: "No. The splitting process runs directly in your browser." },
  { question: "Is the Split PDF tool free?", answer: "Yes. You can split a PDF online with Growile for free." },
  { question: "Will my PDF be uploaded to a server?", answer: "No. Your PDF is processed directly in your browser." },
  { question: "What happens when I choose pages 3 to 5?", answer: "The tool creates sections for pages 1 to 2, pages 3 to 5, and pages 6 onward. Empty sections are not created." },
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
  name: "Split PDF",
  hasPart: seoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

export default function SplitPDF() {
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitMessage, setSplitMessage] = useState("");
  const [splitError, setSplitError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [splitParts, setSplitParts] = useState<SplitPdfPart[]>([]);
  const [pendingPart, setPendingPart] = useState<SplitPdfPart | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const triggerDownload = useCallback(() => {
    if (pendingPart) {
      downloadSplitPdf(pendingPart.bytes, `split-pages-${pendingPart.startPage}-${pendingPart.endPage}.pdf`);
    }
  }, [pendingPart]);

  const closeDownloadPopup = useCallback(() => {
    setIsDownloadPopupOpen(false);
    setPendingPart(null);
  }, []);

  const handleAction = async (file: File) => {
    setIsSplitting(true);
    setSplitMessage("");
    setSplitError("");

    try {
      const parts = await splitPdfByRange(file, startPage, endPage);
      setSplitParts(parts);
      setSplitMessage(`${parts.length} PDF sections created. Choose which one to download.`);
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (error) {
      setSplitError(error instanceof Error ? error.message : "PDF splitting failed.");
    } finally {
      setIsSplitting(false);
    }
  };

  const handleSelectionChange = async (files: File[]) => {
    const file = files[0] ?? null;
    setSelectedFile(file);
    setSplitParts([]);
    setSplitMessage("");
    setSplitError("");
    if (!file) {
      setPageCount(0);
      return;
    }

    try {
      const count = await getPdfPageCount(file);
      setPageCount(count);
      setStartPage(count > 2 ? 2 : 1);
      setEndPage(count > 2 ? count - 1 : count);
    } catch (error) {
      setPageCount(0);
      setSplitError(error instanceof Error ? error.message : "Could not read the PDF pages.");
    }
  };

  return (
    <>
      <PageMeta
        title="Split PDF Files Online"
        description="Split a PDF into individual PDF pages online with Growile's browser-based Split PDF tool."
        canonicalPath="/tools/split-pdf"
      />
      <PdfNavBar />
      <Hero
        kicker="PDF Organization"
        title="Split PDF Files"
        subtitle="Separate your PDF pages into individual PDF documents."
        ctaText="Upload PDF"
        ctaHref="#split-pdf-upload"
      />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="split-pdf-upload">
          <div className="jpg-to-pdf-upload-layout">
            <div className="split-pdf-main-column">
              {splitParts.length === 0 && (
              <FileUploadBox
                className="jpg-to-pdf-upload-box"
                icon={<Scissors size={30} aria-hidden="true" />}
                title="Split PDF"
                description="Separate every page of your PDF into an individual PDF file."
                buttonLabel="Select PDF file"
                actionLabel={isSplitting ? "Splitting..." : "Split PDF"}
                actionDisabled={isSplitting}
                accept=".pdf,application/pdf"
                onAction={handleAction}
                onSelectionChange={handleSelectionChange}
                selectedContent={
                  selectedFile && pageCount > 1 ? (
                    <PdfPagePreview
                      file={selectedFile}
                      pageCount={pageCount}
                      startPage={startPage}
                      endPage={endPage}
                      onStartPageChange={setStartPage}
                      onEndPageChange={setEndPage}
                    />
                  ) : null
                }
                dropHint="or drop one PDF file here"
              />
              )}
              {splitMessage && <p className="jpg-to-pdf-status" role="status">{splitMessage}</p>}
              {splitError && <p className="jpg-to-pdf-error" role="alert">{splitError}</p>}
              {splitParts.length > 0 && (
                <div
                  ref={resultsRef}
                  className="split-pdf-results"
                  aria-label="Split PDF results"
                  tabIndex={-1}
                >
                  {splitParts.map((part) => (
                    <article className="split-pdf-result-card" key={`${part.startPage}-${part.endPage}`}>
                      <div>
                        <strong>Pages {part.startPage}–{part.endPage}</strong>
                        <span>Separate PDF section</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPendingPart(part);
                          setIsDownloadPopupOpen(true);
                        }}
                      >
                        Download
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
            <AdSpace variant="vertical" />
          </div>
        </section>
        <HowToUse heading="How to Split a PDF" steps={steps} />
        <H2Section blocks={seoBlocks} />
        <FAQ heading="Split PDF FAQs" faqs={faqs} />
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
        itemName="split PDF"
      />
    </>
  );
}

function PdfPagePreview({
  file,
  pageCount,
  startPage,
  endPage,
  onStartPageChange,
  onEndPageChange,
}: {
  file: File;
  pageCount: number;
  startPage: number;
  endPage: number;
  onStartPageChange: (page: number) => void;
  onEndPageChange: (page: number) => void;
}) {
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [rangeStartSelection, setRangeStartSelection] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const imageUrls: string[] = [];

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
        const url = canvas.toDataURL("image/jpeg", 0.8);
        imageUrls.push(url);
        images.push(url);
      }

      if (!cancelled) setPageImages(images);
    };

    void renderPages();
    return () => {
      cancelled = true;
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [file]);

  const handlePageClick = (pageNumber: number) => {
    if (rangeStartSelection === null) {
      const nextEndPage = Math.min(pageNumber + 1, pageCount);
      onStartPageChange(Math.min(pageNumber, pageCount - 1));
      onEndPageChange(nextEndPage);
      setRangeStartSelection(pageNumber);
      return;
    }

    if (pageNumber === rangeStartSelection) return;

    const nextStartPage = Math.min(rangeStartSelection, pageNumber);
    const nextEndPage = Math.max(rangeStartSelection, pageNumber);
    onStartPageChange(nextStartPage);
    onEndPageChange(nextEndPage);
    setRangeStartSelection(null);
  };

  return (
    <div className="split-pdf-preview">
      <div className="split-pdf-preview-heading">
        <strong>PDF pages</strong>
        <span>{pageCount} pages</span>
      </div>
      <div className="split-pdf-selection-help" role="status">
        <strong>{rangeStartSelection === null ? "Choose a page range" : "Choose the ending page"}</strong>
        <span>
          {rangeStartSelection === null
            ? "Click the first page, then click the last page you want to split."
            : `Page ${rangeStartSelection} selected. Now click the ending page.`}
        </span>
      </div>
      <div className="split-pdf-page-grid">
        {pageImages.map((image, index) => {
          const pageNumber = index + 1;
          const isSelected = pageNumber >= startPage && pageNumber <= endPage;
          return (
            <button
              type="button"
              className={`split-pdf-page-thumbnail ${isSelected ? "selected" : ""}`}
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              aria-label={`Choose page ${pageNumber}`}
            >
              <img src={image} alt={`PDF page ${pageNumber}`} />
              <span>Page {pageNumber}</span>
            </button>
          );
        })}
      </div>
      <div className="split-pdf-range-controls">
        <p>Select the page range to split.</p>
        <label>
          Starting page
          <input
            type="number"
            min={1}
            max={pageCount - 1}
            value={startPage}
            onChange={(event) => onStartPageChange(Number(event.target.value))}
          />
        </label>
        <label>
          Ending page
          <input
            type="number"
            min={startPage + 1}
            max={pageCount}
            value={endPage}
            onChange={(event) => onEndPageChange(Number(event.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
