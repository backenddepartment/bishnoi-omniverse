'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import catalogData from '@/lib/data/catalogData.json';
import { InquiryGuard, type InquiryGuardHandle } from '@/components/InquiryGuard';
import { CAPTCHA_ENABLED, DOCUMENT_EXTENSIONS, collectFiles, phoneInput, sendInquiry } from '@/lib/inquiry';
import { EQUIPMENT_PATH, productPath } from '@/lib/catalogRoutes';
import { SuccessDialog } from '@/components/SuccessDialog';
import { AttachmentPicker } from '@/components/attachments/AttachmentPicker';

export interface RequisitionItem {
  id: string;
  name: string;
  categoryId: string;
  subcategoryId: string;
}

const EMPTY_RFQ = {
  name: '',
  email: '',
  phone: '',
  delivery: '',
  quantity: '',
  tenderRef: '',
  notes: '',
};

interface Props {
  open: boolean;
  onClose: () => void;
  items: RequisitionItem[];
  onRemoveItem: (productId: string) => void;
  /** Called once the requisition has been sent and its confirmation closed; clear the list here. */
  onSent: () => void;
  /** Written into Additional Notes when the modal opens with them empty, e.g. a chosen size. */
  initialNotes?: string;
}

/**
 * The hospital requisition form, opened from the catalog (Upload Requisition List, or a product's
 * Send Inquiry) and from a product page's Send Inquiry. It sends the items with the buyer's details.
 */
export function RequisitionModal({ open, onClose, items, onRemoveItem, onSent, initialNotes }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [hospitalInfo, setHospitalInfo] = useState(EMPTY_RFQ);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [token, setToken] = useState('');
  const guardRef = useRef<InquiryGuardHandle>(null);

  const subcategoryName = useMemo(() => {
    const map = new Map(catalogData.subcategories.map((s) => [s.id, s.name]));
    return (id: string) => map.get(id) ?? '';
  }, []);

  useEffect(() => {
    if (open && initialNotes) {
      setHospitalInfo((info) => (info.notes.trim() ? info : { ...info, notes: initialNotes }));
    }
  }, [open, initialNotes]);

  // Freeze the page behind the modal so only the modal is interactive, move focus into it so a
  // keyboard or screen reader starts there, and let Escape close it.
  // Once sent, closing clears the form and the list, so the next requisition starts fresh.
  const finish = () => {
    setSubmitted(false);
    setHospitalInfo(EMPTY_RFQ);
    setAttachments([]);
    setError('');
    onSent();
    onClose();
  };

  // onClose is read through a ref, so a parent re-render (an item removed) does not re-run this
  // and pull focus back to the top of the modal.
  const modalRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const submittedRef = useRef(submitted);
  submittedRef.current = submitted;
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const returnFocus = document.activeElement as HTMLElement | null;
    modalRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submittedRef.current) onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKeyDown);
      returnFocus?.focus();
    };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    // Something has to say what is being requested: a catalog item, a note, or an attached list.
    if (items.length === 0 && !hospitalInfo.notes.trim() && attachments.length === 0) {
      setError(
        'Add at least one product from the catalog, describe the items in Additional Notes, or attach a list.'
      );
      return;
    }
    setError('');
    setSending(true);

    const collected = await collectFiles(
      attachments,
      DOCUMENT_EXTENSIONS,
      'Tender spec / PO / product list'
    );
    if (!collected.ok) {
      setError(collected.error);
      setSending(false);
      return;
    }

    // Each item carries a link to its product page, so the team opens exactly what was picked.
    // The prefix keeps the GitHub Pages sub-path (/bishnoi-omniverse) when there is one.
    const path = window.location.pathname;
    const catalogAt = path.indexOf(EQUIPMENT_PATH);
    const siteRoot = window.location.origin + (catalogAt > 0 ? path.slice(0, catalogAt) : '');

    const result = await sendInquiry(
      {
        formType: 'product',
        inquiryType: 'Hospital Requisition',
        name: hospitalInfo.name,
        email: hospitalInfo.email,
        phone: hospitalInfo.phone,
        message: hospitalInfo.notes,
        details: [
          { label: 'Hospital / Facility', value: hospitalInfo.name },
          { label: 'Address', value: hospitalInfo.delivery },
          { label: 'Quantity Needed', value: hospitalInfo.quantity },
          { label: 'Tender / Bid Reference', value: hospitalInfo.tenderRef },
        ],
        items: items.map((item) => ({
          name: `${item.name} (${subcategoryName(item.subcategoryId)})`,
          url: `${siteRoot}${productPath(item)}/`,
        })),
        files: collected.files,
        requireItems: true,
      },
      { captchaToken: token, honeypot: guardRef.current?.honeypot() ?? '' }
    );

    // Turnstile tokens are single-use: a retry always needs a fresh one.
    guardRef.current?.reset();
    setSending(false);
    if (result.ok) {
      setSubmitted(true);
    } else {
      setError(result.message);
    }
  };

  if (!open) return null;

  if (submitted) {
    return (
      <SuccessDialog title="Requisition Sent!" onClose={finish}>
        <p>
          Thank you! Your hospital requisition has reached our global sourcing desk. A Bishnoi supply
          manager will return a fully costed quote within <strong>24 hours</strong>.
        </p>
      </SuccessDialog>
    );
  }

  return (
    // Sits above the sticky site header (z-index 100) and blurs everything behind it.
    <div className="fixed inset-0 z-[200] bg-ink/50 backdrop-blur-md flex items-center justify-center p-4">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rfq-title"
        tabIndex={-1}
        className="rfq-modal bg-surface rounded-2xl max-w-2xl w-full max-h-[calc(100vh-2rem)] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h3 id="rfq-title" className="font-sans text-xl font-bold text-ink m-0">Submit Hospital Requisition List</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 hover:bg-paper-2 rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

          <form onSubmit={handleSubmit} className="rfq-form space-y-4">
            {/* The requested items as pills: each opens its product page in a new tab (so this
                requisition is not lost), and × takes the product off the list. */}
            <div>
              <span id="rfq-items-label" className="field-label">
                Items Requested ({items.length})
              </span>
              {items.length > 0 ? (
                <ul className="rfq-items" aria-labelledby="rfq-items-label">
                  {items.map((item) => (
                    <li key={item.id} className="rfq-pill">
                      <Link
                        href={productPath(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${item.name} · ${subcategoryName(item.subcategoryId)} (opens in a new tab)`}
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name} from this requisition`}
                      >
                        <X className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rfq-items-empty">
                  No products added yet. Use Send Inquiry on any product, describe the items in
                  Additional Notes, or attach a list.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="rfq-name" className="field-label">
                  Hospital / Facility Name
                </label>
                <input
                  id="rfq-name"
                  type="text"
                  required
                  placeholder="e.g. City General Hospital"
                  value={hospitalInfo.name}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, name: e.target.value })}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="rfq-email" className="field-label">
                  Procurement Email
                </label>
                <input
                  id="rfq-email"
                  type="email"
                  required
                  placeholder="e.g. procurement@hospital.com"
                  value={hospitalInfo.email}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, email: e.target.value })}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="rfq-phone" className="field-label">
                  Contact Number
                </label>
                <input
                  id="rfq-phone"
                  type="tel"
                  inputMode="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={hospitalInfo.phone}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, phone: phoneInput(e.target.value) })}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="rfq-delivery" className="field-label">
                  Address
                </label>
                <input
                  id="rfq-delivery"
                  type="text"
                  required
                  placeholder="e.g. 123 Osmeña Blvd, Cebu City, Cebu 6000"
                  value={hospitalInfo.delivery}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, delivery: e.target.value })}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="rfq-quantity" className="field-label">
                  Quantity Needed
                </label>
                <input
                  id="rfq-quantity"
                  type="text"
                  required
                  placeholder='e.g. 500 boxes, or "unsure — advise"'
                  value={hospitalInfo.quantity}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, quantity: e.target.value })}
                  className="field-input"
                />
              </div>
              <div>
                <label htmlFor="rfq-tender" className="field-label">
                  Tender / Bid Reference No. <span className="rfq-optional">(optional)</span>
                </label>
                <input
                  id="rfq-tender"
                  type="text"
                  placeholder="e.g. PhilGEPS reference, if any"
                  value={hospitalInfo.tenderRef}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, tenderRef: e.target.value })}
                  className="field-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="rfq-file" className="field-label">
                Tender Spec, PO or Product List <span className="rfq-optional">(optional)</span>
              </label>
              <AttachmentPicker
                id="rfq-file"
                files={attachments}
                onChange={setAttachments}
                className="field-input rfq-file"
              />
            </div>

            <div>
              <label htmlFor="rfq-notes" className="field-label">
                Additional Notes <span className="rfq-optional">(optional)</span>
              </label>
              <textarea
                id="rfq-notes"
                rows={3}
                placeholder="e.g. items not in the catalog, preferred brands, sizes, delivery timing"
                value={hospitalInfo.notes}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, notes: e.target.value })}
                className="field-textarea"
              />
            </div>

            <InquiryGuard ref={guardRef} onToken={setToken} />

            {error && (
              <p className="rfq-error" role="alert">
                {error}
              </p>
            )}

            {/* Stays disabled until "Verify you are human" has passed, and while sending. */}
            <button
              type="submit"
              disabled={sending || (CAPTCHA_ENABLED && !token)}
              className="btn btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending…' : 'Submit Requisition'}
            </button>
          </form>
      </div>
    </div>
  );
}
