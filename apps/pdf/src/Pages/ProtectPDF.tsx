// Renders the protect pdf PDF tool page.
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
import SoftwareApplicationSchema from "../../../../packages/ui/src/SoftwareApplicationSchema";
import PdfBreadcrumb from "./PdfBreadcrumb";
import PdfToolsFooter from "./toolsFooter";
import PdfIconToolCard from "./IconToolCard";
import Divider from "../../../../packages/ui/src/Divider";
import { downloadProtectedPdf, protectPdf } from "../Utilities/ProtectPDFProcessing";
import "./PdfUploadLayout.css";
import "./SecurityPDF.css";

const steps = [
  { number: "1", title: "Upload a PDF", description: "Select one PDF file or drag it into the upload area." },
  { number: "2", title: "Create a password", description: "Enter and confirm the password used to open the PDF." },
  { number: "3", title: "Protect and download", description: "Encrypt the PDF with AES-256 and download it." },
];

const seoBlocks = [
  { heading: "Add Password to PDF Document Free", description: "It is incredibly simple to add password to PDF document free using Growile PDF. Just upload your private file, type a strong secret code, and we will lock it so only authorized people can open it." },
  { heading: "Encrypt PDF File Online Free", description: "Need top-tier data security? You can effortlessly encrypt PDF file online free. Our advanced platform applies strong encryption standards, ensuring your confidential information remains totally safe." },
  { heading: "Secure PDF with Password Online Free", description: "The locking process is completely stress-free. You can secure PDF with password online free by dropping your file here. Growile PDF applies the secure barrier, delivering your protected file fast." },
];

const faqs = [
  { question: "Is the Growile PDF security tool completely free?", answer: "Yes, locking your files with Growile PDF is 100% free. You can encrypt unlimited sensitive documents without paying any subscription fees." },
  { question: "How strong is the encryption used on my file?", answer: "We use advanced, industry-standard encryption algorithms. This ensures your locked document cannot be opened or hacked by unauthorized users." },
  { question: "What happens if I forget the secret code I set?", answer: "Please write your code down! Because our encryption is extremely secure, we cannot recover or open the document if you lose your secret key." },
  { question: "Do I need software to lock my bank statements?", answer: "No installation is required. You can easily secure your confidential data directly from your web browser using our online Growile PDF tool." },
  { question: "Are my uploaded files and locked documents secure?", answer: "Your data is perfectly safe. Growile PDF automatically deletes your original file and the newly encrypted document from our servers instantly." },
  { question: "Can I remove the lock later if I change my mind?", answer: <>Yes! If you know the current code but want to remove it permanently for easier sharing, you can easily use our <a href="/pdf/unlock-pdf">Unlock PDF</a> tool to clear it.</> },
  { question: "Should I sign my contract before or after locking it?", answer: <>Always sign first! Use our <a href="/pdf/add-signature">Add Signature</a> tool to approve your paperwork, and then use this protection tool to ensure nobody alters your mark.</> },
  { question: "Does this file locking tool work on mobile phones?", answer: "Yes, Growile PDF is highly mobile-friendly. You can easily encrypt and secure private financial files using your Android or iOS smartphone." },
];

const schemas = {
  faq: { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: typeof faq.answer === "string" ? faq.answer : "Use the linked PDF tool for this document task." } })) },
  content: { "@context": "https://schema.org", "@type": "WebPage", name: "Protect PDF", hasPart: seoBlocks.map((block) => ({ "@type": "WebPageElement", name: block.heading, text: block.description })) },
};

// Renders the protect pdf interface.
export default function ProtectPDF() {
  const [isProtecting, setIsProtecting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingPdf, setPendingPdf] = useState<Uint8Array | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const triggerDownload = useCallback(/* Creates a callback that stays stable until its dependencies change. */ () => {
    if (pendingPdf) downloadProtectedPdf(pendingPdf, "protected.pdf");
  }, [pendingPdf]);
  const closePopup = useCallback(/* Creates a callback that stays stable until its dependencies change. */ () => {
    setIsPopupOpen(false);
    setPendingPdf(null);
  }, []);

  const handleAction = /* Handles action work. */ async (file: File) => {
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
      <PageMeta title="Password Protect PDF File Online Free - Secure | Growile PDF" description="Use Growile PDF to password protect PDF file online free. Easily encrypt and secure your PDF document with a password safely. Fast, private, and 100% free." canonicalPath="/pdf/protect-pdf" />
      <PdfNavBar />
      <SoftwareApplicationSchema name="Growile Protect PDF" description="Password protect PDF documents online." path="/pdf/protect-pdf" />
      <PdfBreadcrumb label="Protect PDF" path="protect-pdf" />
      <Hero kicker="PDF Security" title="Password Protect PDF File Online Free" subtitle="Do you have highly sensitive documents that need strict privacy? Growile PDF helps you password protect PDF file online free in just seconds. Whether it is a bank statement or a confidential contract, our tool locks your data securely. You do not need to install expensive security software or pay fees. Experience fast, reliable, and military-grade encryption directly from your browser easily." ctaText="Upload PDF" ctaHref="#protect-pdf-upload" />
      <Divider />
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
              onSelectionChange={/* Runs when the user triggers selection change. */ (files) => {
                setSelectedFile(files[0] ?? null);
                setMessage("");
                setError("");
              }}
              selectedContent={
                selectedFile ? (
                  <div className="security-pdf-fields">
                    <label>Password<input type="password" value={password} onChange={/* Runs when the user triggers change. */ (event) => setPassword(event.target.value)} autoComplete="new-password" /></label>
                    <label>Confirm password<input type="password" value={confirmPassword} onChange={/* Runs when the user triggers change. */ (event) => setConfirmPassword(event.target.value)} autoComplete="new-password" /></label>
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
        <section className="pdf-related-tools" aria-labelledby="related-pdf-tools-title">
          <h2 id="related-pdf-tools-title">More PDF Tools</h2>
          <div className="pdf-related-tools-grid pdf-related-tools-grid-five">
            <PdfIconToolCard toolId="add-watermark" />
            <PdfIconToolCard toolId="add-signature" />
            <PdfIconToolCard toolId="compress-pdf" />
            <PdfIconToolCard toolId="unlock-pdf" />
            <PdfIconToolCard toolId="merge-pdf" />
          </div>
        </section>
        <HowToUse heading="How to Protect a PDF" steps={steps} /><Divider /><H2Section blocks={seoBlocks} /><Divider /><FAQ heading="Protect PDF FAQs" faqs={faqs} /><Divider />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.content) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }} />
      <PdfToolsFooter /><Footer /><AdSpace className="footer-bottom-ad-space" />
      <DownloadPopup isOpen={isPopupOpen} onClose={closePopup} onTriggerDownload={triggerDownload} itemName="protected PDF" />
    </>
  );
}
