"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ko, enUS, ru } from "date-fns/locale";
import { 
  Calendar as CalendarIcon, 
  Download, 
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { Database } from "@/lib/supabase";
import html2canvas from "html2canvas";

// [기존] 성경 책 이름 매핑 (제목 표시용)
const BIBLE_BOOK_NAMES: Record<string, { ko: string; ru: string; en: string }> = {
  // 구약 (Old Testament)
  gn: { ko: "창세기", ru: "Бытие", en: "Genesis" },
  ex: { ko: "출애굽기", ru: "Исход", en: "Exodus" },
  lv: { ko: "레위기", ru: "Левит", en: "Leviticus" },
  nm: { ko: "민수기", ru: "Числа", en: "Numbers" },
  dt: { ko: "신명기", ru: "Второзаконие", en: "Deuteronomy" },
  js: { ko: "여호수아", ru: "Иисус Навин", en: "Joshua" },
  jud: { ko: "사사기", ru: "Судьи", en: "Judges" },
  rt: { ko: "룻기", ru: "Руфь", en: "Ruth" },
  "1sm": { ko: "사무엘상", ru: "1-я Царств", en: "1 Samuel" },
  "2sm": { ko: "사무엘하", ru: "2-я Царств", en: "2 Samuel" },
  "1kg": { ko: "열왕기상", ru: "3-я Царств", en: "1 Kings" },
  "2kg": { ko: "열왕기하", ru: "4-я Царств", en: "2 Kings" },
  "1ch": { ko: "역대상", ru: "1-я Паралипоменон", en: "1 Chronicles" },
  "2ch": { ko: "역대하", ru: "2-я Паралипоменон", en: "2 Chronicles" },
  ez: { ko: "에스라", ru: "Ездра", en: "Ezra" },
  ne: { ko: "느헤미야", ru: "Неемия", en: "Nehemiah" },
  es: { ko: "에스더", ru: "Есфирь", en: "Esther" },
  jb: { ko: "욥기", ru: "Иов", en: "Job" },
  ps: { ko: "시편", ru: "Псалтирь", en: "Psalms" },
  prv: { ko: "잠언", ru: "Притчи", en: "Proverbs" },
  ec: { ko: "전도서", ru: "Екклесиаст", en: "Ecclesiastes" },
  sn: { ko: "아가", ru: "Песнь Песней", en: "Song of Solomon" },
  is: { ko: "이사야", ru: "Исаия", en: "Isaiah" },
  jr: { ko: "예레미야", ru: "Иеремия", en: "Jeremiah" },
  lm: { ko: "예레미야애가", ru: "Плач Иеремии", en: "Lamentations" },
  ek: { ko: "에스겔", ru: "Иезекииль", en: "Ezekiel" },
  dn: { ko: "다니엘", ru: "Даниил", en: "Daniel" },
  ho: { ko: "호세아", ru: "Осия", en: "Hosea" },
  jl: { ko: "요엘", ru: "Иоиль", en: "Joel" },
  am: { ko: "아모스", ru: "Амос", en: "Amos" },
  ob: { ko: "오바댜", ru: "Авдий", en: "Obadiah" },
  jn: { ko: "요나", ru: "Иона", en: "Jonah" },
  mi: { ko: "미가", ru: "Михей", en: "Micah" },
  na: { ko: "나훔", ru: "Наум", en: "Nahum" },
  ha: { ko: "하박국", ru: "Аввакум", en: "Habakkuk" },
  zp: { ko: "스바냐", ru: "Софония", en: "Zephaniah" },
  hg: { ko: "학개", ru: "Аггей", en: "Haggai" },
  zc: { ko: "스가랴", ru: "Захария", en: "Zechariah" },
  ml: { ko: "말라기", ru: "Малахия", en: "Malachi" },

  // 신약 (New Testament)
  mt: { ko: "마태복음", ru: "От Матфея", en: "Matthew" },
  mk: { ko: "마가복음", ru: "От Марка", en: "Mark" },
  lk: { ko: "누가복음", ru: "От Луки", en: "Luke" },
  jo: { ko: "요한복음", ru: "От Иоанна", en: "John" },
  act: { ko: "사도행전", ru: "Деяния", en: "Acts" },
  rm: { ko: "로마서", ru: "Римлянам", en: "Romans" },
  "1co": { ko: "고린도전서", ru: "1-е Коринфянам", en: "1 Corinthians" },
  "2co": { ko: "고린도후서", ru: "2-е Коринфянам", en: "2 Corinthians" },
  gl: { ko: "갈라디아서", ru: "Галатам", en: "Galatians" },
  eph: { ko: "에베소서", ru: "Ефесянам", en: "Ephesians" },
  ph: { ko: "빌립보서", ru: "Филиппийцам", en: "Philippians" },
  col: { ko: "골로새서", ru: "Колоссянам", en: "Colossians" },
  "1ts": { ko: "데살로니가전서", ru: "1-е Фессалоникийцам", en: "1 Thessalonians" },
  "2ts": { ko: "데살로니가후서", ru: "2-е Фессалоникийцам", en: "2 Thessalonians" },
  "1tm": { ko: "디모데전서", ru: "1-е Тимофею", en: "1 Timothy" },
  "2tm": { ko: "디모데후서", ru: "2-е Тимофею", en: "2 Timothy" },
  tt: { ko: "디도서", ru: "Титу", en: "Titus" },
  phm: { ko: "빌레몬서", ru: "Филимону", en: "Philemon" },
  heb: { ko: "히브리서", ru: "Евреям", en: "Hebrews" },
  jm: { ko: "야고보서", ru: "Иакова", en: "James" },
  "1pe": { ko: "베드로전서", ru: "1-е Петра", en: "1 Peter" },
  "2pe": { ko: "베드로후서", ru: "2-е Петра", en: "2 Peter" },
  "1jo": { ko: "요한1서", ru: "1-е Иоанна", en: "1 John" },
  "2jo": { ko: "요한2서", ru: "2-е Иоанна", en: "2 John" },
  "3jo": { ko: "요한3서", ru: "3-е Иоанна", en: "3 John" },
  jd: { ko: "유다서", ru: "Иуды", en: "Jude" },
  re: { ko: "요한계시록", ru: "Откровение", en: "Revelation" },
};

type WordPost = Database['public']['Tables']['word_posts']['Row'] & {
  book_id?: string;
  chapter_num?: number;
  verse_num?: number;
};

interface WordPageClientProps {
  initialPosts: WordPost[];
}

export default function WordPageClient({ initialPosts }: WordPageClientProps) {
  const { t, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // [추가] 성경 전체 데이터를 저장할 state
  const [bibleData, setBibleData] = useState<any[]>([]);

  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  
  const activePost = initialPosts.find(
    (post) => post.word_date === selectedDateStr
  );

  const getDateLocale = () => {
    switch (language) {
      case 'en': return enUS;
      case 'ru': return ru;
      default: return ko;
    }
  };

  // [추가] 언어가 바뀔 때마다 해당 언어의 성경 데이터 로드
  useEffect(() => {
    const loadBible = async () => {
      try {
        const res = await fetch(`/bible/${language}.json`);
        if (!res.ok) throw new Error("Bible data fetch failed");
        const data = await res.json();
        setBibleData(data);
      } catch (e) {
        console.error("Failed to load bible data:", e);
      }
    };
    loadBible();
  }, [language]);

  const handleDownload = async () => {
    const element = document.getElementById("word-card");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        useCORS: true, 
        scale: 2, 
        backgroundColor: null
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `bozhiymir-word-${selectedDateStr}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // 제목 동적 생성 함수 (book_id 기반)
  const getDisplayTitle = (post: WordPost) => {
    if (post.book_id && post.chapter_num && post.verse_num) {
      const abbrev = post.book_id.toLowerCase();
      const bookNameMap = BIBLE_BOOK_NAMES[abbrev];
      
      if (bookNameMap) {
        const localizedBookName = bookNameMap[language as 'ko' | 'en' | 'ru'] || bookNameMap.en;
        return `${localizedBookName} ${post.chapter_num}:${post.verse_num}`;
      }
    }
    return post.title;
  };

  // [추가] 본문 동적 생성 함수 (JSON 데이터 기반)
  const getDisplayContent = (post: WordPost) => {
    // 1. 성경 정보가 있고, JSON 데이터가 로드되어 있는지 확인
    if (post.book_id && post.chapter_num && post.verse_num && bibleData.length > 0) {
      // JSON 데이터에서 해당 책 찾기 (약어 비교)
      const book = bibleData.find((b: any) => b.abbrev.toLowerCase() === post.book_id?.toLowerCase());
      
      if (book && book.chapters) {
        try {
          // 배열 인덱스는 0부터 시작하므로 -1
          // 예: 1장 1절 -> chapters[0][0]
          const content = book.chapters[post.chapter_num - 1][post.verse_num - 1];
          if (content) return content;
        } catch (e) {
          console.warn("Verse not found in JSON data, falling back to DB content.");
        }
      }
    }
    // 2. 정보가 없거나 실패하면 DB에 저장된 원래 content 반환
    return post.content;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      {/* Hero Section */}
      <div className="bg-[#0F172A] text-white py-16 border-b-4 border-yellow-500 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tight mb-4">
            {t('word.hero.title')}
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            {t('word.hero.desc')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Card Area */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {activePost ? (
              <div className="flex flex-col items-center">
                {/* Word Card Container for Download */}
                <div 
                  id="word-card"
                  className="relative aspect-[9/16] w-full max-w-md bg-black rounded-[24px] overflow-hidden shadow-2xl border-4 border-slate-900 mx-auto"
                >
                  {/* Background Image */}
                  {activePost.image_url ? (
                    <img 
                      src={activePost.image_url} 
                      alt="Background" 
                      className="absolute inset-0 w-full h-full object-cover opacity-70"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black" />
                  )}
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 z-10 p-8 flex flex-col justify-center text-center text-white">
                    <div className="mb-6 inline-block mx-auto px-4 py-1 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm text-xs font-medium tracking-wider uppercase">
                      Bozhiymir Church
                    </div>
                    
                    {/* 제목 (동적) */}
                    <h2 className="text-3xl font-black mb-6 drop-shadow-lg leading-tight break-keep">
                      {getDisplayTitle(activePost)}
                    </h2>
                    
                    {/* [수정됨] 본문 (동적: DB내용 대신 성경 JSON 내용 우선 표시) */}
                    <p className="text-lg md:text-xl font-medium leading-relaxed opacity-95 whitespace-pre-wrap drop-shadow-md break-keep">
                      {getDisplayContent(activePost)}
                    </p>
                    
                    <div className="mt-8 pt-6 border-t border-white/20 inline-block mx-auto">
                      <p className="text-sm font-medium opacity-80">
                        {format(new Date(activePost.word_date), "MMMM d, yyyy", { locale: getDateLocale() })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-6">
                  <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 rounded-full px-6">
                    <Download className="w-4 h-4 mr-2" />
                    {t('word.button.download')}
                  </Button>
                  <Button variant="outline" className="rounded-full px-6" onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: getDisplayTitle(activePost),
                        // 공유할 때도 번역된 본문을 사용
                        text: getDisplayContent(activePost),
                        url: window.location.href
                      });
                    } else {
                      alert("Sharing is not supported on this browser.");
                    }
                  }}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 p-8 text-center">
                <CalendarIcon className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">{t('word.list.empty_date')}</p>
                <p className="text-sm">{t('word.list.select_date')}</p>
              </div>
            )}
          </div>

          {/* Sidebar / Calendar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                {t('word.calendar.title')}
              </h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border mx-auto"
                modifiers={{
                  posted: initialPosts.map(p => new Date(p.word_date))
                }}
                modifiersStyles={{
                  posted: { fontWeight: 'bold', color: '#2563eb', textDecoration: 'underline' }
                }}
                locale={getDateLocale()} 
              />
            </div>

            {/* Recent List */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-4">Recent Words</h3>
              <div className="space-y-3">
                {initialPosts.slice(0, 5).map(post => (
                  <button 
                    key={post.id} 
                    onClick={() => setSelectedDate(new Date(post.word_date))}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all flex items-center gap-3",
                      post.word_date === selectedDateStr 
                        ? "bg-blue-50 border-blue-200 ring-1 ring-blue-200" 
                        : "hover:bg-slate-50 border border-transparent"
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-200 flex-shrink-0 overflow-hidden">
                        {post.image_url && <img src={post.image_url} className="w-full h-full object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate text-slate-800">
                        {getDisplayTitle(post)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {post.word_date}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}