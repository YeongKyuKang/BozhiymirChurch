// yeongkyukang/bozhiymirchurch/BozhiymirChurch-3007c4235d54890bd3db6acc74558b701965297b/components/prayer-page-client.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Settings, Save, X, Bookmark } from "lucide-react"; // 아이콘 추가
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import EditableText from "@/components/editable-text";
import { Input } from "@/components/ui/input";
import Link from "next/link"; // Link import 추가

interface PrayerRequest {
  id: string;
  category: "ukraine" | "bozhiymirchurch" | "members" | "children";
  title: string;
  content: string; // 기도제목 내용 (3-6줄)
  author_id: string;
  author_nickname: string;
  created_at: string;
  answer_content?: string | null; // string | null 추가
  answer_author_id?: string | null; // string | null 추가
  answer_author_nickname?: string | null; // string | null 추가
  answered_at?: string | null; // string | null 추가
}

interface PrayerPageClientProps {
  initialContent: Record<string, any>;
  initialPrayerRequests: PrayerRequest[];
}

export default function PrayerPageClient({ initialContent, initialPrayerRequests }: PrayerPageClientProps) {
  const { user, userProfile, userRole } = useAuth();
  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(initialPrayerRequests);
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");

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
          page: 'prayer',
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.error(`Error updating content for prayer.${section}.${key}:`, error);
        } else {
          updateCount++;
        }
      }
    }

    if (updateCount > 0) {
      try {
        const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/prayer`);
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json();
          console.error("Revalidation failed:", errorData.message);
        } else {
          revalidated = true;
          console.log("Prayer page revalidated successfully!");
        }
      } catch (err) {
        console.error("Failed to call revalidate API:", err);
      }
    }

    setIsSavingAll(false);
    setIsPageEditing(false);
    setChangedContent({});

    if (updateCount > 0 && revalidated) {
      alert("모든 변경 사항이 저장되고 기도 페이지가 업데이트되었습니다. 새로고침하면 반영됩니다.");
    } else if (updateCount > 0 && !revalidated) {
        alert("일부 변경 사항은 저장되었지만, 기도 페이지 재검증에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.");
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

  // 응답 받은 내용 편집 시작
  const handleEditAnswer = (prayerId: string, currentAnswerContent: string) => {
    setEditingAnswerId(prayerId);
    setCurrentAnswer(currentAnswerContent);
  };

  // 응답 받은 내용 저장
  const handleSaveAnswer = async (prayerId: string) => {
    if (!user || !userProfile?.id || !userProfile?.nickname) {
      alert("로그인해야 응답을 작성할 수 있습니다.");
      return;
    }

    const { error } = await supabase
      .from('prayer_requests') // 'prayer_requests' 테이블 가정
      .update({
        answer_content: currentAnswer,
        answer_author_id: user.id,
        answer_author_nickname: userProfile.nickname,
        answered_at: new Date().toISOString()
      })
      .eq('id', prayerId);

    if (error) {
      console.error("Error saving answer:", error.message);
      alert(`응답 저장 중 오류 발생: ${error.message}`);
    } else {
      setPrayerRequests(prev =>
        prev.map(req =>
          req.id === prayerId
            ? { 
                ...req, 
                answer_content: currentAnswer, 
                answer_author_id: user.id, 
                answer_author_nickname: userProfile.nickname, 
                answered_at: new Date().toISOString() 
              }
            : req
        )
      );
      setEditingAnswerId(null);
      setCurrentAnswer("");
      alert("응답이 성공적으로 저장되었습니다!");
    }
  };

  // 응답 받은 내용 취소
  const handleCancelAnswer = () => {
    setEditingAnswerId(null);
    setCurrentAnswer("");
  };

  const prayerCategories = [
    { key: "ukraine", titleKey: "ukraine_title", descriptionKey: "ukraine_description", icon: "🇺🇦" },
    { key: "bozhiymirchurch", titleKey: "church_title", descriptionKey: "church_description", icon: "⛪" },
    { key: "members", titleKey: "members_title", descriptionKey: "members_description", icon: "👨‍👩‍👧‍👦" },
    { key: "children", titleKey: "children_title", descriptionKey: "children_description", icon: "👧👦" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
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

      <section className="py-16 px-4 pt-32 text-center">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <EditableText
              page="prayer"
              section="main"
              contentKey="title"
              initialValue={initialContent?.main?.title || "Prayer Requests"}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-5xl font-bold text-gray-900"
            />
          </h1>
          <div className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            <EditableText
              page="prayer"
              section="main"
              contentKey="description"
              initialValue={initialContent?.main?.description || "United in prayer for our community and the world."}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-xl text-gray-600"
            />
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {prayerCategories.map(category => (
            <Card key={category.key} className="bg-white shadow-md rounded-lg p-6 text-center">
              <div className="text-5xl mb-4">{category.icon}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                <EditableText
                  page="prayer"
                  section={category.key}
                  contentKey={category.titleKey}
                  initialValue={initialContent?.[category.key]?.[category.titleKey] || category.key.charAt(0).toUpperCase() + category.key.slice(1)}
                  isEditingPage={isPageEditing}
                  onContentChange={handleContentChange}
                  tag="span"
                  className="text-2xl font-bold text-gray-900"
                />
              </h2>
              <div className="text-gray-600 mb-4">
                <EditableText
                  page="prayer"
                  section={category.key}
                  contentKey={category.descriptionKey}
                  initialValue={initialContent?.[category.key]?.[category.descriptionKey] || `Prayer requests for ${category.key}.`}
                  isEditingPage={isPageEditing}
                  onContentChange={handleContentChange}
                  tag="span"
                  className="text-gray-600"
                  isTextArea={true}
                />
              </div>
              {/* TODO: Add a button to add new prayer requests if needed for users, for now only show existing */}
            </Card>
          ))}
        </div>
      </section>

      {/* Prayer Requests List by Category */}
      <section className="py-8 px-4">
        <div className="container mx-auto space-y-12">
          {prayerCategories.map(category => (
            <div key={category.key}>
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
                {initialContent?.[category.key]?.[category.titleKey] || category.key.charAt(0).toUpperCase() + category.key.slice(1)} Prayer Requests
              </h2>
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                {prayerRequests.filter(req => req.category === category.key).length === 0 ? (
                    <p className="text-center text-gray-600 col-span-full">아직 이 카테고리에 대한 기도 제목이 없습니다.</p>
                ) : (
                    prayerRequests.filter(req => req.category === category.key).map(req => (
                        <Card key={req.id} className="p-6 relative">
                            <CardTitle className="text-lg font-semibold mb-2">{req.title}</CardTitle>
                            <CardContent className="p-0 text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                                {req.content}
                            </CardContent>
                            <div className="text-sm text-gray-500 mb-4">
                                {req.author_nickname} • {new Date(req.created_at).toLocaleDateString()}
                            </div>

                            {/* 응답 내용 섹션 */}
                            {req.answer_content && (
                                <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
                                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                        <Bookmark className="h-4 w-4 mr-2 text-blue-600" />
                                        응답 받은 내용
                                    </h4>
                                    <p className="text-gray-700 whitespace-pre-wrap">{req.answer_content}</p>
                                    <div className="text-xs text-gray-500 mt-2">
                                        by {req.answer_author_nickname} on {req.answered_at ? new Date(req.answered_at).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                            )}

                            {/* 응답 작성/편집 버튼 및 폼 */}
                            {(user?.id === req.author_id || userRole === 'admin') && (
                                <div className="mt-4 border-t pt-4">
                                    {editingAnswerId === req.id ? (
                                        <div className="space-y-2">
                                            <Textarea
                                                value={currentAnswer}
                                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                                placeholder="응답 받은 내용을 입력하세요..."
                                                rows={3}
                                            />
                                            <div className="flex justify-end space-x-2">
                                                {/* Explicitly define child elements as variables */}
                                                {/* Button at line 356 equivalent */}
                                                <Button variant="outline" onClick={handleCancelAnswer}>
                                                    <span>취소</span>
                                                </Button>
                                                <Button onClick={() => handleSaveAnswer(req.id)}>
                                                    <span>저장</span>
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Explicitly define child element as variable
                                        <Button
                                            variant="outline"
                                            onClick={() => handleEditAnswer(req.id, req.answer_content || "")}
                                            className="w-full"
                                        >
                                            <span>
                                                {req.answer_content ? "응답 내용 수정" : "응답 내용 작성"}
                                            </span>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </Card>
                    ))
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 text-center bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            <EditableText
              page="prayer"
              section="cta"
              contentKey="title"
              initialValue={initialContent?.cta?.title || "Submit Your Prayer Request"}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-3xl font-bold text-gray-900 mb-6"
            />
          </h2>
          <div className="text-xl text-gray-600 mb-8">
            <EditableText
              page="prayer"
              section="cta"
              contentKey="description"
              initialValue={initialContent?.cta?.description || "Let us pray with you and for you."}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-xl text-gray-600 mb-8"
            />
          </div>
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link href="/prayer/new"><span>기도 요청 추가</span></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}