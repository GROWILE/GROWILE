// Renders a grid of product cards.
import ProductCard from "./ProductCard";
import type { Product } from "./ProductCard";
import "./Products.css";

export type { Product };

export type ProductsProps = {
  products?: Product[];
  contextLabel?: string;
};

const defaultProducts: Product[] = [
  {
    title: "PDF Tools",
    href: "/pdf",
    buttonLabel: "Explore PDF Tools",
    description: "Free browser-based tools to convert, edit, organize, and secure PDF files.",
    tags: ["FREE", "PRIVATE"],
  },
  {
    title: "Invoice",
    href: "/invoice",
    buttonLabel: "Create Invoice",
    description: "Professional invoicing that keeps your billing clear and moving.",
    tags: ["NON-GST", "GST"],
  },
];

// Renders the products interface.
export default function Products({
  products = defaultProducts,
  contextLabel = "GROWILE SUITE",
}: ProductsProps) {
  return (
    <section className="products">
      <div className="products-heading">
        <p className="products-kicker">GROWILE SUITE</p>
        <h2>Try Our Products &gt;</h2>
      </div>
      <div className="products-grid">
        {products.map(/* Builds a value for each item in the collection. */ (product) => (
          <ProductCard
            key={product.title}
            product={product}
            contextLabel={contextLabel}
          />
        ))}
      </div>
    </section>
  );
}
