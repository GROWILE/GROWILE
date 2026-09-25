// Defines the product cards shown on the web app.
import type { Product } from "../../../../packages/ui/src/ProductCard";
import type { ProductItem } from "../../../../packages/ui/src/ProductsPage";

export const webProductCards: Product[] = [
  {
    id: "pdf",
    title: "PDF Tools",
    href: "/pdf",
    buttonLabel: "Explore PDF Tools",
    description: "Free browser-based tools to convert, edit, organize, and secure PDF files.",
    tags: ["FREE", "PRIVATE"],
  },
  {
    id: "invoice",
    title: "Invoice",
    href: "/invoice",
    buttonLabel: "Create Invoice",
    description: "Professional invoicing that keeps your billing clear and moving.",
    tags: ["NON-GST", "GST"],
  },
];

export const webProductList: ProductItem[] = webProductCards.map(/* Builds a value for each item in the collection. */ (product) => ({
  id: product.id ?? product.title.toLowerCase().replace(/\s+/g, "-"),
  suiteLabel: "GROWILE SUITE",
  title: product.title,
  description: product.description,
  tags: product.tags,
  ctaLabel: product.buttonLabel,
  ctaHref: product.href,
}));
