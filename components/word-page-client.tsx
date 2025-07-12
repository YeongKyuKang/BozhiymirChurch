// components/word-page-client.tsx
"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile"; // useIsMobile 훅 임포트
import dynamic from 'next/dynamic'; // dynamic 임포트

// PC 및 모바일 컴포넌트 동적 임포트 (SSR 비활성화)
const WordPageDesktop = dynamic(() => import("./word-page-desktop"), { ssr: false });
const WordPageMobile = dynamic(() => import("./word-page-mobile"), { ssr: false });

interface WordPageClientProps {
  initialContent: Record<string, any>;
  initialWordPosts: any[]; // WordPost 타입은 하위 컴포넌트에서 정의하므로 여기서는 any로 둡니다.
}

export default function WordPageClient({ initialContent, initialWordPosts }: WordPageClientProps) {
  const isMobile = useIsMobile(); // 모바일 여부 감지 훅 사용

  // isMobile이 undefined일 때 (초기 렌더링 시점) 로딩 상태를 표시하거나,
  // isMobile이 true/false로 결정되면 해당 컴포넌트를 렌더링합니다.
  if (isMobile === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p> {/* 또는 스켈레톤 컴포넌트 */}
      </div>
    );
  }

  return (
    <>
      {isMobile ? (
        <WordPageMobile initialContent={initialContent} initialWordPosts={initialWordPosts} />
      ) : (
        <WordPageDesktop initialContent={initialContent} initialWordPosts={initialWordPosts} />
      )}
    </>
  );
}
