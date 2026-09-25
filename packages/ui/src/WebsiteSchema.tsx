// Adds website structured data for search engines.
type WebsiteSchemaProps = {
  name?: string;
  url?: string;
};

// Renders the website schema interface.
export default function WebsiteSchema({
  name = "Growile",
  url = "https://growile.com/",
}: WebsiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
