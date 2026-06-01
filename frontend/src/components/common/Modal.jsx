import React from 'react';

function ModalHeader({ title, onClose, children }) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line p-5 sm:p-6">
      <div>
        {children || <h2 className="text-lg font-black uppercase tracking-tight text-ink">{title}</h2>}
      </div>
      <button
        className="grid h-10 w-10 shrink-0 place-items-center rounded bg-slate-100 text-slate-500 transition hover:bg-primary hover:text-white"
        onClick={onClose}
        type="button"
      >
        x
      </button>
    </div>
  );
}

function ModalBody({ children }) {
  return <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:max-h-[70vh] sm:p-6">{children}</div>;
}

function ModalFooter({ children }) {
  return <div className="flex shrink-0 justify-end gap-3 border-t border-line bg-white p-4 sm:p-5">{children}</div>;
}

export default function Modal({ open, title, children, footer, onClose, maxWidth = 'max-w-3xl' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-4">
      <div className={`panel flex max-h-[90vh] w-[95vw] ${maxWidth} flex-col overflow-hidden sm:w-[90vw]`}>
        <ModalHeader title={title} onClose={onClose} />
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </div>
    </div>
  );
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
