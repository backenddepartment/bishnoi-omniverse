// Minimal RFC 4180 CSV reader/writer. Google Sheets' "publish to web" CSV export is standard
// RFC 4180, so no dependency is needed: quoted fields, embedded commas and newlines, and ""
// escapes are all handled below.

/**
 * Parses CSV text into an array of row arrays. Handles quoted fields containing commas,
 * newlines and doubled quotes. Normalises CRLF and strips a leading BOM.
 */
export function parseCsv(text) {
  const input = text.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (quoted) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  // Trailing field / row, unless the file simply ended with a newline.
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

/**
 * Parses CSV into objects keyed by the header row. Header names are trimmed and matched
 * case-insensitively, so "Product ID" in the sheet reaches the script as `product id`.
 * Rows where every cell is blank are dropped.
 */
export function parseCsvRecords(text) {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];

  const headers = rows[0].map((h) => h.trim().toLowerCase());

  return rows
    .slice(1)
    .filter((cells) => cells.some((cell) => cell.trim() !== ''))
    .map((cells, idx) => {
      const record = { __row: idx + 2 }; // 1-based, +1 for the header — matches the sheet's gutter
      headers.forEach((header, col) => {
        if (header) record[header] = (cells[col] ?? '').trim();
      });
      return record;
    });
}

/** Quotes a single CSV field only when it needs it. */
function quoteField(value) {
  const str = value == null ? '' : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

/** Serialises an array of objects to CSV text using the given column order. */
export function toCsv(headers, records) {
  const lines = [headers.map(quoteField).join(',')];
  for (const record of records) {
    lines.push(headers.map((header) => quoteField(record[header])).join(','));
  }
  return lines.join('\n') + '\n';
}
