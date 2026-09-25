import { useEffect, useRef, useState } from "react";
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
  const [isVisible, setIsVisible] = useState(true);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const hasRequestedAd = useRef(false);

  useEffect(() => {
    const adContainer = adContainerRef.current;

    if (!adContainer || typeof ResizeObserver === "undefined") {
      return;
    }

    const requestAd = () => {
      if (hasRequestedAd.current || adContainer.getBoundingClientRect().width <= 0) {
        return;
      }

      hasRequestedAd.current = true;
      // @ts-expect-error AdSense adds adsbygoogle to the window at runtime.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    };

    const observer = new ResizeObserver(requestAd);
    observer.observe(adContainer);
    requestAd();

    return () => observer.disconnect();
  }, []);

  if (!isVisible) return null;

  // Unga AdSense dashboard-la irunthu vantha ad slot ID-a inga podunga
  const adSlotId = "8215012803"; 

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
      <button 
        className="ad-space-close-btn" 
        onClick={() => setIsVisible(false)}
        aria-label="Close Advertisement"
      >
        &times;
      </button>


      {label ? <span className="ad-space-label">{label}</span> : null}

      {/* 👇 AdSense Ins Tag Inga Irukkum */}
      <div ref={adContainerRef} className="adsense-container">
        <ins className="adsbygoogle"
             style={{ display: "block", width: "100%" }}
             data-ad-client="ca-pub-5065634748295086"
             data-ad-slot={adSlotId} 
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </section>
  );
}