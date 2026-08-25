'use client';

import React, { useState } from 'react';
import { ArrowRight, Mail, Phone, Clock3 } from 'lucide-react';
import contactData from '@/lib/data/contactData.json';

const IMG = {
  hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/A_waiting_room_at_a_medical_healthcare_clinic%2C_doctor%27s_office%2C_hospital.jpg/1600px-A_waiting_room_at_a_medical_healthcare_clinic%2C_doctor%27s_office%2C_hospital.jpg',
};

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
      <section className="page-hero">
        <div className="hero-media">
          <img src={IMG.hero} alt="A calm hospital waiting area" loading="eager" />
        </div>
        <div className="hero-content">
          <span className="eyebrow on-dark">{pageHeader.title}</span>
          <h1>{pageHeader.headline}</h1>
          <p className="lede">{pageHeader.subheadline}</p>
        </div>
      </section>

      {/* Direct Reach Us */}
      <section className="section-tight section-2col">
        <div className="wrap">
          <span className="eyebrow">Direct Channels</span>
          <h2 className="mb-3">{directContact.title}</h2>
          <p className="lead-block text-ink-soft mb-10">{directContact.description}</p>

          <div className="grid-3 text-sm">
            <div className="info-card">
              <Mail className="w-5 h-5 text-accent mb-3" strokeWidth={1.75} />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted block mb-1">Global Email</span>
              <a href={`mailto:${directContact.email}`} className="text-base font-bold text-ink hover:text-accent-dark block">
                {directContact.email}
              </a>
              <span className="text-xs text-muted block mt-1">Confidential &amp; Direct Case Handler</span>
            </div>

            <div className="info-card">
              <Phone className="w-5 h-5 text-accent mb-3" strokeWidth={1.75} />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted block mb-1">International Hotline</span>
              <span className="text-base font-bold text-ink block">{directContact.hotline}</span>
              <span className="text-xs text-muted block mt-1">Global Operations Desk</span>
            </div>

            <div className="info-card">
              <Clock3 className="w-5 h-5 text-accent mb-3" strokeWidth={1.75} />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted block mb-1">Operating Hours</span>
              <span className="text-base font-bold text-ink block">{directContact.hours}</span>
              <span className="text-xs text-muted block mt-1">Always Available for Emergencies</span>
            </div>
          </div>
        </div>
      </section>

      {/* How Can We Assist You Today? */}
      <section className="section">
        <div className="wrap">
          <span className="eyebrow">Targeted Inquiry</span>
          <h2 className="mb-3">{assistSection.title}</h2>
          <p className="lead-block text-ink-soft italic mb-10">{assistSection.subtitle}</p>

          {/* Persona Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
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
                  className={`p-5 text-left rounded border transition flex flex-col justify-between ${
                    selected ? 'border-ink bg-ink text-white' : 'border-line bg-surface text-ink hover:border-accent'
                  }`}
                >
                  <div>
                    <span className={`text-xs font-semibold uppercase block mb-1 ${selected ? 'text-[#cfc9ba]' : 'text-muted'}`}>
                      Option 0{p.number}
                    </span>
                    <h3 className="font-sans text-sm font-bold leading-snug m-0">{p.category}</h3>
                  </div>
                  <span className={`mt-4 text-xs font-semibold flex items-center gap-1 ${selected ? 'text-accent' : 'text-accent-dark'}`}>
                    Select <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Persona Form */}
          <div className="info-card max-w-4xl !p-8">
            <div className="border-b border-line pb-6 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted block mb-1">Active Selection</span>
              <h3 className="font-sans text-xl font-bold text-ink">{activePersona.category}</h3>
              <p className="text-sm text-ink-soft mt-2 italic">&quot;{activePersona.tagline}&quot;</p>
            </div>

            {submitted ? (
              <div className="p-6 bg-ink text-white rounded space-y-3">
                <h4 className="font-sans text-lg font-bold text-white m-0">Inquiry Submitted Successfully</h4>
                <p className="text-sm !text-[#d7d2c1] leading-relaxed">
                  Thank you. Your inquiry for <strong className="text-white">{activePersona.category}</strong> has been
                  received. A dedicated Bishnoi Omniverse case manager will contact you within{' '}
                  <strong className="text-white">24 hours</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({});
                  }}
                  className="btn btn-outline !py-2 !px-4 !text-xs mt-2"
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
                        <label className="field-label">
                          {field.label} {field.required && <span className="text-accent">*</span>}
                        </label>

                        {field.type === 'select' ? (
                          <select
                            required={field.required}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="field-select"
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
                            className="field-input"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {activePersona.formFields.map((field) => {
                  if (field.type !== 'textarea') return null;
                  return (
                    <div key={field.name}>
                      <label className="field-label">
                        {field.label} {field.required && <span className="text-accent">*</span>}
                      </label>
                      <textarea
                        rows={4}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="field-textarea"
                      />
                    </div>
                  );
                })}

                <div className="pt-2">
                  <button type="submit" className="btn btn-primary w-full sm:w-auto justify-center">
                    {activePersona.buttonText} <ArrowRight />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Our Global Offices */}
      <section className="section section-line section-2col">
        <div className="wrap">
          <span className="eyebrow">Global Operations</span>
          <h2 className="mb-10">{globalOffices.title}</h2>

          <div className="grid-2">
            {globalOffices.locations.map((office) => (
              <div key={office.region} className="info-card">
                <h3 className="font-sans text-lg font-bold text-ink mb-1">{office.region}</h3>
                <div className="text-sm font-semibold text-ink-soft mb-3">{office.entity}</div>
                <p className="text-sm text-ink-soft leading-relaxed">{office.desc}</p>
                <div className="pt-3 mt-3 border-t border-line text-xs text-ink-soft space-y-1">
                  <p className="m-0">
                    <strong className="text-ink">Address:</strong> {office.address}
                  </p>
                  <p className="m-0">
                    <strong className="text-ink">Email:</strong> {office.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Happens After You Contact Us? */}
      <section className="section-dark section-tight">
        <div className="wrap">
          <span className="eyebrow on-dark">Response Commitment</span>
          <h2 className="mb-6 max-w-2xl">{whatHappens.title}</h2>
          <div className="max-w-2xl space-y-4">
            <p>{whatHappens.body}</p>
            <p className="font-serif text-lg text-white border-l-2 border-accent pl-4 py-1">{whatHappens.guarantee}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
