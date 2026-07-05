import React from 'react';
export default function Input({ label, className = '', labelClassName = '', ...props }) {
  return (
    <label className={`grid gap-2 text-xs font-bold text-slate-700 ${labelClassName}`}>
      {label}
      <input className={`premium-input rounded px-3.5 py-3 text-sm font-medium outline-none ring-primary/15 transition placeholder:text-slate-400 focus:border-primary focus:ring-4 ${className}`} {...props} />
    </label>
  );
}
