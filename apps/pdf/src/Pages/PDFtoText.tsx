import { useCallback, useState } from "react";
import { FileText } from "lucide-react";
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
import { convertPdfToText, downloadTextFile } from "../Utilities/PDFtoTextProcessing";
import "./JPGtoPDF.css";

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Extract the text", description: "Text from every PDF page is collected in the original page order." },
  { number: "3", title: "Download the text", description: "Download the extracted content as a TXT file." },
];

const seoBlocks = [
  { heading: "Convert PDF to Text Online", description: "Extract readable text from your PDF and save it as a simple text document." },
  { heading: "Extract Text from Every PDF Page", description: "Upload one PDF and collect its selectable text in the same page order." },
  { heading: "Simple PDF Text Extraction", description: "Use a focused browser-based workflow without installing desktop software." },
];

const faqs = [
  { question: "How do I convert PDF to text?", answer: "Upload one PDF file and click Convert to Text to download the extracted content." },
  { question: "Can I upload more than one PDF?", answer: "This converter accepts one PDF file at a time." },
  { question: "Will page order be preserved?", answer: "Yes. Extracted text is separated and arranged according to the original PDF page order." },
  { question: "Can it extract text from scanned PDFs?", answer: "This tool extracts selectable PDF text. Scanned image-only pages require OCR." },
  { question: "Do I need to install software?", answer: "No. The conversion runs directly in your browser." },
  { question: "Is the conversion free?", answer: "Yes. You can use this browser-based PDF to Text converter online." },
  { question: "Will my PDF be uploaded to a server?", answer: "The conversion is processed in your browser." },
  { question: "What file will I download?", answer: "The extracted content is downloaded as a plain TXT file." },
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
  name: "PDF to Text Converter",
  hasPart: seoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

export default function PDFtoText() {
  const [isConverting, setIsConverting] = useState(false);
  const [conversionMessage, setConversionMessage] = useState("");
  const [conversionError, setConversionError] = useState("");
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [pendingText, setPendingText] = useState<Uint8Array | null>(null);

  const triggerDownload = useCallback(() => {
    if (pendingText) downloadTextFile(pendingText, "pdf-to-text.txt");
  }, [pendingText]);

  const closeDownloadPopup = useCallback(() => {
    setIsDownloadPopupOpen(false);
    setPendingText(null);
  }, []);

  const handleAction = async (file: File) => {
    setIsConverting(true);
    setConversionMessage("");
    setConversionError("");

    try {
      const textBytes = await convertPdfToText(file);
      setPendingText(textBytes);
      setIsDownloadPopupOpen(true);
      setConversionMessage("PDF text extracted successfully.");
    } catch (error) {
      setConversionError(error instanceof Error ? error.message : "PDF to Text conversion failed.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="PDF to Text Converter"
        description="Extract text from PDF files online with Growile's browser-based PDF to Text converter."
        canonicalPath="/tools/pdf-to-text"
      />
      <PdfNavBar />
      <Hero
        kicker="PDF Conversion"
        title="PDF to Text Converter"
        subtitle="Extract readable text from your PDF and download it as a text file."
        ctaText="Upload PDF"
        ctaHref="#pdf-to-text-upload"
      />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="pdf-to-text-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FileText size={30} aria-hidden="true" />}
              title="PDF to Text"
              description="Extract selectable text from every page of your PDF."
              buttonLabel="Select PDF file"
              actionLabel={isConverting ? "Converting..." : "Convert to Text"}
              actionDisabled={isConverting}
              accept=".pdf,application/pdf"
              onAction={handleAction}
              dropHint="or drop one PDF file here"
            />
            <AdSpace variant="vertical" />
          </div>
          {conversionMessage && <p className="jpg-to-pdf-status" role="status">{conversionMessage}</p>}
          {conversionError && <p className="jpg-to-pdf-error" role="alert">{conversionError}</p>}
        </section>
        <HowToUse heading="How to Convert PDF to Text" steps={steps} />
        <H2Section blocks={seoBlocks} />
        <FAQ heading="PDF to Text FAQs" faqs={faqs} />
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
        itemName="PDF to Text"
      />
    </>
  );
}
