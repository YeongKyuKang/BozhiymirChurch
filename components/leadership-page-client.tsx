"use client"; // 이 파일은 클라이언트 컴포넌트임을 명시합니다.

import * as React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase"; // 클라이언트 컴포넌트에서 DB 업데이트를 위해 필요
import { Button } from "@/components/ui/button";
import { Settings, Save, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import EditableText from "@/components/editable-text"; // EditableText는 클라이언트 컴포넌트입니다.
import { Book, Cross, Users, Globe, Heart, DotIcon as Dove } from "lucide-react"; // 아이콘들 추가

// Props 인터페이스 정의
interface BeliefsPageClientProps {
  initialContent: Record<string, any>;
}

export default function BeliefsPageClient({ initialContent }: BeliefsPageClientProps) {
  const { userRole } = useAuth();
  const [isPageEditing, setIsPageEditing] = useState(false); // 페이지 전체 편집 모드 상태
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({}); // 변경된 내용을 추적하는 상태
  const [isSavingAll, setIsSavingAll] = useState(false);

  // EditableText 컴포넌트로부터 변경사항을 받을 콜백 함수
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
          page: 'beliefs',
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.error(`Error updating content for ${section}.${key}:`, error);
        } else {
          updateCount++;
        }
      }
    }

    if (updateCount > 0) {
      try {
        // NEXT_PUBLIC_MY_SECRET_TOKEN은 Vercel 환경 변수에 설정되어야 합니다.
        const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/beliefs`);
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json();
          console.error("Revalidation failed:", errorData.message);
        } else {
          revalidated = true;
          console.log("Page revalidated successfully!");
        }
      } catch (err) {
        console.error("Failed to call revalidate API:", err);
      }
    }

    setIsSavingAll(false);
    setIsPageEditing(false); // 저장 완료 후 편집 모드 종료
    setChangedContent({}); // 변경 사항 초기화

    if (updateCount > 0 && revalidated) {
      alert("모든 변경 사항이 저장되고 페이지가 업데이트되었습니다. 새로고침하면 반영됩니다.");
    } else if (updateCount > 0 && !revalidated) {
        alert("일부 변경 사항은 저장되었지만, 페이지 재검증에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.");
    } else {
        alert("변경된 내용이 없거나 저장에 실패했습니다.");
    }
  };

  const handleCancelAll = () => {
    if (confirm("모든 변경 사항을 취소하시겠습니까?")) {
      setChangedContent({}); // 변경 사항 초기화
      setIsPageEditing(false); // 편집 모드 종료
    }
  };

  const beliefs = [
    {
      icon: <Book className="h-8 w-8 text-blue-600" />,
      titleKey: "bible_title",
      descriptionKey: "bible_description",
    },
    {
      icon: <Cross className="h-8 w-8 text-red-600" />,
      titleKey: "jesus_title",
      descriptionKey: "jesus_description",
    },
    {
      icon: <Dove className="h-8 w-8 text-green-600" />,
      titleKey: "holyspirit_title",
      descriptionKey: "holyspirit_description",
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-600" />,
      titleKey: "love_title",
      descriptionKey: "love_description",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      titleKey: "community_title",
      descriptionKey: "community_description",
    },
    {
      icon: <Globe className="h-8 w-8 text-orange-600" />,
      titleKey: "mission_title",
      descriptionKey: "mission_description",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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

      {/* Hero Section */}
      <section className="py-16 px-4 pt-32">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <EditableText
                  page="beliefs"
                  section="main"
                  contentKey="title"
                  initialValue={initialContent?.main?.title}
                  isEditingPage={isPageEditing} // 편집 모드 전달
                  onContentChange={handleContentChange} // 변경 콜백 전달
                  tag="span"
                  className="text-5xl font-bold text-gray-900"
              />
          </h1>
          {/* <p> 태그를 <div>로 변경 */}
          <div className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              <EditableText
                  page="beliefs"
                  section="main"
                  contentKey="description"
                  initialValue={initialContent?.main?.description}
                  isEditingPage={isPageEditing}
                  onContentChange={handleContentChange}
                  tag="span"
                  className="text-xl text-gray-600"
              />
          </div>
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Beliefs Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beliefs.map((belief, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-600"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {belief.icon}
                    <h3 className="text-xl font-bold text-gray-900 ml-3">
                      <EditableText page="beliefs" section="grid_items" contentKey={belief.titleKey} initialValue={initialContent?.grid_items?.[belief.titleKey]} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="ml-0" />
                    </h3>
                  </div>
                  {/* <p> 태그를 <div>로 변경 */}
                  <div className="text-gray-600 leading-relaxed">
                      <EditableText page="beliefs" section="grid_items" contentKey={belief.descriptionKey} initialValue={initialContent?.grid_items?.[belief.descriptionKey]} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-gray-600 leading-relaxed" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Scripture Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
              <EditableText page="beliefs" section="scripture" contentKey="scripture_title" initialValue={initialContent?.scripture?.scripture_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-white" />
          </h2>
          <blockquote className="text-2xl italic mb-6 max-w-4xl mx-auto">
              <EditableText page="beliefs" section="scripture" contentKey="scripture_quote" initialValue={initialContent?.scripture?.scripture_quote} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-2xl italic" isTextArea={true} />
          </blockquote>
          {/* <p> 태그를 <div>로 변경 */}
          <div className="text-xl opacity-90">
              <EditableText page="beliefs" section="scripture" contentKey="scripture_reference" initialValue={initialContent?.scripture?.scripture_reference} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-xl opacity-90" />
          </div>
        </div>
      </section>

      {/* Ukrainian Ministry Connection */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-blue-500 to-yellow-400 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                  <EditableText page="beliefs" section="ministry_connection" contentKey="ministry_title" initialValue={initialContent?.ministry_connection?.ministry_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold" />
              </h2>
              {/* <p> 태그를 <div>로 변경 */}
              <div className="text-xl mb-6 opacity-90">
                  <EditableText page="beliefs" section="ministry_connection" contentKey="ministry_description" initialValue={initialContent?.ministry_connection?.ministry_description} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-xl opacity-90" />
              </div>
              <div className="flex justify-center space-x-4">
                <span className="text-2xl">🇺🇦</span>
                <span className="text-2xl">❤️</span>
                <span className="text-2xl">🙏</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
              <EditableText page="beliefs" section="cta" contentKey="cta_title" initialValue={initialContent?.cta?.cta_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold text-gray-900" />
          </h2>
          {/* <p> 태그를 <div>로 변경 */}
          <div className="text-xl text-gray-600 mb-8">
              <EditableText page="beliefs" section="cta" contentKey="cta_description" initialValue={initialContent?.cta?.cta_description} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-xl text-gray-600" />
          </div>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/join">Visit Us</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}