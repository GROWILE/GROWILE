import { useCallback, useState } from "react";
import type { ReactNode } from "react";
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
import { convertOfficeToPdf, downloadOfficePdf } from "../Utilities/OfficeToPDFProcessing";
import "./JPGtoPDF.css";

type OfficeFormat = "word" | "excel" | "powerpoint";

const config = {
  word: {
    title: "Word to PDF",
    formatLabel: "Word",
    extensions: ".docx",
    icon: "W",
    description: "Convert Word content into a shareable PDF document.",
    subtitle: "Convert your Word document into a PDF with a simple browser-based workflow.",
  },
  excel: {
    title: "Excel to PDF",
    formatLabel: "Excel",
    extensions: ".xlsx",
    icon: "X",
    description: "Convert spreadsheet content into a clean PDF document.",
    subtitle: "Convert your Excel workbook into a PDF with a simple browser-based workflow.",
  },
  powerpoint: {
    title: "PowerPoint to PDF",
    formatLabel: "PowerPoint",
    extensions: ".ppt,.pptx",
    icon: "P",
    description: "Convert presentation content into a shareable PDF document.",
    subtitle: "Convert your PowerPoint presentation into a PDF with a simple browser-based workflow.",
  },
} as const;

export default function OfficeToPDFPage({ format, icon }: { format: OfficeFormat; icon: ReactNode }) {
  const current = config[format];
  const [isConverting, setIsConverting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pendingPdf, setPendingPdf] = useState<Uint8Array | null>(null);
  const triggerDownload = useCallback(() => {
    if (pendingPdf) downloadOfficePdf(pendingPdf, `${format}-to-pdf.pdf`);
  }, [format, pendingPdf]);
  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
    setPendingPdf(null);
  }, []);
  const handleAction = async (file: File) => {
    setIsConverting(true);
    setMessage("");
    setError("");
    try {
      setPendingPdf(await convertOfficeToPdf(file, format));
      setIsPopupOpen(true);
      setMessage(`${current.formatLabel} file converted to PDF.`);
    } catch (conversionError) {
      setError(conversionError instanceof Error ? conversionError.message : `${current.title} conversion failed.`);
    } finally {
      setIsConverting(false);
    }
  };
  const steps = [
    { number: "1", title: `Upload ${current.formatLabel}`, description: `Select one ${current.formatLabel} file.` },
    { number: "2", title: "Convert the content", description: "Readable text and spreadsheet or slide content is placed into PDF pages." },
    { number: "3", title: "Download the PDF", description: "Download the generated PDF after processing." },
  ];
  const blocks = [
    { heading: `Convert ${current.formatLabel} to PDF Online`, description: current.subtitle },
    { heading: "Create a Shareable PDF", description: `Turn your ${current.formatLabel} content into a PDF that is easy to share and view.` },
    { heading: "Simple Content-Focused Conversion", description: "Use a focused browser-based workflow without installing desktop software." },
  ];
  const faqs = [
    { question: `How do I convert ${current.formatLabel} to PDF?`, answer: `Upload one ${current.formatLabel} file and click Convert to PDF.` },
    { question: "Can I upload more than one file?", answer: "This converter accepts one file at a time." },
    { question: "Will the content be editable before conversion?", answer: "The original file remains editable; the generated PDF is optimized for viewing and sharing." },
    { question: "Will complex formatting stay exact?", answer: "This browser-based converter focuses on readable content, so complex formatting may change." },
    { question: "Do I need to install software?", answer: "No. The conversion runs directly in your browser." },
    { question: "Is the conversion free?", answer: "Yes. You can use this browser-based converter online." },
    { question: "Will my file be uploaded to a server?", answer: "The conversion is processed in your browser." },
    { question: "What file will I download?", answer: "The result is downloaded as a PDF file." },
  ];
  return (
    <>
      <PageMeta title={`${current.title} Converter`} description={current.subtitle} canonicalPath={`/tools/${format}-to-pdf`} />
      <PdfNavBar />
      <Hero kicker="PDF Conversion" title={`${current.title} Converter`} subtitle={current.subtitle} ctaText={`Upload ${current.formatLabel}`} ctaHref={`#${format}-to-pdf-upload`} />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id={`${format}-to-pdf-upload`}>
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={icon}
              title={current.title}
              description={current.description}
              buttonLabel={`Select ${current.formatLabel} file`}
              actionLabel={isConverting ? "Converting..." : "Convert to PDF"}
              actionDisabled={isConverting}
              accept={current.extensions}
              onAction={handleAction}
              dropHint={`or drop one ${current.formatLabel} file here`}
            />
            <AdSpace variant="vertical" />
          </div>
          {message && <p className="jpg-to-pdf-status" role="status">{message}</p>}
          {error && <p className="jpg-to-pdf-error" role="alert">{error}</p>}
        </section>
        <HowToUse heading={`How to Convert ${current.formatLabel} to PDF`} steps={steps} />
        <H2Section blocks={blocks} />
        <FAQ heading={`${current.formatLabel} to PDF FAQs`} faqs={faqs} />
      </main>
      <PdfToolsFooter />
      <Footer />
      <AdSpace className="footer-bottom-ad-space" />
      <DownloadPopup isOpen={isPopupOpen} onClose={closePopup} onTriggerDownload={triggerDownload} itemName={current.title} />
    </>
  );
}
