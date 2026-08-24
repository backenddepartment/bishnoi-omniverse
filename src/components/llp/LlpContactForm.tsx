"use client";

import React, { useState } from "react";

export default function LlpContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    category: "International Distributor / Wholesaler",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-green-500 text-2xl text-white">
          ✓
        </span>
        <h3 className="mt-4 text-2xl font-bold text-forest-950">Global Export Inquiry Received!</h3>
        <p className="mt-2 text-forest-950/70">
          Thank you, {formData.fullName}. Our global export team at <strong>care2@getmeds.in</strong> will review your request and respond within <strong>one business day</strong>.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 rounded-lg bg-forest-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest-900"
        >
          Submit Another Global Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-forest-950/10 bg-white p-6 sm:p-8 shadow-sm">
      <h3 className="text-2xl font-bold text-forest-950">Submit Your Global Inquiry</h3>
      <p className="text-sm text-forest-950/70">
        Connect directly with our international export specialists in Mumbai, Maharashtra, India.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-forest-950">Full Name *</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. Alexander Vance"
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
            placeholder="e.g. a.vance@pharma-distributor.com"
            className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-forest-950">Phone / WhatsApp Number *</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 555 019 2831"
            className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-950">Company / Organization Name</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g. Apex Global Pharma Ltd."
            className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-forest-950">Country *</label>
          <input
            type="text"
            required
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            placeholder="e.g. Singapore, Vietnam, UAE..."
            className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-950">I am a... *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
          >
            <option value="International Distributor / Wholesaler">International Distributor / Wholesaler</option>
            <option value="Overseas Hospital / Clinic Administrator">Overseas Hospital / Clinic Administrator</option>
            <option value="Pharmaceutical Manufacturer">Pharmaceutical Manufacturer</option>
            <option value="Government Agency / Ministry Tender">Government Agency / Ministry Tender</option>
            <option value="NGO / Patient Assistance Program">NGO / Patient Assistance Program</option>
            <option value="International Patient / Family Member">International Patient / Family Member</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-forest-950">Product Inquiry / Message *</label>
        <textarea
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Specify requested oncology medicines, quantities, shipping terms, or partnership details..."
          className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-forest-950 px-6 py-3.5 text-center font-bold text-white shadow-md hover:bg-forest-900 transition-colors"
      >
        Submit Global Export Inquiry →
      </button>
    </form>
  );
}
