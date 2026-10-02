'use client';

import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';
import { FileTypeIcon, fileKindLabel } from './FileTypeIcon';
import { FilePreview, formatFileSize } from './FilePreview';

/**
 * A chosen attachment on an inquiry form: the file's format icon, name and size. Clicking it
 * opens a preview of the file; × takes it off the form.
 */
export function AttachmentCard({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [previewing, setPreviewing] = useState(false);

  return (
    <>
      <div className="att-card">
        <button
          type="button"
          onClick={() => setPreviewing(true)}
          className="att-open"
          aria-label={`Preview ${file.name}`}
        >
          <FileTypeIcon name={file.name} size={38} />
          <span className="att-meta">
            <span className="att-name" title={file.name}>
              {file.name}
            </span>
            <span className="att-sub">
              {fileKindLabel(file.name)} · {formatFileSize(file.size)} · Click to preview
            </span>
          </span>
          <Eye className="att-eye" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="att-remove"
          aria-label={`Remove the attached file ${file.name}`}
        >
          <X aria-hidden="true" />
        </button>
      </div>
      {previewing && <FilePreview file={file} onClose={() => setPreviewing(false)} />}
    </>
  );
}
