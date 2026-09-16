import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import Divider from "../../../../packages/ui/src/Divider";
import FAQ from "@growile/ui/src/FAQ";
import Footer from "../../../../packages/ui/src/Footer";
import Hero from "../../../../packages/ui/src/Hero";
import HowToUse from "@growile/ui/src/HowToUse";
import Navbar from "../../../../packages/ui/src/Navbar";
import invoiceLogo from "../../../../packages/ui/assets/growile-InvoiceGenerator-logo.svg";
import GstInvoice from "./GstInvoice.tsx";
import WithoutGstInvoice from "./WithoutGstInvoice";
import Products from '../../../../packages/ui/src/Products-card';
import PageMeta from "../../../../packages/ui/src/PageMeta";
import H2Section from "../../../../packages/ui/src/H2Section";
import Breadcrumb from "../../../../packages/ui/src/Breadcrumb";
import BreadcrumbSchema from "../../../../packages/ui/src/BreadcrumbSchema";

type InvoicePageVariant = "without-gst" | "gst";

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

export default function InvoicePage() {
  const [variant, setVariant] = useState<InvoicePageVariant>(getPageVariant);
  const isEmbeddedInvoice = window.location.pathname.startsWith("/invoice");
  const invoiceBaseHref = isEmbeddedInvoice ? "/invoice" : "";
  const invoiceHomeHref = isEmbeddedInvoice ? "/invoice" : "/";
  const gstInvoiceHref = `${invoiceBaseHref}/gst-invoice`;
  const withoutGstInvoiceHref = `${invoiceBaseHref}/without-gst-invoice`;
  const termsHref = `${invoiceBaseHref}/terms-and-conditions`;
  const privacyHref = `${invoiceBaseHref}/privacy-policy`;

  useEffect(() => {
    const handleHashChange = () => setVariant(getPageVariant());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const targetId = window.location.hash.slice(1);

    if (!targetId) {
      return;
    }

    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [variant]);

  const isGstPage = variant === "gst";
  const invoiceFormId = isGstPage ? "gst-invoice" : "without-gst-invoice";

  // --- Page Meta Tags ---
  const pageTitle = isGstPage 
    ? "Free GST Invoice Generator (No Sign-Up) | Growile"
    : "Free Invoice Generator Online (Non-GST) | Growile";

  const pageDescription = isGstPage
    ? "Create professional GST tax invoices in any currency. Auto-calculate your exact tax percentages and download a tax-ready PDF bill with no sign-up required."
    : "Create global bills instantly with our simple invoice maker free of charge. Get your standard non GST bill format in any currency with no sign-up required.";

  // --- Hero Section Content ---
  const heroTitle = isGstPage
    ? "Free GST Invoice Generator (No Sign-Up)"
    : "Free Invoice Generator Online (Non-GST)";
    
  const heroSubtitle = isGstPage
    ? "Need a free GST invoice generator for your global business? Our online tool helps you build tax-ready bills fast. You do not need to sign up or log in. Just select your local currency from our global list, add your tax details, and input your item prices. The system will auto-calculate the tax percentage for you. Get your billing done quickly and download a professional PDF in seconds to get paid."
    : "Create professional bills in any currency with our free invoice generator online. Designed for global freelancers and small businesses who don't need to add tax details. You can easily select your local currency, enter customer information, item pricing, and payment terms, then download a clean PDF right away. No sign-up is required, making cross-border billing as fast and simple as possible.";

  // --- SEO H2 Blocks ---
  const gstSeoBlocks = [
    {
      heading: "Tax Invoice Format under GST",
      description: "Looking for the right tax invoice format under GST? We make global billing easy. Our layout supports every world currency and includes all mandatory fields like your tax ID. Just fill the boxes and you are set."
    },
    {
      heading: "Create GST Bill Online Free",
      description: "You can create GST bill online free of cost with this tool. Forget heavy software. Pick any world currency, add your tax percentage, let the math happen automatically, and bill international clients in seconds."
    },
    {
      heading: "GST Invoice Format in PDF",
      description: "Clients worldwide ask for a GST invoice format in PDF to process payments. When you hit download, our tool packs your multi-currency details into a clean, universally accepted PDF document ready to email."
    }
  ];

  const nonGstSeoBlocks = [
    {
      heading: "Standard Non GST Bill Format",
      description: "Wondering what to include in a standard non GST bill format? Our tool keeps global billing simple. Just pick your currency, add your business name, items, and total. We handle the professional layout."
    },
    {
      heading: "Simple Invoice Maker Free",
      description: "As a simple invoice maker free of complicated settings, this tool gets the job done fast. You don't need heavy software to bill international clients. Type your details in any currency and download."
    },
    {
      heading: "Quotation Maker Without GST",
      description: "Need to send an estimate to an overseas client? You can also use this as a quotation maker without GST. Change the invoice number to a quote number, set your world currency, fill your rates, and send."
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
    { question: "Who can use a non-GST bill?", answer: "Perfect for freelancers, small business owners, and unregistered service providers whose income is below the mandatory GST threshold." },
    { question: "Is my invoice data saved on your servers?", answer: "No. Your privacy is 100% safe. We do not store your data. Everything is processed locally right inside your web browser." },
    { question: "Can I generate an invoice in USD or other currencies?", answer: "Yes! You can select any world currency from our global list. It works perfectly for billing overseas clients." },
    { question: "Do I need to create an account to download the PDF?", answer: "No sign-up or login is required. You can instantly fill in your details and download unlimited PDF invoices for free." },
    { question: "Will there be a watermark on the free invoice?", answer: "Yes, a small, clean 'Invoice Created by GROWILE' text appears at the bottom to help keep this tool free for everyone." },
    { question: "Is there a limit on how many bills I can create?", answer: "No, there are absolutely no limitations. You can generate and download as many professional bills as your business needs." },
    { question: "Can I use this as a quotation or estimate maker?", answer: "Yes. Simply type 'Quotation' or 'Estimate' instead of an invoice number, fill in your pricing, and download it instantly." },
    { question: "Is this bill format legally valid without GST?", answer: "Yes, a standard bill of supply without GST is completely valid for accounting and payment collection for unregistered businesses." }
  ];

  const gstFaqs = [
    { question: "Is my GST and financial data stored on your servers?", answer: "No. Your privacy is 100% secure. We do not store any invoice data. Everything is processed locally right inside your web browser." },
    { question: "Does the tool auto-calculate CGST, SGST, and IGST?", answer: "Yes. Just enter your tax percentage. The tool handles the math automatically and formats the tax breakdown for your PDF document." },
    { question: "Can I create a GST invoice in USD or other currencies?", answer: "Yes! You can select any world currency from our list. The system will calculate your GST tax percentage exactly the same way." },
    { question: "Do I need to create an account or pay to download?", answer: "No sign-up, login, or payment is required. You can instantly fill in your tax details and download unlimited PDF bills for free." },
    { question: "Will there be a watermark on the downloaded GST PDF?", answer: "Yes, a small, clean 'Invoice Created by GROWILE' text appears at the bottom. This helps us keep this premium tool free for everyone." },
    { question: "Is there a limit on how many tax invoices I can generate?", answer: "No, there are absolutely no limitations. You can generate and download as many professional GST tax invoices as your business needs." },
    { question: "Can I add my business GSTIN and HSN codes?", answer: "Yes. You can easily add your GSTIN, customer tax details, and HSN/SAC codes in the item boxes to stay fully tax compliant." },
    { question: "Is this GST bill format valid for claiming ITC?", answer: "Yes. Our format includes all mandatory fields required by tax laws, making it fully valid for accounting and Input Tax Credit claims." }
  ];

  const currentFaqs = isGstPage ? gstFaqs : nonGstFaqs;
  const faqHeading = isGstPage ? "GST Invoice FAQ" : "Non-GST Invoice FAQ";

  // --- Schema Objects (FAQ & HowTo Schemas) ---
  const nonGstFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": nonGstFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const gstFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": gstFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const nonGstHowToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": nonGstHowToHeading,
    "description": "Step-by-step guide to creating a non-GST bill quickly using Growile's free online invoice tool.",
    "step": nonGstSteps.map((step, index) => ({
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
    "step": gstSteps.map((step, index) => ({
      "@type": "HowToStep",
      "name": step.title,
      "text": step.description,
      "position": index + 1
    }))
  };

  const scrollToInvoiceForm = (event: MouseEvent<HTMLAnchorElement>) => {
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
          { name: "Home", url: "https://growile.com" },
          { name: "Products", url: "https://growile.com/products" },
          { name: "Invoice Generator", url: "https://growile.com/invoice" },
          { name: "GST Invoice", url: "https://growile.com/invoice/gst-invoice" }
        ]}
      />

      <Navbar
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
            { label: "Non-GST Invoice", href: withoutGstInvoiceHref },
            { label: "GST Invoice", href: gstInvoiceHref },
          ],
        }}
      />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: "Invoice Generator", href: "/invoice" },
          { label: isGstPage ? "GST Invoice" : "Non-GST Invoice", href: window.location.pathname }
        ]}
      />

      <main id={isGstPage ? "gst-invoice-page" : "without-gst-invoice-page"}>
        <Hero
          kicker="GROWILE INVOICE"
          title={heroTitle}
          subtitle={heroSubtitle}
          ctaText="Create Free Invoice"
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
        showAdSpace
      />
    </div>
  );
}