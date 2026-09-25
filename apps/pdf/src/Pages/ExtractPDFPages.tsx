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
import SoftwareApplicationSchema from "../../../../packages/ui/src/SoftwareApplicationSchema";
import PdfBreadcrumb from "./PdfBreadcrumb";
import PdfToolsFooter from "./toolsFooter";
import PdfIconToolCard from "./IconToolCard";
import Divider from "../../../../packages/ui/src/Divider";
import { downloadExtractedPdf, extractPdfPages } from "../Utilities/ExtractPDFPagesProcessing";
import ExtractPagePreview from "./ExtractPagePreview";
import "./PdfUploadLayout.css";
import "./PdfPagePreview.css";
import "./PdfSelectionPreview.css";

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
  {
    heading: "Extract Specific Pages from PDF Online Free",
    description:
      "With Growile PDF, it is very simple to extract specific pages from PDF online free. Just upload your document, choose the exact page numbers you want to keep, and we will generate a fresh file fast.",
  },
  {
    heading: "Extract Selected Pages from PDF Online Free",
    description:
      "Only want certain sections? You can effortlessly extract selected pages from PDF online free. Our intuitive platform lets you pick your desired content and saves it into a clean, ready-to-share file.",
  },
  {
    heading: "Extract Single Page from PDF Online Free",
    description:
      "Sometimes you only need one sheet. You can easily extract single page from PDF online free using our platform. Just select that one crucial page, and Growile PDF will isolate it for you in seconds.",
  },
];

const faqs = [
  {
    question: "Is the Growile PDF page extractor free?",
    answer:
      "Yes, pulling out pages with Growile PDF is 100% free. You can grab exactly what you need from any document without paying subscription fees.",
  },
  {
    question: "Can I extract specific pages from a long document?",
    answer:
      "Absolutely! You can easily select and extract specific pages from PDF online free, creating a brand-new file containing only your chosen data.",
  },
  {
    question: "Will the quality drop for the extracted pages?",
    answer:
      "No, your file quality remains perfect. Growile PDF ensures that the text and layout of your selected pages stay exactly like the original.",
  },
  {
    question: "Do I need software to pull out a single page?",
    answer:
      "No installation is required. You can quickly isolate and extract single page from PDF online free directly using your preferred web browser.",
  },
  {
    question: "Are my uploaded documents and extracted files safe?",
    answer:
      "Your privacy is 100% secure. Growile PDF automatically deletes your original document and the newly extracted file from our secure servers.",
  },
  {
    question: "Does this extraction tool work on mobile?",
    answer:
      "Yes, Growile PDF is highly mobile-friendly. You can comfortably pull out important pages from your business reports using your smartphone.",
  },
  {
    question: "What is the difference between extracting and deleting?",
    answer: (
      <>
        Extracting saves only the pages you select. If you want to remove just a few unwanted pages instead, please use our{" "}
        <a href="/pdf/delete-pdf-pages">Delete PDF Pages</a> tool.
      </>
    ),
  },
  {
    question: "What if I want to cut the document into multiple parts?",
    answer: (
      <>
        Extracting creates one new file. If you need to divide a large document into several separate files, try using our{" "}
        <a href="/pdf/split-pdf">Split PDF</a> tool instead.
      </>
    ),
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
        title="Extract Pages From PDF Online Free - Fast | Growile PDF"
        description="Use Growile PDF to extract pages from PDF online free. Easily extract specific or single pages into a new file. Safe, fast, and 100% free tool!"
        canonicalPath="/pdf/extract-pdf-pages"
      />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile Extract PDF Pages" description="Extract selected pages from a PDF into a new document." path="/pdf/extract-pdf-pages" />
      <PdfBreadcrumb label="Extract PDF Pages" path="extract-pdf-pages" />
      <Hero
        kicker="PDF Organization"
        title="Extract Pages from PDF Online Free"
        subtitle="Do you only need a few important sections from a massive document? Growile PDF helps you extract pages from PDF online free in just seconds. Whether you want to pull out a single invoice or select specific report chapters, our smart tool creates a new document with only the content you need. You do not have to install any software or pay hidden fees. Enjoy fast and secure extraction instantly."
        ctaText="Upload PDF"
        ctaHref="#extract-pdf-pages-upload"
      />
      <Divider />
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
        <section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title">
          <h2 id="related-pdf-tools-title">More PDF Tools</h2>
          <div className="pdf-related-tools-grid pdf-related-tools-grid-five">
            <PdfIconToolCard toolId="split-pdf" />
            <PdfIconToolCard toolId="delete-pdf-pages" />
            <PdfIconToolCard toolId="merge-pdf" />
            <PdfIconToolCard toolId="compress-pdf" />
            <PdfIconToolCard toolId="pdf-to-jpg" />
          </div>
        </section>
        <HowToUse heading="How to Extract PDF Pages" steps={steps} />
        <Divider />
        <H2Section blocks={seoBlocks} />
        <Divider />
        <FAQ heading="Extract PDF Pages FAQs" faqs={faqs} />
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
        itemName="extracted PDF"
      />
    </>
  );
}
