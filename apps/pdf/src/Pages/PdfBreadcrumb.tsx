// Renders the pdf breadcrumb PDF tool page.
import Breadcrumb from "../../../../packages/ui/src/Breadcrumb";
import BreadcrumbSchema from "../../../../packages/ui/src/BreadcrumbSchema";

type PdfBreadcrumbProps = {
  label?: string;
  path?: string;
};

// Renders the pdf breadcrumb interface.
export default function PdfBreadcrumb({ label, path }: PdfBreadcrumbProps) {
  const currentPath = path ? `/pdf/${path}` : "/pdf";
  const siteUrl = "https://growile.com";
  const items = [
    { label: "Home", href: "/" },
    { label: "PDF Tools", href: "/pdf" },
    ...(label ? [{ label, href: currentPath }] : []),
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: `${siteUrl}/` },
          { name: "PDF Tools", url: `${siteUrl}/pdf` },
          ...(label ? [{ name: label, url: `${siteUrl}${currentPath}` }] : []),
        ]}
      />
      <Breadcrumb items={items} />
    </>
  );
}
