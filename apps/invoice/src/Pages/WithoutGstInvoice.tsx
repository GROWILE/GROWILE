import "./WithoutGstInvoice.css";

export default function WithoutGstInvoice() {
  return (
    <section className="invoice-form-section" id="without-gst-invoice">
      <div className="invoice-form-heading">
        <p className="invoice-form-kicker">SIMPLE BILLING</p>
        <h2>Without GST invoice</h2>
        <p>
          For businesses and services that do not need GST details on the
          invoice.
        </p>
      </div>
      <form
        className="invoice-form"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="invoice-form-grid">
          <label>
            Business name
            <input type="text" placeholder="Your business name" required />
          </label>
          <label>
            Customer name
            <input type="text" placeholder="Customer name" required />
          </label>
          <label>
            Invoice number
            <input type="text" placeholder="INV-0001" required />
          </label>
          <label>
            Invoice date
            <input type="date" required />
          </label>
        </div>
        <label className="invoice-form-full">
          Item or service description
          <textarea placeholder="What are you billing for?" rows={3} required />
        </label>
        <div className="invoice-form-grid invoice-form-amounts">
          <label>
            Quantity
            <input type="number" min="1" placeholder="1" required />
          </label>
          <label>
            Amount
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              required
            />
          </label>
        </div>
        <button type="submit" className="invoice-form-button">
          PREVIEW INVOICE <span>→</span>
        </button>
      </form>
    </section>
  );
}
