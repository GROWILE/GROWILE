import Home from "./Pages/Home";
import JPGtoPDF from "./Pages/JPGtoPDF";
import PNGtoPDF from "./Pages/PNGtoPDF";
import PDFtoJPG from "./Pages/PDFtoJPG";
import PDFtoPNG from "./Pages/PDFtoPNG";
import PDFtoText from "./Pages/PDFtoText";
import MergePDF from "./Pages/MergePDF";
import SplitPDF from "./Pages/SplitPDF";
import ExtractPDFPages from "./Pages/ExtractPDFPages";
import DeletePDFPages from "./Pages/DeletePDFPages";
import ReorderPDFPages from "./Pages/ReorderPDFPages";
import RotatePDF from "./Pages/RotatePDF";
import CompressPDF from "./Pages/CompressPDF";
import ProtectPDF from "./Pages/ProtectPDF";
import UnlockPDF from "./Pages/UnlockPDF";
import AddTextPDF from "./Pages/AddTextPDF";
import AddImagePDF from "./Pages/AddImagePDF";
import HighlightPDF from "./Pages/HighlightPDF";
import WatermarkPDF from "./Pages/WatermarkPDF";
import AddPageNumbers from "./Pages/AddPageNumbers";
import AddSignature from "./Pages/AddSignature";

export default function App() {
  if (window.location.pathname === "/tools/jpg-to-pdf") {
    return <JPGtoPDF />;
  }
  if (window.location.pathname === "/tools/png-to-pdf") {
    return <PNGtoPDF />;
  }
  if (window.location.pathname === "/tools/pdf-to-jpg") {
    return <PDFtoJPG />;
  }
  if (window.location.pathname === "/tools/pdf-to-png") {
    return <PDFtoPNG />;
  }
  if (window.location.pathname === "/tools/pdf-to-text") {
    return <PDFtoText />;
  }
  if (window.location.pathname === "/tools/merge-pdf") {
    return <MergePDF />;
  }
  if (window.location.pathname === "/tools/split-pdf") {
    return <SplitPDF />;
  }
  if (window.location.pathname === "/tools/extract-pdf-pages") {
    return <ExtractPDFPages />;
  }
  if (window.location.pathname === "/tools/delete-pdf-pages") {
    return <DeletePDFPages />;
  }
  if (window.location.pathname === "/tools/reorder-pdf-pages") {
    return <ReorderPDFPages />;
  }
  if (window.location.pathname === "/tools/rotate-pdf") {
    return <RotatePDF />;
  }
  if (window.location.pathname === "/tools/compress-pdf") {
    return <CompressPDF />;
  }
  if (window.location.pathname === "/tools/protect-pdf") {
    return <ProtectPDF />;
  }
  if (window.location.pathname === "/tools/unlock-pdf") {
    return <UnlockPDF />;
  }
  if (window.location.pathname === "/tools/add-text") {
    return <AddTextPDF />;
  }
  if (window.location.pathname === "/tools/add-image") {
    return <AddImagePDF />;
  }
  if (window.location.pathname === "/tools/highlight-pdf") {
    return <HighlightPDF />;
  }
  if (window.location.pathname === "/tools/add-watermark") {
    return <WatermarkPDF />;
  }
  if (window.location.pathname === "/tools/add-page-numbers") {
    return <AddPageNumbers />;
  }
  if (window.location.pathname === "/tools/add-signature" || window.location.pathname === "/tools/sign-pdf") {
    return <AddSignature />;
  }
  return <Home />;
}