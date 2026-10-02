# bishnoi-inquiry (Cloudflare Worker)

Receives the website's inquiry forms and emails them through Brevo, and optionally records each one
in a Google Sheet (`google-sheets/Code.gs`). The website is a static
export on GitHub Pages, so this Worker plays the part `api/inquiry.php` plays on the Getmeds sites.

Full setup, testing and troubleshooting: [`../docs/inquiries.md`](../docs/inquiries.md).

```bash
cd inquiry-worker
npm install
npx wrangler login
npx wrangler secret put BREVO_API_KEY            # and the other secrets listed in the docs
npm run deploy                                    # prints the endpoint URL
npm run tail                                      # live logs: look for [bishnoi-inquiry] lines
```

## The email's look

`src/email-template.js` builds the HTML email: the letterhead with the logo and corner swooshes, the
details card with an icon on each row, then the message, attached files and sign-off. It is laid out
with tables and inline styles, because Gmail drops SVG and most CSS.

The logo, swooshes and icons are PNGs in `src/email-assets/`. They are bundled into the Worker (the
`[[rules]]` block in `wrangler.toml`) and served by it at `/email/<name>.png`, so the email's images
always deploy with the template. To change a colour or an icon, edit
`scripts/build-email-assets.mjs` and run it from this folder (it needs the website's own
`npm install` too, for the icon set):

    node scripts/build-email-assets.mjs

The image links point at this Worker's own address. To host them somewhere else, set
`EMAIL_ASSET_BASE` (in `[vars]`) to the folder's URL, e.g. `https://bishnoiomniverse.com/email`.
