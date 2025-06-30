import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(HttpApi) // For loading translations from files/server
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    supportedLngs: ['en', 'hi'], // Supported languages
    fallbackLng: 'en', // Fallback language
    debug: process.env.NODE_ENV === 'development', // Enable debug logs in dev mode
    ns: ['translation'], // Default namespace
    defaultNS: 'translation',
    detection: {
      // Order and from where user language should be detected
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      // Keys or params to lookup language from
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      // Caches detected language in
      caches: ['localStorage', 'cookie'],
      excludeCacheFor: ['cimode'], // Languages to not persist (e.g., 'cimode' for development)
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to translation files
    },
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
    react: {
      useSuspense: true, // Enable React Suspense for loading translations
    }
  });

export default i18n;
