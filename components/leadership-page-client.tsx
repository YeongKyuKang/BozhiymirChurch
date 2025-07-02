// yeongkyukang/bozhiymirchurch/BBozhiymirChurch-3007c4235d54890bd3db6acc74558b701965297b/components/leadership-page-client.tsx
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
interface LeadershipPageClientProps {
  initialContent: Record<string, any>;
}

export default function LeadershipPageClient({ initialContent }: LeadershipPageClientProps) {
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
          page: 'leadership', // 'beliefs'에서 'leadership'으로 변경
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
        const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/leadership`); // 경로를 '/leadership'으로 변경
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

  // 'beliefs' 관련 내용을 'leadership'에 맞게 수정 (예시)
  const leadershipPrinciples = [ // 변수명 변경
    {
      icon: <Book className="h-8 w-8 text-blue-600" />,
      titleKey: "vision_title",
      descriptionKey: "vision_description",
    },
    {
      icon: <Cross className="h-8 w-8 text-red-600" />,
      titleKey: "service_title",
      descriptionKey: "service_description",
    },
    {
      icon: <Dove className="h-8 w-8 text-green-600" />,
      titleKey: "integrity_title",
      descriptionKey: "integrity_description",
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-600" />,
      titleKey: "compassion_title",
      descriptionKey: "compassion_description",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      titleKey: "teamwork_title",
      descriptionKey: "teamwork_description",
    },
    {
      icon: <Globe className="h-8 w-8 text-orange-600" />,
      titleKey: "outreach_title",
      descriptionKey: "outreach_description",
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
                  page="leadership" // 'beliefs'에서 'leadership'으로 변경
                  section="main"
                  contentKey="title"
                  initialValue={initialContent?.main?.title}
                  isEditingPage={isPageEditing}
                  onContentChange={handleContentChange}
                  tag="span"
                  className="text-5xl font-bold text-gray-900"
              />
          </h1>
          <div className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              <EditableText
                  page="leadership" // 'beliefs'에서 'leadership'으로 변경
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

      {/* Leadership Principles Grid (이전 Beliefs Grid) */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadershipPrinciples.map((principle, index) => ( // 변수명 변경
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-600"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {principle.icon}
                    <h3 className="text-xl font-bold text-gray-900 ml-3">
                      <EditableText page="leadership" section="grid_items" contentKey={principle.titleKey} initialValue={initialContent?.grid_items?.[principle.titleKey]} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="ml-0" /> {/* 'beliefs'에서 'leadership'으로 변경 */}
                    </h3>
                  </div>
                  <div className="text-gray-600 leading-relaxed">
                      <EditableText page="leadership" section="grid_items" contentKey={principle.descriptionKey} initialValue={initialContent?.grid_items?.[principle.descriptionKey]} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-gray-600 leading-relaxed" /> {/* 'beliefs'에서 'leadership'으로 변경 */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section (이전 Scripture Section) */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
              <EditableText page="leadership" section="core_values" contentKey="values_title" initialValue={initialContent?.core_values?.values_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-white" /> {/* 'beliefs'에서 'leadership'으로 변경, contentKey 변경 */}
          </h2>
          <blockquote className="text-2xl italic mb-6 max-w-4xl mx-auto">
              <EditableText page="leadership" section="core_values" contentKey="values_quote" initialValue={initialContent?.core_values?.values_quote} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-2xl italic" isTextArea={true} /> {/* 'beliefs'에서 'leadership'으로 변경, contentKey 변경 */}
          </blockquote>
          <div className="text-xl opacity-90">
              <EditableText page="leadership" section="core_values" contentKey="values_summary" initialValue={initialContent?.core_values?.values_summary} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-xl opacity-90" /> {/* 'beliefs'에서 'leadership'으로 변경, contentKey 변경 */}
          </div>
        </div>
      </section>

      {/* Leadership Team Connection (이전 Ukrainian Ministry Connection) */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-blue-500 to-yellow-400 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                  <EditableText page="leadership" section="team_connection" contentKey="team_title" initialValue={initialContent?.team_connection?.team_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold" /> {/* 'beliefs'에서 'leadership'으로 변경, contentKey 변경 */}
              </h2>
              <div className="text-xl mb-6 opacity-90">
                  <EditableText page="leadership" section="team_connection" contentKey="team_description" initialValue={initialContent?.team_connection?.team_description} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-xl opacity-90" /> {/* 'beliefs'에서 'leadership'으로 변경, contentKey 변경 */}
              </div>
              <div className="flex justify-center space-x-4">
                <span className="text-2xl">🤝</span>
                <span className="text-2xl">🌟</span>
                <span className="text-2xl">🌱</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
              <EditableText page="leadership" section="cta" contentKey="cta_title" initialValue={initialContent?.cta?.cta_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold text-gray-900" /> {/* 'beliefs'에서 'leadership'으로 변경 */}
          </h2>
          <div className="text-xl text-gray-600 mb-8">
              <EditableText page="leadership" section="cta" contentKey="cta_description" initialValue={initialContent?.cta?.cta_description} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-xl text-gray-600" /> {/* 'beliefs'에서 'leadership'으로 변경 */}
          </div>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/join">Join Our Community</Link>
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