import React from 'react';
export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="panel w-full max-w-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button className="rounded-md px-2 py-1 text-muted hover:bg-slate-100" onClick={onClose}>x</button>
        </div>
        {children}
      </div>
    </div>
  );
}
