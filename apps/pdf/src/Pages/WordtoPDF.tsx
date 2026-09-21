import { FileText } from "lucide-react";
import OfficeToPDFPage from "./OfficeToPDFPage";
export default function WordtoPDF() {
  return <OfficeToPDFPage format="word" icon={<FileText size={30} aria-hidden="true" />} />;
}
