// Renders a document icon with an optional label.
type DocumentIconProps = {
  label?: string;
};

// Renders the document icon interface.
export default function DocumentIcon({ label }: DocumentIconProps) {
  if (label) {
    return <span className="product-document-label">{label}</span>;
  }

  return (
    <svg
      className="product-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 3.5h7l3 3V20.5H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
      <path d="M14 3.5v4h3M8.5 12h5M8.5 15.5h5" />
    </svg>
  );
}
