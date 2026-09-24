import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, ReactNode, SVGProps } from "react";
import ConfirmPopUp from "../ConfirmPopUp";
import "./fileUploadBox.css";

function FileCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M8 15l2 2 5-5" />
    </svg>
  );
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function MoveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M8 7h8M8 17h8M12 3l3 3-3 3M12 21l-3-3 3-3" />
    </svg>
  );
}

export type FileUploadSource = {
  label: string;
  icon: ReactNode;
  onSelect: () => void;
};

export type FileUploadBoxProps = {
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  actionLabel: string;
  actionDisabled?: boolean;
  accept: string;
  onAction: (file: File) => void;
  onFilesAction?: (files: File[]) => void;
  onSelectionChange?: (files: File[]) => void;
  selectedContent?: ReactNode;
  multiple?: boolean;
  maxFiles?: number;
  sources?: FileUploadSource[];
  dropHint?: string;
  className?: string;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toUpperCase() || "FILE";
}

function isImageFile(file: File) {
  return file.type.startsWith("image/") || /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(file.name);
}

function getToolTheme(title: string) {
  const themeByTitle: Record<string, "blue" | "orange" | "green" | "purple" | "teal"> = {
    "JPG to PDF": "blue",
    "PNG to PDF": "orange",
    "PDF to JPG": "green",
    "PDF to PNG": "purple",
    "PDF to Text": "teal",
    "Merge PDF": "blue",
    "Split PDF": "orange",
    "Extract PDF Pages": "green",
    "Delete PDF Pages": "purple",
    "Reorder PDF Pages": "teal",
    "Rotate PDF": "blue",
    "Compress PDF": "orange",
    "Add Text to PDF": "green",
    "Add Image to PDF": "purple",
    "Highlight PDF": "teal",
    "Add Signature": "blue",
    "Add Watermark": "orange",
    "Add Page Numbers": "green",
    "Protect PDF": "purple",
    "Unlock PDF": "teal",
  };
  return themeByTitle[title] ?? "default";
}

export default function FileUploadBox({
  icon,
  title,
  description,
  buttonLabel,
  actionLabel,
  actionDisabled = false,
  accept,
  onAction,
  onFilesAction,
  onSelectionChange,
  selectedContent,
  multiple = false,
  maxFiles = 50,
  sources = [],
  dropHint = "or drop files here",
  className = "",
}: FileUploadBoxProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isRemoveAllConfirmationOpen, setIsRemoveAllConfirmationOpen] = useState(false);
  const selectedFile = selectedFiles[0] ?? null;
  const toolTheme = getToolTheme(title);

  const selectFiles = (files: File[], append = false) => {
    const existingFiles = append && multiple ? selectedFiles : [];
    const existingKeys = new Set(
      existingFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
    );
    const newFiles = files.filter(
      (file) => !existingKeys.has(`${file.name}-${file.size}-${file.lastModified}`),
    );
    const nextFiles = [...existingFiles, ...newFiles].slice(0, multiple ? maxFiles : 1);
    if (nextFiles.length > 0) {
      setSelectedFiles(nextFiles);
      onSelectionChange?.(nextFiles);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFiles(Array.from(event.target.files ?? []), selectedFiles.length > 0);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files ?? []);
    if (files.length > 0) {
      selectFiles(files, selectedFiles.length > 0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setSelectedFiles([]);
    onSelectionChange?.([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsRemoveAllConfirmationOpen(false);
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles((files) => {
      const nextFiles = files.filter((file) => file !== fileToRemove);
      onSelectionChange?.(nextFiles);
      return nextFiles;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= selectedFiles.length || fromIndex === toIndex) return;
    setSelectedFiles((files) => {
      const nextFiles = [...files];
      const [movedFile] = nextFiles.splice(fromIndex, 1);
      nextFiles.splice(toIndex, 0, movedFile);
      return nextFiles;
    });
  };

  const handleFileReorder = (targetIndex: number) => {
    if (draggedIndex === null) return;
    moveFile(draggedIndex, targetIndex);
    setDraggedIndex(null);
  };

  return (
    <div className={`file-upload-wrapper file-upload-theme-${toolTheme} ${className}`.trim()}>
      <input
        ref={fileInputRef}
        id={inputId}
        name="file"
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="file-upload-input"
      />

      {!selectedFile && (
        <div
          className={`file-upload-box ${isDragging ? "dragging" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="file-upload-header">
            <span className="file-upload-icon">{icon}</span>
            <h2 className="file-upload-title">{title}</h2>
          </div>

          <p className="file-upload-description">{description}</p>

          <button
            type="button"
            className="file-upload-button"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="file-upload-plus">+</span> {buttonLabel}
          </button>

          {sources.length > 0 && (
            <div className="file-upload-sources" aria-label="Other upload sources">
              {sources.map((source) => (
                <button
                  key={source.label}
                  type="button"
                  className="file-upload-source"
                  onClick={source.onSelect}
                  aria-label={`Choose from ${source.label}`}
                >
                  {source.icon}
                </button>
              ))}
            </div>
          )}

          <p className="file-upload-hint">{dropHint}</p>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="file-upload-box file-upload-box-selected">
          <div className="file-selected-header">
            <span className="file-selected-icon" aria-hidden="true">
              <FileCheckIcon width={28} height={28} />
            </span>
            <div>
              <p className="file-selected-eyebrow">
                {selectedFiles.length} {selectedFiles.length === 1 ? "file" : "files"} selected
              </p>
              <h2 className="file-upload-title">{title}</h2>
            </div>
          </div>

          {selectedContent}

          <div className={`file-selected-grid ${multiple ? "file-selected-grid-multiple" : ""}`}>
            {selectedFiles.map((file) => (
              <FilePreview
                key={`${file.name}-${file.lastModified}`}
                file={file}
                index={selectedFiles.indexOf(file)}
                isDragging={draggedIndex === selectedFiles.indexOf(file)}
                onDragStart={() => setDraggedIndex(selectedFiles.indexOf(file))}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleFileReorder(selectedFiles.indexOf(file))}
                onMoveUp={() => moveFile(selectedFiles.indexOf(file), selectedFiles.indexOf(file) - 1)}
                onMoveDown={() => moveFile(selectedFiles.indexOf(file), selectedFiles.indexOf(file) + 1)}
                canMoveUp={selectedFiles.indexOf(file) > 0}
                canMoveDown={selectedFiles.indexOf(file) < selectedFiles.length - 1}
                onRemove={() => handleRemoveFile(file)}
                isReorderable={multiple}
              />
            ))}
          </div>

          <p className="file-selected-ready">
            {selectedFiles.length === 1
              ? "Your file is ready. You can convert it or choose a different file."
              : `${selectedFiles.length} JPG images are ready to convert.`}
          </p>

          <button
            type="button"
            className="file-action-button"
            disabled={actionDisabled}
            onClick={() => {
              if (multiple && onFilesAction) {
                onFilesAction(selectedFiles);
              } else {
                onAction(selectedFiles[0]);
              }
            }}
          >
            {actionLabel}
          </button>

          <div className="file-upload-secondary-actions">
            {multiple && selectedFiles.length < maxFiles && (
              <button
                type="button"
                className="file-add-button"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="file-upload-plus">+</span>
                Add more files
                <span className="file-add-limit">
                  {maxFiles - selectedFiles.length} remaining
                </span>
              </button>
            )}

            <button
              type="button"
              className="file-selected-remove-all"
              onClick={() => setIsRemoveAllConfirmationOpen(true)}
            >
              <CloseIcon width={15} height={15} aria-hidden="true" />
              Remove all files
            </button>
          </div>
        </div>
      )}
      <ConfirmPopUp
        isOpen={isRemoveAllConfirmationOpen}
        title="Remove all files?"
        description={`Are you sure you want to remove all ${selectedFiles.length} selected files?`}
        confirmLabel="Remove all"
        cancelLabel="Keep files"
        onConfirm={handleRemove}
        onCancel={() => setIsRemoveAllConfirmationOpen(false)}
      />
    </div>
  );
}

function FilePreview({
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
}: {
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
}) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [hasPreviewError, setHasPreviewError] = useState(false);

  useEffect(() => {
    if (!isImageFile(file)) {
      setPreviewUrl("");
      return;
    }

    setHasPreviewError(false);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
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
        <button
          type="button"
          className="file-drag-handle"
          aria-label={`Drag to reorder ${file.name}`}
          title="Drag to reorder"
        >
          <MoveIcon width={18} height={18} aria-hidden="true" />
        </button>
      )}
      {previewUrl && !hasPreviewError ? (
        <img
          className="file-selected-thumbnail"
          src={previewUrl}
          alt=""
          onError={() => setHasPreviewError(true)}
        />
      ) : (
        <div className="file-selected-type" aria-hidden="true">
          .{getFileExtension(file.name).toLowerCase()}
        </div>
      )}
      <div className="file-selected-details">
        <strong className="file-selected-name" title={file.name}>
          {file.name}
        </strong>
        <span className="file-selected-meta">
          {getFileExtension(file.name)} file · {formatFileSize(file.size)}
        </span>
      </div>
      {isReorderable && (
        <div className="file-reorder-controls" aria-label={`Reorder ${file.name}`}>
          <button type="button" onClick={onMoveUp} disabled={!canMoveUp} aria-label="Move image up">
            ↑
          </button>
          <button type="button" onClick={onMoveDown} disabled={!canMoveDown} aria-label="Move image down">
            ↓
          </button>
        </div>
      )}
      <button
        type="button"
        className="file-selected-remove"
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        title="Remove file"
      >
        <CloseIcon width={15} height={15} aria-hidden="true" />
      </button>
    </div>
  );
}