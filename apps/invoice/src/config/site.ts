import invoiceLogo from "../../../../packages/ui/assets/growile-InvoiceGenerator-logo.svg";

export const invoiceNavigation = (invoiceHomeHref: string, withoutGstInvoiceHref: string, gstInvoiceHref: string) => ({
  logoAlt: "Growile",
  logoSrc: invoiceLogo,
  home: { label: "Home", href: invoiceHomeHref },
  products: {
    label: "Products",
    items: [
      { label: "PDF", href: "/pdf" },
      { label: "Invoice", href: invoiceHomeHref },
    ],
  },
  tools: {
    label: "All Tools",
    items: [
      { label: "Non-GST Invoice", href: withoutGstInvoiceHref },
      { label: "GST Invoice", href: gstInvoiceHref },
    ],
  },
});

export const invoiceHero = {
  kicker: "GROWILE INVOICE",
  ctaText: "Create Free Invoice",
} as const;

export const invoiceVariantHero = {
  gst: {
    title: "Free GST Invoice Generator Online",
    subtitle: "Are you a registered business looking to bill your customers professionally? Growile PDF provides a fast, free GST invoice generator online. Whether you need to calculate taxes or include specific codes, our smart tool creates compliant documents instantly. You do not need expensive accounting software. Enjoy secure, accurate, and limitless tax billing directly from your web browser today easily.",
  },
  withoutGst: {
    title: "Free Invoice Generator Without GST Online",
    subtitle: "Are you a freelancer or a small business owner not registered for taxes? Growile PDF offers a fast, free invoice generator without GST online. Whether you need to bill clients for freelance work or issue a standard receipt, our tool creates professional documents instantly. You do not need to install software or pay fees. Enjoy safe, simple, and unlimited billing right from your web browser.",
  },
} as const;
