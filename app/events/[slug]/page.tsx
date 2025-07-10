// app/events/[slug]/page.tsx
export const revalidate = 0; // 페이지 캐싱 방지 (필요 시 유지)

import Header from "@/components/header";
import Footer from "@/components/footer";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { Database } from "@/lib/supabase";

type Event = Database['public']['Tables']['events']['Row'];

interface EventDetailPageProps {
  params: {
    slug: string;
  };
}

async function fetchEventDetails(eventSlug: string): Promise<Event | null> {
  const cookieStore = cookies();

  // URL 인코딩된 슬러그를 디코딩합니다.
  const decodedSlug = decodeURIComponent(eventSlug);
  // 정규화는 혹시 모를 상황을 위해 유지합니다.
  const normalizedAndDecodedSlug = decodedSlug.normalize('NFC'); 
  
  console.log('Original eventSlug (from params):', eventSlug); // 원본
  console.log('Decoded and Normalized eventSlug (for query):', normalizedAndDecodedSlug); // 쿼리에 사용될 값 확인

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name: string, options: CookieOptions) => {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: event, error } = await supabase
    .from("events")
    .select("id, title, description, event_date, start_time, end_time, location, category, image_url, created_at, updated_at, slug")
    .eq("slug", normalizedAndDecodedSlug) // 디코딩 및 정규화된 슬러그 사용
    .single();

  if (error) {
    console.error(`Error fetching event by slug ${eventSlug}:`, error);
    return null;
  }

  return event;
}
export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const event = await fetchEventDetails(params.slug);
  

  if (!event) {
    notFound();
  }

  const eventTime =
    event.start_time && event.end_time
      ? `${event.start_time} - ${event.end_time}`
      : event.start_time || event.end_time || "시간 미정";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-xl mb-8">
            <Image
              src={event.image_url || "https://placehold.co/1200x600/CCCCCC/000000?text=Event+Image"}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              style={{ objectFit: "cover" }}
              className="transition-transform duration-300 hover:scale-105"
              priority
            />
            {event.category && (
              <span className="absolute top-4 left-4 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md">
                {event.category}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            {event.title}
          </h1>

          <div className="text-lg text-gray-700 mb-6 space-y-2">
            {event.event_date && (
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-3 text-blue-600" />
                <span>{format(new Date(event.event_date), "yyyy년 MM월 dd일 (EEE)")}</span>
              </div>
            )}
            {(event.start_time || event.end_time) && (
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-blue-600" />
                <span>{eventTime}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {event.description && (
            <div className="prose prose-lg max-w-none text-gray-800 mb-10">
              <p className="whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              구글 캘린더에 추가
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              이벤트 등록/참여
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/events">목록으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}