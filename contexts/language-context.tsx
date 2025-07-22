// contexts/language-context.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

type Translations = { [key: string]: string };

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("language");
      // 만약 로컬 스토리지에 'en'이 아닌 다른 언어 (예: 'ko', 'ru')가 저장되어 있다면,
      // 첫 로드 시에는 'en'으로 강제합니다.
      // 하지만 'en'이 저장되어 있거나 아무것도 저장되어 있지 않다면 'en'으로 시작합니다.
      if (storedLang && storedLang !== "en") {
        console.log(`LOG: Stored language '${storedLang}' found, but forcing initial language to 'en'.`);
        return "en";
      }
      console.log(`LOG: Initial language state from localStorage: ${storedLang || 'none'}, defaulting to 'en'.`);
      return storedLang || "en"; // 'en'이거나 저장된 언어가 없으면 'en'으로 시작
    }
    console.log("LOG: Initial language state (server-side/no window): en");
    return "en";
  });
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);

  const loadTranslations = useCallback(async (lang: string) => {
    console.log(`LOG: Attempting to load translations for: ${lang}`);
    setLoading(true);
    try {
      if (lang !== 'en') {
        console.log(`LOG: Fetching translation file from public directory: /translations/${lang}.json`);
        const response = await fetch(`/translations/${lang}.json`); // public 폴더의 루트를 기준으로 경로 설정

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for /translations/${lang}.json`);
        }
        const langTranslations = await response.json();
        
        setTranslations(langTranslations);
        console.log(`LOG: Successfully loaded translations for ${lang}. Keys count: ${Object.keys(langTranslations).length}`);
      } else {
        console.log("LOG: Language is 'en', clearing translations.");
        setTranslations({});
      }
    } catch (error) {
      console.error(`LOG: Failed to load translations for ${lang}:`, error);
      setTranslations({});
      setLanguageState("en");
      console.log(`LOG: Translation load failed, reverted to 'en' language.`);
    } finally {
      setLoading(false);
      console.log(`LOG: Translation loading finished for ${lang}.`);
    }
  }, []);

  useEffect(() => {
    console.log(`LOG: useEffect triggered. Current language: ${language}. Calling loadTranslations...`);
    loadTranslations(language);
  }, [language, loadTranslations]);

  const setLanguage = (lang: string) => {
    console.log(`LOG: setLanguage called with: ${lang}. Current language: ${language}`);
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
      console.log(`LOG: language stored in localStorage: ${lang}`);
    }
  };

  const t = useCallback(
    (key: string): string => {
      const translatedValue = translations[key];
      return translatedValue || key;
    },
    [translations]
  );

  const value = {
    language,
    setLanguage,
    t,
  };

  if (loading) {
    console.log("LOG: Rendering 'Loading translations...'");
    return <div>Loading translations...</div>;
  }

  console.log("LOG: LanguageProvider rendering children.");
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};