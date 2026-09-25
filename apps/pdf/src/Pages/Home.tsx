// Renders the PDF tools landing page.
import AllPdfTools from "./allPdfTools";
import AdSpace from "../../../../packages/ui/src/AdSpace";
import FAQ from "../../../../packages/ui/src/FAQ";
import Footer from "../../../../packages/ui/src/Footer";
import H2Section from "../../../../packages/ui/src/H2Section";
import Hero from "../../../../packages/ui/src/Hero";
import PageMeta from "../../../../packages/ui/src/PageMeta";
import PdfToolsFooter from "./toolsFooter";
import PdfNavBar from "./NavBar";
import PdfBreadcrumb from "./PdfBreadcrumb";
import Divider from "../../../../packages/ui/src/Divider";

const pdfSeoBlocks = [
  {
    heading: "Edit Convert and Merge PDF Files Online Free",
    description:
      "It is incredibly simple to edit convert and merge PDF files online free using Growile PDF. Upload your documents to our platform, and we will help you combine and modify your files quickly and easily.",
  },
  {
    heading: "Secure Online PDF Tools Without Registration",
    description:
      "Your privacy is our top priority. We provide secure online PDF tools without registration. You can process your highly confidential business documents safely, knowing your files are deleted instantly.",
  },
  {
    heading: "Manage PDF Documents Online Free No Download",
    description:
      "The organizing process is completely hassle-free. You can manage PDF documents online free no download. Everything works perfectly inside your web browser, saving your computer space and boosting speed.",
  },
];

const pdfFaqs = [
  {
    question: "Is the Growile PDF platform completely free?",
    answer: "Yes, our platform is 100% free. You can use all our premium tools to edit, convert, and manage your documents without paying any subscription fees.",
  },
  {
    question: "Do I need to create an account to use the tools?",
    answer: "No registration is required. You can instantly access and use our secure online PDF tools without registration, saving you valuable time and effort.",
  },
  {
    question: "Are my uploaded and processed documents safe?",
    answer: "Your privacy is fully protected. Growile PDF automatically deletes your original uploads and processed documents from our secure servers instantly.",
  },
  {
    question: "How can I change the file type of my documents?",
    answer:
      <>We offer multiple converters! You can easily use our <a href="/pdf/jpg-to-pdf">JPG to PDF</a> tool for photos, or try our <a href="/pdf/pdf-to-text">PDF to Text</a> tool to extract editable words quickly.</>,
  },
  {
    question: "Can I reduce the size of a very heavy document?",
    answer:
      <>Yes, if your file is too bulky for email sharing, you can easily use our <a href="/pdf/compress-pdf">Compress PDF</a> tool to shrink its size without losing any original quality.</>,
  },
  {
    question: "How do I combine multiple files into one?",
    answer:
      <>To bind several documents together, you can comfortably use our <a href="/pdf/merge-pdf">Merge PDF</a> tool. It joins multiple sheets into a single, organized file in seconds.</>,
  },
  {
    question: "Can I lock my sensitive files with a password?",
    answer:
      <>Absolutely. If you have confidential data, we highly recommend using our <a href="/pdf/protect-pdf">Protect PDF</a> tool to encrypt your document with a strong, secure password.</>,
  },
  {
    question: "Does this platform work on my mobile phone?",
    answer: "Yes, Growile PDF is highly mobile-friendly. You can comfortably manage your business reports or study materials using your Android or iOS device.",
  },
];

const pdfFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pdfFaqs.map(/* Builds a value for each item in the collection. */ (faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: typeof faq.answer === "string" ? faq.answer : "Use the linked PDF tool for this document task.",
    },
  })),
};

const pdfContentSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Free Online PDF Tools",
  hasPart: pdfSeoBlocks.map(/* Builds a value for each item in the collection. */ (block) => ({
    "@type": "WebPageElement",
    name: block.heading,
    text: block.description,
  })),
};

// Renders the home interface.
export default function Home() {
  return (
    <>
      <PageMeta
        title="All in One Free Online PDF Tools - Secure | Growile PDF"
        description="Use Growile PDF for all in one free online PDF tools. Edit, convert, and merge PDF files online free with no download. Safe, fast, and 100% secure!"
        canonicalPath="/pdf"
      />
      <PdfNavBar />
      <PdfBreadcrumb />
      <Hero
        kicker="Growile PDF"
        title="All in One Free Online PDF Tools"
        subtitle="Are you looking for a single platform to handle all your document needs? Growile PDF offers all in one free online PDF tools in just a few clicks. Whether you want to compress heavy files or organize messy sheets, our platform makes it easy. You do not need to install heavy software or pay hidden fees. Enjoy unlimited, fast, and secure processing right from your web browser today safely."
        ctaText="Explore PDF tools"
        ctaHref="#all-pdf-tools-title"
      />
      <AllPdfTools />
      <Divider />
      <H2Section blocks={pdfSeoBlocks} />
      <Divider />
      <FAQ heading="Frequently Asked Questions" faqs={pdfFaqs} />
      <Divider />
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