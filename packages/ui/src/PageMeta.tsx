// Updates the page title, description, and social metadata.
import { useEffect } from "react";

type PageMetaProps = {
  title: string;
  description: string;
  canonicalPath?: string;
  indexable?: boolean;
};

const siteName = "Growile";
const publicOrigin = "https://growile.com";
const defaultImage = "/growile-icon.png"; // Fixed extension

function setMeta(name: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }

  element.content = content;
}

// Updates property.
function setProperty(property: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }

  element.content = content;
}

// Updates canonical.
function setCanonical(path: string) {
  let link = document.head.querySelector<HTMLLinkElement>("link[rel=canonical]");

  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }

  link.href = new URL(path, publicOrigin).href;
}

// Renders the page meta interface.
export default function PageMeta({
  title,
  description,
  canonicalPath = window.location.pathname,
  indexable = true,
}: PageMetaProps) {
  useEffect(/* Runs side effects when its dependencies change. */ () => {
    const fullTitle =
      title === siteName || title.includes("|") ? title : `${title} | ${siteName}`;

    document.title = fullTitle;
    setMeta("description", description);
    setMeta("robots", indexable ? "index, follow" : "noindex, follow");
    setProperty("og:title", fullTitle);
    setProperty("og:description", description);
    setProperty("og:type", "website");
    setProperty("og:url", new URL(canonicalPath, publicOrigin).href);
    setProperty("og:image", new URL(defaultImage, publicOrigin).href);
    
    // Updated to summary_large_image for big social previews
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", new URL(defaultImage, publicOrigin).href);
    setCanonical(canonicalPath);
  }, [canonicalPath, description, indexable, title]);

  return null;
}