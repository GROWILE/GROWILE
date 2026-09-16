import ComingSoonPage from "../../../../packages/ui/src/ComingSoonPage";
import webLogo from "../../../../packages/ui/assets/growile-logo.svg"; //Growile-main-logo

export default function FinanceComingSoon() {
  return (
    <ComingSoonPage
      title="Finance"
      description="Our Finance product is currently in active development. We are building a lighter, smarter experience to simplify everyday finance tasks."
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
