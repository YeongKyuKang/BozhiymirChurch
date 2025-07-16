// components/word-page-client.tsx
"use client";

import * as React from "react";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format, isFuture, startOfDay, isBefore, subDays, addDays } from "date-fns";
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { cn } from "@/lib/utils";
import EditableText from "@/components/editable-text";
import {
  Settings, CheckCircle, XCircle, Calendar as CalendarIcon, Frown, Download, Save, X, Heart, BookOpen
} from "lucide-react";
import html2canvas from 'html2canvas';


// 폴란드 시간대 정의
const POLAND_TIMEZONE = 'Europe/Warsaw';

// WordPost 타입 정의 (lib/supabase.ts에서 가져올 수도 있음)
interface WordPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_nickname: string;
  author_profile_picture_url?: string;
  created_at: string;
  likes: { user_id: string }[];
  word_date: string;
  image_url?: string | null; // null 가능성 추가
  imageContainerRef?: React.RefObject<HTMLDivElement>;
}

interface WordPageClientProps {
  initialContent: Record<string, any>;
  initialWordPosts: WordPost[];
}

export default function WordPageClient({ initialContent, initialWordPosts }: WordPageClientProps) {
  const { user, userProfile, userRole, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);

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

  // 현재 선택된 날짜에 해당하는 단일 말씀 게시물
  const currentWordPost = useMemo(() => {
    if (!selectedDate) return null;
    const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
    return wordPosts.find(post => format(new Date(post.word_date), 'yyyy-MM-dd') === formattedSelectedDate) || null;
  }, [selectedDate, wordPosts]);

  useEffect(() => {
    setWordPosts(initialWordPosts.map(post => ({
      ...post,
      imageContainerRef: React.createRef<HTMLDivElement>()
    })));
    if (!initialDateFromParams) {
      setSelectedDate(new Date());
    }
  }, [initialWordPosts, initialDateFromParams]);

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
          page: 'word',
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.error(`Error updating content for word.${section}.${key}:`, error);
        } else {
          updateCount++;
        }
      }
    }

    if (updateCount > 0) {
      try {
        const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/word`);
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json();
          console.error("Revalidation failed:", errorData.message);
        } else {
          revalidated = true;
          console.log("Word page revalidated successfully!");
        }
      } catch (err) {
        console.error("Failed to call revalidate API:", err);
      }
    }

    setIsSavingAll(false);
    setIsPageEditing(false);
    setChangedContent({});

    if (updateCount > 0 && revalidated) {
      alert("모든 변경 사항이 저장되고 말씀 게시판 페이지가 업데이트되었습니다. 새로고침하면 반영됩니다.");
    } else if (updateCount > 0 && !revalidated) {
      alert("일부 변경 사항은 저장되었지만, 말씀 게시판 페이지 재검증에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.");
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

  // 좋아요 기능
  const handleLike = async (postId: string) => {
    if (!user) {
      alert("로그인해야 좋아요를 누를 수 있습니다.");
      return;
    }

    const { data: existingReaction, error: fetchError } = await supabase
      .from('word_reactions')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .eq('reaction_type', 'like') // 'like' 반응만 처리
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116은 데이터 없음 오류
      console.error("Error fetching existing like:", fetchError.message);
      return;
    }

    if (existingReaction) {
      // 이미 좋아요가 있으면 취소
      const { error } = await supabase
        .from('word_reactions')
        .delete()
        .eq('id', existingReaction.id);
      if (error) {
        console.error("Error unliking post:", error.message);
        return;
      }
      setWordPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes: (post.likes ?? []).filter(l => l.user_id !== user.id) }
            : post
        )
      );
    } else {
      // 좋아요 추가
      const { error } = await supabase.from('word_reactions').insert({
        post_id: postId,
        user_id: user.id,
        reaction_type: 'like',
      });
      if (error) {
        console.error("Error liking post:", error.message);
        return;
      }
      setWordPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes: [...(post.likes ?? []), { user_id: user.id, reaction_type: 'like' }] }
            : post
        )
      );
    }
  };

  // 말씀 카드 다운로드 핸들러
  const handleDownload = async (post: WordPost) => {
    if (!post.imageContainerRef || !post.imageContainerRef.current) {
      alert("다운로드할 카드 요소를 찾을 수 없습니다.");
      return;
    }

    try {
      // html2canvas 함수를 직접 사용
      const cardElement = post.imageContainerRef.current;
      const capturedCanvas = await html2canvas(cardElement, { // html2canvas 직접 호출
        scrollX: 0,
        scrollY: -window.scrollY,
        useCORS: true,
        scale: 3,
      });

      const targetWidth = 1080;
      const targetHeight = 1920;

      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = targetWidth;
      finalCanvas.height = targetHeight;
      const ctx = finalCanvas.getContext('2d');

      if (!ctx) {
        throw new Error("Failed to get 2D context from canvas");
      }

      ctx.imageSmoothingEnabled = true;

      const aspectRatio = capturedCanvas.width / capturedCanvas.height;
      let drawWidth = targetWidth;
      let drawHeight = targetHeight;

      if (aspectRatio > targetWidth / targetHeight) {
        drawHeight = targetWidth / aspectRatio;
      } else {
        drawWidth = targetHeight * aspectRatio;
      }

      const dx = (targetWidth - drawWidth) / 2;
      const dy = (targetHeight - drawHeight) / 2;

      ctx.drawImage(capturedCanvas, dx, dy, drawWidth, drawHeight);

      const image = finalCanvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = image;
      link.download = `${post.title.replace(/[^a-zA-Z0-9가-힣]/g, '_')}_${format(new Date(post.word_date), 'yyyyMMdd')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      alert(`"${post.title}" 말씀 카드가 이미지 (${targetWidth}x${targetHeight})로 다운로드되었습니다!`);

    } catch (error: unknown) { // error 타입 명시
      console.error("말씀 카드 이미지 다운로드 중 오류 발생:", error);
      alert(`말씀 카드 이미지 다운로드에 실패했습니다. 다시 시도해 주세요. (CORS 문제일 수 있습니다) 오류: ${(error as Error).message || '알 수 없는 오류'}`);
    }
  };

  const handleMarkAsRead = (postId: string) => {
    alert(`"${postId}" 말씀 카드에 대한 읽음 표시 기능은 백엔드 구현이 필요합니다. (현재는 알림만 표시)`);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    const dateString = date ? format(date, 'yyyy-MM-dd') : '';
    router.push(pathname + '?' + createQueryString('date', dateString));
  };

  const getDisabledDays = useCallback(() => {
    const today = new Date();
    const startOfToday = startOfDay(today);

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 5);
    const startOfFiveDaysAgo = startOfDay(fiveDaysAgo);

    const futureDates = { from: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), to: new Date(2100, 0, 1) };
    const pastBeyondFiveDays = { from: new Date(1900, 0, 1), to: startOfDay(new Date(fiveDaysAgo.getFullYear(), fiveDaysAgo.getMonth(), fiveDaysAgo.getDate() - 1)) };

    return [
      futureDates,
      pastBeyondFiveDays
    ];
  }, []);

  const fiveDaysAgoClientSide = startOfDay(new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 5
  ));

  const isAdmin = userRole === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16">
      {/* Admin Controls */}
      {isAdmin && (
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

      {/* Hero Section (thanks-page-client.tsx 스타일 적용) */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white h-[25vh] flex items-center justify-center border-b-4 border-yellow-500 py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-3">
            <span className="text-3xl md:text-4xl">📖</span> {/* 말씀 페이지 아이콘 */}
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold mb-4">
            <EditableText
              page="word"
              section="hero"
              contentKey="title"
              initialValue={initialContent?.hero?.title || "오늘의 말씀"}
              onContentChange={(section: string, key: string, value: string) =>
                handleContentChange("hero", "title", value)
              }
              isEditingPage={isPageEditing}
              tag="span"
              className="text-white"
            />
          </h1>
          <p className="text-sm md:text-base text-blue-200 max-w-3xl mx-auto leading-relaxed">
            <EditableText
              page="word"
              section="hero"
              contentKey="description"
              initialValue={
                initialContent?.hero?.description ||
                "매일 하나님의 말씀을 발견하고, 새로운 성경 구절과 묵상을 통해 믿음 안에서 성장할 기회를 얻으세요."
              }
              onContentChange={(section: string, key: string, value: string) =>
                handleContentChange("hero", "description", value)
              }
              isEditingPage={isPageEditing}
              tag="span"
              className="text-sm md:text-base text-blue-200"
              isTextArea={true}
            />
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 말씀 내용 카드 */}
          <Card
            ref={currentWordPost?.imageContainerRef || null} // currentWordPost가 null일 수 있으므로 null 병합 연산자 사용
            className={cn(
              "shadow-2xl border-0 p-6 flex flex-col justify-between min-h-[380px]", // thanks-page-client.tsx 카드 스타일 적용
              currentWordPost?.image_url ? "bg-cover bg-center text-white" : "bg-gradient-to-br from-white to-blue-50"
            )}
            style={currentWordPost?.image_url ? { backgroundImage: `url(${currentWordPost.image_url})` } : {}}
          >
            {/* 텍스트 가독성을 위한 오버레이 (이미지 있을 때만) */}
            {currentWordPost?.image_url && (
              <div className="absolute inset-0 bg-black/50 p-4 rounded-lg"></div>
            )}

            <div className="relative z-10 flex-grow flex flex-col justify-between">
              <CardHeader className="pb-4">
                <CardTitle className={cn("text-2xl font-bold", currentWordPost?.image_url ? "text-white" : "text-blue-900")}>
                  {currentWordPost ? currentWordPost.title : "말씀이 없습니다."}
                </CardTitle>
                <CardDescription className={cn("text-sm", currentWordPost?.image_url ? "text-blue-100" : "text-gray-700")}>
                  {selectedDate ? formatInTimeZone(selectedDate, POLAND_TIMEZONE, 'yyyy년 MM월 dd일 (EEE)') : "날짜를 선택해주세요."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-0">
                {currentWordPost ? (
                  <p className={cn("whitespace-pre-wrap text-base leading-relaxed max-h-[200px] overflow-y-auto", currentWordPost?.image_url ? "text-white" : "text-gray-700")}>{currentWordPost.content}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-lg text-gray-600"> {/* wordPost?.image_url 조건 제거 */}
                    <Frown className="h-12 w-12 mb-4" />
                    <p>{selectedDate ? `${formatInTimeZone(selectedDate, POLAND_TIMEZONE, 'yyyy년 MM월 dd일')}의 말씀이 없습니다.` : "날짜를 선택하여 해당 날짜의 말씀을 확인하세요."}</p>
                  </div>
                )}
              </CardContent>
            </div>
            {currentWordPost && (
              <div className="pt-4 border-t border-blue-100 mt-auto">
                <Button variant="outline" onClick={() => handleDownload(currentWordPost)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm">
                  <Download className="mr-2 h-4 w-4" /> 말씀 카드 다운로드
                </Button>
              </div>
            )}
          </Card>

          {/* 말씀 달력 카드 */}
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50 p-6 flex flex-col min-h-[380px]"> {/* thanks-page-client.tsx 카드 스타일 적용 */}
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-blue-900">말씀 달력</CardTitle>
              <CardDescription className="text-gray-700 text-sm">날짜를 선택하여 해당 날짜의 말씀을 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pt-0 flex flex-col items-center justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                disabled={getDisabledDays()}
                className="rounded-md border shadow-md bg-white text-gray-900 border-blue-200"
              />
              {selectedDate && (
                <Button
                  variant="ghost"
                  onClick={() => handleDateSelect(undefined)}
                  className="mt-4 text-blue-700 hover:bg-blue-100 text-sm"
                >
                  <XCircle className="mr-2 h-4 w-4" /> 선택된 날짜 지우기
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
