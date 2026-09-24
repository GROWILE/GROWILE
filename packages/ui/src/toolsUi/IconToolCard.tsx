import type { ReactNode } from "react";
import "./iconToolCard.css";

export type IconToolCardProps = {
  title: string;
  href: string;
  icon: ReactNode;
  colorTheme?: "blue" | "orange" | "green" | "purple" | "teal" | "default";
};

export default function IconToolCard({
  title,
  href,
  icon,
  colorTheme = "default",
}: IconToolCardProps) {
  return (
    <a
      href={href}
      className={`growile-icon-toolcard theme-${colorTheme}`}
      aria-label={title}
    >
      <span className="growile-icon-toolcard-icon">{icon}</span>
      <span className="growile-icon-toolcard-title">{title}</span>
    </a>
  );
}
