// File: packages/ui/src/Breadcrumb.tsx

export type BreadcrumbLink = {
  label: string;
  href: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbLink[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      style={{ 
        width : "50%",
        position: "sticky", 
        top: "70px",          // Navbar height-ku etha mathiri correct-ah ukkanthukkum
        zIndex: 30,           // Navbar-kku keezhe, content-kku mela irukkum
        padding: "12px 24px", 
        borderBottom: "1px solid #e5e7eb" 
      }}
    >
      <ol style={{ display: "flex", listStyle: "none", gap: "8px", alignItems: "center", fontSize: "14px", margin: 0, padding: 0 }}>
        {items.map((item: BreadcrumbLink, index: number) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} style={{ display: "flex", alignItems: "center" }}>
              {!isLast ? (
                <>
                  <a href={item.href} style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>{item.label}</a>
                  <span style={{ marginLeft: "8px", color: "#6b7280" }}>/</span>
                </>
              ) : (
                <span style={{ color: "#1f2937", fontWeight: 600 }} aria-current="page">
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