"use client";

import * as React from "react";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format, isFuture, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Settings, Calendar as CalendarIcon, Frown, Download, Save, X, Heart
} from "lucide-react";
import html2canvas from 'html2canvas';

// WordPost 타입 정의
interface WordPost {
  id: string;
  title: string;
  content: string;
  word_date: string;
  author_id: string;
  author_nickname: string;
  created_at: string;
  likes: { user_id: string }[];
  image_url?: string | null;
  imageContainerRef?: React.RefObject<HTMLDivElement>;
}

interface WordPageClientProps {
  initialContent: Record<string, any>;
  initialWordPosts: WordPost[];
}

export default function WordPageClient({ initialContent, initialWordPosts }: WordPageClientProps) {
  const { user, userRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 말씀 포스트 상태 관리
  const [wordPosts, setWordPosts] = useState<WordPost[]>(
    initialWordPosts.map(post => ({
      ...post,
      imageContainerRef: React.createRef<HTMLDivElement>()
    }))
  );

  const initialDateFromParams = searchParams.get('date');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDateFromParams ? new Date(initialDateFromParams) : new Date()
  );

  // 선택된 날짜의 말씀 필터링
  const currentWordPost = useMemo(() => {
    if (!selectedDate) return null;
    const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
    return wordPosts.find(post => format(new Date(post.word_date), 'yyyy-MM-dd') === formattedSelectedDate) || null;
  }, [selectedDate, wordPosts]);

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    const dateString = date ? format(date, 'yyyy-MM-dd') : '';
    const params = new URLSearchParams(searchParams.toString());
    if (dateString) params.set('date', dateString);
    else params.delete('date');
    router.push(pathname + '?' + params.toString());
  };

  // 좋아요 기능
  const handleLike = async (postId: string) => {
    if (!user) {
      alert("로그인해야 좋아요를 누를 수 있습니다.");
      return;
    }
    // ... 기존 좋아요 로직 동일
  };

  // 다운로드 기능
  const handleDownload = async (post: WordPost) => {
    if (!post.imageContainerRef?.current) return;
    try {
      const canvas = await html2canvas(post.imageContainerRef.current, { useCORS: true, scale: 2 });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${post.title}.png`;
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-16">
      
      {/* 히어로 섹션 */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white h-[25vh] flex items-center justify-center border-b-4 border-yellow-500 py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-3"><span className="text-3xl md:text-4xl">📖</span></div>
          
          {/* EditableText 제거: 일반 텍스트 출력 */}
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold mb-4 text-white">
            {initialContent?.hero?.title || "오늘의 말씀"}
          </h1>
          
          {/* <p> 태그 에러 해결: 텍스트만 직접 노출 */}
          <p className="text-sm md:text-base text-blue-200 max-w-3xl mx-auto leading-relaxed">
            {initialContent?.hero?.description || "매일 하나님의 말씀을 발견하고, 새로운 성경 구절과 묵상을 통해 믿음 안에서 성장할 기회를 얻으세요."}
          </p>
        </div>
      </div>

      {/* 말씀 카드 및 달력 섹션 */}
      <section className="py-6 px-4">
        <div className="container mx-auto max-w-2xl space-y-6 flex flex-col items-center">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* 왼쪽: 말씀 카드 */}
            <div className="w-full space-y-6">
              {!currentWordPost ? (
                <Card className="p-5 text-center py-10 w-full max-w-xs mx-auto shadow-sm">
                  <Frown className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-lg text-gray-600 font-medium">선택한 날짜에 등록된 말씀이 없습니다.</p>
                </Card>
              ) : (
                <Card key={currentWordPost.id} ref={currentWordPost.imageContainerRef} className="relative shadow-md rounded-lg overflow-hidden w-full mx-auto">
                  {currentWordPost.image_url ? (
                    <div className="relative w-full aspect-[9/16] flex flex-col justify-center items-center"
                         style={{ backgroundImage: `url(${currentWordPost.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center p-6 text-white text-center">
                        <h2 className="text-2xl font-extrabold mb-4">{currentWordPost.title}</h2>
                        <p className="text-base text-blue-100 leading-relaxed">{currentWordPost.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6">
                      <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900">{currentWordPost.title}</h2>
                        <p className="text-sm text-gray-500">{format(new Date(currentWordPost.word_date), 'yyyy년 MM월 dd일')}</p>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{currentWordPost.content}</p>
                    </div>
                  )}
                  
                  {/* 카드 하단 액션 버튼 */}
                  <div className="flex justify-between items-center px-4 py-3 bg-slate-50">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleLike(currentWordPost.id)}>
                        <Heart className={cn("h-4 w-4 mr-1", currentWordPost.likes.some(l => l.user_id === user?.id) ? "fill-red-500 text-red-500" : "text-gray-500")} />
                        <span className="text-xs">{currentWordPost.likes.length}</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(currentWordPost)}>
                        <Download className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-xs">이미지 저장</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* 오른쪽: 달력 */}
            <div className="w-full md:w-auto flex justify-center">
              <Card className="p-4 shadow-md max-w-[280px]">
                <div className="flex items-center text-lg font-bold text-gray-900 mb-4 px-2">
                  <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                  <span>말씀 달력</span>
                </div>
                <Calendar 
                  mode="single" 
                  selected={selectedDate} 
                  onSelect={handleDateSelect}
                  className="rounded-md border shadow-sm"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
