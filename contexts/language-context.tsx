'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

type Language = 'ko' | 'en' | 'ru';

// 1차원 문자열 또는 중첩된 객체 구조를 모두 허용하도록 타입을 수정합니다.
type Translations = {
  [key: string]: any;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadTranslations = async (lang: Language) => {
    try {
      // 경로 앞에 '/'를 붙여 절대 경로로 설정 (public 폴더 기준)
      const response = await fetch(`/translations/${lang}.json`);
      if (!response.ok) throw new Error(`Translations not found for: ${lang}`);
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error('Failed to load translations:', error);
      setTranslations({});
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language || 'en';
    setLanguageState(savedLanguage);
    loadTranslations(savedLanguage).finally(() => setIsLoading(false));
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    await loadTranslations(lang);
  };

  // 계층형 키(home.hero.title)를 지원하는 t 함수
  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations;

    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        // 도중에 값을 못 찾으면 원래 전달받은 key를 그대로 반환
        return key;
      }
    }

    // 최종 결과가 문자열이 아니면 key를 반환하고, 문자열이면 번역문을 반환
    return typeof result === 'string' ? result : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {!isLoading && children}
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
