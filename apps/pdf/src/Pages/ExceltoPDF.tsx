// Renders the excelto pdf PDF tool page.
import { FileSpreadsheet } from "lucide-react";
import OfficeToPDFPage from "./OfficeToPDFPage";
// Renders the excelto pdf interface.
export default function ExceltoPDF() {
  return <OfficeToPDFPage format="excel" icon={<FileSpreadsheet size={30} aria-hidden="true" />} />;
}
