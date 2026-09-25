// Builds a GST invoice, validates its fields, and generates a PDF.
import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import jsPDF from "jspdf";
import AdSpace from "../../../../packages/ui/src/AdSpace";
import DownloadPopup from "../../../../packages/ui/src/DownloadPopup"; 
import "./GstInvoice.css";

// ---------- Types ----------

type GstItem = {
  id: number;
  item: string;
  quantity: string;
  rate: string;
};

// ---------- Constants ----------

const currencies = [
  "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN",
  "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL",
  "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY",
  "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP",
  "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL", "GGP", "GHS",
  "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF",
  "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD", "JOD",
  "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT",
  "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD",
  "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN",
  "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK",
  "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR",
  "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SLL", "SOS", "SRD",
  "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY",
  "TTD", "TVD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VES",
  "VND", "VUV", "WST", "XAF", "XCD", "XOF", "XPF", "YER", "ZAR", "ZMW", "ZWL",
];

const initialItems: GstItem[] = [{ id: 1, item: "", quantity: "1", rate: "" }];

// ---------- Small pure helpers ----------

// Formats an amount with the selected currency.
function formatMoney(value: number, currency: string) {
  const code = currency.split(" ")[0];
  return `${code} ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Handles wrap pdf text work.
function wrapPdfText(pdf: jsPDF, text: string, maxWidth: number, maxChars = 42) {
  if (!text) return [""];
  const chunks: string[] = [];
  let current = "";

  text.split(/\s+/).forEach(/* Processes each item in the collection. */ (word) => {
    if (word.length > maxChars) {
      if (current) chunks.push(current);
      current = "";
      for (let index = 0; index < word.length; index += maxChars) {
        chunks.push(word.slice(index, index + maxChars));
      }
      return;
    }
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
    } else {
      chunks.push(current);
      current = word;
    }
  });

  if (current) chunks.push(current);
  return chunks.flatMap(/* Handles the work for this callback. */ (chunk) => pdf.splitTextToSize(chunk, maxWidth));
}

// Validates email.
function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// ---------- Component ----------

// Collects invoice details and provides GST invoice actions.
export default function GstInvoice() {
  const withoutGstInvoiceHref = window.location.pathname.startsWith("/invoice")
    ? "/invoice/without-gst-invoice"
    : "/without-gst-invoice";

  // Tracks whether the download popup is open.
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // ---- Logo ----
  const [logoUrl, setLogoUrl] = useState("");

  // ---- Business (seller) details ----
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessTaxNumber, setBusinessTaxNumber] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");

  // ---- Invoice meta ----
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState(currencies[0]);

  // ---- Customer (buyer) details ----
  const [customerName, setCustomerName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [customerTaxNumber, setCustomerTaxNumber] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // ---- Items + totals inputs ----
  const [items, setItems] = useState(initialItems);
  const [tax, setTax] = useState("");
  const [discount, setDiscount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");

  const [error, setError] = useState("");

  // ---- Derived values ----
  const itemAmounts = useMemo(
    // Calculates the value cached by this memo.
    () => items.map(/* Builds a value for each item in the collection. */ (item) => Number(item.quantity || 0) * Number(item.rate || 0)),
    [items],
  );

  const subtotal = itemAmounts.reduce(/* Combines the collection into one value. */ (sum, amount) => sum + amount, 0);
  const taxAmount = (subtotal * Number(tax || 0)) / 100;
  const discountAmount = (subtotal * Number(discount || 0)) / 100;
  const totalAmount = Math.max(0, subtotal + taxAmount - discountAmount);
  const balanceAmount = Math.max(0, totalAmount - Number(paidAmount || 0));

  // ---- Handlers: logo ----
  const handleLogoChange = /* Handles logo change work. */ (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = /* Handles logo change work. */ () => setLogoUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  // ---- Handlers: items table ----
  const updateItem = /* Updates item. */ (id: number, field: keyof GstItem, value: string) => {
    setItems(/* Updates item. */ (current) =>
      current.map(/* Builds a value for each item in the collection. */ (entry) => (entry.id === id ? { ...entry, [field]: value } : entry)),
    );
  };

  const addItem = /* Adds item. */ () => {
    setItems(/* Adds item. */ (current) => [
      ...current,
      { id: Date.now(), item: "", quantity: "1", rate: "" },
    ]);
  };

  // ---- Validation ----
  const validateForm = /* Validates form. */ () => {
    const requiredValues = [
      businessName,
      businessAddress,
      businessTaxNumber,
      businessPhone,
      businessEmail,
      invoiceNumber,
      invoiceDate,
      dueDate,
      customerName,
      billingAddress,
      customerTaxNumber,
      paymentTerms,
      customerEmail,
      customerPhone,
      items[0]?.item,
      items[0]?.quantity,
      items[0]?.rate,
    ];

    if (requiredValues.some(/* Checks whether any item matches the condition. */ (value) => !value)) {
      return "Please complete all GST invoice fields.";
    }
    if (!isValidEmail(businessEmail) || !isValidEmail(customerEmail)) {
      return "Please enter valid email addresses.";
    }
    if (items.some(/* Checks whether any item matches the condition. */ (item) => Number(item.quantity) <= 0 || Number(item.rate) < 0)) {
      return "Quantity must be greater than 0 and rate cannot be negative.";
    }
    if (Number(tax) < 0 || Number(discount) < 0 || Number(discount) > 100) {
      return "Tax and discount must be valid percentages.";
    }
    if (Number(paidAmount) < 0) {
      return "Paid amount cannot be negative.";
    }
    return null; 
  };

  // ---- PDF generation ----
  // Creates a downloadable PDF from the current invoice details.
  function generatePdf() {
    const pdf = new jsPDF();
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    const currencyCode = currency.split(" ")[0];

    pdf.setDrawColor(230, 230, 230);
    pdf.rect(12, 12, 186, 273);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.setTextColor(17, 17, 17);
    pdf.text("INVOICE", margin, 34);
    if (logoUrl) {
      pdf.addImage(logoUrl, "PNG", pageWidth - margin - 38, 16, 38, 20);
    }

    pdf.setDrawColor(240, 119, 15);
    pdf.setLineWidth(1);
    pdf.line(margin, 40, pageWidth - margin, 40);

    let y = 54;
    const businessLines = [businessName, businessAddress, businessTaxNumber, businessPhone, businessEmail].join("\n");
    const customerLines = [customerName, billingAddress, customerTaxNumber, customerPhone, customerEmail].join("\n");
    const businessWrapped = wrapPdfText(pdf, businessLines.replace(/\n/g, " "), contentWidth / 2 - 8, 32);
    const customerWrapped = wrapPdfText(pdf, customerLines.replace(/\n/g, " "), contentWidth / 2 - 8, 32);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(140, 140, 140);
    pdf.text("BUSINESS", margin, y);
    pdf.text("CUSTOMER", margin + contentWidth / 2, y);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(17, 17, 17);
    pdf.text(businessWrapped, margin, y + 6);
    pdf.text(customerWrapped, margin + contentWidth / 2, y + 6);
    y += Math.max(businessWrapped.length, customerWrapped.length) * 5 + 15;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(140, 140, 140);
    pdf.text("INVOICE NUMBER", margin, y);
    pdf.text("INVOICE DATE", margin + 58, y);
    pdf.text("DUE DATE", margin + 116, y);
    pdf.text("CURRENCY", margin + 158, y);
    y += 6;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(17, 17, 17);
    pdf.text(invoiceNumber, margin, y);
    pdf.text(invoiceDate, margin + 58, y);
    pdf.text(dueDate, margin + 116, y);
    pdf.text(currencyCode, margin + 158, y);
    y += 16;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(140, 140, 140);
    pdf.text("PAYMENT TERMS", margin, y);
    y += 6;
    pdf.setFontSize(9);
    pdf.setTextColor(85, 85, 85);
    pdf.text(wrapPdfText(pdf, paymentTerms, contentWidth, 70), margin, y);
    y += 14;

    pdf.setFillColor(10, 10, 10);
    pdf.rect(margin, y, contentWidth, 10, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.text("ITEM", margin + 4, y + 7);
    pdf.text("QTY", margin + contentWidth - 84, y + 7);
    pdf.text("RATE", margin + contentWidth - 57, y + 7);
    pdf.text("AMOUNT", margin + contentWidth - 4, y + 7, { align: "right" });
    y += 16;

    pdf.setFont("helvetica", "normal");
    items.forEach(/* Processes each item in the collection. */ (item, index) => {
      const lines = wrapPdfText(pdf, item.item || "-", contentWidth - 94, 40);

      pdf.setFontSize(9);
      pdf.setTextColor(17, 17, 17);
      pdf.text(lines, margin + 4, y);

      pdf.setTextColor(85, 85, 85);
      pdf.text(item.quantity || "-", margin + contentWidth - 84, y);
      pdf.text(formatMoney(Number(item.rate || 0), currencyCode), margin + contentWidth - 57, y);
      pdf.text(formatMoney(itemAmounts[index], currencyCode), margin + contentWidth - 4, y, { align: "right" });

      y += Math.max(lines.length, 1) * 6 + 6;
    });

    y += 5;
    pdf.setDrawColor(17, 17, 17);
    pdf.setLineWidth(0.8);
    pdf.line(margin, y, margin + contentWidth, y);
    y += 9;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(85, 85, 85);
    pdf.text(`Subtotal (${currencyCode})`, margin + contentWidth - 70, y);
    pdf.text(formatMoney(subtotal, currencyCode), margin + contentWidth - 4, y, { align: "right" });
    y += 7;

    pdf.text(`Tax (${Number(tax || 0).toFixed(2)}%)`, margin + contentWidth - 70, y);
    pdf.text(formatMoney(taxAmount, currencyCode), margin + contentWidth - 4, y, { align: "right" });
    y += 7;

    pdf.text(`Discount (${Number(discount || 0).toFixed(2)}%)`, margin + contentWidth - 70, y);
    pdf.text(`- ${formatMoney(discountAmount, currencyCode)}`, margin + contentWidth - 4, y, { align: "right" });
    y += 9;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(240, 119, 15);
    pdf.text("Total amount", margin + contentWidth - 70, y);
    pdf.text(formatMoney(totalAmount, currencyCode), margin + contentWidth - 4, y, { align: "right" });
    y += 9;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(85, 85, 85);
    pdf.text("Balance amount", margin + contentWidth - 70, y);
    pdf.text(formatMoney(Number(balanceAmount || 0), currencyCode), margin + contentWidth - 4, y, { align: "right" });

    pdf.setFontSize(8);
    pdf.setTextColor(160, 160, 160);
    pdf.text("Invoice Created by GROWILE INVOICE", margin + contentWidth - 4, 278, { align: "right" });

    pdf.save(`gst-invoice-${invoiceNumber}.pdf`);
  }

  // ---- Form submit ----

  const handleSubmit = /* Handles submit work. */ (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setIsPopupOpen(true);
  };

  // ---- Render ----
  
  return (
    <section className="gst-invoice-section invoice-form-section" id="gst-invoice">
      <div className="invoice-form-heading">
        <p className="invoice-form-kicker">TAX-READY BILLING</p>
        <h2>GST Invoice</h2>
        <p>Create a complete GST invoice with business, customer, item, and payment details.</p>
      </div>

      <div className="invoice-form-with-ad">
        <form className="invoice-form gst-invoice-form" onSubmit={handleSubmit} noValidate>
          {/* Logo upload */}
          <div className="invoice-form-logo-row gst-logo-row">
            <label className="invoice-logo-field">
              <span className="invoice-logo-card">
                <span className="invoice-logo-plus">+</span>
                <span>Add Your Logo</span>
              </span>
              <input type="file" accept="image/*" onChange={handleLogoChange} />
            </label>
            {logoUrl && (
              <img className="invoice-logo-preview" src={logoUrl} alt="Invoice logo" />
            )}
          </div>

          {/* Business (seller) details */}
          <div className="gst-field-section">
            <h3>Business</h3>
            <div className="invoice-form-grid">
              <label>
                Business Name
                <input
                  value={businessName}
                  onChange={/* Runs when the user triggers change. */ (event) => setBusinessName(event.target.value)}
                  required
                />
              </label>
              <label>
                Business Address
                <textarea
                  value={businessAddress}
                  onChange={/* Runs when the user triggers change. */ (event) => setBusinessAddress(event.target.value)}
                  rows={2}
                  required
                />
              </label>
              <label>
                Tax Registration Number
                <input
                  value={businessTaxNumber}
                  onChange={/* Runs when the user triggers change. */ (event) => setBusinessTaxNumber(event.target.value)}
                  required
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  inputMode="numeric"
                  value={businessPhone}
                  onChange={/* Runs when the user triggers change. */ (event) => setBusinessPhone(event.target.value.replace(/\D/g, ""))}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={businessEmail}
                  onChange={/* Runs when the user triggers change. */ (event) => setBusinessEmail(event.target.value)}
                  pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                  required
                />
              </label>
            </div>
          </div>

          {/* Invoice number, dates, currency */}
          <div className="gst-field-section">
            <h3>Invoice Details</h3>
            <div className="invoice-form-grid">
              <label>
                Invoice Number
                <input
                  value={invoiceNumber}
                  onChange={/* Runs when the user triggers change. */ (event) => setInvoiceNumber(event.target.value)}
                  required
                />
              </label>
              <label>
                Invoice Date
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={/* Runs when the user triggers change. */ (event) => setInvoiceDate(event.target.value)}
                  required
                />
              </label>
              <label>
                Due Date
                <input
                  type="date"
                  value={dueDate}
                  onChange={/* Runs when the user triggers change. */ (event) => setDueDate(event.target.value)}
                  required
                />
              </label>
              <label>
                Currency
                <input
                  list="gst-currencies"
                  value={currency}
                  onChange={/* Runs when the user triggers change. */ (event) => setCurrency(event.target.value.toUpperCase())}
                  placeholder="Type or choose currency"
                  required
                />
              </label>
            </div>
            <datalist id="gst-currencies">
              {currencies.map(/* Builds a value for each item in the collection. */ (option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>

          {/* Customer (buyer) details */}
          <div className="gst-field-section">
            <h3>Customer</h3>
            <div className="invoice-form-grid">
              <label>
                Customer Name / Business Name
                <input
                  value={customerName}
                  onChange={/* Runs when the user triggers change. */ (event) => setCustomerName(event.target.value)}
                  required
                />
              </label>
              <label>
                Billing Address
                <textarea
                  value={billingAddress}
                  onChange={/* Runs when the user triggers change. */ (event) => setBillingAddress(event.target.value)}
                  rows={2}
                  required
                />
              </label>
              <label>
                Tax Registration Number
                <input
                  value={customerTaxNumber}
                  onChange={/* Runs when the user triggers change. */ (event) => setCustomerTaxNumber(event.target.value)}
                  required
                />
              </label>
              <label>
                Payment Terms
                <input
                  value={paymentTerms}
                  onChange={/* Runs when the user triggers change. */ (event) => setPaymentTerms(event.target.value)}
                  placeholder="Due on receipt"
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={customerEmail}
                  onChange={/* Runs when the user triggers change. */ (event) => setCustomerEmail(event.target.value)}
                  pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                  required
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  inputMode="numeric"
                  value={customerPhone}
                  onChange={/* Runs when the user triggers change. */ (event) => setCustomerPhone(event.target.value.replace(/\D/g, ""))}
                  required
                />
              </label>
            </div>
          </div>

          {/* Items table */}
          <div className="gst-field-section">
            <h3>Items</h3>
            {items.map(/* Builds a value for each item in the collection. */ (entry, index) => (
              <div className="gst-item-row" key={entry.id}>
                <label>
                  Item {index + 1}
                  <input
                    value={entry.item}
                    onChange={/* Runs when the user triggers change. */ (event) => updateItem(entry.id, "item", event.target.value)}
                    required={index === 0}
                  />
                </label>
                <label>
                  Quantity
                  <input
                    type="number"
                    min="1"
                    value={entry.quantity}
                    onChange={/* Runs when the user triggers change. */ (event) => updateItem(entry.id, "quantity", event.target.value)}
                    required={index === 0}
                  />
                </label>
                <label>
                  Rate
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={entry.rate}
                    onChange={/* Runs when the user triggers change. */ (event) => updateItem(entry.id, "rate", event.target.value)}
                    required={index === 0}
                  />
                </label>
                <label>
                  Amount
                  <input value={formatMoney(itemAmounts[index], currency.split(" ")[0])} readOnly />
                </label>
              </div>
            ))}
            <button type="button" className="invoice-add-item" onClick={addItem}>
              ADD ITEM <span>+</span>
            </button>
          </div>

          {/* Final totals */}
          <div className="gst-field-section">
            <h3>Final</h3>
            <div className="invoice-form-grid invoice-form-amounts">
              <label>
                Tax (%)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={tax}
                  onChange={/* Runs when the user triggers change. */ (event) => setTax(event.target.value)}
                  placeholder="0"
                />
              </label>
              <label>
                Discount (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={discount}
                  onChange={/* Runs when the user triggers change. */ (event) => setDiscount(event.target.value)}
                  placeholder="0"
                />
              </label>
              <label>
                Total amount
                <input value={formatMoney(totalAmount, currency.split(" ")[0])} readOnly />
              </label>
              <label>
                Paid amount
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={paidAmount}
                  onChange={/* Runs when the user triggers change. */ (event) => setPaidAmount(event.target.value)}
                  placeholder="0.00"
                />
              </label>
              <label>
                Balance amount
                <input value={formatMoney(balanceAmount, currency.split(" ")[0])} readOnly />
              </label>
            </div>
          </div>

          {error && (
            <p className="invoice-form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="invoice-form-button">
            DOWNLOAD GST INVOICE <span>&gt;</span>
          </button>
        </form>

        <AdSpace variant="vertical" />
      </div>

      <a className="invoice-switch-button" href={withoutGstInvoiceHref}>
        CREATE A WITHOUT GST INVOICE <span>&gt;</span>
      </a>

      {/* Download PopUp Component */}
      <DownloadPopup 
        isOpen={isPopupOpen} 
        onClose={/* Runs when the user triggers close. */ () => setIsPopupOpen(false)}
        onTriggerDownload={generatePdf} 
        itemName="GST Invoice" 
      />
    </section>
  );
}