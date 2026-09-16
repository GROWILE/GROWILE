import React from 'react';
import './ProductsPage.css';

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

const DefaultIcon = () => (
  <svg className="product-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M7 3.5h7l3 3V20.5H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
    <path d="M14 3.5v4h3M8.5 12h5M8.5 15.5h5" />
  </svg>
);

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
        {products.map((product) => (
          <article key={product.id} className="product-card">
            <div className="product-icon-wrap">
              {product.iconSvg ? product.iconSvg : <DefaultIcon />}
            </div>
            
            <p className="product-context">
              <span>{product.suiteLabel}</span>
            </p>
            
            <h3 className="product-title">{product.title}</h3>
            <p className="product-description">{product.description}</p>
            
            <div className="product-tags" aria-label={`${product.title} features`}>
              {product.tags.map((tag, index) => (
                <span key={index} className="product-tag">{tag}</span>
              ))}
            </div>
            
            <div className="product-divider" />
            
            <a href={product.ctaHref} className="product-button">
              {product.ctaLabel} <span className="product-arrow" aria-hidden="true">-&gt;</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}