// Renders the invoice tools landing page.
import AdSpace from "../../../../packages/ui/src/AdSpace";
import Divider from "../../../../packages/ui/src/Divider";
import FAQ from "../../../../packages/ui/src/FAQ";
import Footer from "../../../../packages/ui/src/Footer";
import H2Section from "../../../../packages/ui/src/H2Section";
import Hero from "../../../../packages/ui/src/Hero";
import PageMeta from "../../../../packages/ui/src/PageMeta";
import InvoiceBreadcrumb from "./InvoiceBreadcrumb";
import InvoiceNavBar from "./InvoiceNavBar";
import InvoiceTools from "./allInvoiceTools";
import InvoiceToolsFooter from "./toolsFooter";

const invoiceSeoBlocks = [
  {
    heading: "Create Professional Invoices Online for Free",
    description:
      "Create a professional invoice in your browser with Growile Invoice. Add your business and customer details, list products or services, and download a polished PDF to share with your customer.",
  },
  {
    heading: "Choose a GST or Non-GST Invoice Format",
    description:
      "Choose the invoice format that suits your business. Create a GST invoice with tax details, or make a non-GST invoice for services and sales that do not require GST billing.",
  },
  {
    heading: "Make and Download Invoices in Your Browser",
    description:
      "No accounting software installation is needed. Enter invoice details directly in your browser, review the calculated totals, and download the finished document as a PDF.",
  },
];

const invoiceFaqs = [
  {
    question: "Is Growile Invoice free to use?",
    answer:
      "Yes. You can create GST and non-GST invoices and download them as PDFs for free.",
  },
  {
    question: "Which invoice formats can I create?",
    answer:
      "You can create a GST invoice with tax details or a non-GST invoice without tax columns.",
  },
  {
    question: "Can I download my invoice as a PDF?",
    answer:
      "Yes. After entering and reviewing your invoice details, use the download action to save a PDF copy.",
  },
  {
    question: "Do I need to install software or create an account?",
    answer:
      "No installation or account is required. The invoice forms work directly in your web browser.",
  },
  {
    question: "Does the GST invoice calculate taxes?",
    answer:
      "Yes. Add your items and tax rates in the GST invoice form to calculate the tax amounts and totals.",
  },
  {
    question: "Can I use the invoice generator on my phone?",
    answer:
      "Yes. The invoice tools are designed to work on mobile phones, tablets, and desktop browsers.",
  },
];

const invoiceFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: invoiceFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const invoiceContentSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Free Online Invoice Generator",
  hasPart: invoiceSeoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

// Renders the home interface.
export default function Home() {
  const isEmbeddedInvoice = window.location.pathname.startsWith("/invoice");
  const invoiceBaseHref = isEmbeddedInvoice ? "/invoice" : "";
  const invoiceHomeHref = isEmbeddedInvoice ? "/invoice" : "/";

  return (
    <div className="invoice-home">
      <PageMeta
        title="Free Online Invoice Generator - GST & Non-GST | Growile"
        description="Create professional GST and non-GST invoices for free with Growile. Add products, calculate totals, and download your invoice as a PDF."
        canonicalPath="/invoice"
      />
      <InvoiceNavBar invoiceBaseHref={invoiceBaseHref} />
      <InvoiceBreadcrumb invoiceHomeHref={invoiceHomeHref} />
      <Hero
        kicker="Growile Invoice"
        title="Free Online Invoice Generator"
        subtitle="Create clear, professional invoices for your business in just a few steps. Choose a GST or non-GST format, add your business and customer details, and download a ready-to-share PDF. No software installation or account is needed."
        ctaText="Explore Invoice tools"
        ctaHref="#all-invoice-tools-title"
      />
      <InvoiceTools invoiceBaseHref={invoiceBaseHref} />
      <Divider />
      <H2Section blocks={invoiceSeoBlocks} />
      <Divider />
      <FAQ heading="Frequently Asked Questions" faqs={invoiceFaqs} />
      <Divider />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(invoiceContentSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(invoiceFaqSchema) }}
      />
      <InvoiceToolsFooter invoiceBaseHref={invoiceBaseHref} />
      <Footer
        invoiceHref={invoiceHomeHref}
        termsHref={`${invoiceBaseHref}/terms-and-conditions`}
        privacyHref={`${invoiceBaseHref}/privacy-policy`}
        reserveBottomAdSpace={false}
      />
      <AdSpace className="footer-bottom-ad-space" />
    </div>
  );
}
