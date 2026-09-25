// Renders an advertisement area and loads its ad when available.
import { useEffect, useRef, useState } from "react";
import "./AdSpace.css";

type AdSpaceProps = {
  label?: string;
  compact?: boolean;
  className?: string;
  variant?: "banner" | "vertical";
};

// Renders the ad space interface.
export default function AdSpace({
  label = "",
  compact = false,
  className = "",
  variant = "banner",
}: AdSpaceProps) {
  const [isVisible, setIsVisible] = useState(true);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const hasRequestedAd = useRef(false);

  useEffect(/* Runs side effects when its dependencies change. */ () => {
    const adContainer = adContainerRef.current;
    const hostname = typeof window !== "undefined" ? window.location.hostname : "";
    const isProductionHost = hostname === "growile.com" || hostname.endsWith(".growile.com");

    if (!adContainer || typeof ResizeObserver === "undefined" || !isProductionHost) {
      return;
    }

    const requestAd = /* Handles request ad work. */ () => {
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

    return /* Runs side effects when its dependencies change. */ () => observer.disconnect();
  }, []);

  if (!isVisible) return null;

  // Set this to the ad slot ID from the AdSense dashboard.
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
        onClick={/* Runs when the user triggers click. */ () => setIsVisible(false)}
        aria-label="Close Advertisement"
      >
        &times;
      </button>


      {label ? <span className="ad-space-label">{label}</span> : null}

      {/* AdSense ad code is rendered here. */}
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