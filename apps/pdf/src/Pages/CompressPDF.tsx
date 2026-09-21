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
import PdfToolsFooter from "./toolsFooter";
import {
  compressPdf,
  downloadCompressedPdf,
  type CompressionTarget,
} from "../Utilities/CompressPDFProcessing";
import "./JPGtoPDF.css";
import "./CompressPDF.css";

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Choose a compression size", description: "Select the target size that fits your needs." },
  { number: "3", title: "Compress and download", description: "Create and download your smaller PDF." },
];

const seoBlocks = [
  { heading: "Compress PDF Files Online", description: "Reduce PDF file size directly in your browser with a target size that you choose." },
  { heading: "Choose Your Compression Level", description: "Use the default 75% reduction or select a 1MB, 500KB, 200KB, or 100KB target when available." },
  { heading: "Simple PDF Compression", description: "Compress PDFs without installing desktop software or uploading your document to a server." },
];

const faqs = [
  { question: "How do I compress a PDF?", answer: "Upload one PDF, choose an available compression option, and click Compress PDF." },
  { question: "What does the default option do?", answer: "Default compression targets approximately 25% of the original file size, reducing it by about 75%." },
  { question: "What compression sizes are available?", answer: "Depending on the original file size, the tool can offer 1MB, 500KB, 200KB, and 100KB targets." },
  { question: "Will the final file be smaller than the selected target?", answer: "Yes. The selected size is a maximum target, so a result below it is accepted as an even better compression." },
  { question: "Can I upload more than one PDF?", answer: "This Compress PDF tool accepts one PDF file at a time." },
  { question: "Will my PDF be uploaded to a server?", answer: "No. Compression is processed directly in your browser." },
  { question: "Is the Compress PDF tool free?", answer: "Yes. You can compress PDF files online with Growile for free." },
  { question: "Will the PDF content stay readable?", answer: "The tool balances image quality and file size, though stronger compression can reduce visual quality." },
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
        title="Compress PDF Files Online"
        description="Compress PDF files online with a chosen file size target using Growile's browser-based Compress PDF tool."
        canonicalPath="/tools/compress-pdf"
      />
      <PdfNavBar />
      <Hero
        kicker="PDF Compression"
        title="Compress PDF Files"
        subtitle="Reduce your PDF file size and choose the compression level you need."
        ctaText="Upload PDF"
        ctaHref="#compress-pdf-upload"
      />
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
        <HowToUse heading="How to Compress a PDF" steps={steps} />
        <H2Section blocks={seoBlocks} />
        <FAQ heading="Compress PDF FAQs" faqs={faqs} />
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
