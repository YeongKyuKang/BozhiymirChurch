'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

type Language = 'ko' | 'en' | 'uk';

type Translations = {
  [key: string]: string;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en'); // 초기 언어는 'en'으로 설정합니다.
  const [translations, setTranslations] = useState<Translations>({});

  // 이 useEffect 훅이 핵심입니다.
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    let initialLang: Language = 'en';
    if (savedLanguage && (savedLanguage === 'ko' || savedLanguage === 'uk')) {
      initialLang = savedLanguage as Language;
    }
    setLanguageState(initialLang);

    if (initialLang !== 'en') {
      loadTranslations(initialLang);
    }

  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    if (lang !== 'en') {
      loadTranslations(lang);
    } else {
      setTranslations({});
    }
  };

  const loadTranslations = async (lang: Language) => {
    try {
      const response = await fetch(`/translations/${lang}.json`);
      if (!response.ok) {
        throw new Error('Translations not found');
      }
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error('Failed to load translations:', error);
      setTranslations({});
    }
  };

  const t = (key: string) => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}