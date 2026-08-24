"use client";

import React, { useState } from "react";

export default function CorpContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    location: "",
    category: "Hospital Procurement Officer",
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
        <h3 className="mt-4 text-2xl font-bold text-forest-950">Inquiry Submitted Successfully!</h3>
        <p className="mt-2 text-forest-950/70">
          Thank you, {formData.fullName}. Our account management team will respond to your request within <strong>one business day</strong>.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 rounded-lg bg-forest-950 px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest-900"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-forest-950/10 bg-white p-6 sm:p-8 shadow-sm">
      <h3 className="text-2xl font-bold text-forest-950">Submit Your Request</h3>
      <p className="text-sm text-forest-950/70">
        Fill out the form below to connect with our Philippine hospital supply and distribution specialists.
      </p>

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
          <label className="block text-sm font-medium text-forest-950">Phone / Mobile Number *</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+63 917 000 0000"
            className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-950">Hospital / Organization Name</label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            placeholder="e.g. St. Jude Medical Center"
            className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-forest-950">Province / City (Philippines)</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. Metro Manila / Cebu City"
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
            <option value="Hospital Procurement Officer">Hospital Procurement Officer</option>
            <option value="Government Agency (DOH/DSWD/LGU)">Government Agency (DOH/DSWD/LGU)</option>
            <option value="Pharmaceutical Manufacturer">Pharmaceutical Manufacturer</option>
            <option value="Local Pharmacy / Distributor">Local Pharmacy / Distributor</option>
            <option value="Cancer Patient / Family Member">Cancer Patient / Family Member</option>
            <option value="International Buyer (Global Export)">International Buyer (Global Export)</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-forest-950">Message / Product Request *</label>
        <textarea
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Please specify requested medicines, quantities, or partnership requirements..."
          className="mt-2 block w-full rounded-lg border border-forest-950/20 px-4 py-2.5 text-forest-950 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-orange-500 px-6 py-3.5 text-center font-bold text-white shadow-md hover:bg-orange-600 transition-colors"
      >
        Submit Inquiry →
      </button>
    </form>
  );
}
