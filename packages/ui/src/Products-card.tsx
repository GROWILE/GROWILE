import "./Products-card.css";

type Product = {
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  tags: string[];
};

const products: Product[] = [
  {
    title: "Finance",
    href: "#finance",
    buttonLabel: "Explore Finance",
    description: "A simpler way to understand your money and stay in control.",
    tags: ["Offers"],
  },
  {
    title: "Invoice",
    href: "/invoice",
    buttonLabel: "Create Invoice",
    description: "Professional invoicing that keeps your billing clear and moving.",
    tags: ["NON-GST", "GST"],
  },
];

function DocumentIcon() {
  return (
    <svg
      className="product-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 3.5h7l3 3V20.5H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
      <path d="M14 3.5v4h3M8.5 12h5M8.5 15.5h5" />
    </svg>
  );
}

export default function Products() {
  return (
    <section className="products">
      <div className="products-heading">
        <p className="products-kicker">GROWILE SUITE</p>
        <h2>Try Our Products &gt;</h2>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <article key={product.title} className="product-card">
            <div className="product-icon-wrap">
              <DocumentIcon />
            </div>
            <p className="product-context">
              <span>GROWILE SUITE</span>
            </p>
            <h3 className="product-title">{product.title}</h3>
            <p className="product-description">{product.description}</p>
            <div className="product-tags" aria-label={`${product.title} features`}>
              {product.tags.map((tag) => (
                <span key={tag} className="product-tag">{tag}</span>
              ))}
            </div>
            <div className="product-divider" />
            <a href={product.href} className="product-button">
              {product.buttonLabel} <span className="product-arrow" aria-hidden="true">-&gt;</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}