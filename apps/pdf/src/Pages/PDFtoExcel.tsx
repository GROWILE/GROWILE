import { useCallback, useState } from "react";
import { FileSpreadsheet } from "lucide-react";
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
import Divider from "../../../../packages/ui/src/Divider";
import { convertPdfToExcel, downloadExcelFile } from "../Utilities/PDFtoExcelProcessing";
import "./JPGtoPDF.css";

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Build the workbook", description: "Text is added to editable spreadsheet cells with page previews." },
  { number: "3", title: "Download the Excel file", description: "Download the generated XLSX workbook and edit its content." },
];

const seoBlocks = [
  { heading: "Convert PDF to Excel Online", description: "Turn PDF text into editable Excel cells with page previews in one workbook." },
  { heading: "Create an Editable Spreadsheet", description: "Upload one PDF and review, edit, and organize extracted content in Excel." },
  { heading: "Simple PDF to Excel Conversion", description: "Use a focused browser-based workflow without installing desktop software." },
];

const faqs = [
  { question: "How do I convert PDF to Excel?", answer: "Upload one PDF file and click Convert to Excel to download an XLSX workbook." },
  { question: "Can I upload more than one PDF?", answer: "This converter accepts one PDF file at a time." },
  { question: "Can I edit the extracted content?", answer: "Yes. Extracted text is placed in editable Excel cells." },
  { question: "Are images and graphs included?", answer: "Each PDF page is included as an editable image object in the workbook so visual content can be reviewed and moved." },
  { question: "Will complex tables be preserved exactly?", answer: "Text is extracted into spreadsheet cells, but complex table layouts may need manual adjustment." },
  { question: "Do I need to install software?", answer: "No. The conversion runs directly in your browser." },
  { question: "Is the conversion free?", answer: "Yes. You can use this browser-based PDF to Excel converter online." },
  { question: "What file will I download?", answer: "The result is downloaded as an editable XLSX Excel workbook." },
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
  name: "PDF to Excel Converter",
  hasPart: seoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

export default function PDFtoExcel() {
  const [isConverting, setIsConverting] = useState(false);
  const [conversionMessage, setConversionMessage] = useState("");
  const [conversionError, setConversionError] = useState("");
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [pendingWorkbook, setPendingWorkbook] = useState<Blob | null>(null);

  const triggerDownload = useCallback(() => {
    if (pendingWorkbook) downloadExcelFile(pendingWorkbook, "pdf-to-excel.xlsx");
  }, [pendingWorkbook]);

  const closeDownloadPopup = useCallback(() => {
    setIsDownloadPopupOpen(false);
    setPendingWorkbook(null);
  }, []);

  const handleAction = async (file: File) => {
    setIsConverting(true);
    setConversionMessage("");
    setConversionError("");

    try {
      const workbook = await convertPdfToExcel(file);
      setPendingWorkbook(workbook);
      setIsDownloadPopupOpen(true);
      setConversionMessage("PDF converted to an editable Excel workbook.");
    } catch (error) {
      setConversionError(error instanceof Error ? error.message : "PDF to Excel conversion failed.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="PDF to Excel Converter"
        description="Convert PDF files to editable Excel workbooks online with Growile's browser-based PDF to Excel converter."
        canonicalPath="/tools/pdf-to-excel"
      />
      <PdfNavBar />
      <Hero
        kicker="PDF Conversion"
        title="PDF to Excel Converter"
        subtitle="Convert PDF content into editable Excel cells with images and page previews."
        ctaText="Upload PDF"
        ctaHref="#pdf-to-excel-upload"
      />
      <Divider />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="pdf-to-excel-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FileSpreadsheet size={30} aria-hidden="true" />}
              title="PDF to Excel"
              description="Convert PDF text, images, and page previews into an editable Excel workbook."
              buttonLabel="Select PDF file"
              actionLabel={isConverting ? "Converting..." : "Convert to Excel"}
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
        <HowToUse heading="How to Convert PDF to Excel" steps={steps} />
        <Divider />
        <H2Section blocks={seoBlocks} />
        <Divider />
        <FAQ heading="PDF to Excel FAQs" faqs={faqs} />
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
        itemName="PDF to Excel"
      />
    </>
  );
}
