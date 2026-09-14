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
      {label ? <span className="ad-space-label">{label}</span> : null}
    </section>
  );
}