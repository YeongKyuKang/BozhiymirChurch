"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ko, enUS, ru } from "date-fns/locale"; 
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon, Download, Heart, Loader2, Sparkles
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
  image_url?: string | null;
  likes?: { user_id: string }[]; 
  imageContainerRef?: React.RefObject<HTMLDivElement>;
  book_id?: string;
  chapter_num?: number;
  verse_num?: number;
}

interface WordPageClientProps {
  initialPosts: WordPost[];
}

export default function WordPageClient({ initialPosts }: WordPageClientProps) {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [wordPosts] = useState<WordPost[]>(
    initialPosts.map(post => ({
      ...post,
      imageContainerRef: React.createRef<HTMLDivElement>()
    }))
  );

  const initialDateFromParams = searchParams.get('date');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDateFromParams ? new Date(initialDateFromParams) : new Date()
  );
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 성경 데이터 상태 유지
  const [bibleData, setBibleData] = useState<any[]>([]);
  const [loadingBible, setLoadingBible] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // [수정] 성경 데이터를 불러오는 로직 강화
  useEffect(() => {
    const loadBible = async () => {
      setLoadingBible(true);
      try {
        // public/bible/ko.json 등의 경로에서 데이터를 가져옴
        const res = await fetch(`/bible/${language}.json`);
        if (!res.ok) throw new Error("Failed to fetch bible");
        const data = await res.json();
        setBibleData(Array.isArray(data) ? data : []); // 배열 형태 확인
      } catch (e) {
        console.error("Bible load error:", e);
        setBibleData([]);
      } finally {
        setLoadingBible(false);
      }
    };
    loadBible();
  }, [language]);

  const getDateLocale = () => {
    switch (language) {
      case 'en': return enUS;
      case 'ru': return ru;
      default: return ko;
    }
  };

  const currentWordPost = useMemo(() => {
    if (!selectedDate) return null;
    const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
    return wordPosts.find(post => format(new Date(post.word_date), 'yyyy-MM-dd') === formattedSelectedDate) || null;
  }, [selectedDate, wordPosts]);

  // [수정] 실시간 번역된 구절을 가져오는 함수
  const getTranslatedVerse = (post: WordPost) => {
    // book_id가 없거나 성경 데이터가 로드되지 않았다면 DB 원본 텍스트 반환
    if (!post.book_id || bibleData.length === 0) return post.content;
    
    // abbrev와 book_id 매칭
    const book = bibleData.find(b => b.abbrev === post.book_id);
    if (!book || !book.chapters) return post.content;

    try {
      // chapters[장-1][절-1] 구조로 접근
      const verseText = book.chapters[post.chapter_num! - 1][post.verse_num! - 1];
      return verseText || post.content;
    } catch (e) {
      return post.content;
    }
  };

  // [수정] 제목 번역 (형식 포함)
  const getTranslatedTitle = (post: WordPost) => {
    if (!post.book_id || bibleData.length === 0) return post.title;
    const book = bibleData.find(b => b.abbrev === post.book_id);
    if (!book) return post.title;

    if (language === 'ko') {
      return `${book.name} ${post.chapter_num}장 ${post.verse_num}절`;
    }
    return `${book.name} ${post.chapter_num}:${post.verse_num}`;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    const dateString = date ? format(date, 'yyyy-MM-dd') : '';
    const params = new URLSearchParams(searchParams.toString());
    if (dateString) params.set('date', dateString);
    else params.delete('date');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLike = async () => {
    if (!user) {
      alert(t('common.login_required'));
      return;
    }
    alert("준비 중입니다."); 
  };

  const handleDownload = async (post: WordPost) => {
    if (!post.imageContainerRef?.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(post.imageContainerRef.current, { 
        useCORS: true, 
        scale: 3, 
        backgroundColor: "#ffffff",
        logging: false
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `word_${post.word_date}.png`;
      link.click();
    } catch (e) {
      console.error(e);
      alert(t('common.error'));
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      
      {/* Hero Section */}
      <div className="bg-[#0F172A] text-white py-10 border-b-4 border-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2 animate-bounce">
            <span className="text-3xl md:text-4xl">📖</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 italic tracking-tight">
            {t('word.hero.title')}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed">
            {t('word.hero.desc')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="flex flex-col lg:flex-row justify-center gap-10 items-start">
            
            {/* 왼쪽: 말씀 카드 영역 */}
            <div className="w-full max-w-xs flex-shrink-0">
              {!currentWordPost ? (
                <div className="text-center py-24 bg-white rounded-[32px] border border-dashed border-slate-200 shadow-sm w-full">
                  <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-lg font-medium">{t('word.list.empty_date')}</p>
                  <p className="text-slate-400 text-sm mt-2">{t('word.list.select_date')}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 w-full">
                  <Card className="rounded-[32px] border-none shadow-xl shadow-slate-200 bg-white overflow-hidden">
                    
                    {/* 캡처 대상 */}
                    <div ref={currentWordPost.imageContainerRef} className="bg-white relative w-full aspect-[9/16] overflow-hidden">
                        
                        {currentWordPost.image_url ? (
                            <>
                                <div 
                                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform hover:scale-105 duration-700"
                                    style={{ backgroundImage: `url(${currentWordPost.image_url})` }}
                                />
                                <div className="absolute inset-0 bg-black/40" />
                            </>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                        )}
                        
                        {/* 텍스트 콘텐츠 */}
                        <div className="absolute inset-0 z-10 p-6 flex flex-col justify-center items-center text-center text-white h-full">
                            <div className="flex-1 flex flex-col justify-center">
                                {loadingBible ? (
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto opacity-50" />
                                ) : (
                                    <>
                                        <h2 className="text-xl md:text-2xl font-black mb-4 leading-tight drop-shadow-xl">
                                            {getTranslatedTitle(currentWordPost)}
                                        </h2>
                                        <p className="text-sm md:text-base text-white/95 leading-relaxed font-medium whitespace-pre-wrap drop-shadow-lg font-serif">
                                            "{getTranslatedVerse(currentWordPost)}"
                                        </p>
                                    </>
                                )}
                            </div>
                            
                            <div className="mt-auto pt-4 border-t border-white/30 w-full">
                                <p className="text-xs font-bold tracking-widest uppercase opacity-90">
                                    {format(new Date(currentWordPost.word_date), 'yyyy.MM.dd')}
                                </p>
                                <p className="text-[10px] opacity-70 mt-1 tracking-wide">Bozhiymir Church Daily Word</p>
                            </div>
                        </div>
                    </div>

                    {/* 카드 푸터 */}
                    <CardFooter className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                        <Button variant="ghost" size="sm" onClick={handleLike} className="text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full gap-1.5 px-3">
                            <Heart className={cn("h-4 w-4")} />
                            <span className="text-xs font-bold">{t('common.amen')}</span>
                        </Button>
                        <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => handleDownload(currentWordPost)}
                            disabled={isDownloading}
                            className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-4 shadow-lg shadow-slate-200 h-8"
                        >
                            {isDownloading ? <Loader2 className="h-3 w-3 animate-spin mr-1.5"/> : <Download className="h-3 w-3 mr-1.5" />}
                            <span className="font-bold text-[10px]">{t('word.button.download')}</span>
                        </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </div>

            {/* 오른쪽: 달력 영역 */}
            <div className="w-full max-w-[320px] flex flex-col gap-6 sticky top-24 flex-shrink-0">
              <Card className="rounded-[24px] border-none shadow-lg shadow-slate-100 bg-white p-6">
                <CardHeader className="p-0 mb-4 border-b border-slate-50 pb-4">
                    <CardTitle className="flex items-center text-lg font-bold text-slate-800">
                        <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                        {t('word.calendar.title')}
                    </CardTitle>
                </CardHeader>
                <div className="flex justify-center">
                    <Calendar 
                        mode="single" 
                        selected={selectedDate} 
                        onSelect={handleDateSelect}
                        className="p-0 w-full"
                        classNames={{
                            head_cell: "text-slate-400 font-normal text-[0.8rem]",
                            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 rounded-full",
                            day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white rounded-full shadow-md shadow-blue-200",
                            day_today: "bg-slate-100 text-slate-900 font-bold",
                        }}
                    />
                </div>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}