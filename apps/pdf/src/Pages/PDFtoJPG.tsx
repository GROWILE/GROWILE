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
import SoftwareApplicationSchema from "../../../../packages/ui/src/SoftwareApplicationSchema";
import PdfBreadcrumb from "./PdfBreadcrumb";
import PdfToolsFooter from "./toolsFooter";
import PdfIconToolCard from "./IconToolCard";
import Divider from "../../../../packages/ui/src/Divider";
import { convertPdfToJpgZip, downloadJpgZip } from "../Utilities/PDFtoJPGProcessing";
import "./PdfUploadLayout.css";

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Convert your pages", description: "Each PDF page is rendered as a high-quality JPG image." },
  { number: "3", title: "Download the JPGs", description: "Download all converted JPG pages together in a ZIP file." },
];

const seoBlocks = [
  {
    heading: "Convert PDF Pages to JPG Online Free",
    description:
      "With Growile PDF, it is simple to convert PDF pages to JPG online free. Our tool processes your entire document and saves every single page as a separate image file automatically and quickly.",
  },
  {
    heading: "Convert PDF to JPG Without Losing Quality",
    description:
      "Image clarity matters. Our Growile PDF tool ensures you can convert PDF to JPG without losing quality. Your extracted images will keep the exact sharpness and text readability of the original file.",
  },
  {
    heading: "Change PDF to JPG Format Online Free",
    description:
      "The conversion process is effortless. You can change PDF to JPG format online free by simply uploading your file. Growile PDF handles the rest, giving you a zip file of your images in seconds.",
  },
];

const faqs = [
  {
    question: "Is the Growile PDF to JPG tool free?",
    answer:
      "Yes, converting documents to images with Growile PDF is completely free. You can process your files without any hidden charges or subscriptions.",
  },
  {
    question: "Will it extract every page as an image?",
    answer:
      "Yes! Growile PDF will convert all your document pages into separate, high-quality JPG image files, which you can easily download in one click.",
  },
  {
    question: "Will the text in my JPG look blurry?",
    answer:
      "Absolutely not. Growile PDF ensures you get crisp results. Your final JPG images will maintain the exact clarity and sharpness of the original.",
  },
  {
    question: "Do I need to install an app to get JPGs?",
    answer:
      "No software is needed. You can easily turn your documents into image formats directly from your web browser using our online Growile PDF tool.",
  },
  {
    question: "Are my uploaded documents safe?",
    answer:
      "Your data is 100% secure. Growile PDF permanently deletes your uploaded documents and the resulting JPG images from our servers automatically.",
  },
  {
    question: "Can I use this PDF to JPG tool on mobile?",
    answer:
      "Yes, Growile PDF is highly mobile-friendly. You can easily convert your documents into shareable photos using your Android or iOS smartphone.",
  },
  {
    question: "How fast is the PDF to image conversion?",
    answer:
      "It is extremely fast. Once you upload your document, Growile PDF instantly processes it and prepares your high-resolution pictures in seconds.",
  },
  {
    question: "Will watermarks be added to my pictures?",
    answer:
      "No, Growile PDF never adds watermarks. You will receive clean, professional JPG images extracted from your documents, ready for instant use.",
  },
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
        title="Convert PDF to JPG Online Free | Growile PDF"
        description="Use Growile PDF to convert PDF to JPG online free. Easily change PDF pages to JPG format without losing quality. Safe, fast, and 100% free tool!"
        canonicalPath="/pdf/pdf-to-jpg"
      />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile PDF to JPG" description="Convert PDF pages into JPG images online." path="/pdf/pdf-to-jpg" />
      <PdfBreadcrumb label="PDF to JPG" path="pdf-to-jpg" />
      <Hero
        kicker="PDF Conversion"
        title="Convert PDF to JPG Online Free"
        subtitle="Do you need to extract images or view documents as photos? Growile PDF helps you convert PDF to JPG online free in seconds. Whether it is a scanned document or an ebook, our tool turns your pages into high-quality images instantly. You do not need to download any software or create an account. Enjoy unlimited, secure, and fast conversions directly from your web browser without paying any fees."
        ctaText="Upload PDF"
        ctaHref="#pdf-to-jpg-upload"
      />
      <Divider />
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
        <section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title">
          <h2 id="related-pdf-tools-title">More PDF Tools</h2>
          <div className="pdf-related-tools-grid pdf-related-tools-grid-five">
            <PdfIconToolCard toolId="pdf-to-png" />
            <PdfIconToolCard toolId="extract-pdf-pages" />
            <PdfIconToolCard toolId="compress-pdf" />
            <PdfIconToolCard toolId="jpg-to-pdf" />
            <PdfIconToolCard toolId="split-pdf" />
          </div>
        </section>
        <HowToUse heading="How to Convert PDF to JPG" steps={steps} />
        <Divider />
        <H2Section blocks={seoBlocks} />
        <Divider />
        <FAQ heading="Frequently Asked Questions (FAQs)" faqs={faqs} />
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
        itemName="PDF to JPG"
      />
    </>
  );
}
