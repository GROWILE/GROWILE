import { useCallback, useState } from "react";
import { ShieldCheck } from "lucide-react";
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
import { downloadUnlockedPdf, unlockPdf } from "../Utilities/UnlockPDFProcessing";
import "./JPGtoPDF.css";
import "./SecurityPDF.css";

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one password-protected PDF file." },
  { number: "2", title: "Enter the password", description: "Provide the password that opens the PDF." },
  { number: "3", title: "Unlock and download", description: "Remove the encryption and download the unlocked PDF." },
];
const seoBlocks = [
  { heading: "Unlock PDF Files Online", description: "Remove password encryption from a PDF when you know its password." },
  { heading: "Create an Accessible PDF", description: "Unlock your document in the browser and download a copy without encryption." },
  { heading: "Private Browser-Based Unlocking", description: "Your PDF and password stay in your browser during processing." },
];
const faqs = [
  { question: "How do I unlock a PDF?", answer: "Upload the protected PDF, enter its password, and click Unlock PDF." },
  { question: "Can I unlock a PDF without its password?", answer: "No. You must provide the correct password to decrypt the PDF." },
  { question: "Can I upload more than one PDF?", answer: "This Unlock PDF tool accepts one PDF file at a time." },
  { question: "Will my PDF or password be uploaded to a server?", answer: "No. Unlocking is processed directly in your browser." },
  { question: "What happens with a wrong password?", answer: "The PDF is not changed and an error is shown so you can try again." },
];
const schemas = {
  faq: { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  content: { "@context": "https://schema.org", "@type": "WebPage", name: "Unlock PDF", hasPart: seoBlocks.map((block) => ({ "@type": "WebPageElement", name: block.heading, text: block.description })) },
};

export default function UnlockPDF() {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [pendingPdf, setPendingPdf] = useState<Uint8Array | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const triggerDownload = useCallback(() => { if (pendingPdf) downloadUnlockedPdf(pendingPdf, "unlocked.pdf"); }, [pendingPdf]);
  const closePopup = useCallback(() => { setIsPopupOpen(false); setPendingPdf(null); }, []);

  const handleAction = async (file: File) => {
    setIsUnlocking(true); setMessage(""); setError("");
    try {
      const bytes = await unlockPdf(file, password);
      setPendingPdf(bytes); setIsPopupOpen(true); setMessage("PDF unlocked successfully.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "PDF unlocking failed.");
    } finally { setIsUnlocking(false); }
  };

  return (
    <>
      <PageMeta title="Unlock PDF Online" description="Unlock a password-protected PDF online with Growile's browser-based tool." canonicalPath="/tools/unlock-pdf" />
      <PdfNavBar />
      <Hero kicker="PDF Security" title="Unlock PDF" subtitle="Remove password protection from a PDF you are authorized to access." ctaText="Upload PDF" ctaHref="#unlock-pdf-upload" />
      <main className="jpg-to-pdf-page">
        <section className="jpg-to-pdf-upload-section" id="unlock-pdf-upload">
          <div className="jpg-to-pdf-upload-layout">
            <FileUploadBox
              className="jpg-to-pdf-upload-box"
              icon={<ShieldCheck size={30} aria-hidden="true" />}
              title="Unlock PDF"
              description="Enter the PDF password to remove its encryption."
              buttonLabel="Select PDF file"
              actionLabel={isUnlocking ? "Unlocking..." : "Unlock PDF"}
              actionDisabled={isUnlocking || !selectedFile}
              accept=".pdf,application/pdf"
              onAction={handleAction}
              onSelectionChange={(files) => { setSelectedFile(files[0] ?? null); setMessage(""); setError(""); }}
              selectedContent={selectedFile ? <div className="security-pdf-fields"><label>PDF password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label></div> : null}
              dropHint="or drop one PDF file here"
            />
            <AdSpace variant="vertical" />
          </div>
          {message && <p className="jpg-to-pdf-status" role="status">{message}</p>}{error && <p className="jpg-to-pdf-error" role="alert">{error}</p>}
        </section>
        <HowToUse heading="How to Unlock a PDF" steps={steps} /><H2Section blocks={seoBlocks} /><FAQ heading="Unlock PDF FAQs" faqs={faqs} />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.content) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }} />
      <PdfToolsFooter /><Footer /><AdSpace className="footer-bottom-ad-space" />
      <DownloadPopup isOpen={isPopupOpen} onClose={closePopup} onTriggerDownload={triggerDownload} itemName="unlocked PDF" />
    </>
  );
}
