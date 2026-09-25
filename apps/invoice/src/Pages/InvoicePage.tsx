// Renders the invoice editor and its supporting content.
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import Divider from "../../../../packages/ui/src/Divider";
import FAQ from "@growile/ui/src/FAQ";
import Footer from "../../../../packages/ui/src/Footer";
import Hero from "../../../../packages/ui/src/Hero";
import HowToUse from "@growile/ui/src/HowToUse";
import Navbar from "../../../../packages/ui/src/Navbar";
import GstInvoice from "./GstInvoice.tsx";
import WithoutGstInvoice from "./WithoutGstInvoice";
import Products from '../../../../packages/ui/src/Products-card';
import PageMeta from "../../../../packages/ui/src/PageMeta";
import SoftwareApplicationSchema from "../../../../packages/ui/src/SoftwareApplicationSchema";
import H2Section from "../../../../packages/ui/src/H2Section";
import Breadcrumb from "../../../../packages/ui/src/Breadcrumb";
import BreadcrumbSchema from "../../../../packages/ui/src/BreadcrumbSchema";
import { invoiceHero, invoiceNavigation, invoiceVariantHero } from "../config/site";
import "./InvoicePage.css";

type InvoicePageVariant = "without-gst" | "gst";

// Gets page variant.
function getPageVariant(): InvoicePageVariant {
  const pathname = window.location.pathname;

  if (pathname.endsWith("/gst-invoice")) {
    return "gst";
  }

  if (pathname.endsWith("/without-gst-invoice")) {
    return "without-gst";
  }

  const gstHashes = new Set(["#gst-invoice-page", "#gst-invoice"]);
  const withoutGstHashes = new Set(["#without-gst-invoice-page", "#without-gst-invoice"]);

  if (gstHashes.has(window.location.hash)) {
    return "gst";
  }

  if (withoutGstHashes.has(window.location.hash)) {
    return "without-gst";
  }

  return "without-gst";
}

// Renders the invoice page interface.
export default function InvoicePage() {
  const [variant, setVariant] = useState<InvoicePageVariant>(getPageVariant);
  const isEmbeddedInvoice = window.location.pathname.startsWith("/invoice");
  const invoiceBaseHref = isEmbeddedInvoice ? "/invoice" : "";
  const invoiceHomeHref = isEmbeddedInvoice ? "/invoice" : "/";
  const gstInvoiceHref = `${invoiceBaseHref}/gst-invoice`;
  const withoutGstInvoiceHref = `${invoiceBaseHref}/without-gst-invoice`;
  const termsHref = `${invoiceBaseHref}/terms-and-conditions`;
  const privacyHref = `${invoiceBaseHref}/privacy-policy`;

  useEffect(/* Runs side effects when its dependencies change. */ () => {
    const handleHashChange = /* Handles hash change work. */ () => setVariant(getPageVariant());
    window.addEventListener("hashchange", handleHashChange);
    return /* Runs side effects when its dependencies change. */ () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(/* Runs side effects when its dependencies change. */ () => {
    const targetId = window.location.hash.slice(1);

    if (!targetId) {
      return;
    }

    requestAnimationFrame(/* Runs side effects when its dependencies change. */ () => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [variant]);

  const isGstPage = variant === "gst";
  const invoiceFormId = isGstPage ? "gst-invoice" : "without-gst-invoice";
  const invoicePageLabel = isGstPage ? "GST Invoice" : "Non-GST Invoice";
  const invoicePagePath = isGstPage ? gstInvoiceHref : withoutGstInvoiceHref;

  // --- Page Meta Tags ---
  const pageTitle = isGstPage 
    ? "Free GST Invoice Generator Online - Secure | Growile PDF"
    : "Free Invoice Generator Without GST Online | Growile PDF";

  const pageDescription = isGstPage
    ? "Use Growile PDF's free GST invoice generator online. Easily create a GST invoice format or make a tax invoice securely. Fast, accurate, and 100% free!"
    : "Use Growile PDF's free invoice generator without GST online. Easily create a non-GST invoice format or bill of supply safely. Fast and 100% free tool!";

  // --- Hero Section Content ---
  const { title: heroTitle, subtitle: heroSubtitle } =
    isGstPage ? invoiceVariantHero.gst : invoiceVariantHero.withoutGst;

  // --- SEO H2 Blocks ---
  const gstSeoBlocks = [
    {
      heading: "Create GST Invoice Format Online Free",
      description: "It is incredibly simple to create GST invoice format online free using Growile PDF. Just input your company details, add your products with proper tax rates, and we will generate a clean document."
    },
    {
      heading: "Make Tax Invoice With GST Online Free",
      description: "Selling products or services? You can easily make tax invoice with GST online free. Our intuitive platform automatically calculates the tax amounts, ensuring your final billing file is perfectly accurate."
    },
    {
      heading: "Generate GST Bill Online Free",
      description: "The entire calculation process is totally stress-free. You can generate GST bill online free by filling out the details here. Growile PDF instantly builds your document, ready to share with clients."
    }
  ];

  const nonGstSeoBlocks = [
    {
      heading: "Create Non GST Invoice Format Online Free",
      description: "It is extremely simple to create non GST invoice format online free with Growile PDF. Just enter your business details, add your services, and our tool will neatly arrange everything into a clean PDF."
    },
    {
      heading: "Make Bill Without GST Online Free",
      description: "Need a quick receipt for your customer? You can effortlessly make bill without GST online free. Our platform removes complex tax columns, giving you a straightforward billing document in seconds."
    },
    {
      heading: "Generate Bill of Supply Online Free",
      description: "The billing process is completely hassle-free. You can generate bill of supply online free by simply filling out our form. Growile PDF instantly processes the data and prepares your ready-to-send file."
    }
  ];

  const currentSeoBlocks = isGstPage ? gstSeoBlocks : nonGstSeoBlocks;

  // --- How-To Steps ---
  const nonGstHowToHeading = "How to Make a Non-GST Bill";
  const nonGstSteps = [
    { 
      number: "1", 
      title: "Enter Your Details", 
      description: "Add your logo, business info, customer details, and pick your preferred currency from the dropdown list." 
    },
    { 
      number: "2", 
      title: "Add Items & Prices", 
      description: "List the services or products you provided, set the quantity, and enter the price. The total calculates automatically." 
    },
    { 
      number: "3", 
      title: "Download Your PDF", 
      description: "Review your details and click download. You will instantly get a clean, professional bill ready to send to your client." 
    }
  ];

  const gstHowToHeading = "How to Create a GST Invoice";
  const gstSteps = [
    { 
      number: "1", 
      title: "Enter Business Details", 
      description: "Add your logo, business info, and buyer details. Don't forget to include both GSTIN numbers to stay tax compliant." 
    },
    { 
      number: "2", 
      title: "Add Items & Tax Rates", 
      description: "List your products, add HSN codes, and set your tax percentage. Our system auto-calculates the exact tax breakdown." 
    },
    { 
      number: "3", 
      title: "Download Tax Invoice", 
      description: "Click download to instantly save a professional, tax-ready PDF bill to your device. Send it right away to get paid." 
    }
  ];

  const currentHowToHeading = isGstPage ? gstHowToHeading : nonGstHowToHeading;
  const currentHowToSteps = isGstPage ? gstSteps : nonGstSteps;

  // --- FAQs Data ---
  const nonGstFaqs = [
    { question: "Is this non-tax billing tool completely free?", answer: "Yes, our platform is 100% free. You can create unlimited standard receipts and bills of supply without paying any hidden subscription fees." },
    { question: "Can I download the final bill as a PDF?", answer: "Absolutely! Once you enter your details, Growile PDF will instantly generate a clean, professional PDF document that you can download easily." },
    { question: "What is the difference between this and a tax bill?", answer: <>This tool removes tax columns. If you are a registered business needing tax breakdowns, please use our <a href="/invoice/gst-invoice">GST Invoice</a> generator tool instead.</> },
    { question: "Can I add my company logo to the receipt?", answer: <>Yes, our billing form lets you upload your logo. If you need to add a faded background logo later, try using our <a href="/pdf/add-watermark">Add Watermark</a> tool.</> },
    { question: "Do I need an app to create my business receipts?", answer: "No software is needed. You can quickly make your standard customer receipts directly from your web browser using our secure online platform." },
    { question: "Are my financial details safe on this website?", answer: "Your privacy is completely secure. Growile PDF automatically deletes your entered data and the generated document from our servers instantly." },
    { question: "Can I sign the document after creating it?", answer: <>Yes! After downloading your final document, you can easily use our <a href="/pdf/add-signature">Add Signature</a> tool to insert your electronic signature professionally.</> },
    { question: "Does this receipt maker work on mobile phones?", answer: "Yes, Growile PDF is mobile-friendly. You can easily generate a professional bill of supply for your clients using your Android or iOS device." }
  ];

  const gstFaqs = [
    { question: "Is this tax billing generator completely free?", answer: "Yes, our tool is 100% free to use. You can calculate taxes and create unlimited professional business bills without paying any hidden fees." },
    { question: "Does it calculate CGST, SGST, and IGST automatically?", answer: "Absolutely! Just enter your product prices and the correct tax percentage. Our smart platform will handle all the complex math automatically." },
    { question: "What if I am not a registered business?", answer: <>If you do not have a registration number and do not charge tax, we highly recommend using our <a href="/invoice/without-gst-invoice">Without GST Invoice</a> generator tool instead.</> },
    { question: "Do I need an app to create my tax documents?", answer: "No installation is required. You can quickly generate professional tax bills directly from your web browser using our secure online platform." },
    { question: "Are my client details and financial data safe?", answer: "Your privacy is strictly protected. Growile PDF automatically deletes your entered information and the generated file from our secure servers." },
    { question: "Can I lock this document so nobody changes the price?", answer: <>Yes! After downloading your final tax bill, you can upload it to our <a href="/pdf/protect-pdf">Protect PDF</a> tool to securely lock it with a strong secret password.</> },
    { question: "How do I add my digital stamp to the final bill?", answer: <>Once your document is ready, you can easily use our <a href="/pdf/add-image">Add Image</a> tool to place your official company stamp perfectly on the final invoice file.</> },
    { question: "Does this tax bill creator work on smartphones?", answer: "Yes, Growile PDF is highly mobile-friendly. You can comfortably calculate taxes and issue professional bills using your Android or iOS device." }
  ];

  const currentFaqs = isGstPage ? gstFaqs : nonGstFaqs;
  const faqHeading = isGstPage ? "GST Invoice FAQ" : "Non-GST Invoice FAQ";

  // --- Schema Objects (FAQ & HowTo Schemas) ---
  const nonGstFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": nonGstFaqs.map(/* Builds a value for each item in the collection. */ faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": typeof faq.answer === "string" ? faq.answer : "Use the linked invoice or PDF tool for this billing task."
      }
    }))
  };

  const gstFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": gstFaqs.map(/* Builds a value for each item in the collection. */ faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": typeof faq.answer === "string" ? faq.answer : "Use the linked invoice or PDF tool for this billing task."
      }
    }))
  };

  const nonGstHowToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": nonGstHowToHeading,
    "description": "Step-by-step guide to creating a non-GST bill quickly using Growile's free online invoice tool.",
    "step": nonGstSteps.map(/* Builds a value for each item in the collection. */ (step, index) => ({
      "@type": "HowToStep",
      "name": step.title,
      "text": step.description,
      "position": index + 1
    }))
  };

  const gstHowToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": gstHowToHeading,
    "description": "Step-by-step guide to generating a tax-compliant GST invoice online with Growile.",
    "step": gstSteps.map(/* Builds a value for each item in the collection. */ (step, index) => ({
      "@type": "HowToStep",
      "name": step.title,
      "text": step.description,
      "position": index + 1
    }))
  };

  const scrollToInvoiceForm = /* Handles scroll to invoice form work. */ (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById(invoiceFormId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="invoice-app">
      <PageMeta
        title={pageTitle}
        description={pageDescription}
        canonicalPath={isGstPage ? "/invoice/gst-invoice" : "/invoice/without-gst-invoice"}
      />
      <SoftwareApplicationSchema
        name={isGstPage ? "Growile GST Invoice Generator" : "Growile Non-GST Invoice Generator"}
        description={pageDescription}
        path={isGstPage ? "/invoice/gst-invoice" : "/invoice/without-gst-invoice"}
      />
    
        {isGstPage ? (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(gstFaqSchema) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(gstHowToSchema) }}
            />
          </>
        ) : (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(nonGstFaqSchema) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(nonGstHowToSchema) }}
            />
          </>
        )}
      
        <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://growile.com/" },
          { name: "Invoice", url: "https://growile.com/invoice/" },
          { name: invoicePageLabel, url: `https://growile.com${invoicePagePath}` }
        ]}
      />

      <Navbar {...invoiceNavigation(invoiceHomeHref, withoutGstInvoiceHref, gstInvoiceHref)} />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Invoice", href: "/invoice/" },
          { label: invoicePageLabel, href: invoicePagePath }
        ]}
      />

      <main id={isGstPage ? "gst-invoice-page" : "without-gst-invoice-page"}>
        <Hero
          kicker={invoiceHero.kicker}
          title={heroTitle}
          subtitle={heroSubtitle}
          ctaText={invoiceHero.ctaText}
          ctaHref={isGstPage ? gstInvoiceHref : withoutGstInvoiceHref}
          onCtaClick={scrollToInvoiceForm}
        />
        
        <Divider />
        <section className="invoice-options" id="invoice-options">
          <p className="kicker">CHOOSE YOUR FORMAT</p>
          <h2>{isGstPage ? "Create a GST Invoice." : "Start with the Invoice you need."}</h2>
          <p>
            Both options are quick to fill in and designed to keep your billing
            clear.
          </p>
        </section>
        
        {isGstPage ? <GstInvoice /> : <WithoutGstInvoice />}

        <Divider />

        <H2Section blocks={currentSeoBlocks} />

        <Divider />
        
        <HowToUse
          heading={currentHowToHeading}
          steps={currentHowToSteps}
        />

        <Divider />
        <Products />
        <Divider />
        
        <FAQ
          heading={faqHeading}
          faqs={currentFaqs}
        />
      </main>
      <Footer
        invoiceHref={invoiceHomeHref}
        termsHref={termsHref}
        privacyHref={privacyHref}
        reserveBottomAdSpace={false}
      />
    </div>
  );
}