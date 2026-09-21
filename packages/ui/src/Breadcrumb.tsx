import "./Breadcrumb.css";

export type BreadcrumbLink = {
  label: string;
  href: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbLink[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item: BreadcrumbLink, index: number) => {
          const isLast = index === items.length - 1;
          return (
            <li className="breadcrumb-item" key={item.href}>
              {!isLast ? (
                <>
                  <a className="breadcrumb-link" href={item.href}>{item.label}</a>
                  <span className="breadcrumb-separator" aria-hidden="true">/</span>
                </>
              ) : (
                <span className="breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}