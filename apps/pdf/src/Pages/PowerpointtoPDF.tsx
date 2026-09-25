// Renders the powerpointto pdf PDF tool page.
import { Presentation } from "lucide-react";
import OfficeToPDFPage from "./OfficeToPDFPage";
// Renders the powerpointto pdf interface.
export default function PowerpointtoPDF() {
  return <OfficeToPDFPage format="powerpoint" icon={<Presentation size={30} aria-hidden="true" />} />;
}
