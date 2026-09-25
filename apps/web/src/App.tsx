// File: apps/web/src/App.tsx
import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./Pages/Home"));
const About = lazy(() => import("./Pages/About"));
const TermsOfService = lazy(() => import("./Pages/TermsOfService"));
const PrivacyPolicyPage = lazy(() => import("./Pages/PrivacyPolicyPage"));
const ProductsList = lazy(() => import("./Pages/ProductsList"));
import RouteMetadata from "./Components/RouteMetadata";
import ScrollToTop from "./Components/ScrollToTop";
import NotFound from "./Pages/NotFound";

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
        <Route path="/products" element={<ProductsList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;