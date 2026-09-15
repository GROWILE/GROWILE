import { useState } from "react";
import "./AdSpace.css";

type AdSpaceProps = {
  label?: string;
  compact?: boolean;
  className?: string;
  variant?: "banner" | "vertical";
};

export default function AdSpace({
  label = "",
  compact = false,
  className = "",
  variant = "banner",
}: AdSpaceProps) {
  
  // 1. Ad space theriyanuma venama nu track panna state uruvakkkurom
  const [isVisible, setIsVisible] = useState(true);

  // 2. isVisible "false" aagitta entha UI-um kaattatha nu solrom
  if (!isVisible) return null;

  return (
    <section
      className={[
        "ad-space",
        variant === "vertical" ? "ad-space-vertical" : "ad-space-banner",
        compact ? "ad-space-compact" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Advertisement space"
    >
      {/* 3. Close Button (CSS vazhiya mobile-la mattum theriya vaipom) */}
      <button 
        className="ad-space-close-btn" 
        onClick={() => setIsVisible(false)}
        aria-label="Close Advertisement"
      >
        &times;
      </button>

      {label ? <span className="ad-space-label">{label}</span> : null}
    </section>
  );
}