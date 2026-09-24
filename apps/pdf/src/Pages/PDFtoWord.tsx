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
import SoftwareApplicationSchema from "../../../../packages/ui/src/SoftwareApplicationSchema";
import PdfToolsFooter from "./toolsFooter";
import Divider from "../../../../packages/ui/src/Divider";
import { convertPdfToWord, downloadWordFile } from "../Utilities/PDFtoWordProcessing";
import "./JPGtoPDF.css";

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Preserve the page layout", description: "Each PDF page is rendered as a high-quality image inside the Word document." },
  { number: "3", title: "Download the Word file", description: "Download the converted pages as a DOCX file." },
];

const seoBlocks = [
  { heading: "Convert PDF to Word Online", description: "Turn selectable PDF text into an editable Word document directly in your browser." },
  { heading: "Keep Your PDF Layout in Word", description: "Upload one PDF and preserve its page order, images, text appearance, and visual alignment in Word." },
  { heading: "Simple PDF to Word Conversion", description: "Use a focused browser-based workflow without installing desktop software." },
];

const faqs = [
  { question: "How do I convert PDF to Word?", answer: "Upload one PDF file and click Convert to Word to download an editable DOCX file." },
  { question: "Can I upload more than one PDF?", answer: "This converter accepts one PDF file at a time." },
  { question: "Will page order be preserved?", answer: "Yes. Extracted content is placed in the Word document according to the original PDF page order." },
  { question: "Can it convert scanned PDFs?", answer: "This tool extracts selectable PDF text. Scanned image-only pages require OCR." },
  { question: "Will the Word file keep the exact PDF layout?", answer: "Each PDF page is placed into the Word document as an image to preserve the original visual layout." },
  { question: "Do I need to install software?", answer: "No. The conversion runs directly in your browser." },
  { question: "Is the conversion free?", answer: "Yes. You can use this browser-based PDF to Word converter online." },
  { question: "What file will I download?", answer: "Each PDF page is included in a DOCX Word file as a high-quality page image." },
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
  name: "PDF to Word Converter",
  hasPart: seoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

export default function PDFtoWord() {
  const [isConverting, setIsConverting] = useState(false);
  const [conversionMessage, setConversionMessage] = useState("");
  const [conversionError, setConversionError] = useState("");
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [pendingWord, setPendingWord] = useState<Blob | null>(null);

  const triggerDownload = useCallback(() => {
    if (pendingWord) downloadWordFile(pendingWord, "pdf-to-word.docx");
  }, [pendingWord]);

  const closeDownloadPopup = useCallback(() => {
    setIsDownloadPopupOpen(false);
    setPendingWord(null);
  }, []);

  const handleAction = async (file: File) => {
    setIsConverting(true);
    setConversionMessage("");
    setConversionError("");

    try {
      const wordBytes = await convertPdfToWord(file);
      setPendingWord(wordBytes);
      setIsDownloadPopupOpen(true);
      setConversionMessage("PDF converted to an editable Word document.");
    } catch (error) {
      setConversionError(error instanceof Error ? error.message : "PDF to Word conversion failed.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="PDF to Word Converter"
        description="Convert PDF files to editable Word documents online with Growile's browser-based PDF to Word converter."
        canonicalPath="/pdf/pdf-to-word"
      />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile PDF to Word" description="Convert PDF files into editable Word documents online." path="/pdf/pdf-to-word" />
      <Hero
        kicker="PDF Conversion"
        title="PDF to Word Converter"
        subtitle="Convert your PDF pages into a Word document while preserving the original visual layout."
        ctaText="Upload PDF"
        ctaHref="#pdf-to-word-upload"
      />
      <Divider />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="pdf-to-word-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FileText size={30} aria-hidden="true" />}
              title="PDF to Word"
              description="Place each PDF page into a Word document while preserving its images and alignment."
              buttonLabel="Select PDF file"
              actionLabel={isConverting ? "Converting..." : "Convert to Word"}
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
        <HowToUse heading="How to Convert PDF to Word" steps={steps} />
        <Divider />
        <H2Section blocks={seoBlocks} />
        <Divider />
        <FAQ heading="PDF to Word FAQs" faqs={faqs} />
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
        itemName="PDF to Word"
      />
    </>
  );
}
