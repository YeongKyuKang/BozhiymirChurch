// yeongkyukang/bozhiymirchurch/BozhiymirChurch-3007c4235d54890bd3db6acc74558b701965297b/components/weekly-events-page-client.tsx
"use client"; // 이 파일은 클라이언트 컴포넌트임을 명시합니다.

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Settings, Save, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import EditableText from "@/components/editable-text";
import { Calendar, Clock, MapPin, Users, Heart, Star } from "lucide-react";
import Image from "next/image"; // Image 컴포넌트 import

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  category: string
  recurring: boolean
  icon: string
  imageUrl?: string // 이미지 URL 필드 추가
}

interface WeeklyEventsPageClientProps { // 인터페이스 이름 변경
  initialEvents: Event[];
  initialContent: Record<string, any>;
}

export default function WeeklyEventsPageClient({ initialEvents, initialContent }: WeeklyEventsPageClientProps) { // 컴포넌트 이름 변경
  const { userRole } = useAuth();
  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Heart": return <Heart className="h-6 w-6" />
      case "Users": return <Users className="h-6 w-6" />
      case "Star": return <Star className="h-6 w-6" />
      default: return null
    }
  }

  const categories = [
    { name: "All Events", color: "bg-gray-100 text-gray-800" },
    { name: "Worship", color: "bg-blue-100 text-blue-800" },
    { name: "Special Event", color: "bg-yellow-100 text-yellow-800" },
    { name: "Bible Study", color: "bg-green-100 text-green-800" },
    { name: "Youth", color: "bg-purple-100 text-purple-800" },
    { name: "Outreach", color: "bg-red-100 text-red-800" },
    { name: "Education", color: "bg-orange-100 text-orange-800" },
  ]

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.name === category)
    return cat ? cat.color : "bg-gray-100 text-gray-800"
  }

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
          page: 'weekly', // 'events'에서 'weekly' 페이지로 변경
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.error(`Error updating content for weekly.${section}.${key}:`, error);
        } else {
          updateCount++;
        }
      }
    }

    if (updateCount > 0) {
      try {
        const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/weekly`); // 경로를 '/weekly'로 변경
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json();
          console.error("Revalidation failed:", errorData.message);
        } else {
          revalidated = true;
          console.log("Weekly events page revalidated successfully!");
        }
      } catch (err) {
        console.error("Failed to call revalidate API:", err);
      }
    }

    setIsSavingAll(false);
    setIsPageEditing(false);
    setChangedContent({});

    if (updateCount > 0 && revalidated) {
      alert("모든 변경 사항이 저장되고 상시 행사 페이지가 업데이트되었습니다. 새로고침하면 반영됩니다.");
    } else if (updateCount > 0 && !revalidated) {
        alert("일부 변경 사항은 저장되었지만, 상시 행사 페이지 재검증에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.");
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
                page="weekly" // 페이지를 'weekly'로 변경
                section="main"
                contentKey="title"
                initialValue={initialContent?.main?.title}
                isEditingPage={isPageEditing}
                onContentChange={handleContentChange}
                tag="span"
                className="text-5xl font-bold text-gray-900"
            />
            <span className="text-blue-600">Weekly Events</span> {/* 텍스트 변경 */}
          </h1>
          <div className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            <EditableText
                page="weekly" // 페이지를 'weekly'로 변경
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

      {/* Category Filter */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors hover:opacity-80 ${getCategoryColor(category.name)}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialEvents.map((event, index) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <CardContent className="p-0">
                  {/* 이미지 및 오버레이 섹션 추가 */}
                  {event.imageUrl ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        layout="fill"
                        objectFit="cover"
                        className="w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 text-white"> {/* 알파 0.5인 검은색 오버레이 */}
                        <div className="flex items-center justify-between mb-2">
                          {getIconComponent(event.icon)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                            {event.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                        {event.recurring && (
                          <span className="inline-block bg-yellow-400 text-blue-900 px-2 py-1 rounded text-xs font-medium">
                            Recurring
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    // imageUrl이 없을 경우 기존 그라데이션 배경 사용
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        {getIconComponent(event.icon)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}
                        >
                          {event.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      {event.recurring && (
                        <span className="inline-block bg-yellow-400 text-blue-900 px-2 py-1 rounded text-xs font-medium">
                          Recurring
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-3 text-blue-600" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-3 text-blue-600" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-3 text-blue-600" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Learn More</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Ukrainian Events */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-yellow-400 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            <EditableText
                page="weekly" // 페이지를 'weekly'로 변경
                section="special_ministry"
                contentKey="title"
                initialValue={initialContent?.special_ministry?.title}
                isEditingPage={isPageEditing}
                onContentChange={handleContentChange}
                tag="span"
                className="text-3xl font-bold mb-8"
            />
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🇺🇦</div>
                <h3 className="text-xl font-bold mb-2">
                    <EditableText
                        page="weekly" // 페이지를 'weekly'로 변경
                        section="special_ministry"
                        contentKey="card1_title"
                        initialValue={initialContent?.special_ministry?.card1_title}
                        isEditingPage={isPageEditing}
                        onContentChange={handleContentChange}
                        tag="span"
                        className="text-xl font-bold mb-2"
                    />
                </h3>
                <div className="opacity-90 mb-4">
                    <EditableText
                        page="weekly" // 페이지를 'weekly'로 변경
                        section="special_ministry"
                        contentKey="card1_description"
                        initialValue={initialContent?.special_ministry?.card1_description}
                        isEditingPage={isPageEditing}
                        onContentChange={handleContentChange}
                        tag="span"
                        className="opacity-90 mb-4"
                    />
                </div>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  View Calendar
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-xl font-bold mb-2">
                    <EditableText
                        page="weekly" // 페이지를 'weekly'로 변경
                        section="special_ministry"
                        contentKey="card2_title"
                        initialValue={initialContent?.special_ministry?.card2_title}
                        isEditingPage={isPageEditing}
                        onContentChange={handleContentChange}
                        tag="span"
                        className="text-xl font-bold mb-2"
                    />
                </h3>
                <div className="opacity-90 mb-4">
                    <EditableText
                        page="weekly" // 페이지를 'weekly'로 변경
                        section="special_ministry"
                        contentKey="card2_description"
                        initialValue={initialContent?.special_ministry?.card2_description}
                        isEditingPage={isPageEditing}
                        onContentChange={handleContentChange}
                        tag="span"
                        className="opacity-90 mb-4"
                    />
                </div>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Join Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Event Guidelines */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            <EditableText
              page="weekly" // 페이지를 'weekly'로 변경
              section="guidelines"
              contentKey="title"
              initialValue={initialContent?.guidelines?.title}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-3xl font-bold text-center text-gray-900 mb-12"
            />
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  <EditableText page="weekly" section="guidelines" contentKey="card1_title" initialValue={initialContent?.guidelines?.card1_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-xl font-bold text-gray-900 mb-2" /> {/* 페이지를 'weekly'로 변경 */}
                </h3>
                <div className="text-gray-600">
                  <EditableText page="weekly" section="guidelines" contentKey="card1_description" initialValue={initialContent?.guidelines?.card1_description} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-gray-600" /> {/* 페이지를 'weekly'로 변경 */}
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  <EditableText page="weekly" section="guidelines" contentKey="card2_title" initialValue={initialContent?.guidelines?.card2_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-xl font-bold text-gray-900 mb-2" /> {/* 페이지를 'weekly'로 변경 */}
                </h3>
                <div className="text-gray-600">
                  <EditableText page="weekly" section="guidelines" contentKey="card2_description" initialValue={initialContent?.guidelines?.card2_description} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-gray-600" /> {/* 페이지를 'weekly'로 변경 */}
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  <EditableText page="weekly" section="guidelines" contentKey="card3_title" initialValue={initialContent?.guidelines?.card3_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-xl font-bold text-gray-900 mb-2" /> {/* 페이지를 'weekly'로 변경 */}
                </h3>
                <div className="text-gray-600">
                  <EditableText page="weekly" section="guidelines" contentKey="card3_description" initialValue={initialContent?.guidelines?.card3_description} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-gray-600" /> {/* 페이지를 'weekly'로 변경 */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 text-center bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            <EditableText page="weekly" section="cta" contentKey="title" initialValue={initialContent?.cta?.title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold text-gray-900 mb-6" /> {/* 페이지를 'weekly'로 변경 */}
          </h2>
          <div className="text-xl text-gray-600 mb-8">
            <EditableText page="weekly" section="cta" contentKey="description" initialValue={initialContent?.cta?.description} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-xl text-gray-600 mb-8" /> {/* 페이지를 'weekly'로 변경 */}
          </div>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/join">Join Our Church</Link>
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