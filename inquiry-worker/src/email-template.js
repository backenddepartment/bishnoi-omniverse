/**
 * The inquiry email: a letterhead with the logo and corner swooshes, a details card with an icon
 * on every row, then the message, the attached files and the sign-off.
 *
 * Written for Gmail first: tables for layout, every style inline, and images (never SVG) for the
 * logo, swooshes and icons. Those images are built by scripts/build-email-assets.mjs and served by
 * this Worker at /email/<name>.png; `assets` is that folder's absolute URL.
 */

// Poppins, the website's font. Clients that load web fonts (Apple Mail, iOS Mail, Outlook for Mac)
// use it; Gmail and Outlook for Windows ignore web fonts and fall back to Arial.
const FONT = "'Poppins',Arial,Helvetica,sans-serif";
const FONT_LINK =
  '<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">';
// The site's orange sweep, with a flat orange behind it for clients that ignore gradients.
const HEADER_BG = 'background-color:#f36b21;background-image:linear-gradient(135deg,#ff9a0a 0%,#f36b21 45%,#e8401c 80%,#c7331a 100%);';

// Keep in step with scripts/build-email-assets.mjs.
const C = {
  green: '#0b4a2e',
  label: '#1f5a3d',
  ink: '#1a1a1a',
  text: '#333333',
  muted: '#5f6b64',
  line: '#e3e6e4',
  rowAlt: '#f5f7f6',
  orange: '#f26a1b',
  link: '#1a5fb4',
};

const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const img = (src, width, height, alt = '') =>
  `<img src="${src}" width="${width}" height="${height}" alt="${esc(alt)}" style="display:block;border:0;outline:none;text-decoration:none;width:${width}px;height:${height}px;">`;

/**
 * @param {string} context  e.g. "Medical Equipment Inquiry"
 * @param {Array<[string,string]>} fields  Ordered label/value rows; empty values dropped.
 * @param {Array<{name:string,url:string}>} items  Catalog products requested.
 * @param {string} message  Free-text notes.
 * @param {Array<{name:string,category:string}>} files  Attachment list.
 * @param {string} intro  The provenance line under "Dear Recipient,".
 * @param {string} assets  Absolute URL of the image folder, ending in "/".
 */
export function renderHtml(context, fields, items, message, files, intro, assets) {
  const icon = (name) => img(`${assets}icon-${name}.png`, 20, 20);

  const rows = fields
    .filter(([, value]) => value !== '' && value != null)
    .map(([label, value]) => {
      const content =
        label.toLowerCase().includes('email') && value.includes('@')
          ? `<a href="mailto:${esc(value)}" style="color:${C.link};text-decoration:underline;">${esc(value)}</a>`
          : esc(value).replace(/\n/g, '<br>');
      return [label, content];
    });

  if (items.length) {
    const list = items
      .map((item) => {
        const name = esc(item.name);
        const content = item.url
          ? `<a href="${esc(item.url)}" style="color:${C.orange};text-decoration:underline;">${name}</a>`
          : name;
        return `<li style="margin:0 0 4px 0;font-family:${FONT};font-size:15px;color:${C.ink};">${content}</li>`;
      })
      .join('');
    rows.push([`Items Requested (${items.length})`, `<ul style="margin:0;padding-left:20px;">${list}</ul>`]);
  }

  const detailRows = rows
    .map(([label, content], idx) => {
      const bg = idx % 2 === 0 ? C.rowAlt : '#ffffff';
      const edge = idx === rows.length - 1 ? '' : `border-bottom:1px solid ${C.line};`;
      return (
        '<tr>' +
        `<td width="40%" valign="top" style="background-color:${bg};padding:13px 14px 13px 22px;border-right:1px solid ${C.line};${edge}">` +
        `<span style="font-family:${FONT};font-size:14px;line-height:21px;color:${C.label};">${esc(label)}</span></td>` +
        `<td valign="top" style="background-color:${bg};padding:13px 20px;${edge}font-family:${FONT};font-size:14px;line-height:21px;color:${C.ink};">${content}</td>` +
        '</tr>'
      );
    })
    .join('');

  const section = (heading, body) => `<tr><td style="padding:30px 40px 0 40px;">${heading}${body}</td></tr>`;

  const messageBlock = message.trim()
    ? section(
        `<div style="border-left:3px solid ${C.green};padding:2px 0 2px 14px;font-family:${FONT};font-size:15px;font-weight:600;color:${C.ink};">Message</div>`,
        `<div style="margin:14px 0 0 17px;padding:14px 18px;background-color:${C.rowAlt};border:1px solid ${C.line};border-radius:4px;font-family:${FONT};font-size:15px;line-height:24px;color:${C.ink};">${esc(message).replace(/\n/g, '<br>')}</div>`
      )
    : '';

  const filesBlock = files.length
    ? section(
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
          `<td valign="middle">${icon('clip')}</td>` +
          `<td valign="middle" style="padding-left:12px;font-family:${FONT};font-size:15px;font-weight:600;color:${C.ink};">Attached Files</td>` +
          '</tr></table>',
        `<ul style="margin:12px 0 0 0;padding-left:38px;">${files
          .map((file) => {
            const category = file.category ? ` (${esc(file.category)})` : '';
            return `<li style="margin:0 0 4px 0;font-family:${FONT};font-size:15px;line-height:22px;color:${C.ink};">${esc(file.name)}${category} &ndash; attached</li>`;
          })
          .join('')}</ul>`
      )
    : '';

  const rule = `<div style="border-top:1px solid ${C.green};height:1px;line-height:1px;font-size:1px;">&nbsp;</div>`;

  return (
    FONT_LINK +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">` +
    '<tr><td align="center" style="padding:24px 12px;">' +
    `<table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;background-color:#ffffff;">` +
    // Letterhead: logo and title on the left, the swoosh tucked into the top-right corner.
    '<tr><td style="padding:0;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
    `<td valign="top" style="padding:34px 0 0 40px;">` +
    img(`${assets}logo.png`, 210, 123, 'Bishnoi Omniverse') +
    `<div style="padding-top:16px;font-family:${FONT};font-size:16px;font-style:italic;color:${C.green};">${esc(context)}</div>` +
    '</td>' +
    `<td width="240" valign="top" align="right" style="padding:0;line-height:0;font-size:0;">${img(`${assets}swoosh-top.png`, 240, 200)}</td>` +
    '</tr></table></td></tr>' +
    `<tr><td style="padding:14px 40px 0 40px;"><div style="border-top:1px solid ${C.line};height:1px;line-height:1px;font-size:1px;">&nbsp;</div></td></tr>` +
    // Greeting and where the inquiry came from.
    `<tr><td style="padding:22px 40px 0 40px;font-family:${FONT};font-size:15px;line-height:24px;color:${C.text};">` +
    'Dear Recipient,' +
    `<p style="margin:10px 0 0 0;">${esc(intro)}</p>` +
    '</td></tr>' +
    // Details card.
    '<tr><td style="padding:24px 40px 0 40px;">' +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.line};border-radius:6px;border-collapse:separate;">` +
    `<tr><td colspan="2" style="${HEADER_BG}padding:18px 22px 16px 22px;border-radius:5px 5px 0 0;">` +
    `<div style="font-family:${FONT};font-size:22px;font-weight:600;color:#ffffff;">Bishnoi Omniverse</div>` +
    `<div style="padding-top:4px;font-family:${FONT};font-size:14px;color:#fff3ea;">${esc(context)}</div>` +
    '</td></tr>' +
    detailRows +
    '</table></td></tr>' +
    messageBlock +
    filesBlock +
    // Sign-off.
    `<tr><td style="padding:30px 40px 0 40px;font-family:${FONT};font-size:15px;line-height:22px;color:${C.text};">` +
    'Best regards,<br>' +
    `<span style="font-weight:600;color:${C.green};">Bishnoi Omniverse</span><br>` +
    `<span style="font-size:13px;font-style:italic;color:${C.green};">Your Trusted Medical Equipment Partner</span>` +
    '</td></tr>' +
    // Tagline between two rules.
    '<tr><td style="padding:30px 40px 0 40px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
    `<td width="24%" valign="middle">${rule}</td>` +
    `<td align="center" valign="middle" style="padding:0 14px;white-space:nowrap;font-family:${FONT};font-size:12px;letter-spacing:1px;color:${C.green};">` +
    `Better Equipment&nbsp;&nbsp;<span style="color:${C.orange};">&bull;</span>&nbsp;&nbsp;Better Care</td>` +
    `<td width="24%" valign="middle">${rule}</td>` +
    '</tr></table></td></tr>' +
    // The swoosh rising out of the bottom-right corner.
    `<tr><td align="right" style="padding:6px 0 0 0;line-height:0;font-size:0;">${img(`${assets}swoosh-bottom.png`, 220, 90)}</td></tr>` +
    '</table></td></tr></table>'
  );
}
