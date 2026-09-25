// Defines the main routes for the invoice app.
import { lazy } from "react";

const Home = lazy(/* Handles home work. */ () => import("./Pages/Home"));
const TermsAndConditions = lazy(/* Handles terms and conditions work. */ () => import("./Pages/TermsOfService"));
const PrivacyPolicyPage = lazy(/* Handles privacy policy page work. */ () => import("./Pages/PrivacyPolicyPage"));

// Renders the app interface.
function App() {
  const path = window.location.pathname;

  if (path === "/terms-and-conditions" || path === "/invoice/terms-and-conditions") {
    return <TermsAndConditions />;
  }

  if (path === "/privacy-policy" || path === "/invoice/privacy-policy") {
    return <PrivacyPolicyPage />;
  }

  return <Home />;
}

export default App;
