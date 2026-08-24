"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

const RECIPIENT_EMAIL = "info@getmeds.ph";

const REASONS = [
  "Request a pharmaceutical product",
  "Hospital / pharmacy supply",
  "Manufacturer partnership",
  "Distribution partnership",
  "Export inquiry",
  "Existing order",
  "General inquiry",
] as const;

const REASON_SLUGS: Record<string, string> = {
  "request-a-product": "Request a pharmaceutical product",
  "hospital-pharmacy-supply": "Hospital / pharmacy supply",
  "manufacturer-partnership": "Manufacturer partnership",
  "distribution-partnership": "Distribution partnership",
  "export-inquiry": "Export inquiry",
  "existing-order": "Existing order",
  "general-inquiry": "General inquiry",
};

interface FormState {
  reason: string;
  fullName: string;
  organization: string;
  country: string;
  email: string;
  phone: string;
  productName: string;
  strength: string;
  quantity: string;
  requiredDate: string;
  message: string;
}

const EMPTY_FORM: FormState = {
  reason: REASONS[0],
  fullName: "",
  organization: "",
  country: "",
  email: "",
  phone: "",
  productName: "",
  strength: "",
  quantity: "",
  requiredDate: "",
  message: "",
};

function buildMailto(data: FormState) {
  const lines = [
    `Reason: ${data.reason}`,
    `Full name: ${data.fullName}`,
    `Company / Hospital / Pharmacy: ${data.organization || "—"}`,
    `Country: ${data.country || "—"}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "—"}`,
  ];

  if (data.reason === REASONS[0]) {
    lines.push(
      `Product name: ${data.productName || "—"}`,
      `Strength: ${data.strength || "—"}`,
      `Quantity: ${data.quantity || "—"}`,
      `Required date: ${data.requiredDate || "—"}`
    );
  }

  lines.push("", "Additional requirements:", data.message);

  const subject = `${data.reason} — ${data.fullName || "Website inquiry"}`;
  const body = lines.join("\n");
  return `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function RequestProductFormInner() {
  const searchParams = useSearchParams();
  const initialReason = REASON_SLUGS[searchParams.get("reason") ?? ""] ?? REASONS[0];

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormState>({ ...EMPTY_FORM, reason: initialReason });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = buildMailto(formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-green-500 text-2xl text-white">
          ✓
        </span>
        <h3 className="mt-4 text-2xl font-bold text-forest-950">Your email client should now be open</h3>
        <p className="mt-2 text-forest-950/70">
          Thank you, {formData.fullName}. Review and send the pre-filled email to reach our team. If nothing opened,
          email <strong>{RECIPIENT_EMAIL}</strong> directly with the summary below.
        </p>
        <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-white p-4 text-xs text-forest-950/80 border border-forest-950/10">
          {decodeURIComponent(buildMailto(formData).split("&body=")[1])}
        </pre>
        <button
          onClick={() => {
            setFormData(EMPTY_FORM);
            setSubmitted(false);
          }}
          className="mt-6 rounded-lg bg-forest-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest-900"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  const isProductRequest = formData.reason === REASONS[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-forest-950/10 bg-white p-6 sm:p-8 shadow-sm">
      <div>
        <label className="block text-sm font-medium text-forest-950">What can we help with? *</label>
        <select
          required
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
        >
          {REASONS.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-forest-950">Full Name *</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. Maria Santos"
            className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-950">Email Address *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. m.santos@hospital.ph"
            className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-forest-950">Company / Hospital / Pharmacy</label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            placeholder="e.g. St. Jude Medical Center"
            className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-950">Country</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            placeholder="e.g. Philippines"
            className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-forest-950">Phone / Mobile Number</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+63 917 000 0000"
          className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      {isProductRequest && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 rounded-xl bg-cream-50 p-4">
          <div>
            <label className="block text-sm font-medium text-forest-950">Product Name</label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-950">Strength</label>
            <input
              type="text"
              value={formData.strength}
              onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
              placeholder="e.g. 500mg"
              className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-950">Quantity</label>
            <input
              type="text"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-950">Required Date</label>
            <input
              type="date"
              value={formData.requiredDate}
              onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
              className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-forest-950">Additional Requirements *</label>
        <textarea
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Describe your requirement. If you have a prescription or purchase order to share, mention it here — our team will follow up for the file."
          className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-orange-500 px-6 py-3.5 text-center font-bold text-white shadow-md hover:bg-orange-600 transition-colors"
      >
        Submit Request →
      </button>
    </form>
  );
}

export default function RequestProductForm() {
  return (
    <Suspense fallback={null}>
      <RequestProductFormInner />
    </Suspense>
  );
}
