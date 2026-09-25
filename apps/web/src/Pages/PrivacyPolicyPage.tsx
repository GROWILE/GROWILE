import PrivacyPolicy from "../../../../packages/ui/src/PrivacyPolicy";
import { webNavigation, webFooter } from "../config/site";

export default function PrivacyPolicyPage() {
  return (
    <PrivacyPolicy
      {...webNavigation}
      footerInvoiceHref={webFooter.invoiceHref}
      footerTermsHref={webFooter.termsHref}
      footerPrivacyHref={webFooter.privacyHref}
    />
  );
}
