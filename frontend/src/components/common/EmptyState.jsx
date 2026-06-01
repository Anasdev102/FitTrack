import React from 'react';
export default function EmptyState({ title = 'No data yet', description, action }) {
  return (
    <div className="panel p-8 text-center">
      <p className="text-sm font-black uppercase tracking-wide text-ink">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
