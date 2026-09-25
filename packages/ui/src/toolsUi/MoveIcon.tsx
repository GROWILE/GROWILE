import type { SVGProps } from "react";

export default function MoveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M8 7h8M8 17h8M12 3l3 3-3 3M12 21l-3-3 3-3" />
    </svg>
  );
}
