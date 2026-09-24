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
import PdfIconToolCard from "./IconToolCard";
import Divider from "../../../../packages/ui/src/Divider";
import { downloadMergedPdf, mergePdfFiles } from "../Utilities/MergePDFProcessing";
import "./JPGtoPDF.css";

const steps = [
  { number: "1", title: "Upload PDF files", description: "Select your PDF files or drag them into the upload area." },
  { number: "2", title: "Arrange your files", description: "Review the files and reorder them to set the final document order." },
  { number: "3", title: "Merge and download", description: "Combine the PDFs and download one merged document." },
];

const seoBlocks = [
  {
    heading: "Combine Multiple PDF Files Online Free",
    description:
      "It is effortless to combine multiple PDF files online free with Growile PDF. Just upload your separate documents, and our smart tool will instantly bind them into one single, easy-to-share file.",
  },
  {
    heading: "Merge PDF Files Without Losing Quality",
    description:
      "Document clarity is essential. Our platform ensures you merge PDF files without losing quality. Your joined file will maintain the exact crisp text, formatting, and layout of all the original files.",
  },
  {
    heading: "Join PDF Files Together Online Free",
    description:
      "The entire process is incredibly smooth. You can join PDF files together online free by simply dropping your documents here. Growile PDF quickly unifies them, delivering your combined file in seconds.",
  },
];

const faqs = [
  {
    question: "Is the Growile PDF merger completely free?",
    answer:
      "Yes, combining documents with Growile PDF is 100% free. You can merge multiple files into a single document without paying any subscription fees.",
  },
  {
    question: "Can I combine multiple PDF files at once?",
    answer:
      "Absolutely! You can easily upload several documents at the same time. Growile PDF will instantly bind all your selected files into one combined PDF.",
  },
  {
    question: "Will the formatting change after merging?",
    answer:
      "No, your layout remains safe. Growile PDF ensures you join files without losing quality, keeping your text and original designs perfectly intact.",
  },
  {
    question: "Do I need software to join PDF files?",
    answer:
      "No installation is needed. You can easily connect your separate documents into one file directly from your web browser using our Growile PDF tool.",
  },
  {
    question: "Are my uploaded and merged files safe?",
    answer:
      "Your privacy is our priority. Growile PDF automatically deletes your original documents and the final combined file from our servers after merging.",
  },
  {
    question: "Does this merging tool work on mobile?",
    answer:
      "Yes, Growile PDF is mobile-friendly. You can comfortably combine your business reports or study materials into one file using your smartphone anytime.",
  },
  {
    question: "How fast is the document merging process?",
    answer:
      "It is extremely quick! Once you upload your separate documents, Growile PDF instantly binds them and prepares your unified file in just seconds.",
  },
  {
    question: "Is there a limit on how many files I can merge?",
    answer:
      "Growile PDF offers a smooth experience for your daily tasks, allowing you to join multiple PDF files together seamlessly without any interruptions.",
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
        title="Merge PDF Files Online Free - Fast & Secure | Growile PDF"
        description="Use Growile PDF to merge PDF files online free. Easily combine multiple PDF files into one document without losing quality. Safe, fast, and 100% free tool!"
        canonicalPath="/tools/merge-pdf"
      />
      <PdfNavBar />
      <Hero
        kicker="PDF Organization"
        title="Merge PDF Files Online Free"
        subtitle="Do you have several documents that need to be in one place? Growile PDF helps you merge PDF files online free in just a few clicks. Whether it is scanning reports or joining invoice pages, our tool seamlessly creates a single, organized file. You do not need to install software or pay hidden fees. Experience fast, secure, and unlimited document merging directly from your web browser today."
        ctaText="Upload PDFs"
        ctaHref="#merge-pdf-upload"
      />
      <Divider />
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
        <section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title">
          <h2 id="related-pdf-tools-title">More PDF Tools</h2>
          <div className="pdf-related-tools-grid pdf-related-tools-grid-five">
            <PdfIconToolCard toolId="compress-pdf" />
            <PdfIconToolCard toolId="split-pdf" />
            <PdfIconToolCard toolId="reorder-pdf-pages" />
            <PdfIconToolCard toolId="delete-pdf-pages" />
            <PdfIconToolCard toolId="add-page-numbers" />
          </div>
        </section>
        <HowToUse heading="How to Merge PDF Files" steps={steps} />
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
        itemName="merged PDF"
      />
    </>
  );
}
