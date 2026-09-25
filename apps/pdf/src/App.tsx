import { lazy, Suspense } from "react";
import LoadingScreen from "../../../packages/ui/src/LoadingScreen";

const Home = lazy(() => import("./Pages/Home"));
const JPGtoPDF = lazy(() => import("./Pages/JPGtoPDF"));
const PNGtoPDF = lazy(() => import("./Pages/PNGtoPDF"));
const PDFtoJPG = lazy(() => import("./Pages/PDFtoJPG"));
const PDFtoPNG = lazy(() => import("./Pages/PDFtoPNG"));
const PDFtoText = lazy(() => import("./Pages/PDFtoText"));
const MergePDF = lazy(() => import("./Pages/MergePDF"));
const SplitPDF = lazy(() => import("./Pages/SplitPDF"));
const ExtractPDFPages = lazy(() => import("./Pages/ExtractPDFPages"));
const DeletePDFPages = lazy(() => import("./Pages/DeletePDFPages"));
const ReorderPDFPages = lazy(() => import("./Pages/ReorderPDFPages"));
const RotatePDF = lazy(() => import("./Pages/RotatePDF"));
const CompressPDF = lazy(() => import("./Pages/CompressPDF"));
const ProtectPDF = lazy(() => import("./Pages/ProtectPDF"));
const UnlockPDF = lazy(() => import("./Pages/UnlockPDF"));
const AddTextPDF = lazy(() => import("./Pages/AddTextPDF"));
const AddImagePDF = lazy(() => import("./Pages/AddImagePDF"));
const HighlightPDF = lazy(() => import("./Pages/HighlightPDF"));
const WatermarkPDF = lazy(() => import("./Pages/WatermarkPDF"));
const AddPageNumbers = lazy(() => import("./Pages/AddPageNumbers"));
const AddSignature = lazy(() => import("./Pages/AddSignature"));
const PDFtoWord = lazy(() => import("./Pages/PDFtoWord"));
const PDFtoExcel = lazy(() => import("./Pages/PDFtoExcel"));

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