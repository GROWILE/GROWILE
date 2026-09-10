import "./GstInvoice.css";

export default function GstInvoice() {
  return (
    <section className="gst-invoice-section" id="gst-invoice">
      <div className="invoice-form-heading">
        <p className="invoice-form-kicker">TAX-READY BILLING</p>
        <h2>With GST invoice</h2>
        <p>
          Add your GST details and tax rate for a complete business invoice.
        </p>
      </div>
      <form
        className="invoice-form gst-invoice-form"
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
            Your GSTIN
            <input type="text" placeholder="22AAAAA0000A1Z5" required />
          </label>
          <label>
            Customer GSTIN
            <input type="text" placeholder="Optional customer GSTIN" />
          </label>
          <label>
            Invoice number
            <input type="text" placeholder="GST-0001" required />
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
            Amount before tax
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              required
            />
          </label>
          <label>
            GST rate
            <select defaultValue="18">
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>
          </label>
        </div>
        <button type="submit" className="invoice-form-button">
          PREVIEW GST INVOICE <span>→</span>
        </button>
      </form>
    </section>
  );
}
