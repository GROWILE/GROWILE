// Renders links to the available invoice tools.
import ToolsFooter from "../../../../packages/ui/src/toolsUi/toolsFooter";
import { allInvoiceTools } from "../config/invoiceTools";

type InvoiceToolsFooterProps = {
  invoiceBaseHref: string;
};

// Renders the invoice tools footer interface.
export default function InvoiceToolsFooter({
  invoiceBaseHref,
}: InvoiceToolsFooterProps) {
  return (
    <ToolsFooter
      ariaLabel="Invoice tools"
      categories={[
        {
          title: "Invoice",
          tools: allInvoiceTools.map((tool) => ({
            label: tool.title,
            href: `${invoiceBaseHref}${tool.path}`,
          })),
        },
      ]}
    />
  );
}
