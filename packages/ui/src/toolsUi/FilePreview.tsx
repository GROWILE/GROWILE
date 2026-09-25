// Renders a preview of an uploaded file.
import { useEffect, useState } from "react";
import type { DragEvent } from "react";
import CloseIcon from "./CloseIcon";
import MoveIcon from "./MoveIcon";
import { formatFileSize, getFileExtension, isImageFile } from "./fileUploadUtils";

export type FilePreviewProps = {
  file: File;
  index: number;
  isDragging: boolean;
  onDragStart: () => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onRemove: () => void;
  isReorderable: boolean;
};

// Renders the file preview interface.
export default function FilePreview({
  file,
  index,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  onRemove,
  isReorderable,
}: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [hasPreviewError, setHasPreviewError] = useState(false);

  useEffect(/* Runs side effects when its dependencies change. */ () => {
    if (!isImageFile(file)) {
      setPreviewUrl("");
      return;
    }

    setHasPreviewError(false);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return /* Runs side effects when its dependencies change. */ () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div
      className={`file-selected-card ${isReorderable ? "file-selected-card-reorderable" : ""} ${isDragging ? "file-selected-card-dragging" : ""}`}
      draggable={isReorderable}
      onDragStart={isReorderable ? onDragStart : undefined}
      onDragOver={isReorderable ? onDragOver : undefined}
      onDrop={isReorderable ? onDrop : undefined}
      aria-label={`Image ${index + 1}: ${file.name}`}
    >
      {isReorderable && (
        <button type="button" className="file-drag-handle" aria-label={`Drag to reorder ${file.name}`} title="Drag to reorder">
          <MoveIcon width={18} height={18} aria-hidden="true" />
        </button>
      )}
      {previewUrl && !hasPreviewError ? (
        <img className="file-selected-thumbnail" src={previewUrl} alt="" onError={/* Runs when the user triggers error. */ () => setHasPreviewError(true)} />
      ) : (
        <div className="file-selected-type" aria-hidden="true">.{getFileExtension(file.name).toLowerCase()}</div>
      )}
      <div className="file-selected-details">
        <strong className="file-selected-name" title={file.name}>{file.name}</strong>
        <span className="file-selected-meta">{getFileExtension(file.name)} file · {formatFileSize(file.size)}</span>
      </div>
      {isReorderable && (
        <div className="file-reorder-controls" aria-label={`Reorder ${file.name}`}>
          <button type="button" onClick={onMoveUp} disabled={!canMoveUp} aria-label="Move image up">↑</button>
          <button type="button" onClick={onMoveDown} disabled={!canMoveDown} aria-label="Move image down">↓</button>
        </div>
      )}
      <button type="button" className="file-selected-remove" onClick={onRemove} aria-label={`Remove ${file.name}`} title="Remove file">
        <CloseIcon width={15} height={15} aria-hidden="true" />
      </button>
    </div>
  );
}
