// Renders the invoice breadcrumb.
import Breadcrumb from "../../../../packages/ui/src/Breadcrumb";
import BreadcrumbSchema from "../../../../packages/ui/src/BreadcrumbSchema";

type InvoiceBreadcrumbProps = {
  invoiceHomeHref: string;
};

// Renders the invoice breadcrumb interface.
export default function InvoiceBreadcrumb({
  invoiceHomeHref,
}: InvoiceBreadcrumbProps) {
  const items =
    invoiceHomeHref === "/"
      ? [{ label: "Invoice", href: invoiceHomeHref }]
      : [
          { label: "Home", href: "/" },
          { label: "Invoice", href: invoiceHomeHref },
        ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://growile.com/" },
          { name: "Invoice", url: "https://growile.com/invoice" },
        ]}
      />
      <Breadcrumb items={items} />
    </>
  );
}
