// Previews rotate page pages.
import { RotateCw } from "lucide-react";

// Renders the rotate page preview interface.
export default function RotatePagePreview({
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
        {pageImages.map(/* Builds a value for each item in the collection. */ (image, index) => (
          <div className="rotate-pdf-page-item" key={index}>
            <button
              type="button"
              className="rotate-pdf-button"
              onClick={/* Runs when the user triggers click. */ () => onRotate(index)}
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

