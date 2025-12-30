"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ko, enUS, ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight, MapPin, Calendar, ImageIcon, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  location?: string;
  image_url?: string;
}

interface EventsPageClientProps {
  events: Event[];
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
}

export default function EventsPageClient({ 
  events, totalCount, currentPage, itemsPerPage 
}: EventsPageClientProps) {
  
  const { t, language } = useLanguage();
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getDateLocale = () => {
    switch (language) {
      case 'en': return enUS;
      case 'ru': return ru;
      default: return ko;
    }
  };

  // 날짜 포맷팅 (예: 2025.12.25 (목) ~ 12.27 (토))
  const formatEventDate = (start: string, end?: string) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;
    const locale = getDateLocale();

    const startStr = format(startDate, "yyyy.MM.dd (eee)", { locale });
    
    if (!endDate || start === end) {
        return startStr;
    }
    const endStr = format(endDate, "MM.dd (eee)", { locale });
    return `${startStr} ~ ${endStr}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Hero Section */}
      <div className="bg-[#0F172A] text-white py-10 border-b-4 border-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2 animate-bounce">
            <span className="text-3xl md:text-4xl">🗓️</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 italic tracking-tight">
            {t('nav.events') || "Events"}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed">
            {t('admin.contents.event.card_desc') || "Stay updated with our latest gatherings."}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 md:py-24 container mx-auto px-4 max-w-6xl">
        
        {events.length === 0 ? (
             <div className="text-center py-24 bg-white rounded-[32px] border border-dashed border-slate-200 shadow-sm">
                <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-400 text-lg">{t('word.list.empty') || "No events found."}</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {events.map((event) => {
                // D-Day 계산
                const dDay = Math.ceil((new Date(event.start_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const dDayLabel = dDay > 0 ? `D-${dDay}` : (dDay === 0 ? "Today" : "End");
                const isEnded = dDay < 0;

                return (
                    <Link key={event.id} href={`/events/post/${event.id}`}>
                    <Card className="group rounded-[32px] border-none shadow-lg shadow-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden h-full flex flex-col">
                        {/* 이미지 영역 */}
                        <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                            {event.image_url ? (
                                <img 
                                    src={event.image_url} 
                                    alt={event.title} 
                                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isEnded ? "grayscale" : ""}`} 
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                    <ImageIcon className="w-10 h-10 mb-2" />
                                    <span className="text-xs font-medium">No Image</span>
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <Badge className={`${isEnded ? "bg-slate-500" : "bg-white/90 text-blue-600"} hover:bg-white backdrop-blur-sm shadow-sm font-bold border-none px-3 py-1`}>
                                    {dDayLabel}
                                </Badge>
                            </div>
                        </div>

                        <CardHeader className="p-6 pb-2">
                            <CardTitle className={`text-xl font-bold leading-tight mb-2 ${isEnded ? "text-slate-400" : "text-slate-900 group-hover:text-blue-600"} transition-colors`}>
                                {event.title}
                            </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="p-6 pt-2 flex-grow space-y-4">
                            <div className="space-y-2 text-sm text-slate-600">
                                <div className="flex items-start gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <span className="font-medium">{formatEventDate(event.start_date, event.end_date)}</span>
                                </div>
                                {event.location && (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                        <span>{event.location}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    </Link>
                );
            })}
            </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-10 border-t border-slate-100">
            <Link href={currentPage > 1 ? `/events/${currentPage - 1}` : "#"} className={`p-2 rounded-full border ${currentPage > 1 ? "hover:bg-slate-50" : "opacity-50 pointer-events-none"}`}>
                <ChevronLeft className="w-5 h-5" />
            </Link>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <Link key={num} href={`/events/${num}`} className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all ${currentPage === num ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-100"}`}>
                {num}
              </Link>
            ))}

            <Link href={currentPage < totalPages ? `/events/${currentPage + 1}` : "#"} className={`p-2 rounded-full border ${currentPage < totalPages ? "hover:bg-slate-50" : "opacity-50 pointer-events-none"}`}>
                <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}