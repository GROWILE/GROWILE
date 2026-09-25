// Previews extract page pages.
import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Renders the extract page preview interface.
export default function ExtractPagePreview({
  file,
  pageCount,
  selectedPages,
  onSelectedPagesChange,
}: {
  file: File;
  pageCount: number;
  selectedPages: number[];
  onSelectedPagesChange: (pages: number[]) => void;
}) {
  const [pageImages, setPageImages] = useState<string[]>([]);

  useEffect(/* Runs side effects when its dependencies change. */ () => {
    let cancelled = false;
    const renderPages = /* Renders pages. */ async () => {
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
      if (!cancelled) setPageImages(images);
    };
    void renderPages();
    return /* Runs side effects when its dependencies change. */ () => {
      cancelled = true;
    };
  }, [file]);

  const togglePage = /* Toggles page. */ (pageNumber: number) => {
    onSelectedPagesChange(
      selectedPages.includes(pageNumber)
        ? selectedPages.filter(/* Keeps items that match the condition. */ (page) => page !== pageNumber)
        : [...selectedPages, pageNumber].sort(/* Compares items to determine their order. */ (first, second) => first - second),
    );
  };

  return (
    <div className="split-pdf-preview extract-pdf-preview">
      <div className="split-pdf-preview-heading">
        <strong>PDF pages</strong>
        <span>{pageCount} pages</span>
      </div>
      <div className="split-pdf-selection-help" role="status">
        <div className="extract-pdf-selected-count">
          <strong>{selectedPages.length}</strong>
          <span>{selectedPages.length === 1 ? "page selected" : "pages selected"}</span>
        </div>
        <div className="extract-pdf-selection-instruction">
          <strong>Choose the pages to extract</strong>
          <span>Click any page to include or remove it from the new PDF.</span>
        </div>
      </div>
      <div className="split-pdf-page-grid">
        {pageImages.map(/* Builds a value for each item in the collection. */ (image, index) => {
          const pageNumber = index + 1;
          const isSelected = selectedPages.includes(pageNumber);
          return (
            <button
              type="button"
              className={`split-pdf-page-thumbnail ${isSelected ? "selected" : ""}`}
              key={pageNumber}
              onClick={/* Runs when the user triggers click. */ () => togglePage(pageNumber)}
              aria-pressed={isSelected}
              aria-label={`${isSelected ? "Remove" : "Select"} page ${pageNumber}`}
            >
              <img src={image} alt={`PDF page ${pageNumber}`} />
              <span>Page {pageNumber}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

