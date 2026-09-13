import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import jsPDF from "jspdf";
import AdSpace from "../../../../packages/ui/src/AdSpace";
import "./WithoutGstInvoice.css";

// ---------- Types ----------

type InvoiceItem = {
  id: number;
  description: string;
  quantity: string;
  amount: string;
};

// ---------- Field limits (change values here only) ----------

const MAX_FROM_TO_LENGTH = 60;
const MAX_PAYMENT_INFO_LENGTH = 300;
const MAX_ITEM_DESCRIPTION_LENGTH = 100;
const MAX_ITEMS = 10;
const MAX_QUANTITY = 100000;
const MAX_AMOUNT = 10000000; // 1 crore

const initialItems: InvoiceItem[] = [
  { id: 1, description: "", quantity: "1", amount: "" },
  { id: 2, description: "", quantity: "1", amount: "" },
  { id: 3, description: "", quantity: "1", amount: "" },
];

// ---------- Small pure helpers (no state, easy to test) ----------

/** Turns raw digits into "DD/MM/YYYY" as the user types. */
function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return [day, month, year].filter(Boolean).join("/");
}

/** Checks the date is a real calendar date, not just correct format. */
function isValidDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const parsedDate = new Date(year, month - 1, day);

  return (
    year > 0 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  );
}

/** Wraps long text into multiple lines so it fits inside the PDF page width. */
function wrapPdfText(pdf: jsPDF, text: string, maxWidth: number, maxCharsPerLine = 34) {
  if (!text) return [""];

  const chunks: string[] = [];
  const words = text.split(/\s+/);
  let current = "";

  words.forEach((word) => {
    if (!word) return;

    if (word.length > maxCharsPerLine) {
      if (current) {
        chunks.push(current);
        current = "";
      }
      for (let index = 0; index < word.length; index += maxCharsPerLine) {
        chunks.push(word.slice(index, index + maxCharsPerLine));
      }
      return;
    }

    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
      return;
    }

    chunks.push(current || word);
    current = word;
  });

  if (current) chunks.push(current);

  return chunks.flatMap((chunk) => pdf.splitTextToSize(chunk, maxWidth));
}

// ---------- Component ----------

export default function WithoutGstInvoice() {
  const gstInvoiceHref = window.location.pathname.startsWith("/invoice")
    ? "/invoice/gst-invoice"
    : "/gst-invoice";
  const [logoUrl, setLogoUrl] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState("");

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.quantity || 0) * Number(item.amount || 0),
        0,
      ),
    [items],
  );

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setLogoUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string) => {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const addItem = () => {
    if (items.length >= MAX_ITEMS) {
      setError(`You can add a maximum of ${MAX_ITEMS} items.`);
      return;
    }

    setItems((currentItems) => [
      ...currentItems,
      { id: Date.now(), description: "", quantity: "1", amount: "" },
    ]);
    setError("");
  };

  const handleDateChange = (value: string) => {
    const formattedDate = formatDateInput(value);
    setDate(formattedDate);

    const month = formattedDate.split("/")[1];
    if (month?.length === 2 && Number(month) > 12) {
      setError("Month must be between 01 and 12.");
    } else if (error.startsWith("Month") || error.startsWith("Date")) {
      setError("");
    }
  };

  function validateForm(): string | null {
    if (from.length > MAX_FROM_TO_LENGTH || to.length > MAX_FROM_TO_LENGTH) {
      return "From and To can contain a maximum of 60 characters.";
    }
    if (paymentInfo.length > MAX_PAYMENT_INFO_LENGTH) {
      return "Payment info can contain a maximum of 300 characters.";
    }
    if (!from || !to || !invoiceNumber || !isValidDate(date)) {
      return "Please complete From, To, Invoice number, and Date in DD/MM/YYYY format.";
    }

    const firstItem = items[0];
    if (!firstItem.description || !firstItem.quantity || !firstItem.amount) {
      return "Please complete all mandatory fields in Item 1.";
    }

    const invalidItemDescription = items.find(
      (item) => item.description.length > MAX_ITEM_DESCRIPTION_LENGTH,
    );
    if (invalidItemDescription) {
      return "Each item description can contain a maximum of 100 characters.";
    }

    const invalidItemNumbers = items.find(
      (item) => Number(item.quantity) > MAX_QUANTITY || Number(item.amount) > MAX_AMOUNT,
    );
    if (invalidItemNumbers) {
      return `Quantity must be under ${MAX_QUANTITY} and amount must be under ₹${MAX_AMOUNT.toLocaleString("en-IN")}.`;
    }

    return null;
  }

  function generatePdf() {
    const pdf = new jsPDF();
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.5);
    pdf.rect(12, 12, 186, 273);

    pdf.setFontSize(24);
    pdf.setTextColor(17, 17, 17);
    pdf.setFont("helvetica", "bold");
    pdf.text("INVOICE", margin, 34);

    if (logoUrl) {
      const logoWidth = 38;
      const logoHeight = 20;
      const logoX = pageWidth - margin - logoWidth;
      const logoY = 16;
      pdf.addImage(logoUrl, "PNG", logoX, logoY, logoWidth, logoHeight);
    }

    pdf.setDrawColor(240, 119, 15);
    pdf.setLineWidth(1);
    pdf.line(margin, 40, pageWidth - margin, 40);

    let y = 54;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(140, 140, 140);
    pdf.text("FROM", margin, y);
    pdf.text("TO", margin + contentWidth / 2, y);

    y += 6;
    pdf.setFontSize(11);
    pdf.setTextColor(17, 17, 17);
    pdf.setFont("helvetica", "bold");

    const fromLines = wrapPdfText(pdf, from, contentWidth / 2 - 6, 30);
    const toLines = wrapPdfText(pdf, to, contentWidth / 2 - 6, 30);
    fromLines.forEach((line: string, i: number) => pdf.text(line, margin, y + i * 6));
    toLines.forEach((line: string, i: number) =>
      pdf.text(line, margin + contentWidth / 2, y + i * 6),
    );

    y += Math.max(fromLines.length, toLines.length) * 6 + 12;

    pdf.setFontSize(9);
    pdf.setTextColor(140, 140, 140);
    pdf.setFont("helvetica", "normal");
    pdf.text("INVOICE NUMBER", margin, y);
    pdf.text("DATE", margin + contentWidth / 2, y);

    y += 6;
    pdf.setFontSize(11);
    pdf.setTextColor(17, 17, 17);
    pdf.setFont("helvetica", "bold");
    pdf.text(invoiceNumber, margin, y);
    pdf.text(date, margin + contentWidth / 2, y);

    y += 16;

    if (paymentInfo) {
      pdf.setFontSize(9);
      pdf.setTextColor(140, 140, 140);
      pdf.setFont("helvetica", "normal");
      pdf.text("PAYMENT INFO", margin, y);

      y += 6;
      pdf.setFontSize(10);
      pdf.setTextColor(85, 85, 85);
      const paymentLines = wrapPdfText(pdf, paymentInfo, contentWidth, 70);
      pdf.text(paymentLines, margin, y);
      y += paymentLines.length * 5.5 + 10;
    }

    y += 4;

    pdf.setFillColor(10, 10, 10);
    pdf.rect(margin, y, contentWidth, 10, "F");
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.text("ITEM", margin + 4, y + 7);
    pdf.text("QTY", margin + contentWidth - 60, y + 7);
    pdf.text("AMOUNT", margin + contentWidth - 4, y + 7, { align: "right" });
    y += 16;

    pdf.setFont("helvetica", "normal");
    items.forEach((item) => {
      if (!item.description && !item.amount) return;

      const descriptionLines = wrapPdfText(pdf, item.description || "-", contentWidth - 80, 46);
      const quantityText = item.quantity || "-";
      const amountValue = Number(item.amount || 0);
      const amountText = `Rs. ${amountValue.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      const lineCount = Math.max(descriptionLines.length, 1);

      pdf.setFontSize(10);
      pdf.setTextColor(17, 17, 17);
      descriptionLines.forEach((line: string, index: number) => {
        pdf.text(line, margin + 4, y + index * 6);
      });

      pdf.setTextColor(85, 85, 85);
      pdf.text(quantityText, margin + contentWidth - 60, y);
      pdf.text(amountText, margin + contentWidth - 4, y, { align: "right" });

      y += lineCount * 6 + 6;
    });

    y += 8;
    pdf.setDrawColor(17, 17, 17);
    pdf.setLineWidth(0.8);
    pdf.line(margin, y, margin + contentWidth, y);

    y += 10;
    const amountX = margin + contentWidth - 4;
    const totalText = `Rs. ${total.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    pdf.setFontSize(16);
    pdf.setTextColor(240, 119, 15);
    pdf.setFont("helvetica", "bold");
    const totalWidth = pdf.getTextWidth(totalText);
    pdf.text(totalText, amountX, y, { align: "right" });

    pdf.setFontSize(12);
    pdf.setTextColor(85, 85, 85);
    pdf.setFont("helvetica", "normal");
    pdf.text("Total", amountX - totalWidth - 12, y, { align: "right" });

    pdf.setFontSize(8);
    pdf.setTextColor(160, 160, 160);
    pdf.setFont("helvetica", "normal");
    pdf.text("Invoice Created by GROWILE INVOICE", margin + contentWidth - 4, 278, {
      align: "right",
    });

    pdf.save(`invoice-${invoiceNumber}.pdf`);
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    generatePdf();
  };

  return (
    <section className="invoice-form-section" id="without-gst-invoice">
      <div className="invoice-form-heading">
        <p className="invoice-form-kicker">SIMPLE BILLING</p>
        <h2>Without GST Invoice</h2>
        <p>For businesses and services that do not need GST details on the invoice.</p>
      </div>

      <div className="invoice-form-with-ad">
      <form className="invoice-form" onSubmit={handleSubmit} noValidate>
        <div className="invoice-form-logo-row">
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

        <div className="invoice-form-grid">
          <label>
            From
            <input
              type="text"
              value={from}
              onChange={(event) => setFrom(event.target.value.slice(0, MAX_FROM_TO_LENGTH))}
              placeholder="Your business name"
              maxLength={MAX_FROM_TO_LENGTH}
            />
          </label>

          <label>
            To
            <input
              type="text"
              value={to}
              onChange={(event) => setTo(event.target.value.slice(0, MAX_FROM_TO_LENGTH))}
              placeholder="Customer name"
              maxLength={MAX_FROM_TO_LENGTH}
            />
          </label>

          <label>
            Invoice number
            <input
              type="text"
              value={invoiceNumber}
              onChange={(event) => setInvoiceNumber(event.target.value)}
              placeholder="INV-0001"
            />
          </label>

          <label>
            Date
            <input
              type="text"
              inputMode="numeric"
              value={date}
              onChange={(event) => handleDateChange(event.target.value)}
              placeholder="DD/MM/YYYY"
              maxLength={10}
              autoComplete="off"
            />
          </label>
        </div>

        <label className="invoice-payment-info">
          Payment Info
          <textarea
            value={paymentInfo}
            onChange={(event) =>
              setPaymentInfo(event.target.value.slice(0, MAX_PAYMENT_INFO_LENGTH))
            }
            placeholder="Add payment details, bank account, UPI, or payment terms"
            rows={3}
            maxLength={MAX_PAYMENT_INFO_LENGTH}
          />
        </label>

        <div className="invoice-items">
          <div className="invoice-items-heading">
            <h3>Items</h3>
            <span>Amount</span>
          </div>

          {items.map((item, index) => (
            <div className="invoice-item-row" key={item.id}>
              <label>
                Item {index + 1}
                <input
                  type="text"
                  value={item.description}
                  placeholder="Item or service description"
                  onChange={(event) =>
                    updateItem(
                      item.id,
                      "description",
                      event.target.value.slice(0, MAX_ITEM_DESCRIPTION_LENGTH),
                    )
                  }
                  maxLength={MAX_ITEM_DESCRIPTION_LENGTH}
                />
              </label>

              <label>
                Quantity
                <input
                  type="number"
                  min="1"
                  max={MAX_QUANTITY}
                  value={item.quantity}
                  onChange={(event) => updateItem(item.id, "quantity", event.target.value)}
                />
              </label>

              <label>
                Amount
                <input
                  type="number"
                  min="0"
                  max={MAX_AMOUNT}
                  step="0.01"
                  value={item.amount}
                  placeholder="0.00"
                  onChange={(event) => updateItem(item.id, "amount", event.target.value)}
                />
              </label>
            </div>
          ))}

          <button
            type="button"
            className="invoice-add-item"
            onClick={addItem}
            disabled={items.length >= MAX_ITEMS}
            aria-disabled={items.length >= MAX_ITEMS}
          >
            {items.length >= MAX_ITEMS ? "MAX ITEMS REACHED" : "ADD ITEM"} <span>+</span>
          </button>
        </div>

        <div className="invoice-total">
          <span>Total</span>
          <strong>Rs. {total.toFixed(2)}</strong>
        </div>

        {error && (
          <p className="invoice-form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="invoice-form-button">
          DOWNLOAD INVOICE <span>&gt;</span>
        </button>
      </form>
        <AdSpace />
      </div>

      <a className="invoice-switch-button" href={gstInvoiceHref}>
        SWITCH TO GST INVOICE <span>&gt;</span>
      </a>
    </section>
  );
}
