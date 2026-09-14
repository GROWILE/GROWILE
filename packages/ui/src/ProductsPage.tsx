import React from 'react';
import './ProductsPage.css';

// Product Data Type Definition
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

// Default Icon (Document) fallback
const DefaultIcon = () => (
  <svg className="product-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export default function ProductsPage({ 
  heading = "Try Our Products", 
  products 
}: ProductsPageProps) {
  return (
    <div className="products-page-container">
      <div className="products-page-header">
        <h2 className="products-page-title">
          {heading} <span aria-hidden="true">›</span>
        </h2>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-icon-wrapper">
              {product.iconSvg ? product.iconSvg : <DefaultIcon />}
            </div>
            
            <div className="product-suite-label">{product.suiteLabel}</div>
            <h3 className="product-title">{product.title}</h3>
            <p className="product-desc">{product.description}</p>
            
            <div className="product-tags">
              {product.tags.map((tag, index) => (
                <span key={index} className="product-tag">{tag}</span>
              ))}
            </div>
            
            <a href={product.ctaHref} className="product-cta">
              {product.ctaLabel} <span aria-hidden="true">→</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}