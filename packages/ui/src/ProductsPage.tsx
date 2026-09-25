// Renders the shared product listing page.
import './Products.css';
import './ProductCard.css';
import './ProductsPage.css';
import ProductCard from './ProductCard';

export type ProductItem = {
  id: string;
  suiteLabel: string;
  title: string;
  description: string;
  tags: string[];
  ctaLabel: string;
  ctaHref: string;
  iconSvg?: React.ReactNode; 
};

export type ProductsPageProps = {
  heading?: string;
  products: ProductItem[];
};

// Renders the products page interface.
export default function ProductsPage({ 
  heading = "Try Our Products", 
  products 
}: ProductsPageProps) {
  return (
    <section className="products">
      <div className="products-heading">
        <p className="products-kicker">GROWILE SUITE</p>
        <h2>{heading} &gt;</h2>
      </div>

      <div className="products-grid">
        {products.map(/* Builds a value for each item in the collection. */ (product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              title: product.title,
              description: product.description,
              href: product.ctaHref,
              buttonLabel: product.ctaLabel,
              tags: product.tags,
            }}
          />
        ))}
      </div>
    </section>
  );
}