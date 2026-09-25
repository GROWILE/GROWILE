// Renders the page shown for unknown web routes.
import Navbar from "../../../../packages/ui/src/Navbar";
import Footer from "../../../../packages/ui/src/Footer";
import PageMeta from "../../../../packages/ui/src/PageMeta";
import webLogo from "../../../../packages/ui/assets/growile-logo.svg";
import { webFooter, webNavigation } from "../config/site";
import "./NotFound.css";

// Renders the not found interface.
export default function NotFound() {
  return (
    <>
      <PageMeta
        title="Page Not Found | Growile"
        description="The page you requested could not be found."
        canonicalPath="/404"
        indexable={false}
      />
      <Navbar {...webNavigation} />
      <main className="not-found-page">
        <section className="not-found-card" aria-labelledby="not-found-title">
          <div className="not-found-orbit not-found-orbit-one" aria-hidden="true" />
          <div className="not-found-orbit not-found-orbit-two" aria-hidden="true" />
          <div className="not-found-illustration" aria-hidden="true">
            <span className="not-found-number">4</span>
            <div className="not-found-logo-wrap">
              <img src={webLogo} alt="" />
            </div>
            <span className="not-found-number">4</span>
          </div>
          <p className="not-found-kicker">Oops! Lost in the workflow?</p>
          <h1 id="not-found-title">This page took a wrong turn.</h1>
          <p className="not-found-description">
            The page you are looking for is no longer here or may have moved.
            Let&apos;s get you back to something useful.
          </p>
          <div className="not-found-actions">
            <a className="not-found-primary-action" href="/">
              Back to Home
            </a>
            <a className="not-found-secondary-action" href="/products">
              Explore Products
            </a>
          </div>
        </section>
      </main>
      <Footer {...webFooter} />
    </>
  );
}
