"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Share2, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { ko, enUS, ru } from "date-fns/locale"; // 로케일 추가

interface WordPost {
  id: string;
  title: string;
  content: string;
  word_date: string;
  author_id: string;
  author_nickname: string;
  image_url: string | null;
  created_at: string;
}

interface WordPageClientProps {
  initialPosts: WordPost[];
}

export default function WordPageClient({ initialPosts }: WordPageClientProps) {
  const { t, language } = useLanguage();
  const [posts] = useState<WordPost[]>(initialPosts || []);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 날짜 포맷용 로케일 선택
  const getDateLocale = () => {
    switch (language) {
      case 'en': return enUS;
      case 'ru': return ru;
      default: return ko;
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 pt-16">
      {/* 1. Hero Section */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-800 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
            <BookOpen className="w-8 h-8 text-yellow-300" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
            {t('word.hero.title')}
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            {t('word.hero.desc')}
          </p>
        </div>
      </div>

      {/* 2. Main Feed Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card 
              key={post.id} 
              className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white"
            >
              {/* 카드 이미지 영역 */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                {post.image_url ? (
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-blue-300 opacity-50" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-blue-900 hover:bg-white font-bold backdrop-blur-sm shadow-sm">
                    {format(new Date(post.word_date), "MMM d", { locale: getDateLocale() })}
                  </Badge>
                </div>
              </div>

              {/* 카드 헤더 (작성자 정보) */}
              <CardHeader className="pb-2 pt-4 px-6 flex flex-row items-center gap-3">
                <Avatar className="h-8 w-8 border border-gray-100">
                   <AvatarFallback className="bg-blue-50 text-blue-700 text-xs font-bold">
                     {post.author_nickname?.slice(0, 2)}
                   </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-700">{post.author_nickname}</span>
                  <span className="text-[10px] text-gray-400">
                    {format(new Date(post.created_at), "yyyy.MM.dd")}
                  </span>
                </div>
              </CardHeader>

              {/* 카드 본문 */}
              <CardContent className="px-6 pb-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-700 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-4 whitespace-pre-line">
                  {post.content}
                </p>
              </CardContent>

              {/* 카드 푸터 (액션 버튼) */}
              <CardFooter className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500 hover:bg-red-50 gap-2">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs font-medium">{t('common.amen')}</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                  <Share2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {posts.length === 0 && (
           <div className="text-center py-20">
             <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
               <BookOpen className="w-8 h-8 text-gray-400" />
             </div>
             <p className="text-gray-500">{t('word.list.empty')}</p>
           </div>
        )}
      </div>
    </div>
  );
}