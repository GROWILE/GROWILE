import PrivacyPolicy from "../../../../packages/ui/src/PrivacyPolicy";
import webLogo from "../../../../packages/ui/assets/growile-logo.svg";

export default function PrivacyPolicyPage() {
  return (
    <PrivacyPolicy
      logoAlt="Growile"
      logoSrc={webLogo}
      home={{ label: "Home", href: "/" }}
      products={{
        label: "Products",
        items: [
          { label: "Finance", href: "/finance" },
          { label: "Invoice", href: "/invoice" },
        ],
      }}
      about={{ label: "About", href: "/about" }}
      footerInvoiceHref="/invoice"
      footerTermsHref="/terms-of-service"
      footerPrivacyHref="/privacy-policy"
    />
  );
}
