import { Presentation } from "lucide-react";
import OfficeToPDFPage from "./OfficeToPDFPage";
export default function PowerpointtoPDF() {
  return <OfficeToPDFPage format="powerpoint" icon={<Presentation size={30} aria-hidden="true" />} />;
}
