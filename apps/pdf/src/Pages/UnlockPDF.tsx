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
import SoftwareApplicationSchema from "../../../../packages/ui/src/SoftwareApplicationSchema";
import PdfBreadcrumb from "./PdfBreadcrumb";
import PdfToolsFooter from "./toolsFooter";
import PdfIconToolCard from "./IconToolCard";
import Divider from "../../../../packages/ui/src/Divider";
import { downloadUnlockedPdf, unlockPdf } from "../Utilities/UnlockPDFProcessing";
import "./JPGtoPDF.css";
import "./SecurityPDF.css";

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one password-protected PDF file." },
  { number: "2", title: "Enter the password", description: "Provide the password that opens the PDF." },
  { number: "3", title: "Unlock and download", description: "Remove the encryption and download the unlocked PDF." },
];
const seoBlocks = [
  { heading: "Unlock PDF Document Online Free", description: "It is incredibly simple to unlock PDF document online free with Growile PDF. Just upload your locked file, provide the owner access if required, and we will instantly strip away the security walls." },
  { heading: "Decrypt PDF File Online Free", description: "Tired of entering a code every time? You can easily decrypt PDF file online free. Our platform cleanly removes the encryption layer, giving you a completely open file for hassle-free daily viewing." },
  { heading: "Remove PDF Editing Restrictions Free", description: "The clearing process is remarkably smooth. You can remove PDF editing restrictions free by simply uploading your file here. Growile PDF rapidly disables the locks, letting you edit or print freely." },
];
const faqs = [
  { question: "Is the Growile PDF unlocking tool completely free?", answer: "Yes, clearing restrictions with Growile PDF is 100% free. You can decrypt unlimited files for easier access without paying any hidden fees." },
  { question: "Can it bypass a password I do not know?", answer: "No. You must have authorization and provide the correct password to unlock an encrypted PDF." },
  { question: "Can I remove editing and printing restrictions?", answer: "Yes, when authorized, the tool removes supported security restrictions so you can edit or print the document freely." },
  { question: "Do I need software to unlock my documents?", answer: "No installation is required. You can unlock your confidential files directly from your web browser using Growile PDF." },
  { question: "Are my uploaded files and unlocked documents safe?", answer: "Your data is secure. Growile PDF automatically deletes your original file and unlocked document from our servers." },
  { question: "How can I lock the file again after unlocking it?", answer: <>After making your changes, use our <a href="/pdf/protect-pdf">Protect PDF</a> tool to add a new password and secure the document again.</> },
  { question: "Can I type on the unlocked PDF?", answer: <>Yes. Once the restrictions are removed, you can use our <a href="/pdf/add-text">Add Text</a> tool to type notes or fill in fields.</> },
  { question: "Does this unlocking tool work on mobile phones?", answer: "Yes, Growile PDF is mobile-friendly. You can unlock authorized files from any Android or iOS smartphone." },
];
const schemas = {
  faq: { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: typeof faq.answer === "string" ? faq.answer : "Use the linked PDF tool for this document task." } })) },
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
      <PageMeta title="Remove Password From PDF Online Free - Unlock | Growile PDF" description="Use Growile PDF to remove password from PDF online free. Easily unlock your PDF document or decrypt files to remove editing restrictions. Fast and 100% free!" canonicalPath="/pdf/unlock-pdf" />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile Unlock PDF" description="Unlock authorized PDF documents online." path="/pdf/unlock-pdf" />
      <PdfBreadcrumb label="Unlock PDF" path="unlock-pdf" />
      <Hero kicker="PDF Security" title="Remove Password from PDF Online Free" subtitle="Have you forgotten the passcode to your own digital document? Growile PDF helps you remove password from PDF online free in just a few clicks. Whether you need to read a locked invoice or edit a restricted report, our smart tool instantly clears the barrier. You do not need to install complex software or pay any fees. Enjoy fast, secure, and limitless unlocking right from your web browser today." ctaText="Upload PDF" ctaHref="#unlock-pdf-upload" />
      <Divider />
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
        <section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title">
          <h2 id="related-pdf-tools-title">More PDF Tools</h2>
          <div className="pdf-related-tools-grid pdf-related-tools-grid-five">
            <PdfIconToolCard toolId="protect-pdf" />
            <PdfIconToolCard toolId="pdf-to-text" />
            <PdfIconToolCard toolId="compress-pdf" />
            <PdfIconToolCard toolId="split-pdf" />
            <PdfIconToolCard toolId="merge-pdf" />
          </div>
        </section>
        <HowToUse heading="How to Unlock a PDF" steps={steps} /><Divider /><H2Section blocks={seoBlocks} /><Divider /><FAQ heading="Unlock PDF FAQs" faqs={faqs} /><Divider />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.content) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }} />
      <PdfToolsFooter /><Footer /><AdSpace className="footer-bottom-ad-space" />
      <DownloadPopup isOpen={isPopupOpen} onClose={closePopup} onTriggerDownload={triggerDownload} itemName="unlocked PDF" />
    </>
  );
}
