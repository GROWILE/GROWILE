import "./About.css";
import Divider from "../../../../packages/ui/src/Divider";
import Footer from "../../../../packages/ui/src/Footer";
import Navbar from "../../../../packages/ui/src/Navbar";
import webLogo from "../../../../packages/ui/assets/growile-invoice-logo.svg";

const acceptableUseItems = [
  "Attempting to disrupt or damage the website or its functionality",
  "Using the tools for any unlawful purpose",
  "Attempting to gain unauthorized access to our systems",
];

export default function TermsOfService() {
  return (
    <>
      <Navbar
        logoAlt="Growile"
        logoSrc={webLogo}
        home={{ label: "Home", href: "/" }}
        products={{
          label: "Products",
          items: [
            { label: "Finance", href: "/finance" },
            { label: "Invoice", href: "/invoice" },
          ],
        }}
        about={{ label: "About", href: "/about" }}
      />

      <section className="about-hero">
        <h1 className="about-title">Terms of Service</h1>
        <p className="about-description">
          Effective Date: 14/09/2026
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <p className="about-text">
          Welcome to GROWILE. These Terms of Service ("Terms") govern your use
          of the GROWILE website and all tools and services offered under
          growile.com. By using our website or tools, you agree to these Terms.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">1. About GROWILE</h2>
        <p className="about-text">
          GROWILE is a software company that builds simple, browser-based tools
          to help you handle everyday tasks, including finance, invoicing, and
          other utilities. Our tools are designed to be fast, easy to use, and
          privacy-friendly.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">2. Eligibility</h2>
        <p className="about-text">
          You must be at least 18 years old to use GROWILE and its tools. By
          using our services, you confirm that you meet this age requirement.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">3. Accounts</h2>
        <p className="about-text">
          Creating an account is optional for most tools. Some features may
          require you to sign up in the future. If you create an account, you
          are responsible for keeping your login details secure.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">4. Information We Collect</h2>
        <p className="about-text">
          We collect only basic information to run your account, where
          applicable:
        </p>
        <ul className="approach-list">
          <li className="approach-item">Name</li>
          <li className="approach-item">Phone number</li>
          <li className="approach-item">Email address</li>
        </ul>
        <p className="about-text">
          We do not collect or require any other personal information to use our
          tools.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">5. How Our Tools Work</h2>
        <p className="about-text">
          Most GROWILE tools run entirely in your browser. This means any
          documents, files, or data you enter into a tool stay on your device
          and are not uploaded to or stored on our servers. We do not have
          access to the content you create or process using our tools.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">6. Acceptable Use</h2>
        <p className="about-text">
          You agree not to misuse GROWILE&apos;s tools or website, including but
          not limited to:
        </p>
        <ul className="approach-list">
          {acceptableUseItems.map((item) => (
            <li key={item} className="approach-item">{item}</li>
          ))}
        </ul>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">7. Intellectual Property</h2>
        <p className="about-text">
          All content, branding, design, and code on the GROWILE website and
          tools belong to GROWILE, unless stated otherwise. You may not copy,
          reproduce, or redistribute our tools or content without permission.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">8. Disclaimer</h2>
        <p className="about-text">
          GROWILE tools are provided "as is." While we aim for accuracy and
          reliability, we do not guarantee that our tools will be error-free or
          available at all times.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">9. Limitation of Liability</h2>
        <p className="about-text">
          GROWILE is not liable for any loss or damage arising from your use of
          our tools or website, to the extent permitted by law.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">10. Changes to These Terms</h2>
        <p className="about-text">
          We may update these Terms from time to time. Continued use of GROWILE
          after changes are posted means you accept the updated Terms.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">11. Governing Law</h2>
        <p className="about-text">
          These Terms are governed by the laws of Tamil Nadu, India, and any
          disputes will be subject to the jurisdiction of the courts in Tamil
          Nadu, India.
        </p>
      </section>

      <Divider />

      <section className="about-section">
        <h2 className="about-heading">12. Contact Us</h2>
        <p className="about-text">
          If you have any questions about these Terms, please contact us at:
        </p>
        <p className="about-text">
          Email: <a href="mailto:growile.groups@gmail.com">growile.groups@gmail.com</a>
        </p>
      </section>

      <Footer termsHref="/terms-of-service" />
    </>
  );
}
