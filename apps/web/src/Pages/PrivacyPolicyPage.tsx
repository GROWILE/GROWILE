// Configures the privacy policy page for the web app.
import PrivacyPolicy from "../../../../packages/ui/src/PrivacyPolicy";
import { webNavigation, webFooter } from "../config/site";
import "./About.css";

// Renders the privacy policy page interface.
export default function PrivacyPolicyPage() {
  return (
    <PrivacyPolicy
      {...webNavigation}
      footerInvoiceHref={webFooter.invoiceHref}
      footerTermsHref={webFooter.termsHref}
      footerPrivacyHref={webFooter.privacyHref}
      reserveBottomAdSpace={webFooter.reserveBottomAdSpace}
    />
  );
}
