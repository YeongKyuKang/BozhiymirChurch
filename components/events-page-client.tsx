// components/events-page-client.tsx
"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Settings, Save, X, CalendarIcon, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import EditableText from "@/components/editable-text";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from "next/link";
import { Database } from "@/lib/supabase";

type Event = Database['public']['Tables']['events']['Row'];

interface SpecificEventsPageClientProps {
  initialContent: Record<string, any>;
  initialEvents: Event[];
}

export default function SpecificEventsPageClient({ initialContent, initialEvents }: SpecificEventsPageClientProps) {
  const { userRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);

  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    searchParams.get('date') ? new Date(searchParams.get('date') as string) : undefined
  );
  const [timezoneOffset, setTimezoneOffset] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimezoneOffset(new Date().getTimezoneOffset());
    }
  }, []);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const createQueryString = useCallback(
    (name: string, value: string | number | null | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value !== null && value !== undefined && value !== '') {
        params.set(name, String(value));
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    router.push(pathname + '?' + createQueryString('category', value));
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    const dateString = date ? format(date, 'yyyy-MM-dd') : '';
    
    let newQueryString = createQueryString('date', dateString);
    if (timezoneOffset !== null) {
      newQueryString = createQueryString('timezoneOffset', timezoneOffset);
    }
    router.push(pathname + '?' + newQueryString);
  };

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
          page: 'events',
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.error(`Error updating content for events.${section}.${key}:`, error);
        } else {
          updateCount++;
        }
      }
    }

    if (updateCount > 0) {
      try {
        const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/events`);
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json();
          throw new Error(errorData.message || "재검증 실패");
        }
        revalidated = true;
      } catch (error) {
        console.error("재검증 중 오류 발생:", error);
        alert("콘텐츠 업데이트는 성공했지만 페이지 재검증에 실패했습니다. 수동으로 새로고침해야 할 수 있습니다.");
      }
    }

    setChangedContent({});
    setIsPageEditing(false);
    setIsSavingAll(false);

    if (updateCount > 0) {
      alert(`콘텐츠가 성공적으로 업데이트되었습니다.${revalidated ? "" : " (재검증 실패)"}`);
      router.refresh();
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

  const isAdmin = userRole === 'admin';

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    let matchesDate = true;
    if (selectedDate && event.event_date) {
      const eventDate = new Date(event.event_date);
      matchesDate = eventDate.getFullYear() === selectedDate.getFullYear() &&
                    eventDate.getMonth() === selectedDate.getMonth() &&
                    eventDate.getDate() === selectedDate.getDate();
    }
    return matchesCategory && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {isAdmin && (
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setIsPageEditing(!isPageEditing)}
              variant={isPageEditing ? "secondary" : "default"}
              className="mr-2"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isPageEditing ? "편집 모드 종료" : "페이지 편집"}
            </Button>
            {isPageEditing && (
              <>
                <Button onClick={handleSaveAll} className="mr-2" disabled={isSavingAll}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSavingAll ? "저장 중..." : "모두 저장"}
                </Button>
                <Button onClick={handleCancelAll} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
              </>
            )}
          </div>
        )}

        <section className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            <EditableText
              page="events"
              section="header"
              contentKey="title"
              initialValue={initialContent.header?.title || "교회 행사"}
              onContentChange={(section: string, key: string, value: string) => handleContentChange("header", "title", value)}
              isEditingPage={isPageEditing}
              className="inline-block"
            />
          </h1>
          <div className="text-xl text-gray-600 max-w-3xl mx-auto">
            <EditableText
              page="events"
              section="header"
              contentKey="description"
              initialValue={initialContent.header?.description || "보지미르 교회에서 열리는 모든 특별한 행사와 모임을 확인하세요."}
              onContentChange={(section: string, key: string, value: string) => handleContentChange("header", "description", value)}
              isEditingPage={isPageEditing}
            />
          </div>
        </section>

        <section className="mb-8 p-4 bg-white rounded-lg shadow-md flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div className="flex-1 min-w-[180px]">
            <label htmlFor="category-filter" className="sr-only">카테고리</label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-filter" className="w-full">
                <SelectValue placeholder="모든 카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 카테고리</SelectItem>
                <SelectItem value="예배">예배</SelectItem>
                <SelectItem value="어린이">어린이</SelectItem>
                <SelectItem value="청소년/청년">청소년/청년</SelectItem>
                <SelectItem value="성경공부">성경공부</SelectItem>
                <SelectItem value="공동체">공동체</SelectItem>
                <SelectItem value="특별행사">특별 행사</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[180px]">
            <label htmlFor="date-filter" className="sr-only">날짜</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "yyyy년 MM월 dd일") : <span>날짜 선택</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {selectedDate && (
              <Button variant="ghost" size="icon" onClick={() => handleDateChange(undefined)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </section>

        <section>
          {filteredEvents.length === 0 ? (
            <p className="text-center text-gray-600 text-lg py-10">
              선택한 필터에 해당하는 이벤트가 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {filteredEvents.map((event) => (
                // 링크를 event.slug로 변경했습니다.
                <Link key={event.id} href={`/events/${event.slug}`} passHref>
                  <Card className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col lg:flex-row cursor-pointer">
                    {event.image_url && (
                      <div className="relative w-full h-48 lg:h-auto lg:w-1/3 flex-shrink-0">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/600x400/CCCCCC/000000?text=No+Image`;
                          }}
                        />
                        {event.category && (
                          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                            {event.category}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex-grow p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                          {event.description || "이벤트 설명이 없습니다."}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                        {event.event_date && (
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{format(new Date(event.event_date), "yyyy년 MM월 dd일 (EEE)")}</span>
                          </div>
                        )}
                        {(event.start_time || event.end_time) && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-blue-500" />
                            <span>
                              {event.start_time}{event.end_time ? ` - ${event.end_time}` : ''}
                            </span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}