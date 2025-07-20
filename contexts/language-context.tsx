// yeongkyukang/bozhiymirchurch/BozhiymirChurch-a6add0b3b500ff96955c66318b3b02ce7b47931a/contexts/language-context.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// 번역 파일을 동적으로 import하기 위한 타입 정의
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
  // 초기 언어 설정: 로컬 스토리지 확인 또는 기본값 'en'
  const [language, setLanguageState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("language");
      // LOG: 초기 언어 설정 시도
      console.log(`LOG: Initial language state from localStorage: ${storedLang || 'none'}, default: en`);
      return storedLang || "en";
    }
    console.log("LOG: Initial language state (server-side/no window): en");
    return "en";
  });
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);

  // 언어팩 로드 함수
  const loadTranslations = useCallback(async (lang: string) => {
    console.log(`LOG: Attempting to load translations for: ${lang}`);
    setLoading(true); // 로딩 시작
    try {
      if (lang !== 'en') {
        console.log(`LOG: Importing translation file: @/lib/translations/${lang}.json`);
        const { default: langTranslations } = await import(
          `@/lib/translations/${lang}.json`
        );
        setTranslations(langTranslations);
        console.log(`LOG: Successfully loaded translations for ${lang}. Keys count: ${Object.keys(langTranslations).length}`);
      } else {
        console.log("LOG: Language is 'en', clearing translations.");
        setTranslations({});
      }
    } catch (error) {
      console.error(`LOG: Failed to load translations for ${lang}:`, error);
      setTranslations({});
      setLanguageState("en"); // 로드 실패 시 언어를 'en'으로 강제 설정 (폴백)
      console.log(`LOG: Translation load failed, reverted to 'en' language.`);
    } finally {
      setLoading(false); // 로딩 완료
      console.log(`LOG: Translation loading finished for ${lang}.`);
    }
  }, []);

  useEffect(() => {
    // LOG: language state 변경 감지, loadTranslations 호출
    console.log(`LOG: useEffect triggered. Current language: ${language}. Calling loadTranslations...`);
    loadTranslations(language);
  }, [language, loadTranslations]);

  // 언어 변경 함수
  const setLanguage = (lang: string) => {
    // LOG: setLanguage 호출
    console.log(`LOG: setLanguage called with: ${lang}. Current language: ${language}`);
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
      console.log(`LOG: language stored in localStorage: ${lang}`);
    }
  };

  // 번역 함수
  const t = useCallback(
    (key: string): string => {
      const translatedValue = translations[key];
      // LOG: t 함수 호출 시 번역 결과
      // console.log(`LOG: t('${key}') -> ${translatedValue || key}`); // 너무 많은 로그가 생성될 수 있으므로 주석 처리
      return translatedValue || key; // 번역이 없으면 키 자체를 반환 (영어 기본값 역할)
    },
    [translations]
  );

  const value = {
    language,
    setLanguage,
    t,
  };

  // 로딩 중이거나 번역이 없을 경우 빈 값 또는 로딩 인디케이터를 렌더링할 수 있습니다.
  if (loading) {
    console.log("LOG: Rendering 'Loading translations...'");
    return <div>Loading translations...</div>; // 필요에 따라 로딩 스피너 등 추가 가능
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