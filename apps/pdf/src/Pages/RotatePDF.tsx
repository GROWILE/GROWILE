import { useCallback, useState } from "react";
import { RotateCw, WandSparkles } from "lucide-react";
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
import PdfToolsFooter from "./toolsFooter";
import { downloadRotatedPdf, rotatePdfPages } from "../Utilities/RotatePDFProcessing";
import "./JPGtoPDF.css";
import "./SplitPDF.css";
import "./ExtractPDFPages.css";
import "./RotatePDF.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Rotate the pages", description: "Click the rotate button above any page to rotate it clockwise." },
  { number: "3", title: "Rotate and download", description: "Create and download a PDF with your chosen page rotations." },
];

const seoBlocks = [
  { heading: "Rotate PDF Pages Online", description: "Rotate individual PDF pages directly in your browser." },
  { heading: "Rotate Any Page", description: "Use the rotate button above each page to turn pages independently without changing the rest of the document." },
  { heading: "Simple PDF Rotation", description: "Rotate PDF pages without installing desktop software or uploading your document to a server." },
];

const faqs = [
  { question: "How do I rotate PDF pages?", answer: "Upload one PDF, click the rotate button above any page, and click Rotate PDF." },
  { question: "Can I rotate only one page?", answer: "Yes. Each page has its own rotate button, so you can rotate individual pages independently." },
  { question: "How much does each click rotate a page?", answer: "Each click rotates that page 90 degrees clockwise." },
  { question: "Can I rotate multiple pages?", answer: "Yes. Click the rotate button on as many pages as you need." },
  { question: "Can I upload more than one PDF?", answer: "This Rotate PDF tool accepts one PDF file at a time." },
  { question: "Will my PDF be uploaded to a server?", answer: "No. The rotation is processed directly in your browser." },
  { question: "Is the Rotate PDF tool free?", answer: "Yes. You can rotate PDF pages online with Growile for free." },
  { question: "What happens after I click Rotate PDF?", answer: "A new PDF with the chosen page rotations is created and prepared for download." },
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
  name: "Rotate PDF",
  hasPart: seoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

export default function RotatePDF() {
  const [isRotating, setIsRotating] = useState(false);
  const [rotateMessage, setRotateMessage] = useState("");
  const [rotateError, setRotateError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [rotations, setRotations] = useState<number[]>([]);
  const [pendingPdf, setPendingPdf] = useState<Uint8Array | null>(null);
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);

  const triggerDownload = useCallback(() => {
    if (pendingPdf) downloadRotatedPdf(pendingPdf, "rotated-pages.pdf");
  }, [pendingPdf]);

  const closeDownloadPopup = useCallback(() => {
    setIsDownloadPopupOpen(false);
    setPendingPdf(null);
  }, []);

  const handleSelectionChange = async (files: File[]) => {
    const file = files[0] ?? null;
    setSelectedFile(file);
    setPageImages([]);
    setRotations([]);
    setRotateMessage("");
    setRotateError("");
    if (!file) return;

    try {
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const images: string[] = [];
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 0.35 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        images.push(canvas.toDataURL("image/jpeg", 0.8));
      }
      setPageImages(images);
      setRotations(Array.from({ length: pdf.numPages }, () => 0));
    } catch (error) {
      setRotateError(error instanceof Error ? error.message : "Could not read the PDF pages.");
    }
  };

  const handleAction = async (file: File) => {
    setIsRotating(true);
    setRotateMessage("");
    setRotateError("");
    try {
      const pdfBytes = await rotatePdfPages(file, rotations);
      setPendingPdf(pdfBytes);
      setIsDownloadPopupOpen(true);
      setRotateMessage("PDF pages rotated successfully.");
    } catch (error) {
      setRotateError(error instanceof Error ? error.message : "PDF page rotation failed.");
    } finally {
      setIsRotating(false);
    }
  };

  const rotatePage = (index: number) => {
    setRotations((current) =>
      current.map((rotation, pageIndex) =>
        pageIndex === index ? (rotation + 90) % 360 : rotation,
      ),
    );
  };

  return (
    <>
      <PageMeta
        title="Rotate PDF Pages Online"
        description="Rotate individual PDF pages online with Growile's browser-based Rotate PDF tool."
        canonicalPath="/tools/rotate-pdf"
      />
      <PdfNavBar />
      <Hero
        kicker="PDF Organization"
        title="Rotate PDF Pages"
        subtitle="Rotate individual pages in your PDF to the orientation you need."
        ctaText="Upload PDF"
        ctaHref="#rotate-pdf-upload"
      />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="rotate-pdf-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<WandSparkles size={30} aria-hidden="true" />}
              title="Rotate PDF"
              description="Click the rotate button above any page to change its orientation."
              buttonLabel="Select PDF file"
              actionLabel={isRotating ? "Rotating..." : "Rotate PDF"}
              actionDisabled={isRotating || rotations.length === 0}
              accept=".pdf,application/pdf"
              onAction={handleAction}
              onSelectionChange={handleSelectionChange}
              selectedContent={
                selectedFile ? (
                  <RotatePagePreview
                    pageImages={pageImages}
                    rotations={rotations}
                    onRotate={rotatePage}
                  />
                ) : null
              }
              dropHint="or drop one PDF file here"
            />
            <AdSpace variant="vertical" />
          </div>
          {rotateMessage && <p className="jpg-to-pdf-status" role="status">{rotateMessage}</p>}
          {rotateError && <p className="jpg-to-pdf-error" role="alert">{rotateError}</p>}
        </section>
        <HowToUse heading="How to Rotate a PDF" steps={steps} />
        <H2Section blocks={seoBlocks} />
        <FAQ heading="Rotate PDF FAQs" faqs={faqs} />
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
        itemName="rotated PDF"
      />
    </>
  );
}

function RotatePagePreview({
  pageImages,
  rotations,
  onRotate,
}: {
  pageImages: string[];
  rotations: number[];
  onRotate: (index: number) => void;
}) {
  return (
    <div className="split-pdf-preview rotate-pdf-preview">
      <div className="split-pdf-preview-heading">
        <strong>PDF pages</strong>
        <span>{pageImages.length} pages</span>
      </div>
      <div className="split-pdf-selection-help" role="status">
        <strong>Rotate the pages</strong>
        <span>Click the rotate button above any page. Each click rotates it 90° clockwise.</span>
      </div>
      <div className="split-pdf-page-grid">
        {pageImages.map((image, index) => (
          <div className="rotate-pdf-page-item" key={index}>
            <button
              type="button"
              className="rotate-pdf-button"
              onClick={() => onRotate(index)}
              aria-label={`Rotate page ${index + 1}`}
            >
              <RotateCw size={16} aria-hidden="true" />
              <span>Rotate</span>
            </button>
            <img
              src={image}
              alt={`PDF page ${index + 1}`}
              style={{ transform: `rotate(${rotations[index] ?? 0}deg)` }}
            />
            <span>Page {index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
