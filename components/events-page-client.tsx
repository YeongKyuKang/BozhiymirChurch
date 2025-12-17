"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";

interface EventsPageClientProps {
  initialContent: Record<string, any>;
  events: any[];
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
}

export default function EventsPageClient({ 
  initialContent, events, totalCount, currentPage, itemsPerPage 
}: EventsPageClientProps) {
  
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-white pt-16">
      <section className="py-20 bg-[#0F172A] text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 italic">
          {initialContent?.hero?.title || "Events"}
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">{initialContent?.hero?.description}</p>
      </section>

      <section className="py-20 container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {events.map((event) => (
            // 상세 페이지 경로 수정: /events/post/[id]
            <Link key={event.id} href={`/events/post/${event.id}`}>
              <div className="group bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all h-full">
                {event.image_url && (
                  <div className="h-56 overflow-hidden">
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                  <div className="space-y-2 text-slate-600 text-sm pt-4 border-t border-slate-50">
                    <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-blue-500" />{format(new Date(event.event_date), 'yyyy.MM.dd p')}</div>
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-blue-500" />{event.location}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 페이지네이션 UI */}
        <div className="flex flex-col items-center space-y-4 pt-10 border-t">
          <div className="flex items-center space-x-2">
            {currentPage > 1 && (
              <Link href={`/events/${currentPage - 1}`} className="p-2 rounded-full border hover:bg-slate-50"><ChevronLeft /></Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <Link key={num} href={`/events/${num}`} className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${currentPage === num ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-100"}`}>
                {num}
              </Link>
            ))}
            {currentPage < totalPages && (
              <Link href={`/events/${currentPage + 1}`} className="p-2 rounded-full border hover:bg-slate-50"><ChevronRight /></Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}