import TermsLayout from "../../../../packages/ui/src/TermsLayout";
import Divider from "../../../../packages/ui/src/Divider";
import invoiceLogo from "../../../../packages/ui/assets/growile-InvoiceGenerator-logo.svg";
import "../../../web/src/Pages/About.css";

export default function TermsAndConditions() {
  const isEmbeddedInvoice = window.location.pathname.startsWith("/invoice");
  const invoiceBaseHref = isEmbeddedInvoice ? "/invoice" : "";
  const invoiceHomeHref = isEmbeddedInvoice ? "/invoice" : "/";
  const termsHref = `${invoiceBaseHref}/terms-and-conditions`;

  return (
    <TermsLayout
      pageTitle="Terms of Service for Growile Invoice | Growile"
      pageDescription="Read the Terms of Service for Growile Invoice, including local data processing, privacy, acceptable use, and user responsibilities."
      heroTitle="Terms of Service for Growile Invoice"
      lastUpdated="September 14, 2026"
      logoAlt="Growile"
      logoSrc={invoiceLogo}
      home={{ label: "Home", href: invoiceHomeHref }}
      products={{
        label: "Products",
        items: [
          { label: "PDF", href: "/pdf" },
          { label: "Invoice", href: invoiceHomeHref },
        ],
      }}
      tools={{
        label: "All Tools",
        items: [
          { label: "Non-GST Invoice", href: `${invoiceBaseHref}/without-gst-invoice` },
          { label: "GST Invoice", href: `${invoiceBaseHref}/gst-invoice` },
        ],
      }}
      footerTermsHref={termsHref}
    >
      <section className="about-section">
        <p className="about-text">
          Welcome to Growile Invoice. By using our free invoice generator, you agree
          to the following terms. Please read them carefully.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">1. Data Privacy &amp; Local Processing (Our Core Promise)</h2>
        <p className="about-text">
          Your privacy is our priority. All invoice generation and tax calculations
          happen completely locally within your web browser. <strong>We do not save,
          store, or upload your generated invoices, client data, or business
          financial details to our servers.</strong> Once you close the tab, the
          generated invoice data is gone from our system.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">2. Information We Collect</h2>
        <p className="about-text">
          To provide basic functionality and prevent abuse, we only collect minimal
          personal information:
        </p>
        <ul className="approach-list">
          <li className="approach-item">Your Name</li>
          <li className="approach-item">Mobile Number</li>
          <li className="approach-item">Email Address</li>
        </ul>
        <p className="about-text">
          We do not sell or share this information with third parties.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">3. User Responsibility &amp; Limitation of Liability</h2>
        <p className="about-text">
          Growile Invoice is provided as a free utility tool "as is."
        </p>
        <ul className="approach-list">
          <li className="approach-item">
            <strong>Accuracy:</strong> You are solely responsible for the accuracy of
            the data entered, including tax percentages (GST/Non-GST), totals, and
            customer details.
          </li>
          <li className="approach-item">
            <strong>Legal Compliance:</strong> Growile is not a tax advisory service.
            We are not liable for any incorrect tax calculations, auditing issues,
            or legal disputes arising from the use of invoices generated through our
            platform. The responsibility of issuing valid legal documents lies entirely
            with you.
          </li>
        </ul>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">4. Acceptable Use</h2>
        <p className="about-text">
          You agree to use Growile Invoice only for lawful business purposes. You
          must not use our tool to generate fraudulent, illegal, or deceptive
          documents.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">5. Changes to These Terms</h2>
        <p className="about-text">
          We may update these terms from time to time as our ecosystem grows. Any
          changes will be posted directly on this website, and your continued use of
          the tool implies acceptance of those changes.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">6. Contact Us</h2>
        <p className="about-text">
          If you have any questions or need support regarding these terms, please
          contact us at: <a href="mailto:growile.groups@gmail.com">growile.groups@gmail.com</a>
        </p>
      </section>
    </TermsLayout>
  );
}