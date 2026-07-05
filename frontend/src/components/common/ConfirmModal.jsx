import React, { useEffect } from 'react';
import { AlertTriangle, Info, ShieldAlert, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from './Button';

const variants = {
  warning: {
    icon: AlertTriangle,
    iconClass: 'bg-orange-100 text-primary',
    confirmVariant: 'primary',
  },
  danger: {
    icon: ShieldAlert,
    iconClass: 'bg-red-100 text-red-600',
    confirmVariant: 'primary',
  },
  info: {
    icon: Info,
    iconClass: 'bg-slate-100 text-ink',
    confirmVariant: 'secondary',
  },
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  variant = 'warning',
}) {
  const { t } = useTranslation();
  const config = variants[variant] || variants.warning;
  const Icon = config.icon;
  const confirmLabel = confirmText || t('common.confirm');
  const cancelLabel = cancelText || t('common.cancel');

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <button className="absolute inset-0 cursor-default" type="button" onClick={onCancel} aria-label="Close confirmation modal" />

      <div className="relative w-full max-w-md rounded-lg border border-white/10 bg-white p-6 text-center shadow-2xl shadow-black/30 sm:p-7">
        <button
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded bg-slate-100 text-slate-500 transition hover:bg-primary hover:text-white"
          type="button"
          onClick={onCancel}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${config.iconClass}`}>
          <Icon className="h-7 w-7" />
        </div>

        <h2 className="mt-5 text-2xl font-black uppercase tracking-tight text-ink" id="confirm-modal-title">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-muted">{message}</p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Button className="w-full sm:w-auto" variant="ghost" type="button" onClick={onCancel}>{cancelLabel}</Button>
          <Button className="w-full sm:w-auto" variant={config.confirmVariant} type="button" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
