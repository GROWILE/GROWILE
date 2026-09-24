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
import PdfToolsFooter from "./toolsFooter";
import PdfIconToolCard from "./IconToolCard";
import Divider from "../../../../packages/ui/src/Divider";
import { downloadReorderedPdf, reorderPdfPages } from "../Utilities/ReorderPDFPagesProcessing";
import "./JPGtoPDF.css";
import "./SplitPDF.css";
import "./ExtractPDFPages.css";
import "./ReorderPDFPages.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Arrange the pages", description: "Drag pages or use the left and right arrows to set the order." },
  { number: "3", title: "Reorder and download", description: "Create and download a PDF with your new page order." },
];

const seoBlocks = [
  {
    heading: "Rearrange PDF Pages Online Free",
    description:
      "It is incredibly simple to rearrange PDF pages online free using Growile PDF. Just upload your file, drag and drop the thumbnails into their correct spots, and we will update your document instantly.",
  },
  {
    heading: "Change Order of PDF Pages Online Free",
    description:
      "Got your sheets mixed up? You can quickly change order of PDF pages online free. Our tool allows you to shift any page left or right, ensuring your final file flows logically and beautifully.",
  },
  {
    heading: "Sort PDF Pages Online Free",
    description:
      "The organizing process is completely stress-free. You can sort PDF pages online free by simply uploading your file here. Growile PDF aligns everything perfectly, delivering your updated file quickly.",
  },
];

const faqs = [
  {
    question: "Is the Growile PDF reordering tool free?",
    answer:
      "Yes, moving your document sheets with Growile PDF is 100% free. You can easily fix the sequence of any file without paying subscription fees.",
  },
  {
    question: "How do I change the position of my sheets?",
    answer:
      "It is very easy! Just upload your file and drag the page thumbnails into your desired spots. Growile PDF handles the rest instantly.",
  },
  {
    question: "Will the content layout change when I shift pages?",
    answer:
      "No, your layout is safe. Growile PDF ensures you sort your document without losing quality, keeping the original text and design perfectly.",
  },
  {
    question: "Do I need an app to arrange my document?",
    answer:
      "No installation is required. You can quickly shift and align your sheets directly from your web browser using our online Growile PDF tool.",
  },
  {
    question: "Are my uploaded files and new documents secure?",
    answer:
      "Your privacy is fully protected. Growile PDF automatically deletes your original file and the newly sorted document from our servers quickly.",
  },
  {
    question: "What if a page is upside down while sorting?",
    answer: (
      <>
        This tool only shifts sequence. If a sheet is sideways or upside down, please use our{" "}
        <a href="/tools/rotate-pdf">Rotate PDF</a> tool to fix its orientation easily.
      </>
    ),
  },
  {
    question: "Can I erase an unwanted sheet while sorting?",
    answer: (
      <>
        This tool strictly moves sheets. If you find a blank or wrong page you want to remove, try using our{" "}
        <a href="/tools/delete-pdf-pages">Delete PDF Pages</a> tool instead.
      </>
    ),
  },
  {
    question: "Does this page sorting tool work on smartphones?",
    answer:
      "Yes, Growile PDF is fully optimized for mobile. You can easily drag and drop your report pages into the correct order using your phone.",
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
  name: "Reorder PDF Pages",
  hasPart: seoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

export default function ReorderPDFPages() {
  const [isReordering, setIsReordering] = useState(false);
  const [reorderMessage, setReorderMessage] = useState("");
  const [reorderError, setReorderError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [pendingPdf, setPendingPdf] = useState<Uint8Array | null>(null);
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);

  const triggerDownload = useCallback(() => {
    if (pendingPdf) downloadReorderedPdf(pendingPdf, "reordered-pages.pdf");
  }, [pendingPdf]);

  const closeDownloadPopup = useCallback(() => {
    setIsDownloadPopupOpen(false);
    setPendingPdf(null);
  }, []);

  const handleSelectionChange = async (files: File[]) => {
    const file = files[0] ?? null;
    setSelectedFile(file);
    setPageOrder([]);
    setPageImages([]);
    setReorderMessage("");
    setReorderError("");
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
      setPageOrder(Array.from({ length: pdf.numPages }, (_, index) => index + 1));
    } catch (error) {
      setReorderError(error instanceof Error ? error.message : "Could not read the PDF pages.");
    }
  };

  const handleAction = async (file: File) => {
    setIsReordering(true);
    setReorderMessage("");
    setReorderError("");
    try {
      const pdfBytes = await reorderPdfPages(file, pageOrder);
      setPendingPdf(pdfBytes);
      setIsDownloadPopupOpen(true);
      setReorderMessage("PDF pages reordered successfully.");
    } catch (error) {
      setReorderError(error instanceof Error ? error.message : "PDF page reordering failed.");
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Reorder PDF Pages Online Free - Fast & Easy | Growile PDF"
        description="Use Growile PDF to reorder PDF pages online free. Easily rearrange, sort, or change the order of your document's pages. Safe, fast, and 100% free tool!"
        canonicalPath="/tools/reorder-pdf-pages"
      />
      <PdfNavBar />
      <Hero
        kicker="PDF Organization"
        title="Reorder PDF Pages Online Free"
        subtitle="Do you need to fix the sequence of your document? Growile PDF helps you reorder PDF pages online free in just a few clicks. Whether you scanned a report backwards or mixed up presentation slides, our smart tool lets you move sheets into the perfect position. You do not need to install complex software or pay any fees. Enjoy fast, secure, and limitless page organization right from your browser."
        ctaText="Upload PDF"
        ctaHref="#reorder-pdf-pages-upload"
      />
      <Divider />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="reorder-pdf-pages-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<FileText size={30} aria-hidden="true" />}
              title="Reorder PDF Pages"
              description="Drag pages or use the arrows to arrange your PDF."
              buttonLabel="Select PDF file"
              actionLabel={isReordering ? "Reordering..." : "Reorder PDF"}
              actionDisabled={isReordering || pageOrder.length === 0}
              accept=".pdf,application/pdf"
              onAction={handleAction}
              onSelectionChange={handleSelectionChange}
              selectedContent={
                selectedFile ? (
                  <ReorderPagePreview
                    pageOrder={pageOrder}
                    pageImages={pageImages}
                    onPageOrderChange={setPageOrder}
                  />
                ) : null
              }
              dropHint="or drop one PDF file here"
            />
            <AdSpace variant="vertical" />
          </div>
          {reorderMessage && <p className="jpg-to-pdf-status" role="status">{reorderMessage}</p>}
          {reorderError && <p className="jpg-to-pdf-error" role="alert">{reorderError}</p>}
        </section>
        <section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title">
          <h2 id="related-pdf-tools-title">More PDF Tools</h2>
          <div className="pdf-related-tools-grid pdf-related-tools-grid-five">
            <PdfIconToolCard toolId="delete-pdf-pages" />
            <PdfIconToolCard toolId="merge-pdf" />
            <PdfIconToolCard toolId="rotate-pdf" />
            <PdfIconToolCard toolId="add-page-numbers" />
            <PdfIconToolCard toolId="compress-pdf" />
          </div>
        </section>
        <HowToUse heading="How to Reorder PDF Pages" steps={steps} />
        <Divider />
        <H2Section blocks={seoBlocks} />
        <Divider />
        <FAQ heading="Reorder PDF Pages FAQs" faqs={faqs} />
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
        itemName="reordered PDF"
      />
    </>
  );
}

function ReorderPagePreview({
  pageOrder,
  pageImages,
  onPageOrderChange,
}: {
  pageOrder: number[];
  pageImages: string[];
  onPageOrderChange: (order: number[]) => void;
}) {
  const [draggedPage, setDraggedPage] = useState<number | null>(null);

  const movePage = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= pageOrder.length) return;
    const nextOrder = [...pageOrder];
    [nextOrder[index], nextOrder[targetIndex]] = [nextOrder[targetIndex], nextOrder[index]];
    onPageOrderChange(nextOrder);
  };

  const dropPage = (targetIndex: number) => {
    if (draggedPage === null || draggedPage === targetIndex) return;
    const nextOrder = [...pageOrder];
    const [movedPage] = nextOrder.splice(draggedPage, 1);
    nextOrder.splice(targetIndex, 0, movedPage);
    onPageOrderChange(nextOrder);
    setDraggedPage(null);
  };

  return (
    <div className="split-pdf-preview reorder-pdf-preview">
      <div className="split-pdf-preview-heading">
        <strong>Arrange PDF pages</strong>
        <span>{pageOrder.length} pages</span>
      </div>
      <div className="split-pdf-selection-help" role="status">
        <strong>Reorder the pages</strong>
        <span>Drag a page or use the left and right arrows above each thumbnail.</span>
      </div>
      <div className="split-pdf-page-grid">
        {pageOrder.map((pageNumber, index) => (
          <div
            className="reorder-pdf-page-item"
            key={pageNumber}
            draggable
            onDragStart={() => setDraggedPage(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => dropPage(index)}
          >
            <div className="reorder-pdf-page-controls">
              <button type="button" onClick={() => movePage(index, -1)} disabled={index === 0} aria-label={`Move page ${pageNumber} left`}>←</button>
              <span>Order {index + 1}</span>
              <button type="button" onClick={() => movePage(index, 1)} disabled={index === pageOrder.length - 1} aria-label={`Move page ${pageNumber} right`}>→</button>
            </div>
            <img src={pageImages[pageNumber - 1]} alt={`PDF page ${pageNumber}`} />
            <span>Page {pageNumber}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
