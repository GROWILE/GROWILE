// Selects and renders the page for the current PDF tool route.
import { lazy, Suspense } from "react";
import LoadingScreen from "../../../packages/ui/src/LoadingScreen";

const Home = lazy(/* Handles home work. */ () => import("./Pages/Home"));
const JPGtoPDF = lazy(/* Handles jpgto pdf work. */ () => import("./Pages/JPGtoPDF"));
const PNGtoPDF = lazy(/* Handles pngto pdf work. */ () => import("./Pages/PNGtoPDF"));
const PDFtoJPG = lazy(/* Handles pdfto jpg work. */ () => import("./Pages/PDFtoJPG"));
const PDFtoPNG = lazy(/* Handles pdfto png work. */ () => import("./Pages/PDFtoPNG"));
const PDFtoText = lazy(/* Handles pdfto text work. */ () => import("./Pages/PDFtoText"));
const MergePDF = lazy(/* Combines pdf. */ () => import("./Pages/MergePDF"));
const SplitPDF = lazy(/* Splits pdf. */ () => import("./Pages/SplitPDF"));
const ExtractPDFPages = lazy(/* Extracts pdfpages. */ () => import("./Pages/ExtractPDFPages"));
const DeletePDFPages = lazy(/* Removes pdfpages. */ () => import("./Pages/DeletePDFPages"));
const ReorderPDFPages = lazy(/* Moves pdfpages. */ () => import("./Pages/ReorderPDFPages"));
const RotatePDF = lazy(/* Rotates pdf. */ () => import("./Pages/RotatePDF"));
const CompressPDF = lazy(/* Compresses pdf. */ () => import("./Pages/CompressPDF"));
const ProtectPDF = lazy(/* Protects pdf. */ () => import("./Pages/ProtectPDF"));
const UnlockPDF = lazy(/* Unlocks pdf. */ () => import("./Pages/UnlockPDF"));
const AddTextPDF = lazy(/* Adds text pdf. */ () => import("./Pages/AddTextPDF"));
const AddImagePDF = lazy(/* Adds image pdf. */ () => import("./Pages/AddImagePDF"));
const HighlightPDF = lazy(/* Handles highlight pdf work. */ () => import("./Pages/HighlightPDF"));
const WatermarkPDF = lazy(/* Handles watermark pdf work. */ () => import("./Pages/WatermarkPDF"));
const AddPageNumbers = lazy(/* Adds page numbers. */ () => import("./Pages/AddPageNumbers"));
const AddSignature = lazy(/* Adds signature. */ () => import("./Pages/AddSignature"));
const PDFtoWord = lazy(/* Handles pdfto word work. */ () => import("./Pages/PDFtoWord"));
const PDFtoExcel = lazy(/* Handles pdfto excel work. */ () => import("./Pages/PDFtoExcel"));

// Renders the app interface.
export default function App() {
  const path = window.location.pathname;
  let Page = Home;

  if (path === "/pdf/jpg-to-pdf") Page = JPGtoPDF;
  else if (path === "/pdf/png-to-pdf") Page = PNGtoPDF;
  else if (path === "/pdf/pdf-to-jpg") Page = PDFtoJPG;
  else if (path === "/pdf/pdf-to-png") Page = PDFtoPNG;
  else if (path === "/pdf/pdf-to-text") Page = PDFtoText;
  else if (path === "/pdf/pdf-to-word") Page = PDFtoWord;
  else if (path === "/pdf/pdf-to-excel") Page = PDFtoExcel;
  else if (path === "/pdf/merge-pdf") Page = MergePDF;
  else if (path === "/pdf/split-pdf") Page = SplitPDF;
  else if (path === "/pdf/extract-pdf-pages") Page = ExtractPDFPages;
  else if (path === "/pdf/delete-pdf-pages") Page = DeletePDFPages;
  else if (path === "/pdf/reorder-pdf-pages") Page = ReorderPDFPages;
  else if (path === "/pdf/rotate-pdf") Page = RotatePDF;
  else if (path === "/pdf/compress-pdf") Page = CompressPDF;
  else if (path === "/pdf/protect-pdf") Page = ProtectPDF;
  else if (path === "/pdf/unlock-pdf") Page = UnlockPDF;
  else if (path === "/pdf/add-text") Page = AddTextPDF;
  else if (path === "/pdf/add-image") Page = AddImagePDF;
  else if (path === "/pdf/highlight-pdf") Page = HighlightPDF;
  else if (path === "/pdf/add-watermark") Page = WatermarkPDF;
  else if (path === "/pdf/add-page-numbers") Page = AddPageNumbers;
  else if (path === "/pdf/add-signature" || path === "/pdf/sign-pdf") Page = AddSignature;

  return (
    <Suspense fallback={<LoadingScreen label="Loading PDF tool" />}>
      <Page />
    </Suspense>
  );
}