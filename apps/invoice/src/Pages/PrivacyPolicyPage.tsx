import PrivacyPolicy from "../../../../packages/ui/src/PrivacyPolicy";
import invoiceLogo from "../../../../packages/ui/assets/growile-InvoiceGenerator-logo.svg";


export default function PrivacyPolicyPage() {
  const isEmbeddedInvoice = window.location.pathname.startsWith("/invoice");
  const invoiceBaseHref = isEmbeddedInvoice ? "/invoice" : "";
  const invoiceHomeHref = isEmbeddedInvoice ? "/invoice" : "/";

  return (
    <PrivacyPolicy
      logoAlt="Growile"
      logoSrc={invoiceLogo}
      home={{ label: "Home", href: invoiceHomeHref }}
      products={{
        label: "Products",
        items: [
          { label: "Finance", href: "/finance" },
          { label: "Invoice", href: invoiceHomeHref },
        ],
      }}
      tools={{
        label: "Tools",
        items: [
          { label: "Non-GST Invoice", href: `${invoiceBaseHref}/without-gst-invoice` },
          { label: "GST Invoice", href: `${invoiceBaseHref}/gst-invoice` },
        ],
      }}
      footerInvoiceHref={invoiceHomeHref}
      footerTermsHref={`${invoiceBaseHref}/terms-and-conditions`}
      footerPrivacyHref={`${invoiceBaseHref}/privacy-policy`}
    />
  );
}
