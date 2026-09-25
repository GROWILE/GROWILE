// Renders the web app product list page.
// File: src/pages/ProductsList.tsx (or your products page route file)
import Navbar from "../../../../packages/ui/src/Navbar";
import Footer from "../../../../packages/ui/src/Footer";
import ProductsPage from "../../../../packages/ui/src/ProductsPage";
import Breadcrumb from "../../../../packages/ui/src/Breadcrumb";
import BreadcrumbSchema from "../../../../packages/ui/src/BreadcrumbSchema";
import { webFooter, webNavigation } from "../config/site";
import { webProductList } from "../config/productCards";

// Renders the products list interface.
export default function ProductsList() {
  
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
      <Navbar {...webNavigation} />
      
      {/* 3. Visual User Breadcrumb (Navbar-kku aduthu) */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" }
        ]}
      />

      {/* 4. Reusable Products Grid Page */}
      <main>
        <ProductsPage heading="All Products" products={webProductList} />
      </main>
      
      {/* 5. Global Footer */}
      <Footer {...webFooter} />
    </>
  );
}