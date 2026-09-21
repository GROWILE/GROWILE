import AllPdfTools from "./allPdfTools";
import AdSpace from "../../../../packages/ui/src/AdSpace";
import FAQ from "../../../../packages/ui/src/FAQ";
import Footer from "../../../../packages/ui/src/Footer";
import H2Section from "../../../../packages/ui/src/H2Section";
import Hero from "../../../../packages/ui/src/Hero";
import PageMeta from "../../../../packages/ui/src/PageMeta";
import PdfToolsFooter from "./toolsFooter";
import PdfNavBar from "./NavBar";

const pdfSeoBlocks = [
  {
    heading: "Free Online PDF Tools",
    description:
      "Use Growile's free online PDF tools to convert, organize, compress, edit, and secure your documents. Choose the tool you need and get started without complicated software.",
  },
  {
    heading: "Work with PDFs in Your Browser",
    description:
      "Manage everyday PDF tasks directly in your browser with a simple, focused workflow. Convert files, arrange pages, add content, and prepare documents for sharing in a few steps.",
  },
  {
    heading: "Simple PDF Tools for Everyday Work",
    description:
      "Whether you need to merge files, reduce a document's size, convert a PDF, or protect sensitive content, Growile brings the essential PDF tools together in one place.",
  },
];

const pdfFaqs = [
  {
    question: "What PDF tools are available on Growile?",
    answer:
      "Growile provides tools for PDF conversion, organization, compression, editing, and security, including merge, split, compress, convert, protect, and unlock tools.",
  },
  {
    question: "Can I convert images to PDF?",
    answer:
      "Yes. You can convert JPG and PNG images into PDF documents using the image-to-PDF conversion tools.",
  },
  {
    question: "Can I convert a PDF to Word or Excel?",
    answer:
      "Yes. Growile includes PDF-to-Word and PDF-to-Excel tools for converting PDF content into editable document formats.",
  },
  {
    question: "Can I merge multiple PDF files?",
    answer:
      "Yes. Use the Merge PDF tool to combine multiple PDF files into one document.",
  },
  {
    question: "Can I rearrange or remove PDF pages?",
    answer:
      "Yes. The PDF tools include options to extract, delete, reorder, rotate, and split PDF pages.",
  },
  {
    question: "Can I reduce the size of a PDF?",
    answer:
      "Yes. Use Compress PDF to reduce the file size of a document while keeping it ready for sharing.",
  },
  {
    question: "Can I edit or annotate a PDF?",
    answer:
      "Yes. You can use tools for adding text and images, drawing, highlighting, signing, watermarking, cropping, and adding page numbers.",
  },
  {
    question: "Can I protect or unlock a PDF?",
    answer:
      "Yes. Growile includes tools to protect PDF files with security settings and unlock PDFs when you have permission to remove their restrictions.",
  },
];

const pdfFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pdfFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const pdfContentSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Free Online PDF Tools",
  hasPart: pdfSeoBlocks.map((block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

export default function Home() {
  return (
    <>
      <PageMeta
        title="Free Online PDF Tools"
        description="Use Growile's free online PDF tools to convert, organize, compress, edit, and secure PDF files directly in your browser."
        canonicalPath="/"
      />
      <PdfNavBar />
      <Hero
        kicker="Growile PDF"
        title="Free online PDF tools for every task."
        subtitle="Convert, organize, compress, edit, and secure your PDF files with simple browser-based tools."
        ctaText="Explore PDF tools"
        ctaHref="#all-pdf-tools-title"
      />
      <AllPdfTools />
      <H2Section blocks={pdfSeoBlocks} />
      <FAQ heading="Frequently Asked Questions" faqs={pdfFaqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pdfContentSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pdfFaqSchema) }}
      />
      <PdfToolsFooter />
      <Footer />
      <AdSpace className="footer-bottom-ad-space" />
    </>
  );
}