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
  type CompressionTarget,
} from "../Utilities/CompressPDFProcessing";
import "./PdfUploadLayout.css";
import "./CompressPDF.css";

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Choose a compression size", description: "Select the target size that fits your needs." },
  { number: "3", title: "Compress and download", description: "Create and download your smaller PDF." },
];

const seoBlocks = [
  {
    heading: "Compress PDF to 100kb Online Free",
    description:
      "Need a tiny file for a web upload? It is simple to compress PDF to 100kb online free with Growile PDF. Just upload your heavy document, and our smart tool will aggressively shrink the size quickly.",
  },
  {
    heading: "Compress PDF to 200kb Online Free",
    description:
      "If government portals require specific sizes, you can easily compress PDF to 200kb online free. Growile PDF optimizes your bulky files instantly, making them perfectly sized for quick email sharing.",
  },
  {
    heading: "Compress PDF Without Losing Quality Online Free",
    description:
      "Worried about blurry text? Our tool ensures you can compress PDF without losing quality online free. We carefully reduce the file weight while keeping your text sharp and images perfectly readable.",
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
      "Not at all. Growile PDF uses smart optimization to ensure your text and images remain sharp and clear even after massive size reduction.",
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
  mainEntity: faqs.map((faq) => ({
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
  hasPart: seoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getCompressionOptions(fileSize: number): CompressionTarget[] {
  if (fileSize > 1024 * 1024) return ["default", "1mb", "500kb", "200kb", "100kb"];
  if (fileSize > 500 * 1024) return ["default", "200kb", "100kb"];
  return ["default"];
}

function isLargePdf(fileSize: number) {
  return fileSize > 20 * 1024 * 1024;
}

const optionLabels: Record<CompressionTarget, string> = {
  default: "Compress PDF (75% smaller)",
  "1mb": "Compress to 1 MB or less",
  "500kb": "Compress to 500 KB or less",
  "200kb": "Compress to 200 KB or less",
  "100kb": "Compress to 100 KB or less",
};

export default function CompressPDF() {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressMessage, setCompressMessage] = useState("");
  const [compressError, setCompressError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [target, setTarget] = useState<CompressionTarget>("default");
  const [pendingPdf, setPendingPdf] = useState<Uint8Array | null>(null);
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);

  const triggerDownload = useCallback(() => {
    if (pendingPdf) downloadCompressedPdf(pendingPdf, "compressed.pdf");
  }, [pendingPdf]);

  const closeDownloadPopup = useCallback(() => {
    setIsDownloadPopupOpen(false);
    setPendingPdf(null);
  }, []);

  const handleSelectionChange = (files: File[]) => {
    const file = files[0] ?? null;
    setSelectedFile(file);
    setCompressMessage("");
    setCompressError("");
    if (file) setTarget(getCompressionOptions(file.size)[0]);
  };

  const handleAction = async (file: File) => {
    setIsCompressing(true);
    setCompressMessage("");
    setCompressError("");
    try {
      const pdfBytes = await compressPdf(file, target);
      setPendingPdf(pdfBytes);
      setIsDownloadPopupOpen(true);
      setCompressMessage(`PDF compressed to ${formatFileSize(pdfBytes.byteLength)}.`);
    } catch (error) {
      setCompressError(error instanceof Error ? error.message : "PDF compression failed.");
    } finally {
      setIsCompressing(false);
    }
  };

  const availableOptions = selectedFile ? getCompressionOptions(selectedFile.size) : [];

  return (
    <>
      <PageMeta
        title="Compress PDF File Size Online Free - Fast | Growile PDF"
        description="Use Growile PDF to compress PDF file size online free. Shrink documents to 100KB or 200KB easily without losing quality. Safe, fast, and 100% free tool!"
        canonicalPath="/pdf/compress-pdf"
      />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile Compress PDF" description="Reduce PDF file size online." path="/pdf/compress-pdf" />
      <PdfBreadcrumb label="Compress PDF" path="compress-pdf" />
      <Hero
        kicker="PDF Compression"
        title="Compress PDF File Size Online Free"
        subtitle="Do you need to email a heavy document but the attachment is too large? Growile PDF helps you compress PDF file size online free in just a few clicks. Whether it is a bulky report or a scanned ebook, our tool shrinks your files instantly. You do not need to install software or pay hidden fees. Enjoy fast, secure, and unlimited document size reduction directly from your web browser today easily."
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
              description="Choose a target size after selecting your PDF."
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
                      Original file size: <strong>{formatFileSize(selectedFile.size)}</strong>
                    </div>
                    {isLargePdf(selectedFile.size) && (
                      <div className="compress-pdf-recommendation" role="note">
                        <strong>Recommended for this large PDF</strong>
                        <span>Default compression or 1 MB keeps a better balance between size and quality.</span>
                      </div>
                    )}
                    <div className="compress-pdf-options-list" role="radiogroup" aria-label="Compression options">
                      {availableOptions.map((option) => (
                        <label className={`compress-pdf-option ${target === option ? "selected" : ""}`} key={option}>
                          <input
                            type="radio"
                            name="compression-target"
                            value={option}
                            checked={target === option}
                            onChange={() => setTarget(option)}
                          />
                          <span>{optionLabels[option]}</span>
                          {isLargePdf(selectedFile.size) && (option === "default" || option === "1mb") && (
                            <em>Recommended</em>
                          )}
                        </label>
                      ))}
                    </div>
                    {isLargePdf(selectedFile.size) && (
                      <p className="compress-pdf-quality-note">
                        500 KB, 200 KB, and 100 KB can reduce quality, but may produce a smaller file.
                      </p>
                    )}
                  </div>
                ) : null
              }
              dropHint="or drop one PDF file here"
            />
            <AdSpace variant="vertical" />
          </div>
          {compressMessage && <p className="jpg-to-pdf-status" role="status">{compressMessage}</p>}
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
