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
import SoftwareApplicationSchema from "../../../../packages/ui/src/SoftwareApplicationSchema";
import PdfBreadcrumb from "./PdfBreadcrumb";
import PdfToolsFooter from "./toolsFooter";
import PdfIconToolCard from "./IconToolCard";
import Divider from "../../../../packages/ui/src/Divider";
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
  {
    heading: "Split PDF into Multiple Files Online Free",
    description:
      "It is very simple to split PDF into multiple files online free with Growile PDF. Just upload your document, choose where to cut, and we will instantly break it down into smaller, ready-to-use files.",
  },
  {
    heading: "Split Large PDF Files Online Free",
    description:
      "Dealing with heavy documents? You can easily split large PDF files online free using our platform. Growile PDF processes bulky files smoothly, giving you lightweight documents that are easy to send.",
  },
  {
    heading: "Divide PDF Pages Online Free",
    description:
      "The process is incredibly fast. You can divide PDF pages online free by simply uploading your file here. Growile PDF neatly separates your long document, delivering precisely divided files in seconds.",
  },
];

const faqs = [
  {
    question: "Is the Growile PDF splitter free?",
    answer:
      "Yes, splitting documents with Growile PDF is completely free. You can break your files into smaller parts without paying any subscription fees.",
  },
  {
    question: "Can I split large PDF files easily?",
    answer:
      "Absolutely! Growile PDF easily handles heavy documents, allowing you to split large PDF files into smaller, lightweight sizes for easy email sharing.",
  },
  {
    question: "Will dividing pages reduce file quality?",
    answer:
      "No, your document quality is protected. Growile PDF ensures you divide PDF pages without losing any clarity, keeping the original text and layout.",
  },
  {
    question: "Do I need software to split documents?",
    answer:
      "No installation is required. You can quickly cut your long documents into separate files directly from your web browser using our Growile PDF tool.",
  },
  {
    question: "Are my uploaded and split files secure?",
    answer:
      "Your data is 100% safe. Growile PDF automatically deletes your original long document and the newly divided files from our servers after splitting.",
  },
  {
    question: "Does this PDF cutter work on mobile?",
    answer:
      "Yes, Growile PDF is mobile-friendly. You can comfortably separate your large business reports into multiple files using your smartphone anytime.",
  },
  {
    question: "Can I extract specific pages instead?",
    answer: (
      <>
        This tool cuts a file into parts. If you want to pull out specific pages, please use our{" "}
        <a href="/pdf/extract-pdf-pages">Extract PDF Pages</a> tool for precise page extraction.
      </>
    ),
  },
  {
    question: "How fast is the PDF splitting process?",
    answer:
      "It is remarkably quick! Once you upload your bulky file, Growile PDF instantly separates the pages and prepares your divided files in seconds.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text:
        typeof faq.answer === "string"
          ? faq.answer
          : "Use the Extract PDF Pages tool for precise page extraction.",
    },
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
        title="Split PDF Files Online Free - Easy & Fast | Growile PDF"
        description="Use Growile PDF to split PDF files online free. Divide large PDF pages or split a PDF into multiple files instantly. Safe, fast, and 100% free tool!"
        canonicalPath="/pdf/split-pdf"
      />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile Split PDF" description="Split a PDF into separate files online." path="/pdf/split-pdf" />
      <PdfBreadcrumb label="Split PDF" path="split-pdf" />
      <Hero
        kicker="PDF Organization"
        title="Split PDF Files Online Free"
        subtitle="Do you have a massive document that is too hard to share? Growile PDF helps you split PDF files online free in just a few clicks. Whether it is breaking a huge report into chapters or separating important invoices, our smart tool creates manageable files instantly. You do not need to install complex software or pay any fees. Enjoy fast, secure, and unlimited splitting directly from your browser."
        ctaText="Upload PDF"
        ctaHref="#split-pdf-upload"
      />
      <Divider />
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
                        <strong>Pages {part.startPage}ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“{part.endPage}</strong>
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
        <section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title">
          <h2 id="related-pdf-tools-title">More PDF Tools</h2>
          <div className="pdf-related-tools-grid pdf-related-tools-grid-five">
            <PdfIconToolCard toolId="merge-pdf" />
            <PdfIconToolCard toolId="extract-pdf-pages" />
            <PdfIconToolCard toolId="delete-pdf-pages" />
            <PdfIconToolCard toolId="compress-pdf" />
            <PdfIconToolCard toolId="reorder-pdf-pages" />
          </div>
        </section>
        <HowToUse heading="How to Split a PDF" steps={steps} />
        <Divider />
        <H2Section blocks={seoBlocks} />
        <Divider />
        <FAQ heading="Split PDF FAQs" faqs={faqs} />
        <Divider />
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
