// Renders the invoice app navigation bar.
import Navbar from "../../../../packages/ui/src/Navbar";
import { getProductNavigationLinks } from "../../../../packages/ui/src/productNavigation";
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
        items: getProductNavigationLinks(invoiceHomeHref),
      }}
    />
  );
}
