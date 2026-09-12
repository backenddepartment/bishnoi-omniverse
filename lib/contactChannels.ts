import contactData from '@/lib/data/contactData.json';

/**
 * The Philippines hub's phone number and the links built from it: tap-to-call in the header, and
 * the floating WhatsApp / Viber shortcuts. It is read from the contact page's hotline, so there is
 * one place to change it. The hotline lists the PH number first: "+63 917 156 9029 | +91 …".
 */
export const PH_PHONE_DISPLAY = contactData.directContact.hotline.split('|')[0].trim();

// International format without the "+", e.g. "639171569029".
const PH_PHONE_DIGITS = PH_PHONE_DISPLAY.replace(/\D/g, '');

export const PH_TEL_HREF = `tel:+${PH_PHONE_DIGITS}`;
export const WHATSAPP_HREF = `https://wa.me/${PH_PHONE_DIGITS}`;
// Viber wants the leading "+" percent-encoded.
export const VIBER_HREF = `viber://chat?number=%2B${PH_PHONE_DIGITS}`;
