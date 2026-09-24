// File: apps/web/src/App.tsx
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import PageMeta from "../../../packages/ui/src/PageMeta";

// Normal Static Imports (No Lazy Loading)
import Home from "./Pages/Home";
import About from "./Pages/About";
import TermsOfService from "./Pages/TermsOfService";
import PrivacyPolicyPage from "./Pages/PrivacyPolicyPage"; // <-- Ithu ippo sariya import aayirukku
import ProductsList from "./Pages/ProductsList";

const pageMetadata = {
  "/": {
    title: "Growile | Global Web Tools & Utilities",
    description: "Discover fast, private web tools built for modern global workflows. No sign-up required, zero data tracking, and 100% browser-secure."
  },
  "/about": {
    title: "About Growile - Building a Free Digital Tool Ecosystem",
    description: "Discover the vision behind Growile. We are dedicated to simplifying your daily tasks by building a completely free ecosystem of essential digital tools."
  },
  "/terms-of-service": {
    title: "Terms of Service",
    description: "Read the Terms of Service governing your use of the GROWILE website and tools.",
  },
  "/privacy-policy": {
    title: "Privacy Policy for Growile",
    description: "Read the Growile Privacy Policy to understand how we collect, protect, and use your information across our tools.",
  },
  "/pdf": {
    title: "Free PDF Tools Online | Growile",
    description: "Use Growile's free online PDF tools to merge, split, convert, compress, edit, sign, and secure PDF files."
  },
  "/products": {
    title: "All Products - Growile Suite",
    description: "Explore Growile's complete suite of free utilities and tools."
  }
} as const;

const defaultMetadata = {
  title: "Growile - Essential Free Online Tools & Utilities",
  description: "Access Growile's complete suite of free digital tools. Instantly simplify your daily tasks with our fast, secure, and easy-to-use browser utilities."
};

function RouteMetadata() {
  const { pathname } = useLocation();
  const metadata = pageMetadata[pathname as keyof typeof pageMetadata] ?? defaultMetadata;

  return <PageMeta {...metadata} canonicalPath={pathname} />;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PdfDeploymentRedirect() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const pdfPath = pathname === "/pdf" ? "/pdf/" : pathname;
    window.location.replace(`https://growile-pdf.vercel.app${pdfPath}${search}${hash}`);
  }, [hash, pathname, search]);

  return null;
}

function App() {
  const { pathname } = useLocation();

  if (pathname === "/pdf" || pathname.startsWith("/pdf/")) {
    return <PdfDeploymentRedirect />;
  }

  return (
    <>
      <ScrollToTop />
      <RouteMetadata />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/products" element={<ProductsList />} />
      </Routes>
    </>
  );
}

export default App;