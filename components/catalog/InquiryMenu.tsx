'use client';

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PERSONAS, personaName } from '@/components/PersonaInquiryForm';
import { Building2, ChevronDown, Handshake, Stethoscope, Users, type LucideIcon } from 'lucide-react';

/** The contact page's four personas (contactData.json), in the order the menu lists them. */
export type InquiryType = 'patient' | 'doctor' | 'partner' | 'hospital';

const ICONS: Record<InquiryType, LucideIcon> = {
  patient: Users,
  doctor: Stethoscope,
  partner: Handshake,
  hospital: Building2,
};

// Labels are the contact page's persona names without their leading "For ", so the menu and the
// forms always read the same.
const personaLabel = (id: InquiryType) => {
  const persona = PERSONAS.find((p) => p.id === id);
  return persona ? personaName(persona) : id;
};

export const INQUIRY_TYPES = (['patient', 'doctor', 'partner', 'hospital'] as const).map((id) => ({
  id,
  label: personaLabel(id),
  icon: ICONS[id],
}));

const MENU_GAP = 8;
const VIEWPORT_MARGIN = 12;

interface Props {
  /** Product the inquiry is about, for the button's accessible name. */
  productName: string;
  /** Called with the inquirer type picked from the menu. */
  onSelect: (type: InquiryType) => void;
}

/**
 * Send Inquiry asks first who is asking, since each kind of inquirer has its own form. The menu is
 * portalled to <body> so a card's or the table's overflow cannot clip it.
 */
export function InquiryMenu({ productName, onSelect }: Props) {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);
  const [pos, setPos] = useState<{ top: number; left: number; width: number; above: boolean } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  // Below the trigger, right edges aligned, kept on screen; above it when there is no room below.
  const place = () => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu) return;
    const rect = trigger.getBoundingClientRect();
    const width = Math.min(Math.max(rect.width, 300), window.innerWidth - VIEWPORT_MARGIN * 2);
    const left = Math.min(
      Math.max(rect.right - width, VIEWPORT_MARGIN),
      window.innerWidth - width - VIEWPORT_MARGIN
    );
    const height = menu.offsetHeight;
    const fitsBelow = rect.bottom + MENU_GAP + height <= window.innerHeight - VIEWPORT_MARGIN;
    const above = !fitsBelow && rect.top - MENU_GAP - height >= VIEWPORT_MARGIN;
    setPos({ top: above ? rect.top - MENU_GAP - height : rect.bottom + MENU_GAP, left, width, above });
  };

  useLayoutEffect(() => {
    if (open) place();
    else setPos(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) setOpen(false);
    };
    // The menu is fixed to the screen, so a scroll would leave it behind its button: close instead.
    const close = () => setOpen(false);
    document.addEventListener('pointerdown', onPointer);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  useEffect(() => {
    if (open && pos) menuRef.current?.querySelectorAll<HTMLButtonElement>('button')[focusIdx]?.focus();
  }, [open, pos, focusIdx]);

  const choose = (type: InquiryType) => {
    setOpen(false);
    onSelect(type);
  };

  const openMenu = (idx = 0) => {
    setFocusIdx(idx);
    setOpen(true);
  };

  const onMenuKey = (e: React.KeyboardEvent) => {
    const last = INQUIRY_TYPES.length - 1;
    if (e.key === 'ArrowDown') setFocusIdx((i) => (i === last ? 0 : i + 1));
    else if (e.key === 'ArrowUp') setFocusIdx((i) => (i === 0 ? last : i - 1));
    else if (e.key === 'Home') setFocusIdx(0);
    else if (e.key === 'End') setFocusIdx(last);
    else if (e.key === 'Escape' || e.key === 'Tab') {
      setOpen(false);
      if (e.key === 'Escape') triggerRef.current?.focus();
      if (e.key === 'Tab') return;
    } else return;
    e.preventDefault();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`Send inquiry for ${productName}`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            openMenu(0);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            openMenu(INQUIRY_TYPES.length - 1);
          }
        }}
        className={`inquiry-btn inquiry-menu-trigger${open ? ' is-open' : ''}`}
      >
        <span>Send Inquiry</span>
        <ChevronDown className="inquiry-menu-chevron" aria-hidden="true" />
      </button>

      {open &&
        createPortal(
          <ul
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label="Who is this inquiry from?"
            onKeyDown={onMenuKey}
            className={`inquiry-menu${pos?.above ? ' is-above' : ''}`}
            style={
              pos
                ? { top: pos.top, left: pos.left, width: pos.width }
                : { top: 0, left: 0, visibility: 'hidden' }
            }
          >
            {INQUIRY_TYPES.map(({ id, label, icon: Icon }, idx) => (
              <li key={id} role="none">
                <button
                  type="button"
                  role="menuitem"
                  tabIndex={idx === focusIdx ? 0 : -1}
                  onClick={() => choose(id)}
                  onMouseEnter={() => setFocusIdx(idx)}
                  className="inquiry-menu-item"
                >
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ul>,
          document.body
        )}
    </>
  );
}
