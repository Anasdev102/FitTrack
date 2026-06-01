import React from 'react';

export default function LoadingSpinner({ label = 'Loading...', className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-sm font-bold text-muted ${className}`} role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}
