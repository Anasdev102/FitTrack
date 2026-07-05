import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import fr from './fr.json';
import en from './en.json';
import ar from './ar.json';

export const supportedLanguages = [
  { code: 'en', label: 'EN', name: 'English' },
];

export const getLanguageDirection = (language) => (language?.startsWith('ar') ? 'rtl' : 'ltr');

const applyDocumentLanguage = (language) => {
  const currentLanguage = language || 'en';
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = getLanguageDirection(currentLanguage);
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: 'fitmanager_language',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
  });

applyDocumentLanguage(i18n.language);

i18n.on('languageChanged', (language) => {
  localStorage.setItem('fitmanager_language', 'en');
  applyDocumentLanguage(language);
});

export default i18n;
