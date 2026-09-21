import { useCallback, useState } from "react";
import { LockKeyhole } from "lucide-react";
import AdSpace from "../../../../packages/ui/src/AdSpace";
import FAQ from "../../../../packages/ui/src/FAQ";
import DownloadPopup from "../../../../packages/ui/src/DownloadPopup";
import FileUploadBox from "../../../../packages/ui/src/toolsUi/fileUploadBox";
import Footer from "../../../../packages/ui/src/Footer";
import H2Section from "../../../../packages/ui/src/H2Section";
import Hero from "../../../../packages/ui/src/Hero";
import HowToUse from "../../../../packages/ui/src/HowToUse";
import PageMeta from "../../../../packages/ui/src/PageMeta";
import PdfNavBar from "./NavBar";
import PdfToolsFooter from "./toolsFooter";
import { downloadProtectedPdf, protectPdf } from "../Utilities/ProtectPDFProcessing";
import "./JPGtoPDF.css";
import "./SecurityPDF.css";

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Create a password", description: "Enter and confirm the password used to open the PDF." },
  { number: "3", title: "Protect and download", description: "Encrypt the PDF with AES-256 and download it." },
];

const seoBlocks = [
  { heading: "Protect PDF Files Online", description: "Encrypt a PDF with a password directly in your browser." },
  { heading: "AES-256 PDF Encryption", description: "Create a password-protected PDF that requires the password to open." },
  { heading: "Private Browser-Based Protection", description: "Your PDF and password remain in your browser during processing." },
];

const faqs = [
  { question: "How do I protect a PDF?", answer: "Upload one PDF, enter a password twice, and click Protect PDF." },
  { question: "What encryption does this tool use?", answer: "The PDF is protected with AES-256 encryption." },
  { question: "Can I open the protected PDF without the password?", answer: "No. The password is required to open the protected PDF." },
  { question: "Can I upload more than one PDF?", answer: "This Protect PDF tool accepts one PDF file at a time." },
  { question: "Will my PDF or password be uploaded to a server?", answer: "No. Protection is processed directly in your browser." },
  { question: "What if I forget the password?", answer: "There is no password recovery. Keep your password in a safe place." },
];

const schemas = {
  faq: { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  content: { "@context": "https://schema.org", "@type": "WebPage", name: "Protect PDF", hasPart: seoBlocks.map((block) => ({ "@type": "WebPageElement", name: block.heading, text: block.description })) },
};

export default function ProtectPDF() {
  const [isProtecting, setIsProtecting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingPdf, setPendingPdf] = useState<Uint8Array | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const triggerDownload = useCallback(() => {
    if (pendingPdf) downloadProtectedPdf(pendingPdf, "protected.pdf");
  }, [pendingPdf]);
  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
    setPendingPdf(null);
  }, []);

  const handleAction = async (file: File) => {
    setMessage("");
    setError("");
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    setIsProtecting(true);
    try {
      const bytes = await protectPdf(file, password);
      setPendingPdf(bytes);
      setIsPopupOpen(true);
      setMessage("PDF protected with AES-256 encryption.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "PDF protection failed.");
    } finally {
      setIsProtecting(false);
    }
  };

  return (
    <>
      <PageMeta title="Protect PDF with Password" description="Protect a PDF with AES-256 password encryption using Growile's browser-based tool." canonicalPath="/tools/protect-pdf" />
      <PdfNavBar />
      <Hero kicker="PDF Security" title="Protect PDF" subtitle="Encrypt your PDF with a password before sharing it." ctaText="Upload PDF" ctaHref="#protect-pdf-upload" />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="protect-pdf-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<LockKeyhole size={30} aria-hidden="true" />}
              title="Protect PDF"
              description="Add AES-256 password protection to your PDF."
              buttonLabel="Select PDF file"
              actionLabel={isProtecting ? "Protecting..." : "Protect PDF"}
              actionDisabled={isProtecting || !selectedFile}
              accept=".pdf,application/pdf"
              onAction={handleAction}
              onSelectionChange={(files) => {
                setSelectedFile(files[0] ?? null);
                setMessage("");
                setError("");
              }}
              selectedContent={
                selectedFile ? (
                  <div className="security-pdf-fields">
                    <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /></label>
                    <label>Confirm password<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" /></label>
                  </div>
                ) : null
              }
              dropHint="or drop one PDF file here"
            />
            <AdSpace variant="vertical" />
          </div>
          {message && <p className="jpg-to-pdf-status" role="status">{message}</p>}
          {error && <p className="jpg-to-pdf-error" role="alert">{error}</p>}
        </section>
        <HowToUse heading="How to Protect a PDF" steps={steps} /><H2Section blocks={seoBlocks} /><FAQ heading="Protect PDF FAQs" faqs={faqs} />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.content) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }} />
      <PdfToolsFooter /><Footer /><AdSpace className="footer-bottom-ad-space" />
      <DownloadPopup isOpen={isPopupOpen} onClose={closePopup} onTriggerDownload={triggerDownload} itemName="protected PDF" />
    </>
  );
}
