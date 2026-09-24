export type SoftwareApplicationSchemaProps = {
  name: string;
  description: string;
  path: string;
  applicationCategory?: string;
};

export default function SoftwareApplicationSchema({
  name,
  description,
  path,
  applicationCategory = "UtilitiesApplication",
}: SoftwareApplicationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory,
    operatingSystem: "Web Browser",
    description,
    url: `https://growile.com${path}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
