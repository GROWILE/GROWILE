import type { ReactNode } from "react";
import "./toolCard.css";

export type ToolCardProps = {
  title: string;
  href: string;
  description?: string;
  icon?: ReactNode;
  colorTheme?: "blue" | "orange" | "green" | "purple" | "teal" | "default";
};

export default function ToolCard({
  title,
  href,
  description,
  icon,
  colorTheme = "default",
}: ToolCardProps) {
  // variant-detailed class-a inga fix panniyachu
  const cardClass = `growile-toolcard variant-detailed theme-${colorTheme}`;

  return (
    <a href={href} className={cardClass}>
      <div className="growile-toolcard-header">
        {icon && <div className="growile-toolcard-icon">{icon}</div>}
      </div>
      
      <div className="growile-toolcard-content">
        <h3 className="growile-toolcard-title">{title}</h3>
        
        {/* variant check thevaiyilla, description irunthaale render aagum */}
        {description && (
          <p className="growile-toolcard-desc">{description}</p>
        )}
      </div>
    </a>
  );
}