// Defines the main routes for the invoice app.
import { lazy } from "react";

const Home = lazy(/* Handles home work. */ () => import("./Pages/Home"));
const InvoicePage = lazy(/* Handles invoice generator work. */ () => import("./Pages/InvoicePage"));
const TermsAndConditions = lazy(/* Handles terms and conditions work. */ () => import("./Pages/TermsOfService"));
const PrivacyPolicyPage = lazy(/* Handles privacy policy page work. */ () => import("./Pages/PrivacyPolicyPage"));

// Renders the app interface.
function App() {
  const path = window.location.pathname;
  const hash = window.location.hash;

  if (path === "/terms-and-conditions" || path === "/invoice/terms-and-conditions") {
    return <TermsAndConditions />;
  }

  if (path === "/privacy-policy" || path === "/invoice/privacy-policy") {
    return <PrivacyPolicyPage />;
  }

  if (
    path === "/gst-invoice" ||
    path === "/without-gst-invoice" ||
    path === "/invoice/gst-invoice" ||
    path === "/invoice/without-gst-invoice"
  ) {
    return <InvoicePage />;
  }

  if (
    (path === "/" || path === "/invoice") &&
    ["#gst-invoice-page", "#gst-invoice", "#without-gst-invoice-page", "#without-gst-invoice"].includes(hash)
  ) {
    return <InvoicePage />;
  }

  return <Home />;
}

export default App;
