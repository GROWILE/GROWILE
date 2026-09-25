// Renders the close icon used by tool controls.
import type { SVGProps } from "react";

// Renders the close icon interface.
export default function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
