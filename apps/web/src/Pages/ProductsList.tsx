// File: src/pages/ProductsList.tsx (or your products page route file)
import Navbar from "../../../../packages/ui/src/Navbar";
import Footer from "../../../../packages/ui/src/Footer";
import ProductsPage from "../../../../packages/ui/src/ProductsPage";
import Breadcrumb from "../../../../packages/ui/src/Breadcrumb";
import BreadcrumbSchema from "../../../../packages/ui/src/BreadcrumbSchema";
import webLogo from "../../../../packages/ui/assets/growile-logo.svg";

export default function ProductsList() {
  
  // Future-la innum products add panrathukku inga list-la add pannina pothum!
  const allProducts = [
    {
      id: "pdf",
      suiteLabel: "GROWILE SUITE",
      title: "PDF Tools",
      description: "Free browser-based tools to convert, edit, organize, and secure PDF files.",
      tags: ["FREE", "PRIVATE"],
      ctaLabel: "Explore PDF Tools",
      ctaHref: "/pdf"
    },
    {
      id: "invoice",
      suiteLabel: "GROWILE SUITE",
      title: "Invoice",
      description: "Professional invoicing that keeps your billing clear and moving.",
      tags: ["NON-GST", "GST"],
      ctaLabel: "Create Invoice",
      ctaHref: "/invoice" 
    }
  ];

  return (
    <>
      {/* 1. SEO Breadcrumb Schema for Google */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://growile.com" },
          { name: "Products", url: "https://growile.com/products" }
        ]}
      />

      {/* 2. Global Navbar */}
      <Navbar
        logoAlt="Growile"
        logoSrc={webLogo}
        home={{ label: "Home", href: "/" }}
        products={{
          label: "Products",
          items: [
            { label: "PDF", href: "/pdf" },
            { label: "Invoice", href: "/invoice" },
          ],
        }}
        about={{ label: "About", href: "/about" }}
      />
      
      {/* 3. Visual User Breadcrumb (Navbar-kku aduthu) */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" }
        ]}
      />

      {/* 4. Reusable Products Grid Page */}
      <main>
        <ProductsPage heading="All Products" products={allProducts} />
      </main>
      
      {/* 5. Global Footer */}
      <Footer 
        invoiceHref="/invoice"
        termsHref="/terms-of-service" 
        privacyHref="/privacy-policy" 
      />
    </>
  );
}