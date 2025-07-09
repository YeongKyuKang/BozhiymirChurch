"use client";

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Settings, Save, X } from "lucide-react";
import HeroSection from "@/components/hero-section"; // 기존 HeroSection 컴포넌트 import
import CommunitySection from "@/components/community-section"; // 기존 CommunitySection 컴포넌트 import
import MinistriesShowcase from "@/components/ministries-showcase";
import KidsMessageForm from "@/components/kids-message-form";
import { useRouter } from "next/navigation"; // useRouter import for router.refresh()
import { Database } from "@/lib/supabase"; // Database 타입 임포트

interface HomePageClientProps {
  initialContent: Record<string, any>;
}

export default function HomePageClient({ initialContent }: HomePageClientProps) {
  const { userRole } = useAuth();
  const router = useRouter();

  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);

  const handleContentChange = (section: string, key: string, value: string) => {
    setChangedContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value
      }
    }));
  };

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    let updateCount = 0;
    let revalidated = false;

    for (const section in changedContent) {
      for (const key in changedContent[section]) {
        const value = changedContent[section][key];
        const { error } = await supabase.from('content').upsert({
          page: 'home', // 'home' 페이지 지정
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.error(`Error updating content for home.${section}.${key}:`, error);
        } else {
          updateCount++;
        }
      }
    }

    if (updateCount > 0) {
      try {
        const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/`); // 홈페이지는 path가 '/'
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json();
          console.error("Revalidation failed:", errorData.message);
        } else {
          revalidated = true;
          console.log("Homepage revalidated successfully!");
        }
      } catch (err) {
        console.error("Failed to call revalidate API:", err);
      }
    }

    setChangedContent({});
    setIsPageEditing(false);
    setIsSavingAll(false);

    if (updateCount > 0 && revalidated) {
      alert("홈페이지의 모든 변경 사항이 저장되고 업데이트되었습니다. 새로고침하면 반영됩니다.");
    } else if (updateCount > 0 && !revalidated) {
        alert("일부 변경 사항은 저장되었지만, 홈페이지 재검증에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.");
    } else {
        alert("변경된 내용이 없거나 저장에 실패했습니다.");
    }
  };

  const handleCancelAll = () => {
    if (confirm("모든 변경 사항을 취소하시겠습니까?")) {
      setChangedContent({});
      setIsPageEditing(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* 전역 편집 모드 버튼 */}
      {userRole === 'admin' && (
        <div className="fixed top-24 right-8 z-50 flex flex-col space-y-2">
          {!isPageEditing ? (
            <Button variant="outline" size="icon" onClick={() => setIsPageEditing(true)}>
              <Settings className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button variant="outline" size="icon" onClick={handleSaveAll} disabled={isSavingAll}>
                {isSavingAll ? <span className="animate-spin text-blue-500">🔄</span> : <Save className="h-5 w-5 text-green-600" />}
              </Button>
              <Button variant="outline" size="icon" onClick={handleCancelAll} disabled={isSavingAll}>
                <X className="h-5 w-5 text-red-600" />
              </Button>
            </>
          )}
        </div>
      )}

      <HeroSection 
        heroContent={initialContent.hero || {}} 
        isEditingPage={isPageEditing} 
        onContentChange={handleContentChange} 
      />
      <CommunitySection 
        initialContent={initialContent} // CommunitySection은 initialContent를 직접 받음
        isEditingPage={isPageEditing} 
        onContentChange={handleContentChange} 
      />
      <MinistriesShowcase 
        initialContent={initialContent} // MinistriesShowcase에 initialContent 전달
        isEditingPage={isPageEditing} 
        onContentChange={handleContentChange} 
      />
      <KidsMessageForm />
    </div>
  );
}
