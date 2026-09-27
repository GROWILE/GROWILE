// Defines the invoice tool catalog and invoice type filters.
import type { ComponentType } from "react";
import { GstInvoiceIcon, InvoiceIcon } from "./invoiceToolIcons";

export type InvoiceToolCategory = "GST" | "Non-GST";

export type InvoiceTool = {
  id: string;
  title: string;
  category: InvoiceToolCategory;
  path: string;
  description: string;
  icon: ComponentType;
};

export const invoiceToolCategories: Array<"All" | InvoiceToolCategory> = [
  "All",
  "GST",
  "Non-GST",
];

export const allInvoiceTools: InvoiceTool[] = [
  {
    id: "gst-invoice",
    title: "GST Invoice Generator",
    category: "GST",
    path: "/gst-invoice",
    description:
      "Create a tax invoice with GST details, item rates, and calculated tax totals.",
    icon: GstInvoiceIcon,
  },
  {
    id: "without-gst-invoice",
    title: "Non-GST Invoice Generator",
    category: "Non-GST",
    path: "/without-gst-invoice",
    description:
      "Make a clear invoice for products or services without GST tax columns.",
    icon: InvoiceIcon,
  },
];

export const toolCardThemes = ["blue", "orange"] as const;
