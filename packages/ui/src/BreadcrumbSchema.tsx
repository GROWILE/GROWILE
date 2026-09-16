// File: packages/ui/src/BreadcrumbSchema.tsx
export type BreadcrumbItem = {
  name: string;
  url: string;
};

export type BreadcrumbSchemaProps = {
  items: BreadcrumbItem[];
};

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}