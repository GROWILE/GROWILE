import { useCallback, useState } from "react";
import { FileImage } from "lucide-react";
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
import { convertPngFilesToPdf, downloadPngPdf } from "../Utilities/PNGtoPDFProcessing";
import "./JPGtoPDF.css";

const seoBlocks = [
  { heading: "Convert PNG Images to PDF Online", description: "Turn one or more PNG images into a single PDF document with Growile's simple online PNG to PDF converter." },
  { heading: "Create a PDF from PNG Files", description: "Upload, arrange, and convert PNG images into a shareable PDF without installing desktop software." },
  { heading: "Simple PNG to PDF Conversion", description: "Convert transparent graphics, screenshots, and everyday PNG files through a focused browser-based workflow." },
];

const steps = [
  { number: "1", title: "Upload PNG files", description: "Select PNG images or drag them into the upload area." },
  { number: "2", title: "Arrange your images", description: "Review the previews and drag or move images into the order you need." },
  { number: "3", title: "Create your PDF", description: "Start the conversion and download your new PDF document." },
];

const faqs = [
  { question: "How do I convert PNG to PDF?", answer: "Select PNG images, arrange them in the required order, and click Convert to PDF." },
  { question: "Can I convert multiple PNG images to one PDF?", answer: "Yes. You can upload and arrange up to 50 PNG images in one PDF." },
  { question: "Do I need to install software?", answer: "No. The PNG to PDF converter works directly in your browser." },
  { question: "Can I rearrange PNG images before conversion?", answer: "Yes. Drag image cards on desktop or use the up and down controls on mobile." },
  { question: "Will transparent PNG images work?", answer: "Yes. PNG images, including transparent graphics, are supported." },
  { question: "Will the image quality be preserved?", answer: "Each PNG is embedded at its original dimensions with a 50px page margin." },
  { question: "Can I convert JPG images here?", answer: "Use the JPG to PDF tool for JPG and JPEG files." },
  { question: "What can I do with the PDF after conversion?", answer: "You can use Growile tools to compress, merge, edit, protect, or convert the resulting PDF." },
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
  name: "PNG to PDF Converter",
  hasPart: seoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

export default function PNGtoPDF() {
  const [conversionMessage, setConversionMessage] = useState("");
  const [conversionError, setConversionError] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [pendingPdf, setPendingPdf] = useState<Uint8Array | null>(null);

  const triggerDownload = useCallback(() => {
    if (pendingPdf) {
      downloadPngPdf(pendingPdf, "png-to-pdf.pdf");
    }
  }, [pendingPdf]);

  const closeDownloadPopup = useCallback(() => {
    setIsDownloadPopupOpen(false);
    setPendingPdf(null);
  }, []);

  const handleAction = async (files: File[]) => {
    setIsConverting(true);
    setConversionMessage("");
    setConversionError("");

    try {
      const pdfBytes = await convertPngFilesToPdf(files);
      setPendingPdf(pdfBytes);
      setIsDownloadPopupOpen(true);
      setConversionMessage(`${files.length} PNG image${files.length === 1 ? "" : "s"} converted and downloaded.`);
    } catch (error) {
      setConversionError(error instanceof Error ? error.message : "PNG to PDF conversion failed.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="PNG to PDF Converter"
        description="Convert PNG images to PDF online with Growile's simple browser-based PNG to PDF converter."
        canonicalPath="/tools/png-to-pdf"
      />
      <PdfNavBar />
      <Hero
        kicker="PDF Conversion"
        title="PNG to PDF Converter"
        subtitle="Convert your PNG images into a PDF document quickly and easily."
        ctaText="Upload PNG"
        ctaHref="#png-to-pdf-upload"
      />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="png-to-pdf-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FileImage size={30} aria-hidden="true" />}
              title="PNG to PDF"
              description="Convert your PNG images into a portable PDF file."
              buttonLabel="Select PNG images"
              actionLabel={isConverting ? "Converting..." : "Convert to PDF"}
              actionDisabled={isConverting}
              accept=".png,image/png"
              onAction={(file) => handleAction([file])}
              onFilesAction={handleAction}
              multiple
              maxFiles={50}
              dropHint="or drop up to 50 PNG images here"
            />
            <AdSpace variant="vertical" />
          </div>
          {conversionMessage && <p className="jpg-to-pdf-status" role="status">{conversionMessage}</p>}
          {conversionError && <p className="jpg-to-pdf-error" role="alert">{conversionError}</p>}
        </section>
        <HowToUse heading="How to Convert PNG to PDF" steps={steps} />
        <H2Section blocks={seoBlocks} />
        <FAQ heading="PNG to PDF FAQs" faqs={faqs} />
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
        itemName="PNG to PDF"
      />
    </>
  );
}
