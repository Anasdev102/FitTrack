import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LoadingSpinner({ label = 'Loading...', className = '' }) {
  const { t } = useTranslation();
  const displayLabel = label === 'Loading...' ? `${t('common.loading')}...` : label;

  return (
    <div className={`flex items-center justify-center gap-3 text-sm font-bold text-muted ${className}`} role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span>{displayLabel}</span>
    </div>
  );
}
