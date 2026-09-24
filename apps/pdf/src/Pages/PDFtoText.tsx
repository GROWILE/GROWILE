import { useCallback, useState } from "react";
import { FileText } from "lucide-react";
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
import { convertPdfToText, downloadTextFile } from "../Utilities/PDFtoTextProcessing";
import "./JPGtoPDF.css";

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Extract the text", description: "Text from every PDF page is collected in the original page order." },
  { number: "3", title: "Download the text", description: "Download the extracted content as a TXT file." },
];

const seoBlocks = [
  {
    heading: "Extract Text from PDF Online Free",
    description:
      "It is incredibly easy to extract text from PDF online free with Growile PDF. Our fast tool reads your document and gives you a clean, editable Notepad file, saving you hours of manual typing work.",
  },
  {
    heading: "Convert Scanned PDF to Text Online Free",
    description:
      "Have images with text? You can easily convert scanned PDF to text online free. Our advanced tool quickly recognizes the characters in your scanned files and delivers accurate, fully editable words.",
  },
  {
    heading: "Change PDF to TXT Format Online Free",
    description:
      "The conversion process is smooth for everyone. You can change PDF to TXT format online free by simply uploading your file. Growile PDF instantly processes it and gives you a ready-to-use text file.",
  },
];

const faqs = [
  {
    question: "Is the Growile PDF to text converter free?",
    answer:
      "Yes, converting documents to text with Growile PDF is completely free. You can extract words from any file without paying for a subscription.",
  },
  {
    question: "Can I edit the text after conversion?",
    answer:
      "Absolutely! Growile PDF gives you a clean TXT file. You can easily open it in Notepad or Word to edit, copy, and paste your data instantly.",
  },
  {
    question: "Will it work on scanned documents?",
    answer:
      "Yes, our tool uses smart technology to read characters, allowing you to extract words from scanned files and images quickly and accurately.",
  },
  {
    question: "Do I need to install any software?",
    answer:
      "No software is needed. You can change your documents into TXT formats directly through your web browser using our online Growile PDF platform.",
  },
  {
    question: "Are my uploaded text files safe?",
    answer:
      "Your privacy is 100% secure. Growile PDF automatically deletes your original documents and the extracted TXT files from our servers quickly.",
  },
  {
    question: "Does this tool work on mobile phones?",
    answer:
      "Yes, Growile PDF is fully optimized for mobile. You can easily turn your files into editable text notes using any Android or iOS smartphone.",
  },
  {
    question: "How fast is the text extraction process?",
    answer:
      "It is extremely fast. Once uploaded, Growile PDF instantly reads your document and prepares your downloadable TXT file in just a few seconds.",
  },
  {
    question: "Will the original formatting be kept?",
    answer:
      "A TXT file contains plain text, so it removes complex layouts and images. Growile PDF focuses on giving you pure, clean words for easy editing.",
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
  name: "PDF to Text Converter",
  hasPart: seoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

export default function PDFtoText() {
  const [isConverting, setIsConverting] = useState(false);
  const [conversionMessage, setConversionMessage] = useState("");
  const [conversionError, setConversionError] = useState("");
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [pendingText, setPendingText] = useState<Uint8Array | null>(null);

  const triggerDownload = useCallback(() => {
    if (pendingText) downloadTextFile(pendingText, "pdf-to-text.txt");
  }, [pendingText]);

  const closeDownloadPopup = useCallback(() => {
    setIsDownloadPopupOpen(false);
    setPendingText(null);
  }, []);

  const handleAction = async (file: File) => {
    setIsConverting(true);
    setConversionMessage("");
    setConversionError("");

    try {
      const textBytes = await convertPdfToText(file);
      setPendingText(textBytes);
      setIsDownloadPopupOpen(true);
      setConversionMessage("PDF text extracted successfully.");
    } catch (error) {
      setConversionError(error instanceof Error ? error.message : "PDF to Text conversion failed.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Convert PDF to Text Online Free - Fast & Easy | Growile PDF"
        description="Use Growile PDF to convert PDF to text online free. Easily extract text from scanned PDFs without losing data. Safe, fast, and 100% free tool. Try it now!"
        canonicalPath="/pdf/pdf-to-text"
      />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile PDF to Text" description="Extract text from PDF files online." path="/pdf/pdf-to-text" />
      <PdfBreadcrumb label="PDF to Text" path="pdf-to-text" />
      <Hero
        kicker="PDF Conversion"
        title="Convert PDF to Text Online Free"
        subtitle="Do you need to copy words from an uneditable document? Growile PDF helps you convert PDF to text online free in just seconds. Whether it is an ebook, a report, or an invoice, our smart tool pulls out all the readable data instantly. You do not need to type everything manually or download software. Enjoy safe, accurate, and unlimited conversions right from your web browser with zero hidden fees."
        ctaText="Upload PDF"
        ctaHref="#pdf-to-text-upload"
      />
      <Divider />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="pdf-to-text-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FileText size={30} aria-hidden="true" />}
              title="PDF to Text"
              description="Extract selectable text from every page of your PDF."
              buttonLabel="Select PDF file"
              actionLabel={isConverting ? "Converting..." : "Convert to Text"}
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
        <section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title">
          <h2 id="related-pdf-tools-title">More PDF Tools</h2>
          <div className="pdf-related-tools-grid pdf-related-tools-grid-five">
            <PdfIconToolCard toolId="pdf-to-jpg" />
            <PdfIconToolCard toolId="unlock-pdf" />
            <PdfIconToolCard toolId="compress-pdf" />
            <PdfIconToolCard toolId="split-pdf" />
            <PdfIconToolCard toolId="protect-pdf" />
          </div>
        </section>
        <HowToUse heading="How to Convert PDF to Text" steps={steps} />
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
        itemName="PDF to Text"
      />
    </>
  );
}
