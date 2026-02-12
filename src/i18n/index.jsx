import { createContext, useContext, useState, useCallback } from 'react';
import en from './en';
import si from './si';
import ta from './ta';

const translations = { en, si, ta };

export const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'si', label: 'Sinhala', nativeLabel: 'සිංහල' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
];

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('magnite_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const switchLang = useCallback((code) => {
    setLang(code);
    try {
      localStorage.setItem('magnite_lang', code);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key, replacements) => {
      const keys = key.split('.');
      let value = translations[lang];
      for (const k of keys) {
        value = value?.[k];
      }
      if (value === undefined || value === null) {
        // Fallback to English
        value = translations.en;
        for (const k of keys) {
          value = value?.[k];
        }
      }
      if (typeof value !== 'string') return key;

      // Simple template replacements: {{name}}
      if (replacements) {
        return value.replace(/\{\{(\w+)\}\}/g, (_, k) =>
          replacements[k] !== undefined ? replacements[k] : `{{${k}}}`
        );
      }
      return value;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
