import { useCallback, useState } from "react";
import { FileImage } from "lucide-react";
import AdSpace from "../../../../packages/ui/src/AdSpace";
import FAQ from "../../../../packages/ui/src/FAQ";
import FileUploadBox from "../../../../packages/ui/src/toolsUi/fileUploadBox";
import Footer from "../../../../packages/ui/src/Footer";
import H2Section from "../../../../packages/ui/src/H2Section";
import Hero from "../../../../packages/ui/src/Hero";
import HowToUse from "../../../../packages/ui/src/HowToUse";
import PageMeta from "../../../../packages/ui/src/PageMeta";
import PdfNavBar from "./NavBar";
import PdfToolsFooter from "./toolsFooter";
import DownloadPopup from "../../../../packages/ui/src/DownloadPopup";
import { convertJpgFilesToPdf, downloadPdf } from "../Utilities/JPGtoPDFProcessing";
import "./JPGtoPDF.css";

const seoBlocks = [
  {
    heading: "Convert JPG Images to PDF Online",
    description:
      "Turn one or more JPG images into a single PDF document with Growile's simple online JPG to PDF converter.",
  },
  {
    heading: "Create a PDF from JPG Files",
    description:
      "Upload your JPG files, arrange your images as needed, and create a shareable PDF without installing desktop software.",
  },
  {
    heading: "Simple JPG to PDF Conversion",
    description:
      "Growile keeps image conversion straightforward with a focused workflow designed for documents, photos, and everyday files.",
  },
];

const steps = [
  {
    number: "1",
    title: "Upload JPG files",
    description: "Select your JPG images or drag them into the upload area.",
  },
  {
    number: "2",
    title: "Review your images",
    description: "Check the selected file and remove it if you need to choose another image.",
  },
  {
    number: "3",
    title: "Create your PDF",
    description: "Start the conversion and download your new PDF document.",
  },
];

const faqs = [
  {
    question: "How do I convert JPG to PDF?",
    answer:
      "Select a JPG image in the upload box, review the selected file, and use the conversion action to create a PDF.",
  },
  {
    question: "Can I convert multiple JPG images to one PDF?",
    answer:
      "The JPG to PDF tool is designed for converting JPG images into PDF documents. Multiple-image support can be added to the same reusable upload workflow.",
  },
  {
    question: "Can I use this JPG to PDF converter for free?",
    answer:
      "Yes. Growile's PDF tools are available online without requiring a paid desktop application.",
  },
  {
    question: "Do I need to install software?",
    answer:
      "No. You can use the converter directly in your browser.",
  },
  {
    question: "Which image format does this tool support?",
    answer: "This tool is intended for JPG and JPEG image files.",
  },
  {
    question: "Will my JPG image keep its quality?",
    answer:
      "The converter is designed to place your image into a PDF while preserving the original image content.",
  },
  {
    question: "Can I convert a PNG image to PDF?",
    answer:
      "For PNG files, use the PNG to PDF tool from the All PDF Tools list.",
  },
  {
    question: "What can I do after creating a PDF?",
    answer:
      "You can use Growile's other tools to compress, merge, edit, protect, or convert the resulting PDF.",
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
      text: faq.answer,
    },
  })),
};

const contentSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "JPG to PDF Converter",
  hasPart: seoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

export default function JPGtoPDF() {
  const [conversionMessage, setConversionMessage] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState("");
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [pendingPdf, setPendingPdf] = useState<Uint8Array | null>(null);

  const triggerDownload = useCallback(() => {
    if (pendingPdf) {
      downloadPdf(pendingPdf, "jpg-to-pdf.pdf");
    }
  }, [pendingPdf]);

  const closeDownloadPopup = useCallback(() => {
    setIsDownloadPopupOpen(false);
    setPendingPdf(null);
  }, []);

  const handleAction = async (files: File[]) => {
    setIsConverting(true);
    setConversionError("");
    setConversionMessage("");

    try {
      const pdfBytes = await convertJpgFilesToPdf(files);
      setPendingPdf(pdfBytes);
      setIsDownloadPopupOpen(true);
      setConversionMessage(
        `${files.length} JPG image${files.length === 1 ? "" : "s"} converted and downloaded.`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "JPG to PDF conversion failed.";
      setConversionError(message);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="JPG to PDF Converter"
        description="Convert JPG images to PDF online with Growile's simple browser-based JPG to PDF converter."
        canonicalPath="/tools/jpg-to-pdf"
      />
      <PdfNavBar />
      <Hero
        kicker="PDF Conversion"
        title="JPG to PDF Converter"
        subtitle="Convert your JPG images into a PDF document quickly and easily."
        ctaText="Upload JPG"
        ctaHref="#jpg-to-pdf-upload"
      />

      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="jpg-to-pdf-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FileImage size={30} aria-hidden="true" />}
              title="JPG to PDF"
              description="Convert your JPG image into a portable PDF file."
              buttonLabel="Select JPG image"
              actionLabel={isConverting ? "Converting..." : "Convert to PDF"}
              actionDisabled={isConverting}
              accept=".jpg,.jpeg,image/jpeg"
              onAction={(file) => handleAction([file])}
              onFilesAction={handleAction}
              multiple
              maxFiles={50}
              dropHint="or drop up to 50 JPG images here"
            />
            <AdSpace variant="vertical" />
          </div>
          {conversionMessage && (
            <p className="jpg-to-pdf-status" role="status">
              {conversionMessage}
            </p>
          )}
          {conversionError && (
            <p className="jpg-to-pdf-error" role="alert">
              {conversionError}
            </p>
          )}
        </section>

        <HowToUse heading="How to Convert JPG to PDF" steps={steps} />
        <H2Section blocks={seoBlocks} />
        <FAQ heading="JPG to PDF FAQs" faqs={faqs} />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contentSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PdfToolsFooter />
      <Footer />
      <AdSpace className="footer-bottom-ad-space" />
      <DownloadPopup
        isOpen={isDownloadPopupOpen}
        onClose={closeDownloadPopup}
        onTriggerDownload={triggerDownload}
        itemName="JPG to PDF"
      />
    </>
  );
}
