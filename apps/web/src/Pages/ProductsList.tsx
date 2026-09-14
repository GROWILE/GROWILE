import Navbar from '../../../../packages/ui/src/Navbar';
import Footer from '../../../../packages/ui/src/Footer';
import ProductsPage from '../../../../packages/ui/src/ProductsPage';
import webLogo from '../../../../packages/ui/assets/growile-invoice-logo.svg';

export default function ProductsList() {
  
  const allProducts = [
    {
      id: "finance",
      suiteLabel: "GROWILE SUITE",
      title: "Finance",
      description: "A simpler way to understand your money and stay in control.",
      tags: ["Coming Soon"],
      ctaLabel: "Explore Finance",
      ctaHref: "/finance"
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
      <Navbar
        logoAlt="Growile"
        logoSrc={webLogo}
        home={{ label: "Home", href: "/" }}
        products={{
          label: "Products",
          items: [
            { label: "Finance", href: "/finance" },
            { label: "Invoice", href: "/invoice" },
          ],
        }}
        about={{ label: "About", href: "/about" }}
      />
      
    
      <ProductsPage heading="All Products" products={allProducts} />
      
      <Footer termsHref="/terms-of-service" />
    </>
  );
}