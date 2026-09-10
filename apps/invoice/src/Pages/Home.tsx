import "../App.css";
import AdSpace from "../Components/AdSpace";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import GstInvoice from "./GstInvoice";
import Hero from "./Hero";
import WithoutGstInvoice from "./WithoutGstInvoice";

export default function Home() {
  return (
    <div className="invoice-app">
      <Navbar />
      <main>
        <Hero />
        <AdSpace />
        <section className="invoice-options" id="invoice-options">
          <p className="invoice-options-kicker">CHOOSE YOUR FORMAT</p>
          <h2>Start with the invoice you need.</h2>
          <p>
            Both options are quick to fill in and designed to keep your billing
            clear.
          </p>
        </section>
        <WithoutGstInvoice />
        <GstInvoice />
      </main>
      <Footer />
    </div>
  );
}
