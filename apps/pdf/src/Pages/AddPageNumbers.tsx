import { useCallback, useState } from "react";
import { FileText } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
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
import { addPageNumbersToPdf, downloadPageNumbersPdf } from "../Utilities/AddPageNumbersProcessing";
import "./PdfUploadLayout.css";
import "./PdfEditorStyles.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString();

type PreviewPage = { image: string; width: number; height: number };
const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF document." },
  { number: "2", title: "Preview page numbers", description: "Page numbers are automatically placed at the bottom of every page." },
  { number: "3", title: "Download the PDF", description: "Download a copy with clean, centered page numbers." },
];
const faqs = [
  { question: "Is the Growile PDF numbering tool totally free?", answer: "Yes, formatting your documents with Growile PDF is 100% free. You can sequentially number unlimited files without paying any subscription fees." },
  { question: "Can I choose where the digits appear on the sheet?", answer: "Absolutely! Our tool allows you to easily place the digits at the top, bottom, left, right, or center margins according to your preference." },
  { question: "Can I start the numbering from a specific digit?", answer: "Yes, you have full control. If your document is the second chapter of a book, you can easily set the starting digit to any custom value." },
  { question: "Do I need an app to format my university thesis?", answer: "No software is needed. You can quickly organize and paginate your lengthy documents directly from your web browser using our secure platform." },
  { question: "Are my uploaded documents and formatted files safe?", answer: "Your privacy is fully protected. Growile PDF automatically deletes your original file and the numbered document from our servers quickly." },
  { question: "What if I combine files before adding digits?", answer: <>That is a great workflow! You can use our <a href="/pdf/merge-pdf">Merge PDF</a> tool to combine separate chapters first, and then use this tool to number the final file.</> },
  { question: "What if my sheets are currently in the wrong order?", answer: <>Before adding sequential digits, we recommend using our <a href="/pdf/reorder-pdf-pages">Reorder PDF Pages</a> tool to ensure all your sheets are in the correct logical sequence.</> },
  { question: "Does this pagination tool work on mobile devices?", answer: "Yes, Growile PDF is mobile-friendly. You can easily organize and format large business reports using your Android or iOS smartphone anywhere." },
];

export default function AddPageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PreviewPage[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<Uint8Array | null>(null);
  const [popup, setPopup] = useState(false);

  const handleSelection = async (files: File[]) => {
    const selected = files[0] ?? null;
    setFile(selected);
    setPages([]);
    setMessage("");
    setError("");
    if (!selected) return;
    try {
      const pdf = await pdfjsLib.getDocument({ data: await selected.arrayBuffer() }).promise;
      const rendered: PreviewPage[] = [];
      for (let number = 1; number <= pdf.numPages; number += 1) {
        const page = await pdf.getPage(number);
        const viewport = page.getViewport({ scale: 0.72 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height + 28.8);
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        rendered.push({
          image: canvas.toDataURL("image/jpeg", 0.86),
          width: viewport.width / 0.72,
          height: viewport.height / 0.72 + 40,
        });
      }
      setPages(rendered);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not read the PDF.");
    }
  };

  const handleAction = async (selected: File) => {
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const bytes = await addPageNumbersToPdf(selected);
      setPending(bytes);
      setPopup(true);
      setMessage("Page numbers added successfully.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not add page numbers.");
    } finally {
      setBusy(false);
    }
  };

  const closePopup = useCallback(() => {
    setPopup(false);
    setPending(null);
  }, []);

  return (
    <>
      <PageMeta title="Add Page Numbers to PDF Online Free - Easy | Growile PDF" description="Use Growile PDF to add page numbers to PDF online free. Easily paginate your document or add custom page numbers safely. Fast, reliable, and 100% free tool!" canonicalPath="/pdf/add-page-numbers" />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile Add Page Numbers to PDF" description="Add page numbers to PDF documents online." path="/pdf/add-page-numbers" />
      <PdfBreadcrumb label="Add Page Numbers" path="add-page-numbers" />
      <Hero kicker="PDF Editing" title="Add Page Numbers to PDF Online Free" subtitle="Do you need to organize a lengthy document for easy reading? Growile PDF helps you add page numbers to PDF online free in just a few clicks. Whether you are formatting a university thesis or a massive business report, our tool keeps everything in sequence perfectly. You do not need to install complex apps or pay fees. Enjoy fast, secure, and limitless pagination directly from your web browser." ctaText="Upload PDF" ctaHref="#add-page-numbers-upload" />
      <Divider />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="add-page-numbers-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FileText size={30} aria-hidden="true" />}
              title="Add Page Numbers"
              description="Upload one PDF. Page numbers will be added automatically with a clean 40px bottom margin."
              buttonLabel="Select PDF file"
              actionLabel={busy ? "Preparing PDF..." : "Download Numbered PDF"}
              actionDisabled={busy || !file || pages.length === 0}
              accept=".pdf,application/pdf"
              onAction={handleAction}
              onSelectionChange={handleSelection}
              selectedContent={file ? (
                <div className="pdf-edit-content pdf-page-number-content">
                  <p className="pdf-editor-hint">Preview: page numbers are centered in the added bottom margin.</p>
                  <div className="pdf-page-number-grid" aria-label="Numbered PDF preview">
                    {pages.map((page, index) => (
                      <div className="pdf-page-number-preview" key={index}>
                        <div className="pdf-page-number-sheet">
                          <img src={page.image} alt={`PDF page ${index + 1}`} />
                          <span>{index + 1}</span>
                        </div>
                        <strong>Page {index + 1}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              dropHint="or drop one PDF file here"
            />
            <AdSpace variant="vertical" />
          </div>
          {message && <p className="jpg-to-pdf-status" role="status">{message}</p>}
          {error && <p className="jpg-to-pdf-error" role="alert">{error}</p>}
        </section>
        <section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title">
          <h2 id="related-pdf-tools-title">More PDF Tools</h2>
          <div className="pdf-related-tools-grid pdf-related-tools-grid-five">
            <PdfIconToolCard toolId="reorder-pdf-pages" />
            <PdfIconToolCard toolId="merge-pdf" />
            <PdfIconToolCard toolId="split-pdf" />
            <PdfIconToolCard toolId="add-text" />
            <PdfIconToolCard toolId="compress-pdf" />
          </div>
        </section>
        <HowToUse heading="How to Add Page Numbers to a PDF" steps={steps} />
        <Divider />
        <H2Section blocks={[{ heading: "Insert Page Numbers in PDF Document Free", description: "It is incredibly straightforward to insert page numbers in PDF document free with Growile PDF. Upload your file, choose your preferred position, and we will automatically number every sheet instantly." }, { heading: "Paginate PDF Document Online Free", description: "Got a huge, unorganized file? You can quickly paginate PDF document online free. Our smart platform neatly applies sequential digits to the corners or margins, making your file completely readable." }, { heading: "Add Custom Page Numbers to PDF Free", description: "The formatting process is totally flexible. You can add custom page numbers to PDF free by selecting specific starting digits. Growile PDF quickly processes the layout and delivers your clean file." }]} />
        <Divider />
        <FAQ heading="Add Page Numbers to PDF FAQs" faqs={faqs} />
        <Divider />
      </main>
      <PdfToolsFooter />
      <Footer />
      <AdSpace className="footer-bottom-ad-space" />
      <DownloadPopup isOpen={popup} onClose={closePopup} onTriggerDownload={() => { if (pending) downloadPageNumbersPdf(pending, "numbered-pdf.pdf"); }} itemName="Numbered PDF" />
    </>
  );
}
