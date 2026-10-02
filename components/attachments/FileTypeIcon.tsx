import React from 'react';

/** The families of file the inquiry forms accept, plus a fallback for anything else. */
export type FileKind = 'pdf' | 'word' | 'excel' | 'image' | 'text' | 'other';

export function fileExtension(name: string) {
  const dot = name.lastIndexOf('.');
  return dot === -1 ? '' : name.slice(dot + 1).toLowerCase();
}

const KIND_BY_EXTENSION: Record<string, FileKind> = {
  pdf: 'pdf',
  doc: 'word', docx: 'word', odt: 'word', rtf: 'word',
  xls: 'excel', xlsx: 'excel', csv: 'excel',
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', bmp: 'image', tif: 'image', tiff: 'image', webp: 'image',
  txt: 'text',
};

export function fileKind(name: string): FileKind {
  return KIND_BY_EXTENSION[fileExtension(name)] ?? 'other';
}

// The colours people know these formats by: Acrobat red, Word blue, Excel green.
const KINDS: Record<FileKind, { name: string; color: string; tint: string }> = {
  pdf: { name: 'PDF', color: '#e2231a', tint: '#fde4e3' },
  word: { name: 'Word', color: '#2b579a', tint: '#e1e9f5' },
  excel: { name: 'Excel', color: '#217346', tint: '#dff0e6' },
  image: { name: 'Image', color: '#7b4fd6', tint: '#ece5fb' },
  text: { name: 'Text', color: '#5b6573', tint: '#e8ebef' },
  other: { name: 'File', color: '#6e675a', tint: '#efece6' },
};

/** "PDF", "Word", "Excel", "Image"… for a line of text about the file. */
export function fileKindLabel(name: string) {
  const kind = fileKind(name);
  return kind === 'excel' && fileExtension(name) === 'csv' ? 'CSV' : KINDS[kind].name;
}

/** A document page with a folded corner and the file's extension on a band in its format's colour. */
export function FileTypeIcon({ name, size = 40 }: { name: string; size?: number }) {
  const { color, tint } = KINDS[fileKind(name)];
  const label = (fileExtension(name) || 'file').toUpperCase().slice(0, 4);
  const bandWidth = label.length > 3 ? 33 : 28;
  return (
    <svg
      width={size * 0.83}
      height={size}
      viewBox="0 0 40 48"
      fill="none"
      aria-hidden="true"
      className="file-type-icon"
    >
      <path
        d="M8 1.5h19.5L38.5 12.5V44a2.5 2.5 0 0 1-2.5 2.5H8A2.5 2.5 0 0 1 5.5 44V4A2.5 2.5 0 0 1 8 1.5Z"
        fill="#fff"
        stroke="#d9d4ca"
      />
      <path d="M27.5 1.5V10a2.5 2.5 0 0 0 2.5 2.5h8.5" fill={tint} stroke="#d9d4ca" />
      <rect x="1" y="24" width={bandWidth} height="14" rx="3" fill={color} />
      <text
        x={1 + bandWidth / 2}
        y="34.2"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize={label.length > 3 ? 8 : 9}
        fontWeight="700"
        fill="#fff"
      >
        {label}
      </text>
    </svg>
  );
}
