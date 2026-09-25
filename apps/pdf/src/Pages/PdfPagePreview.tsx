import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

export default function PdfPagePreview({
  file,
  pageCount,
  startPage,
  endPage,
  onStartPageChange,
  onEndPageChange,
}: {
  file: File;
  pageCount: number;
  startPage: number;
  endPage: number;
  onStartPageChange: (page: number) => void;
  onEndPageChange: (page: number) => void;
}) {
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [rangeStartSelection, setRangeStartSelection] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const imageUrls: string[] = [];

    const renderPages = async () => {
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
        const url = canvas.toDataURL("image/jpeg", 0.8);
        imageUrls.push(url);
        images.push(url);
      }

      if (!cancelled) setPageImages(images);
    };

    void renderPages();
    return () => {
      cancelled = true;
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [file]);

  const handlePageClick = (pageNumber: number) => {
    if (rangeStartSelection === null) {
      const nextEndPage = Math.min(pageNumber + 1, pageCount);
      onStartPageChange(Math.min(pageNumber, pageCount - 1));
      onEndPageChange(nextEndPage);
      setRangeStartSelection(pageNumber);
      return;
    }

    if (pageNumber === rangeStartSelection) return;

    const nextStartPage = Math.min(rangeStartSelection, pageNumber);
    const nextEndPage = Math.max(rangeStartSelection, pageNumber);
    onStartPageChange(nextStartPage);
    onEndPageChange(nextEndPage);
    setRangeStartSelection(null);
  };

  return (
    <div className="split-pdf-preview">
      <div className="split-pdf-preview-heading">
        <strong>PDF pages</strong>
        <span>{pageCount} pages</span>
      </div>
      <div className="split-pdf-selection-help" role="status">
        <strong>{rangeStartSelection === null ? "Choose a page range" : "Choose the ending page"}</strong>
        <span>
          {rangeStartSelection === null
            ? "Click the first page, then click the last page you want to split."
            : `Page ${rangeStartSelection} selected. Now click the ending page.`}
        </span>
      </div>
      <div className="split-pdf-page-grid">
        {pageImages.map((image, index) => {
          const pageNumber = index + 1;
          const isSelected = pageNumber >= startPage && pageNumber <= endPage;
          return (
            <button
              type="button"
              className={`split-pdf-page-thumbnail ${isSelected ? "selected" : ""}`}
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              aria-label={`Choose page ${pageNumber}`}
            >
              <img src={image} alt={`PDF page ${pageNumber}`} />
              <span>Page {pageNumber}</span>
            </button>
          );
        })}
      </div>
      <div className="split-pdf-range-controls">
        <p>Select the page range to split.</p>
        <label>
          Starting page
          <input
            type="number"
            min={1}
            max={pageCount - 1}
            value={startPage}
            onChange={(event) => onStartPageChange(Number(event.target.value))}
          />
        </label>
        <label>
          Ending page
          <input
            type="number"
            min={startPage + 1}
            max={pageCount}
            value={endPage}
            onChange={(event) => onEndPageChange(Number(event.target.value))}
          />
        </label>
      </div>
    </div>
  );
}

