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
import SoftwareApplicationSchema from "../../../../packages/ui/src/SoftwareApplicationSchema";
import PdfBreadcrumb from "./PdfBreadcrumb";
import PdfToolsFooter from "./toolsFooter";
import PdfIconToolCard from "./IconToolCard";
import Divider from "../../../../packages/ui/src/Divider";
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
  {
    heading: "Rotate PDF Permanently Online Free",
    description:
      "Unlike simple viewers, our tool lets you rotate PDF permanently online free. Once you flip your document and save it, Growile PDF ensures the new angle stays fixed every time you open the final file.",
  },
  {
    heading: "Change PDF Orientation Online Free",
    description:
      "Need to switch from landscape to portrait? You can easily change PDF orientation online free. Just upload your file, select the sheets, and Growile PDF will adjust the viewing layout in seconds.",
  },
  {
    heading: "Turn PDF Pages Upside Down Online Free",
    description:
      "Got a completely flipped scan? You can quickly turn PDF pages upside down online free. Our tool lets you easily flip any page 180 degrees so your text and images become perfectly readable again.",
  },
];

const faqs = [
  {
    question: "Is the Growile PDF rotation tool free?",
    answer:
      "Yes, fixing your document's angle with Growile PDF is 100% free. You can adjust your files anytime without paying any subscription fees.",
  },
  {
    question: "Can I flip just one page instead of all?",
    answer:
      "Absolutely! You can select a single sheet to rotate, keeping the rest of your document exactly as it is for perfect readability.",
  },
  {
    question: "Will the text quality drop after rotating?",
    answer:
      "No, your file quality remains perfect. Growile PDF ensures you change the orientation without losing the original text clarity.",
  },
  {
    question: "Do I need an app to fix sideways scans?",
    answer:
      "No installation is required. You can easily correct sideways documents directly from your web browser using our online Growile PDF tool.",
  },
  {
    question: "Are my uploaded files and fixed documents safe?",
    answer:
      "Your data is entirely secure. Growile PDF automatically deletes your original file and the rotated document from our servers instantly.",
  },
  {
    question: "What if the pages are in the wrong order?",
    answer: (
      <>
        This tool only fixes angles. If your sheets are mixed up, please use our{" "}
        <a href="/pdf/reorder-pdf-pages">Reorder PDF Pages</a> tool to rearrange them correctly.
      </>
    ),
  },
  {
    question: "Can I remove a sideways page entirely?",
    answer: (
      <>
        This tool only turns sheets. If you want to erase an unwanted page instead of fixing it, use our{" "}
        <a href="/pdf/delete-pdf-pages">Delete PDF Pages</a> tool.
      </>
    ),
  },
  {
    question: "Does this orientation tool work on mobile?",
    answer:
      "Yes, Growile PDF is mobile-friendly. You can easily fix sideways photos or upside-down reports using your Android or iOS smartphone.",
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
        title="Rotate PDF Pages Online Free - Fast & Easy | Growile PDF"
        description="Use Growile PDF to rotate PDF pages online free. Easily change PDF orientation or rotate PDF permanently without losing quality. Safe, fast, and 100% free!"
        canonicalPath="/pdf/rotate-pdf"
      />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile Rotate PDF" description="Rotate PDF pages online." path="/pdf/rotate-pdf" />
      <PdfBreadcrumb label="Rotate PDF" path="rotate-pdf" />
      <Hero
        kicker="PDF Organization"
        title="Rotate PDF Pages Online Free"
        subtitle="Did you scan a document sideways or upside down? Growile PDF helps you rotate PDF pages online free in just a few clicks. Whether you need to fix a single image or adjust a whole presentation, our tool instantly changes the viewing angle. You do not need to install software or pay fees. Enjoy fast, secure, and permanent orientation fixes right from your web browser to make your files readable."
        ctaText="Upload PDF"
        ctaHref="#rotate-pdf-upload"
      />
      <Divider />
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
        <section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title">
          <h2 id="related-pdf-tools-title">More PDF Tools</h2>
          <div className="pdf-related-tools-grid pdf-related-tools-grid-five">
            <PdfIconToolCard toolId="reorder-pdf-pages" />
            <PdfIconToolCard toolId="delete-pdf-pages" />
            <PdfIconToolCard toolId="split-pdf" />
            <PdfIconToolCard toolId="merge-pdf" />
            <PdfIconToolCard toolId="compress-pdf" />
          </div>
        </section>
        <HowToUse heading="How to Rotate a PDF" steps={steps} />
        <Divider />
        <H2Section blocks={seoBlocks} />
        <Divider />
        <FAQ heading="Rotate PDF FAQs" faqs={faqs} />
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
        <span>Click the rotate button above any page. Each click rotates it 90ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â° clockwise.</span>
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
