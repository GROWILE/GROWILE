import Navbar from "../../../../packages/ui/src/Navbar";
import Footer from "../../../../packages/ui/src/Footer";
import PageMeta from "../../../../packages/ui/src/PageMeta";
import { webFooter, webNavigation } from "../config/site";

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
      <main>
        <h1>Page Not Found</h1>
        <p>The page you requested could not be found.</p>
        <a href="/">Return to Growile home</a>
      </main>
      <Footer {...webFooter} />
    </>
  );
}
