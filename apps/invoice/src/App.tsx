import Home from "./Pages/Home";
import TermsAndConditions from "./Pages/TermsAndConditions";
import PrivacyPolicyPage from "./Pages/PrivacyPolicyPage";

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
