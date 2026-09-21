import { FileSpreadsheet } from "lucide-react";
import OfficeToPDFPage from "./OfficeToPDFPage";
export default function ExceltoPDF() {
  return <OfficeToPDFPage format="excel" icon={<FileSpreadsheet size={30} aria-hidden="true" />} />;
}
