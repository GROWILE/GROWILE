import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import PageMeta from "../../../packages/ui/src/PageMeta";
import Home from "./Pages/Home";
import About from "./Pages/About";
import TermsOfService from "./Pages/TermsOfService";
import PrivacyPolicyPage from "./Pages/PrivacyPolicyPage";

const pageMetadata = {
  "/": {
    title: "Growile - Free Digital Tools Ecosystem for Daily Tasks",
    description: "Explore Growile, a complete digital ecosystem offering free online tools for your day-to-day needs. Simplify your everyday tasks with our growing platform."
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

function App() {
  return (
    <>
      <ScrollToTop />
      <RouteMetadata />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      </Routes>
    </>
  );
}

export default App;