import { useEffect, useState } from "react";
import Divider from "../../../../packages/ui/src/Divider";
import FAQ from "@growile/ui/src/FAQ";
import Footer from "../../../../packages/ui/src/Footer";
import Hero from "../../../../packages/ui/src/Hero";
import HowToUse from "@growile/ui/src/HowToUse";
import Navbar from "../../../../packages/ui/src/Navbar";
import GstInvoice from "./GstInvoice.tsx";
import WithoutGstInvoice from "./WithoutGstInvoice";
import Products from '../../../../packages/ui/src/Products-card'

type InvoicePageVariant = "without-gst" | "gst";

function getPageVariant(): InvoicePageVariant {
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

  return (
    <div className="invoice-app">
      <Navbar
        logoAlt="Growile"
        home={{ label: "Home", href: "/" }}
        products={{
          label: "Products",
          items: [
            { label: "Finance", href: "#finance" },
            { label: "Invoice", href: "/" },
          ],
        }}
        tools={{
          label: "Tools",
          items: [
            { label: "Non-GST Invoice", href: "#without-gst-invoice-page" },
            { label: "GST Invoice", href: "#gst-invoice-page" },
          ],
        }}
      />
      <main id={isGstPage ? "gst-invoice-page" : "without-gst-invoice-page"}>
        <Hero
          kicker="GROWILE INVOICE"
          title="Professional invoices, built for your business."
          subtitle="Create clean, accurate invoices in minutes. Choose the format that suits your business and keep every payment moving forward."
          ctaText="Create an Invoice"
          ctaHref={isGstPage ? "#gst-invoice" : "#without-gst-invoice"}
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
        
        <HowToUse
          heading="How to Create an Invoice"
          steps={[
            { number: "1", title: "Choose a template", description: "Pick a professional invoice format that fits your business." },
            { number: "2", title: "Add your details", description: "Fill in client info, items, and pricing." },
            { number: "3", title: "Download or send", description: "Export as PDF or send directly to your client." },
          ]}
        />
        <Divider />
        <Products />
        <Divider />
        <FAQ
          heading="Invoice FAQ"
          faqs={[
            { question: "Can I customize my invoice template?", answer: "Yes, you can choose from multiple templates and adjust colors, logo, and layout." },
            { question: "Can I download invoices as PDF?", answer: "Yes, every invoice can be exported as a PDF instantly." },
            { question: "Is my data secure?", answer: "We take privacy seriously. Your data is not stored on our servers and is only used to generate your invoice." },
          ]}
        />
      </main>
      <Footer invoiceHref="/" />
    </div>
  );
}