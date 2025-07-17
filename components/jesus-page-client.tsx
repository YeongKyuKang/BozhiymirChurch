// components/jesus-page-client.tsx
"use client"; // 변경됨: "use client" 지시어 추가

import * as React from "react";
import { useLanguage } from "@/contexts/language-context";
import EditableText from "@/components/editable-text";
import { Database } from "@/lib/supabase"; // Database 타입 임포트
import { Loader2 } from "lucide-react"; // 로딩 스피너 아이콘
import { useContent } from "@/hooks/use-content"; // useContent 훅 추가

interface JesusPageClientProps {
  initialContent: Record<string, any>;
  authHeader?: string | null; // SSR에서 인증 헤더를 받기 위함
}

export default function JesusPageClient({ initialContent, authHeader }: JesusPageClientProps) {
  const { language } = useLanguage(); // useLanguage 훅 사용
  const [content, setContent] = React.useState(initialContent);
  const [isEditingPage, setIsEditingPage] = React.useState(false); // 관리자 편집 모드 상태
  const [isLoadingContent, setIsLoadingContent] = React.useState(false); // 콘텐츠 로딩 상태
  const [errorContent, setErrorContent] = React.useState<string | null>(null); // 콘텐츠 에러 상태

  // useContent 훅을 사용하여 페이지 콘텐츠 관리
  // JesusPageClient가 Server Component로 콘텐츠를 미리 가져오므로, 여기서는 편집 모드에서만 사용하도록 조정
  // 또는 모든 콘텐츠를 useContent로 관리하도록 설계 변경 고려
  // 현재는 initialContent를 받아오므로, 여기서는 EditableText에서 useContent를 사용하도록 유지
  // 여기서는 단순히 useLanguage만 사용해도 충분함

  const handleContentChange = (section: string, key: string, value: string) => {
    setContent(prevContent => ({
      ...prevContent,
      [section]: {
        ...prevContent[section],
        [key]: value,
      },
    }));
  };

  // 콘텐츠 로딩 상태를 표시
  if (isLoadingContent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  // 오류 메시지 표시
  if (errorContent) {
    return (
      <div className="text-center text-red-600 mt-20">
        <p>Error loading content: {errorContent}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: `url('/path/to/jesus-hero.jpg')` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center leading-tight">
            <EditableText
              page="jesus"
              section="hero"
              contentKey="title"
              initialValue={content?.hero?.title || "Jesus Christ"}
              isEditingPage={isEditingPage}
              onContentChange={handleContentChange}
              tag="span"
              className="text-4xl md:text-6xl font-bold leading-tight"
            />
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg mx-auto text-gray-800">
          <EditableText
            page="jesus"
            section="main"
            contentKey="introduction"
            initialValue={content?.main?.introduction || "Explore the life, teachings, and significance of Jesus Christ."}
            isEditingPage={isEditingPage}
            onContentChange={handleContentChange}
            tag="div" // Allowing div for richer content
            className="text-gray-800"
            isTextArea={true}
          />
          
          <h2 className="text-3xl font-bold mt-10 mb-4">
            <EditableText
              page="jesus"
              section="teachings"
              contentKey="title"
              initialValue={content?.teachings?.title || "His Teachings"}
              isEditingPage={isEditingPage}
              onContentChange={handleContentChange}
              tag="span"
              className="text-3xl font-bold"
            />
          </h2>
          <EditableText
            page="jesus"
            section="teachings"
            contentKey="description"
            initialValue={content?.teachings?.description || "Jesus's teachings emphasize love, compassion, forgiveness, and the Kingdom of God. His parables offer timeless wisdom for daily life."}
            isEditingPage={isEditingPage}
            onContentChange={handleContentChange}
            tag="div"
            className="text-gray-800"
            isTextArea={true}
          />

          <h2 className="text-3xl font-bold mt-10 mb-4">
            <EditableText
              page="jesus"
              section="significance"
              contentKey="title"
              initialValue={content?.significance?.title || "Significance for Humanity"}
              isEditingPage={isEditingPage}
              onContentChange={handleContentChange}
              tag="span"
              className="text-3xl font-bold"
            />
          </h2>
          <EditableText
            page="jesus"
            section="significance"
            contentKey="description"
            initialValue={content?.significance?.description || "For billions worldwide, Jesus Christ is the central figure of their faith, offering hope, redemption, and eternal life."}
            isEditingPage={isEditingPage}
            onContentChange={handleContentChange}
            tag="div"
            className="text-gray-800"
            isTextArea={true}
          />
        </div>
      </main>
    </div>
  );
}