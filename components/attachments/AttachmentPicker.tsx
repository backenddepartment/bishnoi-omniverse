'use client';

import React, { useState } from 'react';
import { DOCUMENT_ACCEPT, DOCUMENT_HINT, INQUIRY_MAX_FILE_COUNT, addFiles } from '@/lib/inquiry';
import { AttachmentCard } from './AttachmentCard';

interface Props {
  id?: string;
  files: File[];
  onChange: (files: File[]) => void;
  /** Ask for at least one file before the form can be sent. */
  required?: boolean;
  className?: string;
}

/**
 * The file picker on the inquiry forms: several files can be picked at once or one after another,
 * each listed as a card that opens a preview, until the limit is reached.
 */
export function AttachmentPicker({ id, files, onChange, required, className = 'field-input' }: Props) {
  const [error, setError] = useState('');
  const full = files.length >= INQUIRY_MAX_FILE_COUNT;

  return (
    <>
      <input
        id={id}
        type="file"
        multiple
        accept={DOCUMENT_ACCEPT}
        // Only the cards hold the chosen files, so the picker is only required while there are none.
        required={required && files.length === 0}
        onChange={(e) => {
          const result = addFiles(files, Array.from(e.target.files ?? []));
          setError(result.error);
          onChange(result.files);
          // Emptied after every pick, so the next pick adds to the list and the same file can be
          // picked again after it is removed.
          e.target.value = '';
        }}
        className={`${className}${full ? ' att-input-hidden' : ''}`}
      />
      {files.length > 0 && (
        <div className="att-list">
          {files.map((file) => (
            <AttachmentCard
              key={`${file.name}-${file.size}-${file.lastModified}`}
              file={file}
              onRemove={() => {
                setError('');
                onChange(files.filter((f) => f !== file));
              }}
            />
          ))}
        </div>
      )}
      {error && (
        <p className="att-error" role="alert">
          {error}
        </p>
      )}
      <p className="rfq-hint">
        {full ? `${INQUIRY_MAX_FILE_COUNT} of ${INQUIRY_MAX_FILE_COUNT} files attached.` : DOCUMENT_HINT}
      </p>
    </>
  );
}
