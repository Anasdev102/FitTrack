import React from 'react';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../../i18n';

export default function LanguageSwitcher({ compact = false, tone = 'dark', className = '' }) {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language?.split('-')[0] || 'en';
  const toneClass = tone === 'light'
    ? 'border-black/10 bg-white text-ink shadow-sm'
    : 'border-white/15 bg-white/10 text-white shadow-lg shadow-black/10 hover:border-primary/50 hover:bg-white/15';

  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <label className={`inline-flex items-center gap-2 rounded border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] backdrop-blur transition duration-300 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 ${toneClass} ${className}`}>
      <Languages className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-primary`} />
      <span className="sr-only">{t('common.language')}</span>
      <select
        className="cursor-pointer bg-transparent text-inherit outline-none"
        value={currentLanguage}
        onChange={handleChange}
        aria-label={t('common.language')}
      >
        {supportedLanguages.map((language) => (
          <option className="bg-white text-ink" key={language.code} value={language.code}>
            {compact ? language.label : language.name}
          </option>
        ))}
      </select>
    </label>
  );
}
