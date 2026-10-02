/**
 * Builds the PNG images the inquiry email uses: the logo, the corner swooshes and the row icons.
 * Email clients (Gmail above all) drop SVG and most CSS, so everything decorative has to be a
 * plain image at a public URL. The Worker serves these files itself at /email/<name>.png.
 *
 * Run from inquiry-worker/ after changing a colour or an icon:
 *   node scripts/build-email-assets.mjs
 *
 * Icons come from lucide-react, the icon set the website uses, rendered through the website's own
 * React install (../node_modules), so it needs the site's dependencies installed too.
 */
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, '../..');
const out = path.resolve(here, '../src/email-assets');
mkdirSync(out, { recursive: true });

const siteRequire = createRequire(path.join(site, 'package.json'));
const React = siteRequire('react');
const { renderToStaticMarkup } = siteRequire('react-dom/server');
const lucide = siteRequire('lucide-react');

// Keep in step with the palette in src/email-template.js.
const GREEN = '#0b4a2e';
const ORANGE = '#f26a1b';
const GREY = '#e6e7e9';

// Everything is drawn at twice its display size so it stays sharp on high-density screens.
const SCALE = 2;

async function png(name, svg, width, height) {
  await sharp(Buffer.from(svg))
    .resize(width * SCALE, height * SCALE)
    .png({ compressionLevel: 9 })
    .toFile(path.join(out, `${name}.png`));
}

// The logo, trimmed of its empty margin and sized for a 210px-wide slot.
await sharp(path.join(site, 'app/assets/logo.png'))
  .trim()
  .resize({ width: 210 * SCALE })
  .png({ compressionLevel: 9 })
  .toFile(path.join(out, 'logo.png'));

// Top-right corner: a thin grey arc, an orange band and the green corner, as in the letterhead.
await png(
  'swoosh-top',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200">
    <path d="M58 0 C140 42 205 105 240 196 L240 186 C207 100 146 40 74 0 Z" fill="${GREY}"/>
    <path d="M86 0 C160 38 218 98 240 164 L240 132 C214 80 168 36 118 0 Z" fill="${ORANGE}"/>
    <path d="M124 0 C172 34 214 76 240 124 L240 0 Z" fill="${GREEN}"/>
  </svg>`,
  240,
  200
);

// Bottom-right corner: the same three bands rising out of the corner.
await png(
  'swoosh-bottom',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 90">
    <path d="M30 90 C110 82 175 55 220 6 L220 16 C178 62 118 86 52 90 Z" fill="${GREY}"/>
    <path d="M70 90 C130 80 185 56 220 26 L220 46 C190 70 148 86 104 90 Z" fill="${ORANGE}"/>
    <path d="M112 90 C155 84 192 68 220 50 L220 90 Z" fill="${GREEN}"/>
  </svg>`,
  220,
  90
);

// Row icons: one per kind of detail. src/email-template.js picks one from each row's label.
const ICONS = {
  hospital: 'Hospital',
  user: 'User',
  mail: 'Mail',
  phone: 'Phone',
  pin: 'MapPin',
  box: 'Package',
  gavel: 'Gavel',
  list: 'FileText',
  building: 'Building2',
  clock: 'Clock',
  badge: 'BadgeCheck',
  message: 'MessageSquareText',
  info: 'Info',
  clip: 'Paperclip',
};
for (const [name, component] of Object.entries(ICONS)) {
  const Icon = lucide[component];
  if (!Icon) throw new Error(`lucide-react has no ${component} icon`);
  const svg = renderToStaticMarkup(
    React.createElement(Icon, { size: 24, color: GREEN, strokeWidth: 2.25, xmlns: 'http://www.w3.org/2000/svg' })
  );
  await png(`icon-${name}`, svg, 20, 20);
}

console.log(`Email images written to ${path.relative(process.cwd(), out)}`);
