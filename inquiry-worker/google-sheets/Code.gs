/**
 * Bishnoi Omniverse — inquiry log.
 *
 * Paste this into the Google Sheet's Apps Script editor (Extensions → Apps Script) and deploy it as
 * a web app. The inquiry Worker (../src/index.js) POSTs one inquiry at a time here after it has
 * emailed it, and this appends it as a row. Full setup: docs/inquiries.md, "Google Sheets log".
 *
 * Each form gets a tab of its own, named after its inquiry type ("Hospital Requisition",
 * "Institutional Supply", …), created the first time that form is used. Columns are created the
 * same way: a field the tab has not seen before becomes a new column at the end, so adding a field
 * to a form on the website needs no change here, and columns can be reordered by hand freely.
 */

/**
 * Must match the Worker's SHEETS_WEBHOOK_SECRET. Set it in Project Settings → Script properties as
 * WEBHOOK_SECRET rather than in this file, so the code can be shared without the secret.
 */
function webhookSecret_() {
  return PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET') || '';
}

/** Tabs are named after the inquiry type; the rest are cut or replaced to suit Sheets' rules. */
function tabName_(value) {
  var name = String(value || 'Other').replace(/[\[\]\*\?\/\\:]/g, ' ').trim().slice(0, 90);
  return name || 'Other';
}

/**
 * A value that starts with = + - or @ would be read by Sheets as a formula, and one that starts
 * with a digit as a number (dropping the leading 0 of a phone number like 0919…). Visitors type
 * these fields, so they are stored as plain text; the leading apostrophe does not show in the cell.
 */
function asText_(value) {
  var text = String(value == null ? '' : value);
  return /^[=+\-@0-9]/.test(text) ? "'" + text : text;
}

function reply_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply_({ ok: false, error: 'invalid body' });
  }

  var secret = webhookSecret_();
  if (!secret || payload.secret !== secret) {
    return reply_({ ok: false, error: 'unauthorised' });
  }

  // [[label, value], …] in the order the columns should first appear.
  var record = Array.isArray(payload.record) ? payload.record : [];
  if (record.length === 0) return reply_({ ok: false, error: 'empty record' });

  // Two inquiries arriving together must not both add the same new column or tab.
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var book = SpreadsheetApp.getActiveSpreadsheet();
    var name = tabName_(payload.tab);
    var sheet = book.getSheetByName(name);
    if (!sheet) {
      sheet = book.insertSheet(name);
      sheet.setFrozenRows(1);
    }

    var lastColumn = sheet.getLastColumn();
    var headers = lastColumn > 0 ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(String) : [];

    var added = [];
    record.forEach(function (pair) {
      var label = String(pair[0]);
      if (headers.indexOf(label) === -1 && added.indexOf(label) === -1) added.push(label);
    });
    if (added.length > 0) {
      sheet.getRange(1, headers.length + 1, 1, added.length).setValues([added]).setFontWeight('bold');
      headers = headers.concat(added);
    }

    var row = headers.map(function () { return ''; });
    record.forEach(function (pair) {
      row[headers.indexOf(String(pair[0]))] = asText_(pair[1]);
    });
    // The time is stamped here, in the spreadsheet's own time zone (File → Settings).
    row[headers.indexOf('Received')] = new Date();

    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }

  return reply_({ ok: true });
}
