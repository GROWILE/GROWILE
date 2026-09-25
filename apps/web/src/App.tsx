// File: apps/web/src/App.tsx
import { Routes, Route } from "react-router-dom";

// Normal Static Imports (No Lazy Loading)
import Home from "./Pages/Home";
import About from "./Pages/About";
import TermsOfService from "./Pages/TermsOfService";
import PrivacyPolicyPage from "./Pages/PrivacyPolicyPage"; // <-- Ithu ippo sariya import aayirukku
import ProductsList from "./Pages/ProductsList";
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