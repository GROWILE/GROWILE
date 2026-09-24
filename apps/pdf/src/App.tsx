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
  if (window.location.pathname === "/pdf/jpg-to-pdf") {
    return <JPGtoPDF />;
  }
  if (window.location.pathname === "/pdf/png-to-pdf") {
    return <PNGtoPDF />;
  }
  if (window.location.pathname === "/pdf/pdf-to-jpg") {
    return <PDFtoJPG />;
  }
  if (window.location.pathname === "/pdf/pdf-to-png") {
    return <PDFtoPNG />;
  }
  if (window.location.pathname === "/pdf/pdf-to-text") {
    return <PDFtoText />;
  }
  if (window.location.pathname === "/pdf/merge-pdf") {
    return <MergePDF />;
  }
  if (window.location.pathname === "/pdf/split-pdf") {
    return <SplitPDF />;
  }
  if (window.location.pathname === "/pdf/extract-pdf-pages") {
    return <ExtractPDFPages />;
  }
  if (window.location.pathname === "/pdf/delete-pdf-pages") {
    return <DeletePDFPages />;
  }
  if (window.location.pathname === "/pdf/reorder-pdf-pages") {
    return <ReorderPDFPages />;
  }
  if (window.location.pathname === "/pdf/rotate-pdf") {
    return <RotatePDF />;
  }
  if (window.location.pathname === "/pdf/compress-pdf") {
    return <CompressPDF />;
  }
  if (window.location.pathname === "/pdf/protect-pdf") {
    return <ProtectPDF />;
  }
  if (window.location.pathname === "/pdf/unlock-pdf") {
    return <UnlockPDF />;
  }
  if (window.location.pathname === "/pdf/add-text") {
    return <AddTextPDF />;
  }
  if (window.location.pathname === "/pdf/add-image") {
    return <AddImagePDF />;
  }
  if (window.location.pathname === "/pdf/highlight-pdf") {
    return <HighlightPDF />;
  }
  if (window.location.pathname === "/pdf/add-watermark") {
    return <WatermarkPDF />;
  }
  if (window.location.pathname === "/pdf/add-page-numbers") {
    return <AddPageNumbers />;
  }
  if (window.location.pathname === "/pdf/add-signature" || window.location.pathname === "/pdf/sign-pdf") {
    return <AddSignature />;
  }
  return <Home />;
}