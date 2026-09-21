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
import { downloadMergedPdf, mergePdfFiles } from "../Utilities/MergePDFProcessing";
import "./JPGtoPDF.css";

const steps = [
  { number: "1", title: "Upload PDF files", description: "Select your PDF files or drag them into the upload area." },
  { number: "2", title: "Arrange your files", description: "Review the files and reorder them to set the final document order." },
  { number: "3", title: "Merge and download", description: "Combine the PDFs and download one merged document." },
];

const seoBlocks = [
  { heading: "Merge PDF Files Online", description: "Combine multiple PDF files into one organized document directly in your browser." },
  { heading: "Keep Your PDF Order", description: "Arrange your uploaded files before merging so the final PDF follows the order you need." },
  { heading: "Simple PDF Merging", description: "Merge PDFs without installing desktop software or uploading your documents to a server." },
];

const faqs = [
  { question: "How do I merge PDF files?", answer: "Upload at least two PDF files, arrange them in the required order, and click Merge PDFs." },
  { question: "Can I change the order of the PDFs?", answer: "Yes. Drag the selected files or use the move controls to arrange them before merging." },
  { question: "How many PDF files can I merge?", answer: "You can select up to 50 PDF files in one merge operation." },
  { question: "Will my PDF files be uploaded to a server?", answer: "No. The merge is processed directly in your browser." },
  { question: "Will the pages stay in the same order?", answer: "Yes. Each source PDF is added in the order shown in the upload area, with its original page order preserved." },
  { question: "Is the Merge PDF tool free?", answer: "Yes. You can merge PDF files online with Growile for free." },
  { question: "Can I merge password-protected PDFs?", answer: "Password-protected or encrypted PDFs cannot be merged unless they can be opened without a password." },
  { question: "What can I do after merging?", answer: "You can use Growile's other PDF tools to convert, compress, edit, protect, or organize the merged document." },
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
  name: "Merge PDF",
  hasPart: seoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

export default function MergePDF() {
  const [isMerging, setIsMerging] = useState(false);
  const [mergeMessage, setMergeMessage] = useState("");
  const [mergeError, setMergeError] = useState("");
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [pendingPdf, setPendingPdf] = useState<Uint8Array | null>(null);

  const triggerDownload = useCallback(() => {
    if (pendingPdf) downloadMergedPdf(pendingPdf, "merged.pdf");
  }, [pendingPdf]);

  const closeDownloadPopup = useCallback(() => {
    setIsDownloadPopupOpen(false);
    setPendingPdf(null);
  }, []);

  const handleAction = async (files: File[]) => {
    setIsMerging(true);
    setMergeMessage("");
    setMergeError("");

    try {
      const pdfBytes = await mergePdfFiles(files);
      setPendingPdf(pdfBytes);
      setIsDownloadPopupOpen(true);
      setMergeMessage(`${files.length} PDF files merged successfully.`);
    } catch (error) {
      setMergeError(error instanceof Error ? error.message : "PDF merging failed.");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Merge PDF Files Online"
        description="Merge multiple PDF files into one document online with Growile's browser-based Merge PDF tool."
        canonicalPath="/tools/merge-pdf"
      />
      <PdfNavBar />
      <Hero
        kicker="PDF Organization"
        title="Merge PDF Files"
        subtitle="Combine multiple PDF files into one organized document."
        ctaText="Upload PDFs"
        ctaHref="#merge-pdf-upload"
      />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="merge-pdf-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FileArchive size={30} aria-hidden="true" />}
              title="Merge PDF"
              description="Combine your PDF files into one document in the order you choose."
              buttonLabel="Select PDF files"
              actionLabel={isMerging ? "Merging..." : "Merge PDFs"}
              actionDisabled={isMerging}
              accept=".pdf,application/pdf"
              onAction={(file) => handleAction([file])}
              onFilesAction={handleAction}
              multiple
              maxFiles={20}
              dropHint="or drop up to 20 PDF files here"
            />
            <AdSpace variant="vertical" />
          </div>
          {mergeMessage && <p className="jpg-to-pdf-status" role="status">{mergeMessage}</p>}
          {mergeError && <p className="jpg-to-pdf-error" role="alert">{mergeError}</p>}
        </section>
        <HowToUse heading="How to Merge PDF Files" steps={steps} />
        <H2Section blocks={seoBlocks} />
        <FAQ heading="Merge PDF FAQs" faqs={faqs} />
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
        itemName="merged PDF"
      />
    </>
  );
}
