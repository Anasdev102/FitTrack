import React from 'react';
export default function EmptyState({ title = 'No data yet' }) {
  return <div className="panel p-8 text-center text-sm text-muted">{title}</div>;
}
