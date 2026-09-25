import { lazy } from "react";

const Home = lazy(() => import("./Pages/Home"));
const TermsAndConditions = lazy(() => import("./Pages/TermsOfService"));
const PrivacyPolicyPage = lazy(() => import("./Pages/PrivacyPolicyPage"));

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
