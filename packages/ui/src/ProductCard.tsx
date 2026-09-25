// Renders a product card with its details and link.
import DocumentIcon from "./DocumentIcon";
import "./ProductCard.css";

export type Product = {
  id?: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  tags: string[];
};

export type ProductCardProps = {
  product: Product;
  contextLabel?: string;
};

// Renders the product card interface.
export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <a href={product.href} className="product-card">
      <div className="product-icon-wrap">
        <DocumentIcon label={product.title === "PDF Tools" ? "PDF" : undefined} />
      </div>
      <div className="product-card-content">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
      </div>
    </a>
  );
}
