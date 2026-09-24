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
import SoftwareApplicationSchema from "../../../../packages/ui/src/SoftwareApplicationSchema";
import PdfBreadcrumb from "./PdfBreadcrumb";
import PdfToolsFooter from "./toolsFooter";
import PdfIconToolCard from "./IconToolCard";
import Divider from "../../../../packages/ui/src/Divider";
import { convertPngFilesToPdf, downloadPngPdf } from "../Utilities/PNGtoPDFProcessing";
import "./JPGtoPDF.css";

const seoBlocks = [
  { heading: "Convert Multiple PNG to PDF Online Free", description: "Do you have many images to process? With Growile PDF, you can easily convert multiple PNG to PDF online free. Just upload your batch of photos, and we will combine them into one single file quickly." },

  { heading: "Convert PNG to PDF Without Losing Quality",
   description: "Image clarity is very important. Our Growile PDF tool ensures you can convert PNG to PDF without losing quality. Your final document will keep the exact original resolution and transparent details." },

  { heading: "Change PNG Format to PDF Online Free", 
    description: "The process is incredibly simple for everyone. You can change PNG format to PDF online free by just dragging and dropping your files. Growile PDF handles the rest to give you a ready document." },
];

const steps = [
  { number: "1", title: "Upload PNG files", description: "Select PNG images or drag them into the upload area." },
  { number: "2", title: "Arrange your images", description: "Review the previews and drag or move images into the order you need." },
  { number: "3", title: "Create your PDF", description: "Start the conversion and download your new PDF document." },
];

const faqs = [
  { question: "Is the Growile PDF PNG converter free?", 
    answer: "Yes, converting PNGs with Growile PDF is completely free. You can process your transparent graphics without limits or hidden costs." },

  { question: "Can I convert multiple PNG files at once?", answer: "Yes, you can upload a batch of PNGs. Growile PDF will flawlessly combine all your design assets and screenshots into a single document." },

  { question: "Will my PNGs lose their original quality?",
    answer: "No, your graphic quality is protected. Growile PDF maintains the crisp details and vibrant colors of your original PNG designs." },

  { question: "Do I need to install software to process PNGs?", 
    answer: "Not at all. Growile PDF operates entirely online, allowing you to convert PNG formats directly through your preferred web browser." },

  { question: "Are my uploaded PNG files safe with Growile PDF?", 
    answer: "Your data is 100% safe. Growile PDF permanently removes your PNG uploads and resulting documents from our encrypted servers after processing." },

  { question: "Will the transparent background of my PNG stay?",    answer: "Yes! Our PNG tool is designed to perfectly handle transparency, ensuring your graphics look exactly as intended in the final file." },

  { question: "Can I use this PNG converter on my Mac?", 
    answer: "Yes, Growile PDF works flawlessly on Mac, Windows, and Linux. You can process your PNG files smoothly on any operating system." },

  { question: "Is there a file limit for PNG conversions?", answer: "Growile PDF offers a seamless experience for your daily tasks, allowing you to convert your essential PNG graphics without any hassle." },
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
        title="Convert PNG to PDF Online Free | Growile PDF"
        description="Use Growile PDF to convert PNG to PDF online free. Easily change multiple PNG formats to PDF without losing quality. Safe, fast, and 100% free tool!"
        canonicalPath="/pdf/png-to-pdf"
      />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile PNG to PDF" description="Convert PNG images into PDF files online." path="/pdf/png-to-pdf" />
      <PdfBreadcrumb label="PNG to PDF" path="png-to-pdf" />
      <Hero
        kicker="PDF Conversion"
        title="Convert PNG to PDF Online Free with Growile PDF"
        subtitle="Are you looking for a simple way to turn your images into documents? Growile PDF helps you convert PNG to PDF online free in just a few seconds. Whether it is a single logo or a design file, our smart tool creates a perfectly formatted document instantly. You do not need to download software or pay hidden fees. Experience fast and secure conversions directly from your web browser today."
        ctaText="Upload PNG"
        ctaHref="#png-to-pdf-upload"
      />
      <Divider />
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
        <section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title">
          <h2 id="related-pdf-tools-title">More PDF Tools</h2>
          <div className="pdf-related-tools-grid pdf-related-tools-grid-five">
            <PdfIconToolCard toolId="compress-pdf" />
            <PdfIconToolCard toolId="merge-pdf" />
            <PdfIconToolCard toolId="jpg-to-pdf" />
            <PdfIconToolCard toolId="pdf-to-png" />
            <PdfIconToolCard toolId="protect-pdf" />
          </div>
        </section>
        <HowToUse heading="How to Convert PNG to PDF" steps={steps} />
        <Divider />
        <H2Section blocks={seoBlocks} />
        <Divider />
        <FAQ heading="PNG to PDF FAQs" faqs={faqs} />
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
        itemName="PNG to PDF"
      />
    </>
  );
}
