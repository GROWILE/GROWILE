// Renders the compress pdf PDF tool page.
import { useCallback, useState } from "react";
import { FileArchive } from "lucide-react";
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
import {
  compressPdf,
  downloadCompressedPdf,
} from "../Utilities/CompressPDFProcessing";
import "./PdfUploadLayout.css";
import "./CompressPDF.css";

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Compress your PDF", description: "Adjust image quality to target a 50% size reduction." },
  { number: "3", title: "Compare and download", description: "Check the original and compressed sizes, then download." },
];

const seoBlocks = [
  {
    heading: "Reduce PDF File Size Online Free",
    description:
      "Upload a PDF and compress it toward half its original size. The tool adjusts image quality and shows the resulting file size before download.",
  },
  {
    heading: "Compress PDF While Keeping Pages Readable",
    description:
      "PDF pages are converted into high-quality images to reduce file size. This can slightly affect image quality, and text, links, and forms may no longer be selectable or interactive.",
  },
];

const faqs = [
  {
    question: "Is the Growile PDF compressor free?",
    answer:
      "Yes, shrinking documents with Growile PDF is 100% free. You can reduce your file sizes anytime without paying any subscription fees.",
  },
  {
    question: "Can I compress multiple files at once?",
    answer:
      "Absolutely! You can upload several heavy documents. Growile PDF will instantly reduce their sizes, making them perfect for fast sharing.",
  },
  {
    question: "Will the text become unreadable after shrinking?",
    answer:
      "The compressor renders pages as high-quality images and adjusts image quality to target a 50% reduction. Text, links, and forms in the output may no longer be selectable or interactive.",
  },
  {
    question: "Do I need an app to reduce my file size?",
    answer:
      "No installation is needed. You can easily shrink heavy documents directly from your web browser using our online Growile PDF platform.",
  },
  {
    question: "Are my uploaded and optimized files secure?",
    answer:
      "Your data is entirely safe. Growile PDF automatically deletes your original heavy file and the compressed document from our servers.",
  },
  {
    question: "What if my file is still too large to email?",
    answer: (
      <>
        If the file remains too bulky, you can use our{" "}
        <a href="/pdf/split-pdf">Split PDF</a> tool to break the heavy document into smaller, manageable parts for emailing.
      </>
    ),
  },
  {
    question: "Can I remove heavy images before compressing?",
    answer: (
      <>
        If certain pages contain huge images you do not need, try our{" "}
        <a href="/pdf/delete-pdf-pages">Delete PDF Pages</a> tool first to erase them and save even more space.
      </>
    ),
  },
  {
    question: "Does this file reducer work on mobile?",
    answer:
      "Yes, Growile PDF is highly mobile-friendly. You can easily optimize large files on your Android or iOS smartphone while on the move.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(/* Builds a value for each item in the collection. */ (faq) => ({
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
  name: "Compress PDF",
  hasPart: seoBlocks.map(/* Builds a value for each item in the collection. */ (block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

// Formats file size.
function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Renders the compress pdf interface.
export default function CompressPDF() {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressError, setCompressError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressionResult, setCompressionResult] = useState<{ compressedSize: number; targetMet: boolean } | null>(null);
  const [pendingPdf, setPendingPdf] = useState<Uint8Array | null>(null);
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);

  const triggerDownload = useCallback(/* Creates a callback that stays stable until its dependencies change. */ () => {
    if (pendingPdf) downloadCompressedPdf(pendingPdf, "compressed.pdf");
  }, [pendingPdf]);

  const closeDownloadPopup = useCallback(/* Creates a callback that stays stable until its dependencies change. */ () => {
    setIsDownloadPopupOpen(false);
    setPendingPdf(null);
  }, []);

  const handleSelectionChange = /* Handles selection change work. */ (files: File[]) => {
    const file = files[0] ?? null;
    setSelectedFile(file);
    setCompressError("");
    setCompressionResult(null);
  };

  const handleAction = /* Handles action work. */ async (file: File) => {
    setIsCompressing(true);
    setCompressError("");
    setCompressionResult(null);
    try {
      const result = await compressPdf(file);
      setPendingPdf(result.bytes);
      setIsDownloadPopupOpen(true);
      setCompressionResult({ compressedSize: result.bytes.byteLength, targetMet: result.targetMet });
    } catch (error) {
      setCompressError(error instanceof Error ? error.message : "PDF compression failed.");
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Compress PDF File Size Online Free - Fast | Growile PDF"
        description="Compress PDF files online for free toward 45% smaller. Compare original and compressed sizes with image compression."
        canonicalPath="/pdf/compress-pdf"
      />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile Compress PDF" description="Reduce PDF file size online." path="/pdf/compress-pdf" />
      <PdfBreadcrumb label="Compress PDF" path="compress-pdf" />
      <Hero
        kicker="PDF Compression"
        title="Compress PDF File Size Online Free"
        subtitle="Aim to reduce your PDF by at least 45% with image compression. Compare the original and compressed file sizes before downloading."
        ctaText="Upload PDF"
        ctaHref="#compress-pdf-upload"
      />
      <Divider />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="compress-pdf-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FileArchive size={30} aria-hidden="true" />}
              title="Compress PDF"
              description="Aim to reduce PDF size by 50%. Pages are converted to images, so text, links, and forms may no longer be selectable or interactive."
              buttonLabel="Select PDF file"
              actionLabel={isCompressing ? "Compressing..." : "Compress PDF"}
              actionDisabled={isCompressing || !selectedFile}
              accept=".pdf,application/pdf"
              onAction={handleAction}
              onSelectionChange={handleSelectionChange}
              selectedContent={
                selectedFile ? (
                  <div className="compress-pdf-options">
                    <div className="compress-pdf-file-size">
                      Original size: <strong>{formatFileSize(selectedFile.size)}</strong>
                    </div>
                    {compressionResult && (
                      <div className="compress-pdf-file-size" role="status">
                        Compressed size: <strong>{formatFileSize(compressionResult.compressedSize)}</strong>
                      </div>
                    )}
                    {compressionResult && !compressionResult.targetMet && (
                      <p className="compress-pdf-compression-note" role="status">
                        A 45% reduction was not achievable at the selected quality limit. The output is still smaller than the original.
                      </p>
                    )}
                  </div>
                ) : null
              }
              dropHint="or drop one PDF file here"
            />
            <AdSpace variant="vertical" />
          </div>
          {compressError && <p className="jpg-to-pdf-error" role="alert">{compressError}</p>}
        </section>
        <section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title">
          <h2 id="related-pdf-tools-title">More PDF Tools</h2>
          <div className="pdf-related-tools-grid pdf-related-tools-grid-five">
            <PdfIconToolCard toolId="merge-pdf" />
            <PdfIconToolCard toolId="split-pdf" />
            <PdfIconToolCard toolId="protect-pdf" />
            <PdfIconToolCard toolId="jpg-to-pdf" />
            <PdfIconToolCard toolId="add-watermark" />
          </div>
        </section>
        <HowToUse heading="How to Compress a PDF" steps={steps} />
        <Divider />
        <H2Section blocks={seoBlocks} />
        <Divider />
        <FAQ heading="Compress PDF FAQs" faqs={faqs} />
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
        itemName="compressed PDF"
      />
    </>
  );
}
