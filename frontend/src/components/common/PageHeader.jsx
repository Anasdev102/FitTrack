import React from 'react';

export default function PageHeader({ kicker, title, description, action, className = '' }) {
  return (
    <div className={`flex flex-col justify-between gap-4 md:flex-row md:items-end ${className}`}>
      <div>
        {kicker && <p className="section-kicker">{kicker}</p>}
        <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
