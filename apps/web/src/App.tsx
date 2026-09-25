// Defines the main routes for the web app.
import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(/* Handles home work. */ () => import("./Pages/Home"));
const About = lazy(/* Handles about work. */ () => import("./Pages/About"));
const TermsOfService = lazy(/* Handles terms of service work. */ () => import("./Pages/TermsOfService"));
const PrivacyPolicyPage = lazy(/* Handles privacy policy page work. */ () => import("./Pages/PrivacyPolicyPage"));
const ProductsList = lazy(/* Handles products list work. */ () => import("./Pages/ProductsList"));
import RouteMetadata from "./Components/RouteMetadata";
import ScrollToTop from "./Components/ScrollToTop";
import NotFound from "./Pages/NotFound";

// Renders the app interface.
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