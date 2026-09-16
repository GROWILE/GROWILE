import { useEffect } from "react";

type PageMetaProps = {
  title: string;
  description: string;
  canonicalPath?: string;
};

const siteName = "GROWILE";
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

function setProperty(property: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }

  element.content = content;
}

function setCanonical(path: string) {
  let link = document.head.querySelector<HTMLLinkElement>("link[rel=canonical]");

  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }

  link.href = new URL(path, window.location.origin).href;
}

export default function PageMeta({ title, description, canonicalPath = window.location.pathname }: PageMetaProps) {
  useEffect(() => {
    const fullTitle = title === siteName ? siteName : `${title} | ${siteName}`;

    document.title = fullTitle;
    setMeta("description", description);
    setMeta("robots", "index, follow");
    setProperty("og:title", fullTitle);
    setProperty("og:description", description);
    setProperty("og:type", "website");
    setProperty("og:url", new URL(canonicalPath, window.location.origin).href);
    setProperty("og:image", new URL(defaultImage, window.location.origin).href);
    
    // Updated to summary_large_image for big social previews
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", new URL(defaultImage, window.location.origin).href);
    setCanonical(canonicalPath);
  }, [canonicalPath, description, title]);

  return null;
}