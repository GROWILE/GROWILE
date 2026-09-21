import { useCallback, useState } from "react";
import { FileOutput } from "lucide-react";
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
import { convertPdfToJpgZip, downloadJpgZip } from "../Utilities/PDFtoJPGProcessing";
import "./JPGtoPDF.css";

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Convert your pages", description: "Each PDF page is rendered as a high-quality JPG image." },
  { number: "3", title: "Download the JPGs", description: "Download all converted JPG pages together in a ZIP file." },
];

const seoBlocks = [
  { heading: "Convert PDF Pages to JPG Images", description: "Turn each page of a PDF into a clear JPG image directly in your browser." },
  { heading: "Export Every PDF Page", description: "Upload one PDF and receive all of its pages as JPG images in one convenient ZIP download." },
  { heading: "Simple PDF to JPG Conversion", description: "Use a focused workflow to convert PDF pages without installing desktop software." },
];

const faqs = [
  { question: "How do I convert PDF to JPG?", answer: "Upload one PDF file and click Convert to JPG. Every page will be rendered as a JPG image." },
  { question: "Can I upload more than one PDF?", answer: "This converter accepts one PDF file at a time." },
  { question: "How are multiple pages downloaded?", answer: "All converted JPG pages are placed in one ZIP file for a single download." },
  { question: "Will the PDF page order stay the same?", answer: "Yes. JPG files are named and arranged in the same order as the PDF pages." },
  { question: "Do I need to install software?", answer: "No. The conversion runs directly in your browser." },
  { question: "Is the conversion free?", answer: "Yes. You can use this browser-based PDF to JPG converter online." },
  { question: "Will my PDF be uploaded to a server?", answer: "The conversion is processed in your browser." },
  { question: "What can I do after converting?", answer: "You can use the JPG images in documents, presentations, or other PDF workflows." },
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
  name: "PDF to JPG Converter",
  hasPart: seoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

export default function PDFtoJPG() {
  const [isConverting, setIsConverting] = useState(false);
  const [conversionMessage, setConversionMessage] = useState("");
  const [conversionError, setConversionError] = useState("");
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [pendingZip, setPendingZip] = useState<Uint8Array | null>(null);

  const triggerDownload = useCallback(() => {
    if (pendingZip) downloadJpgZip(pendingZip, "pdf-to-jpg.zip");
  }, [pendingZip]);

  const closeDownloadPopup = useCallback(() => {
    setIsDownloadPopupOpen(false);
    setPendingZip(null);
  }, []);

  const handleAction = async (file: File) => {
    setIsConverting(true);
    setConversionMessage("");
    setConversionError("");

    try {
      const zipBytes = await convertPdfToJpgZip(file);
      setPendingZip(zipBytes);
      setIsDownloadPopupOpen(true);
      setConversionMessage("PDF pages converted to JPG images.");
    } catch (error) {
      setConversionError(error instanceof Error ? error.message : "PDF to JPG conversion failed.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="PDF to JPG Converter"
        description="Convert PDF pages to JPG images online with Growile's browser-based PDF to JPG converter."
        canonicalPath="/tools/pdf-to-jpg"
      />
      <PdfNavBar />
      <Hero
        kicker="PDF Conversion"
        title="PDF to JPG Converter"
        subtitle="Convert every page of your PDF into a high-quality JPG image."
        ctaText="Upload PDF"
        ctaHref="#pdf-to-jpg-upload"
      />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="pdf-to-jpg-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FileOutput size={30} aria-hidden="true" />}
              title="PDF to JPG"
              description="Convert each page of your PDF into a JPG image."
              buttonLabel="Select PDF file"
              actionLabel={isConverting ? "Converting..." : "Convert to JPG"}
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
        <HowToUse heading="How to Convert PDF to JPG" steps={steps} />
        <H2Section blocks={seoBlocks} />
        <FAQ heading="PDF to JPG FAQs" faqs={faqs} />
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
        itemName="PDF to JPG"
      />
    </>
  );
}
