import "./AdSpace.css";

type AdSpaceProps = {
  label?: string;
  compact?: boolean;
  className?: string;
};

export default function AdSpace({
  label = "Advertisement",
  compact = false,
  className = "",
}: AdSpaceProps) {
  return (
    <section
      className={`ad-space ${compact ? "ad-space-compact" : ""} ${className}`.trim()}
      aria-label="Advertisement space"
    >
      <span className="ad-space-label">{label}</span>
    </section>
  );
}