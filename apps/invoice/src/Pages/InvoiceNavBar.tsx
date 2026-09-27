// Renders the invoice app navigation bar.
import DocumentIcon from "../../../../packages/ui/src/DocumentIcon";
import Navbar from "../../../../packages/ui/src/Navbar";
import { invoiceNavigation } from "../config/site";

type InvoiceNavBarProps = {
  invoiceBaseHref: string;
};

// Renders the invoice nav bar interface.
export default function InvoiceNavBar({
  invoiceBaseHref,
}: InvoiceNavBarProps) {
  const invoiceHomeHref = invoiceBaseHref || "/";

  return (
    <Navbar
      {...invoiceNavigation(
        invoiceHomeHref,
        `${invoiceBaseHref}/without-gst-invoice`,
        `${invoiceBaseHref}/gst-invoice`,
      )}
      products={{
        label: "Products",
        items: [
          { label: "PDF", href: "/pdf", icon: <DocumentIcon label="PDF" /> },
          {
            label: "Invoice",
            href: invoiceHomeHref,
            icon: <DocumentIcon />,
          },
        ],
      }}
    />
  );
}
