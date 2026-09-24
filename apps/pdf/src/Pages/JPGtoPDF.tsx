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
import SoftwareApplicationSchema from "../../../../packages/ui/src/SoftwareApplicationSchema";
import PdfBreadcrumb from "./PdfBreadcrumb";
import PdfToolsFooter from "./toolsFooter";
import PdfIconToolCard from "./IconToolCard";
import DownloadPopup from "../../../../packages/ui/src/DownloadPopup";
import Divider from "../../../../packages/ui/src/Divider";
import { convertJpgFilesToPdf, downloadPdf } from "../Utilities/JPGtoPDFProcessing";
import "./JPGtoPDF.css";

const seoBlocks = [
  {
    heading: "How to Change JPG to PDF Format Online Free",
    description:
      "It is very easy to use. Just upload your image files, arrange them in the order you want, and click the convert button. You can change JPG to PDF format online free in seconds with zero hassle.",
  },
  {
    heading: "Convert Multiple JPG to PDF Online Free",
    description:
      "Got many photos? No problem. You can convert multiple JPG to PDF online free by uploading them all at once. Our tool will combine all your selected images into one neat PDF document perfectly.",
  },
  {
    heading: "Convert JPG to PDF Without Losing Quality",
    description:
      "Worried about blurry images? We ensure that you can convert JPG to PDF without losing quality. The final document will keep the exact colors, sharpness, and details of your original photos.",
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
    question: "Is this JPG to PDF converter free?",
    answer:
      "Yes, the Growile PDF converter is 100% free. You can transform your JPG photos into documents without any hidden fees or subscriptions.",
  },
  {
    question: "Can I upload many JPG images at once?",
    answer:
      "Yes! You can upload multiple JPGs together. Growile PDF will instantly merge all your selected photographs into one organized PDF file.",
  },
  {
    question: "Will the JPG image quality drop after conversion?",
    answer:
      "Absolutely not. Growile PDF ensures your original JPG resolution and colors remain perfectly sharp in the final document.",
  },
  {
    question: "Do I need to install an app to convert JPGs?",
    answer:
      "No installation is required. You can convert JPG files directly in your web browser using Growile PDF on any device.",
  },
  {
    question: "Are my uploaded JPG photos safe?",
    answer: "Yes, your privacy is secure. Growile PDF automatically deletes your uploaded JPG images and the final file from our servers quickly.",
  },
  {
    question: "Does this tool work on mobile for JPG files?",
    answer:
      "Yes, Growile PDF is highly mobile-friendly. You can easily convert your camera photos from your Android or iOS smartphone on the go.",
  },
  {
    question: "How fast is the JPG conversion process?",
    answer:
      "It is incredibly fast! Once you upload your JPG images, Growile PDF generates your new document ready for download in just seconds.",
  },
  {
    question: "Is there a watermark on my converted JPGs?",
    answer:
      "No, Growile PDF never adds watermarks. You get a clean, professional document made from your JPGs, ready to share or print instantly.",
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
        title="Convert JPG to PDF Online Free - High Quality | Growile PDF"
        description="Convert JPG to PDF online free with our fast tool. Change multiple JPG to PDF format without losing quality. Enjoy safe, unlimited, and easy conversions!"
        canonicalPath="/pdf/jpg-to-pdf"
      />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile JPG to PDF" description="Convert JPG images into PDF files online." path="/pdf/jpg-to-pdf" />
      <PdfBreadcrumb label="JPG to PDF" path="jpg-to-pdf" />
      <Hero
        kicker="PDF Conversion"
        title="Convert JPG to PDF Online Free"
        subtitle="Looking for a fast way to turn your images into documents? Our tool lets you convert JPG to PDF online free in just a few clicks. Whether it is a single photo or a batch of scanned receipts, you can easily create a single, easy-to-share file. No sign-ups or hidden fees are required. Enjoy unlimited access to high-quality conversions right from your browser. Try it now and save your time!"
        ctaText="Upload JPG"
        ctaHref="#jpg-to-pdf-upload"
      />

      <Divider />

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

        <section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title">
          <h2 id="related-pdf-tools-title">More PDF Tools</h2>
          <div className="pdf-related-tools-grid pdf-related-tools-grid-five">
            <PdfIconToolCard toolId="compress-pdf" />
            <PdfIconToolCard toolId="merge-pdf" />
            <PdfIconToolCard toolId="png-to-pdf" />
            <PdfIconToolCard toolId="pdf-to-jpg" />
            <PdfIconToolCard toolId="protect-pdf" />
          </div>
        </section>

        <HowToUse heading="How to Convert JPG to PDF" steps={steps} />

        <Divider />

        <H2Section blocks={seoBlocks} />

        <Divider />

        <FAQ heading="JPG to PDF FAQs" faqs={faqs} />

        <Divider />

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
