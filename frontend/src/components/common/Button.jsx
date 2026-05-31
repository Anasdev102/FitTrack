import React from 'react';
export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const styles = {
    primary: 'bg-primary text-white shadow-lg shadow-orange-600/20 hover:bg-orange-600',
    secondary: 'bg-ink text-white shadow-lg shadow-black/20 hover:bg-black',
    ghost: 'bg-white text-ink border border-black/10 hover:border-primary hover:text-primary',
  };

  return (
    <button className={`inline-flex items-center justify-center gap-2 rounded px-4 py-2.5 text-sm font-black uppercase tracking-wide transition hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
