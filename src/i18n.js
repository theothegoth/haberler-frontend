import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationTR from './locales/tr.json';

// Translation resources
const resources = {
  en: {
    translation: translationEN
  },
  tr: {
    translation: translationTR
  }
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    resources,
    fallbackLng: 'tr', // Default language if detection fails
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false // React already protects from XSS
    },
    react: {
      useSuspense: false
    }
  });

// Override language based on browser setting
const browserLang = navigator.language || navigator.userLanguage;
const savedLang = localStorage.getItem('i18nextLng');

if (!savedLang) {
  // First time visitor - detect from browser
  if (browserLang.startsWith('tr')) {
    i18n.changeLanguage('tr');
  } else {
    i18n.changeLanguage('en');
  }
}

export default i18n;
