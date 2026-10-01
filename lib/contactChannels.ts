import contactData from '@/lib/data/contactData.json';

/** A tap-to-call link for a displayed number, e.g. "+63 994 855 9919" -> "tel:+639948559919". */
export const telHref = (display: string) => `tel:+${display.replace(/\D/g, '')}`;

/**
 * The main phone number, for the header's tap-to-call link and the Call buttons. It is the first of
 * the contact page's phones (contactData → directContact.phones), so there is one place to change it.
 */
export const PH_PHONE_DISPLAY = contactData.directContact.phones[0];

export const PH_TEL_HREF = telHref(PH_PHONE_DISPLAY);

/**
 * The number that answers on WhatsApp and Viber (contactData → directContact.messaging), for the
 * floating shortcuts and the contact page. Both links open a chat with that number directly.
 */
export const MESSAGING_DISPLAY = contactData.directContact.messaging.trim();
const MESSAGING_DIGITS = MESSAGING_DISPLAY.replace(/\D/g, '');

// WhatsApp's own address rather than its wa.me short link: some networks cannot look wa.me up,
// and the short link only redirects here anyway. Opens the app on a phone, WhatsApp Web or the
// desktop app on a computer.
export const WHATSAPP_HREF = `https://api.whatsapp.com/send?phone=${MESSAGING_DIGITS}`;
// Opens the Viber app, where it is installed; Viber has no web page for a chat. The leading "+"
// has to be percent-encoded.
export const VIBER_HREF = `viber://chat?number=%2B${MESSAGING_DIGITS}`;
export const VIBER_DOWNLOAD_HREF = 'https://www.viber.com/en/download/';

/** The LinkedIn profile to message. LinkedIn has no link that opens a chat; the profile has the button. */
export const LINKEDIN_HREF = contactData.directContact.linkedin;
