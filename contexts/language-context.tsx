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
      return localStorage.getItem("language") || "en";
    }
    return "en";
  });
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);

  // 언어팩 로드 함수
  const loadTranslations = useCallback(async (lang: string) => {
    try {
      // 'en'이 기본 언어이고 별도의 en.json 파일이 없으므로, 'en'일 때는 번역을 로드하지 않습니다.
      // 다른 언어일 경우에만 해당 언어의 json 파일을 로드합니다.
      if (lang !== 'en') { // 재변경됨: 'en'이 아닐 때만 번역 파일 로드
        const { default: langTranslations } = await import(
          `@/lib/translations/${lang}.json`
        );
        setTranslations(langTranslations);
      } else { // 재변경됨: 'en'일 경우 번역을 비워둠 (t 함수에서 키 자체를 반환하도록)
        setTranslations({});
      }
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      // 번역 파일 로드 실패 시, translations를 비워두어 t() 함수가 키를 그대로 반환하도록 합니다.
      setTranslations({}); // 재변경됨: 로드 실패 시 translations를 비워둠
      setLanguageState("en"); // 재변경됨: 언어 설정도 English로 (옵션)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTranslations(language);
  }, [language, loadTranslations]);

  // 언어 변경 함수
  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  // 번역 함수
  const t = useCallback(
    (key: string): string => {
      return translations[key] || key; // 번역이 없으면 키 자체를 반환 (영어 기본값 역할)
    },
    [translations]
  );

  const value = {
    language,
    setLanguage,
    t,
  };

  // 로딩 중이거나 번역이 없을 경우 빈 값 또는 로딩 인디케이터를 렌더링할 수 있습니다.
  // 이 예제에서는 단순히 children을 렌더링하여 컨텐츠가 표시되도록 합니다.
  if (loading) {
    return <div>Loading translations...</div>; // 필요에 따라 로딩 스피너 등 추가 가능
  }

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