// Renders a confirmation dialog.
import { useId } from "react";
import type { ReactNode } from "react";
import "./ConfirmPopUp.css";

export type ConfirmPopUpProps = {
  isOpen: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// Renders the confirm pop up interface.
export default function ConfirmPopUp({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmPopUpProps) {
  const titleId = useId();

  if (!isOpen) return null;

  return (
    <div className="confirm-popup-overlay" role="presentation" onClick={onCancel}>
      <div
        className="confirm-popup-container"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={/* Runs when the user triggers click. */ (event) => event.stopPropagation()}
      >
        <div className="confirm-popup-icon" aria-hidden="true">!</div>
        <h2 id={titleId} className="confirm-popup-title">{title}</h2>
        <div className="confirm-popup-description">{description}</div>
        <div className="confirm-popup-actions">
          <button type="button" className="confirm-popup-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="confirm-popup-confirm" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
