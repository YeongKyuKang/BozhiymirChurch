"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import koTranslations from '@/lib/translations/ko.json';
import ruTranslations from '@/lib/translations/ru.json';

export type Language = 'en' | 'ko' | 'ru';

const translations: Record<string, Record<string, string>> = {
  ko: koTranslations,
  ru: ruTranslations,
};

type TranslationKey = keyof typeof koTranslations | keyof typeof ruTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string): string => {
    if (language === 'en' || !key) return key;
    return translations[language]?.[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
