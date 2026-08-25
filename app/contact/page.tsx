'use client';

import React, { useState } from 'react';
import contactData from '@/lib/data/contactData.json';

export default function ContactPage() {
  const { pageHeader, directContact, assistSection, personas, globalOffices, whatHappens } = contactData;

  const [activePersonaId, setActivePersonaId] = useState<string>('doctor');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const activePersona = personas.find((p) => p.id === activePersonaId) || personas[0];

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 border-b border-black">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          {pageHeader.title}
        </span>
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-black leading-tight max-w-4xl">
          {pageHeader.headline}
        </h1>
        <p className="text-base md:text-lg text-slate-800 mt-4 max-w-3xl leading-relaxed">
          {pageHeader.subheadline}
        </p>
      </section>

      {/* Direct Reach Us Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 border-b border-black bg-slate-50">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          Direct Channels
        </span>
        <h2 className="text-xl md:text-2xl font-bold uppercase text-black mb-3">
          {directContact.title}
        </h2>
        <p className="text-sm text-slate-700 max-w-3xl mb-8 leading-relaxed">
          {directContact.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="p-6 bg-white border border-black space-y-2">
            <span className="text-xs font-bold uppercase text-slate-500 block">Global Email</span>
            <a
              href={`mailto:${directContact.email}`}
              className="text-base font-bold text-black hover:underline block"
            >
              {directContact.email}
            </a>
            <span className="text-xs text-slate-600 block">Confidential & Direct Case Handler</span>
          </div>

          <div className="p-6 bg-white border border-black space-y-2">
            <span className="text-xs font-bold uppercase text-slate-500 block">International Hotline</span>
            <span className="text-base font-bold text-black block">{directContact.hotline}</span>
            <span className="text-xs text-slate-600 block">Global Operations Desk</span>
          </div>

          <div className="p-6 bg-white border border-black space-y-2">
            <span className="text-xs font-bold uppercase text-slate-500 block">Operating Hours</span>
            <span className="text-base font-bold text-black block">{directContact.hours}</span>
            <span className="text-xs text-slate-600 block">Always Available for Emergencies</span>
          </div>
        </div>
      </section>

      {/* How Can We Assist You Today? */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-black">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          Targeted Inquiry
        </span>
        <h2 className="text-2xl md:text-3xl font-bold uppercase text-black mb-3">
          {assistSection.title}
        </h2>
        <p className="text-sm md:text-base text-slate-800 max-w-3xl mb-10 leading-relaxed italic">
          {assistSection.subtitle}
        </p>

        {/* Persona Selector Tabs / Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {personas.map((p) => {
            const selected = p.id === activePersonaId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setActivePersonaId(p.id);
                  setSubmitted(false);
                  setFormData({});
                }}
                className={`p-5 text-left border transition flex flex-col justify-between ${
                  selected
                    ? 'border-black bg-black text-white'
                    : 'border-slate-300 bg-white text-slate-900 hover:border-black'
                }`}
              >
                <div>
                  <span className={`text-xs font-bold uppercase block mb-1 ${selected ? 'text-slate-300' : 'text-slate-500'}`}>
                    Option 0{p.number}
                  </span>
                  <h3 className="text-sm font-bold uppercase leading-snug">
                    {p.category}
                  </h3>
                </div>
                <span className={`mt-4 text-xs font-bold uppercase tracking-wider underline ${selected ? 'text-white' : 'text-slate-900'}`}>
                  Select Persona →
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Active Persona Form Box */}
        <div className="p-8 border border-black bg-white max-w-4xl">
          <div className="border-b border-slate-200 pb-6 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-1">
              Active Selection
            </span>
            <h3 className="text-xl font-bold uppercase text-black">
              {activePersona.category}
            </h3>
            <p className="text-sm text-slate-700 mt-2 italic">
              &quot;{activePersona.tagline}&quot;
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-slate-900 text-white space-y-3">
              <h4 className="text-lg font-bold uppercase text-white">
                Inquiry Submitted Successfully
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                Thank you. Your inquiry for <strong>{activePersona.category}</strong> has been received. A dedicated Bishnoi Omniverse case manager will contact you within <strong>24 hours</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({});
                }}
                className="mt-4 px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider border border-white hover:bg-slate-100"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {activePersona.formFields.map((field) => {
                  if (field.type === 'textarea') return null;
                  return (
                    <div key={field.name} className={field.name === 'additionalNotes' || field.name === 'message' ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                        {field.label} {field.required && <span className="text-red-600">*</span>}
                      </label>

                      {field.type === 'select' ? (
                        <select
                          required={field.required}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="w-full p-3 text-sm bg-slate-50 border border-black focus:outline-none focus:bg-white text-black"
                        >
                          <option value="">Select an option...</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          required={field.required}
                          placeholder={field.placeholder}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="w-full p-3 text-sm bg-slate-50 border border-black focus:outline-none focus:bg-white text-black"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Render Textarea if present */}
              {activePersona.formFields.map((field) => {
                if (field.type !== 'textarea') return null;
                return (
                  <div key={field.name}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                      {field.label} {field.required && <span className="text-red-600">*</span>}
                    </label>
                    <textarea
                      rows={4}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full p-3 text-sm bg-slate-50 border border-black focus:outline-none focus:bg-white text-black"
                    />
                  </div>
                );
              })}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-wider border border-black hover:bg-slate-900 transition"
                >
                  [ BUTTON: {activePersona.buttonText} ]
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Our Global Offices */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-black">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          Global Operations
        </span>
        <h2 className="text-2xl md:text-3xl font-bold uppercase text-black mb-8">
          {globalOffices.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {globalOffices.locations.map((office) => (
            <div key={office.region} className="p-6 border border-black space-y-3 bg-white">
              <h3 className="text-lg font-bold uppercase text-black">
                {office.region}
              </h3>
              <div className="text-sm font-bold text-slate-900">
                {office.entity}
              </div>
              <p className="text-sm text-slate-800 leading-relaxed">
                {office.desc}
              </p>
              <div className="pt-3 border-t border-slate-200 text-xs text-slate-700 space-y-1">
                <p><strong>Address:</strong> {office.address}</p>
                <p><strong>Email:</strong> {office.email}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What Happens After You Contact Us? */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block mb-2">
          Response Commitment
        </span>
        <h2 className="text-2xl md:text-3xl font-bold uppercase text-black mb-6">
          {whatHappens.title}
        </h2>
        <div className="p-8 border-2 border-black bg-slate-900 text-white max-w-4xl space-y-4">
          <p className="text-base md:text-lg leading-relaxed text-slate-200">
            {whatHappens.body}
          </p>
          <p className="text-base md:text-lg font-bold text-white uppercase tracking-wide border-l-4 border-white pl-4 py-1">
            {whatHappens.guarantee}
          </p>
        </div>
      </section>
    </div>
  );
}
