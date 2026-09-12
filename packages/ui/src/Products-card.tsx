import "./Products-card.css";

const products = [
  {
    icon: "💰",
    title: "Finance",
    description:
      "Track expenses, manage budgets, and get real-time insights into your business finances — all in one simple dashboard.",
    href: "#finance",
    buttonLabel: "Explore Finance",
  },
  {
    icon: "🧾",
    title: "Invoice",
    description:
      "Create, send, and manage professional invoices in seconds. Get paid faster with automated reminders and tracking.",
    href: "#invoice",
    buttonLabel: "Create Invoice",
  },
];

export default function Products() {
  return (
    <section className="products">
      <h2 className="products-heading">Try Our Products &gt;</h2>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.title} className="product-card">
            <div className="product-icon">{product.icon}</div>
            <h3 className="product-title">{product.title}</h3>
            <p className="product-description">{product.description}</p>
            <a href={product.href} className="product-button">
              {product.buttonLabel} <span className="product-arrow">&gt;</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}