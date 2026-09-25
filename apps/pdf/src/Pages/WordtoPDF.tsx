// Renders the wordto pdf PDF tool page.
import { FileText } from "lucide-react";
import OfficeToPDFPage from "./OfficeToPDFPage";
// Renders the wordto pdf interface.
export default function WordtoPDF() {
  return <OfficeToPDFPage format="word" icon={<FileText size={30} aria-hidden="true" />} />;
}
