import { useState } from "react";

export default function ReorderPagePreview({
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
              <button type="button" onClick={() => movePage(index, -1)} disabled={index === 0} aria-label={`Move page ${pageNumber} left`}>-</button>
              <span>Order {index + 1}</span>
              <button type="button" onClick={() => movePage(index, 1)} disabled={index === pageOrder.length - 1} aria-label={`Move page ${pageNumber} right`}>+</button>
            </div>
            <img src={pageImages[pageNumber - 1]} alt={`PDF page ${pageNumber}`} />
            <span>Page {pageNumber}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
