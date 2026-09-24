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
import SoftwareApplicationSchema from "../../../../packages/ui/src/SoftwareApplicationSchema";
import PdfBreadcrumb from "./PdfBreadcrumb";
import PdfToolsFooter from "./toolsFooter";
import PdfIconToolCard from "./IconToolCard";
import Divider from "../../../../packages/ui/src/Divider";
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
  {
    heading: "Remove Pages from PDF Document Online Free",
    description:
      "It is very simple to remove pages from PDF document online free with Growile PDF. Just upload your file, select the unwanted sheets you want to discard, and we will clean up your document instantly.",
  },
  {
    heading: "Delete Specific Pages from PDF Online Free",
    description:
      "Got a few errors in a big file? You can quickly delete specific pages from PDF online free. Simply pick the exact page numbers you do not need, and Growile PDF will permanently erase them for you.",
  },
  {
    heading: "Delete Blank Pages from PDF Online Free",
    description:
      "Scanners often leave empty sheets behind. You can effortlessly delete blank pages from PDF online free. Our tool helps you trim down the unnecessary empty spaces to create a neat, professional file.",
  },
];

const faqs = [
  {
    question: "Is the Growile PDF page remover tool free?",
    answer:
      "Yes, deleting unwanted sheets with Growile PDF is 100% free. You can easily remove pages from your document without paying any subscription fees.",
  },
  {
    question: "Can I delete specific pages from a large file?",
    answer:
      "Absolutely! You can easily select and delete specific pages from PDF online free, leaving only the important content in your clean final document.",
  },
  {
    question: "How do I handle empty scanned sheets?",
    answer:
      "Our tool makes it simple to delete blank pages from PDF online free. Just select the empty sheets and erase them to keep your file professional.",
  },
  {
    question: "Do I need to install an app to remove pages?",
    answer:
      "No installation is required. You can quickly discard unwanted sheets from your document directly using your web browser with our Growile PDF tool.",
  },
  {
    question: "Are my uploaded files and data secure?",
    answer:
      "Your privacy is perfectly safe. Growile PDF automatically deletes your original file and the newly cleaned document from our servers permanently.",
  },
  {
    question: "What if I want to keep the selected pages instead?",
    answer: (
      <>
        If you want to pull out and save pages rather than erasing them, please use our{" "}
        <a href="/pdf/extract-pdf-pages">Extract PDF Pages</a> tool to create a new file with chosen sheets.
      </>
    ),
  },
  {
    question: "Can I change the order of the remaining pages?",
    answer: (
      <>
        This tool only erases sheets. If you need to rearrange the sequence of your document, we recommend using our{" "}
        <a href="/pdf/reorder-pdf-pages">Reorder PDF Pages</a> tool instead.
      </>
    ),
  },
  {
    question: "Does this deletion tool work on my mobile phone?",
    answer:
      "Yes, Growile PDF is mobile-friendly. You can easily remove unwanted pages from your reports or invoices using any Android or iOS smartphone today.",
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
          : "Use the linked PDF tool for this document task.",
    },
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
        title="Delete Pages From PDF Online Free - Fast | Growile PDF"
        description="Use Growile PDF to delete pages from PDF online free. Easily remove specific or blank pages from your document. Safe, fast, and 100% free tool!"
        canonicalPath="/pdf/delete-pdf-pages"
      />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile Delete PDF Pages" description="Remove unwanted pages from a PDF online." path="/pdf/delete-pdf-pages" />
      <PdfBreadcrumb label="Delete PDF Pages" path="delete-pdf-pages" />
      <Hero
        kicker="PDF Organization"
        title="Delete Pages from PDF Online Free"
        subtitle="Do you have unwanted sheets in your document? Growile PDF helps you delete pages from PDF online free in just a few clicks. Whether you need to remove outdated information or clean up messy scans, our tool makes it incredibly easy. You do not have to install any heavy software or pay hidden fees. Experience fast, secure, and hassle-free page deletion directly from your web browser today."
        ctaText="Upload PDF"
        ctaHref="#delete-pdf-pages-upload"
      />
      <Divider />
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
        <section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title">
          <h2 id="related-pdf-tools-title">More PDF Tools</h2>
          <div className="pdf-related-tools-grid pdf-related-tools-grid-five">
            <PdfIconToolCard toolId="split-pdf" />
            <PdfIconToolCard toolId="extract-pdf-pages" />
            <PdfIconToolCard toolId="reorder-pdf-pages" />
            <PdfIconToolCard toolId="merge-pdf" />
            <PdfIconToolCard toolId="compress-pdf" />
          </div>
        </section>
        <HowToUse heading="How to Delete PDF Pages" steps={steps} />
        <Divider />
        <H2Section blocks={seoBlocks} />
        <Divider />
        <FAQ heading="Delete PDF Pages FAQs" faqs={faqs} />
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
