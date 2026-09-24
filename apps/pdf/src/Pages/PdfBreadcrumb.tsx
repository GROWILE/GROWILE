import Breadcrumb from "../../../../packages/ui/src/Breadcrumb";
import BreadcrumbSchema from "../../../../packages/ui/src/BreadcrumbSchema";

type PdfBreadcrumbProps = {
  label?: string;
  path?: string;
};

export default function PdfBreadcrumb({ label, path }: PdfBreadcrumbProps) {
  const currentPath = path ? `/pdf/${path}` : "/pdf/";
  const items = [
    { label: "Home", href: "/" },
    { label: "PDF Tools", href: "/pdf/" },
    ...(label ? [{ label, href: currentPath }] : []),
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://growile.com/" },
          { name: "PDF Tools", url: "https://growile.com/pdf/" },
          ...(label ? [{ name: label, url: `https://growile.com${currentPath}` }] : []),
        ]}
      />
      <Breadcrumb items={items} />
    </>
  );
}
