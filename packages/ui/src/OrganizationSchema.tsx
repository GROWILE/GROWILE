type OrganizationSchemaProps = {
  name?: string;
  url?: string;
  logo?: string;
  email?: string;
  sameAs?: string[];
};

export default function OrganizationSchema({
  name = "Growile",
  url = "https://growile.com/",
  logo = "https://growile.com/growile-icon.png.png",
  email = "growile.groups@gmail.com",
  sameAs = [],
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    email,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
