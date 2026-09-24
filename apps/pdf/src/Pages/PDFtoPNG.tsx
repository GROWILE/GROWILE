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
import { convertPdfToPngZip, downloadPngZip } from "../Utilities/PDFtoPNGProcessing";
import "./JPGtoPDF.css";

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Convert your pages", description: "Each PDF page is rendered as a high-quality PNG image." },
  { number: "3", title: "Download the PNGs", description: "Download all converted PNG pages together in a ZIP file." },
];

const seoBlocks = [
  {
    heading: "Convert PDF Pages to PNG Online Free",
    description:
      "With Growile PDF, it is very simple to convert PDF pages to PNG online free. Our smart tool scans your entire document and automatically saves every single page as a separate, crisp image file.",
  },
  {
    heading: "Convert PDF to PNG Without Losing Quality",
    description:
      "Retaining visual clarity is vital. Our tool ensures you convert PDF to PNG without losing quality. The final pictures will keep the exact sharp text and vibrant graphics of your original file.",
  },
  {
    heading: "Change PDF to PNG Format Online Free",
    description:
      "The process is incredibly smooth. You can change PDF to PNG format online free by just dropping your file here. Growile PDF does the heavy lifting, delivering high-resolution images instantly.",
  },
];

const faqs = [
  {
    question: "Is the Growile PDF to PNG converter free?",
    answer:
      "Yes, changing documents into PNGs with Growile PDF is totally free. You can process your vector files or text pages without any hidden subscription.",
  },
  {
    question: "Will it extract all document pages as PNGs?",
    answer:
      "Yes! Growile PDF safely converts all your document pages into individual PNG image files, which you can easily download together in one single click.",
  },
  {
    question: "Will my converted PNG images look blurry?",
    answer:
      "Not at all. Growile PDF guarantees high resolution. Your final PNG graphics will keep the exact sharpness and visual clarity of the original file.",
  },
  {
    question: "Do I need an app to get PNG pictures?",
    answer:
      "No software installation is required. You can easily turn your files into lossless PNG images directly from your browser using our Growile PDF tool.",
  },
  {
    question: "Are my uploaded documents safe here?",
    answer:
      "Your privacy is 100% secure. Growile PDF automatically and permanently deletes your uploaded documents and the resulting PNGs from our secure servers.",
  },
  {
    question: "Does this PDF to PNG tool work on mobile?",
    answer:
      "Yes, Growile PDF is fully optimized for mobile devices. You can effortlessly generate PNG pictures from your documents using your smartphone anytime.",
  },
  {
    question: "Can this tool retain transparent backgrounds?",
    answer:
      "Yes, if your original document has transparent elements, our PNG converter will perfectly maintain that transparency in your final downloaded images.",
  },
  {
    question: "Will there be watermarks on my PNG files?",
    answer:
      "No, Growile PDF will never add watermarks. You will receive clean, professional-grade PNG images created from your documents, ready for instant use.",
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
  name: "PDF to PNG Converter",
  hasPart: seoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

export default function PDFtoPNG() {
  const [isConverting, setIsConverting] = useState(false);
  const [conversionMessage, setConversionMessage] = useState("");
  const [conversionError, setConversionError] = useState("");
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [pendingZip, setPendingZip] = useState<Uint8Array | null>(null);

  const triggerDownload = useCallback(() => {
    if (pendingZip) downloadPngZip(pendingZip, "pdf-to-png.zip");
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
      const zipBytes = await convertPdfToPngZip(file);
      setPendingZip(zipBytes);
      setIsDownloadPopupOpen(true);
      setConversionMessage("PDF pages converted to PNG images.");
    } catch (error) {
      setConversionError(error instanceof Error ? error.message : "PDF to PNG conversion failed.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Convert PDF to PNG Online Free & High Quality | Growile PDF"
        description="Use Growile PDF to convert PDF to PNG online free. Easily change PDF pages to PNG format without losing quality. Safe, fast, and 100% free tool!"
        canonicalPath="/pdf/pdf-to-png"
      />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile PDF to PNG" description="Convert PDF pages into PNG images online." path="/pdf/pdf-to-png" />
      <PdfBreadcrumb label="PDF to PNG" path="pdf-to-png" />
      <Hero
        kicker="PDF Conversion"
        title="Convert PDF to PNG Online Free"
        subtitle="Do you need to turn your documents into high-quality transparent images? Growile PDF helps you convert PDF to PNG online free in just a few clicks. Whether it is a digital graphic or a text document, our tool changes your pages into crystal-clear picture files easily. There is no software to install or hidden costs. Enjoy fast, secure, and limitless conversions directly from your web browser."
        ctaText="Upload PDF"
        ctaHref="#pdf-to-png-upload"
      />
      <Divider />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="pdf-to-png-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FileOutput size={30} aria-hidden="true" />}
              title="PDF to PNG"
              description="Convert each page of your PDF into a PNG image."
              buttonLabel="Select PDF file"
              actionLabel={isConverting ? "Converting..." : "Convert to PNG"}
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
        <HowToUse heading="How to Convert PDF to PNG" steps={steps} />
        <Divider />
        <H2Section blocks={seoBlocks} />
        <Divider />
        <FAQ heading="Frequently Asked Questions (FAQs)" faqs={faqs} />
        <Divider />
        <section className="pdf-related-tools" aria-labelledby="pdf-related-tools-title">
          <h2 id="pdf-related-tools-title">More PDF Tools</h2>
          <div className="pdf-related-tools-grid pdf-related-tools-grid-five">
            <PdfIconToolCard toolId="pdf-to-jpg" />
            <PdfIconToolCard toolId="extract-pdf-pages" />
            <PdfIconToolCard toolId="compress-pdf" />
            <PdfIconToolCard toolId="png-to-pdf" />
            <PdfIconToolCard toolId="split-pdf" />
          </div>
        </section>
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
        itemName="PDF to PNG"
      />
    </>
  );
}
