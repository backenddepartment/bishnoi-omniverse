'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, ExternalLink, X } from 'lucide-react';
import { FileTypeIcon, fileExtension, fileKindLabel } from './FileTypeIcon';

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1048576).toFixed(1).replace(/\.0$/, '')} MB`;
}

// A spreadsheet preview is a look at the file, not a viewer for it: big sheets are cut here.
const MAX_ROWS = 300;
const MAX_COLS = 30;

type Cell = string | number | boolean | Date | null | undefined;
type Sheet = { name: string; rows: Cell[][] };

function columnLetter(index: number) {
  let name = '';
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) {
    name = String.fromCharCode(65 + ((n - 1) % 26)) + name;
  }
  return name;
}

/** Splits CSV text into rows, honouring quoted fields (with "" for a quote and line breaks inside). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += ch;
  }
  if (field || row.length) rows.push([...row, field]);
  return rows;
}

// How each extension is shown. Older and less common formats (.doc, .xls, .odt, .rtf) have no
// in-browser renderer, so they get the "can't preview" note; .tif shows only where the browser
// can draw it (Safari).
type Mode = 'pdf' | 'docx' | 'sheet' | 'csv' | 'image' | 'text' | 'none';
const MODE_BY_EXTENSION: Record<string, Mode> = {
  pdf: 'pdf',
  docx: 'docx',
  xlsx: 'sheet',
  csv: 'csv',
  txt: 'text',
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', bmp: 'image', webp: 'image', tif: 'image', tiff: 'image',
};

function cellText(value: Cell) {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toLocaleDateString();
  return String(value);
}

/**
 * Shows an attached file before it is sent. PDFs open in the browser's own viewer; Word and
 * Excel files are drawn on the page by docx-preview and read-excel-file, which load only when a
 * preview of that kind is opened. Rendered into <body> so no modal around it can clip it.
 */
export function FilePreview({ file, onClose }: { file: File; onClose: () => void }) {
  const mode: Mode = MODE_BY_EXTENSION[fileExtension(file.name)] ?? 'none';
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [text, setText] = useState('');
  const [activeSheet, setActiveSheet] = useState(0);
  const docxRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // A local link to the file, for the PDF viewer and the download/open buttons.
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // Freeze the page, start focus on Close, and take Escape before any modal underneath sees it,
  // so it closes this preview and not the form behind it.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const returnFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      onCloseRef.current();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown, true);
      returnFocus?.focus();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const done = (ok: boolean) => !cancelled && setStatus(ok ? 'ready' : 'error');

    if (mode === 'pdf' || mode === 'image') {
      // Drawn by the browser itself; an image that fails to decode reports back through onError.
      done(true);
    } else if (mode === 'docx') {
      import('docx-preview')
        .then(({ renderAsync }) =>
          docxRef.current
            ? renderAsync(file, docxRef.current, undefined, {
                inWrapper: true,
                breakPages: true,
                ignoreLastRenderedPageBreak: true,
              })
            : undefined
        )
        .then(() => done(true), () => done(false));
    } else if (mode === 'sheet') {
      import('read-excel-file/browser')
        .then(({ default: readXlsxFile }) => readXlsxFile(file))
        .then((result) => {
          if (cancelled) return;
          setSheets(result.map((s) => ({ name: s.sheet, rows: s.data as Cell[][] })));
          done(true);
        }, () => done(false));
    } else if (mode === 'csv' || mode === 'text') {
      file.text().then((content) => {
        if (cancelled) return;
        if (mode === 'csv') setSheets([{ name: file.name, rows: parseCsv(content) }]);
        else setText(content.slice(0, 200_000));
        done(true);
      }, () => done(false));
    } else {
      done(false);
    }
    return () => {
      cancelled = true;
    };
  }, [file, mode]);

  const sheet = sheets[activeSheet];
  const sheetCols = sheet ? sheet.rows.reduce((max, r) => Math.max(max, r.length), 0) : 0;
  const colCount = Math.min(MAX_COLS, sheetCols);

  return createPortal(
    <div className="fp-overlay" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="fp-title"
        className="fp-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="fp-head">
          <FileTypeIcon name={file.name} size={34} />
          <div className="fp-head-meta">
            <h3 id="fp-title" title={file.name}>
              {file.name}
            </h3>
            <span>
              {fileKindLabel(file.name)} · {formatFileSize(file.size)}
            </span>
          </div>
          <div className="fp-head-actions">
            {(mode === 'pdf' || mode === 'image') && url && (
              <a href={url} target="_blank" rel="noopener noreferrer" className="fp-action" title="Open in a new tab">
                <ExternalLink aria-hidden="true" />
                <span className="sr-only">Open in a new tab</span>
              </a>
            )}
            {url && (
              <a href={url} download={file.name} className="fp-action" title="Download">
                <Download aria-hidden="true" />
                <span className="sr-only">Download</span>
              </a>
            )}
            <button ref={closeRef} type="button" onClick={onClose} className="fp-action" aria-label="Close preview">
              <X aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className={`fp-body is-${mode}`}>
          {status === 'loading' && <p className="fp-note">Loading preview…</p>}
          {status === 'error' && (
            <p className="fp-note">
              This file can&apos;t be previewed here. It will still be sent with your inquiry.
            </p>
          )}

          {mode === 'pdf' && url && <iframe src={url} title={`Preview of ${file.name}`} className="fp-pdf" />}

          {mode === 'image' && url && status !== 'error' && (
            <div className="fp-image">
              <img src={url} alt={`Preview of ${file.name}`} onError={() => setStatus('error')} />
            </div>
          )}

          {mode === 'text' && status === 'ready' && <pre className="fp-text">{text}</pre>}

          {mode === 'docx' && <div ref={docxRef} className="fp-docx" hidden={status !== 'ready'} />}

          {(mode === 'sheet' || mode === 'csv') && status === 'ready' && sheet && (
            <>
              {sheets.length > 1 && (
                <div className="fp-sheets" role="tablist" aria-label="Sheets">
                  {sheets.map((s, idx) => (
                    <button
                      key={s.name}
                      type="button"
                      role="tab"
                      aria-selected={idx === activeSheet}
                      onClick={() => setActiveSheet(idx)}
                      className={idx === activeSheet ? 'is-active' : ''}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
              {sheet.rows.length === 0 ? (
                <p className="fp-note">This sheet is empty.</p>
              ) : (
                <div className="fp-table-wrap">
                  <table className="fp-table">
                    <thead>
                      <tr>
                        <th aria-hidden="true" />
                        {Array.from({ length: colCount }, (_, c) => (
                          <th key={c}>{columnLetter(c)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sheet.rows.slice(0, MAX_ROWS).map((row, r) => (
                        <tr key={r}>
                          <th>{r + 1}</th>
                          {Array.from({ length: colCount }, (_, c) => (
                            <td key={c}>{cellText(row[c])}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {(sheet.rows.length > MAX_ROWS || sheetCols > MAX_COLS) && (
                <p className="fp-note is-small">
                  Showing the first {Math.min(MAX_ROWS, sheet.rows.length)} rows and {colCount} columns. The
                  whole file will be sent.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
