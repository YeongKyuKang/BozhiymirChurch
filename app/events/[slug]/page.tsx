// app/events/[slug]/page.tsx
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
  
  console.log('Original eventSlug (from params):', eventSlug); 
  console.log('Decoded and Normalized eventSlug (for query):', normalizedAndDecodedSlug); 

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    }
  );

  const { data: event, error } = await supabase
    .from("events")
    .select("id, title, description, event_date, start_time, end_time, location, category, image_url, created_at, updated_at, slug")
    .eq("slug", normalizedAndDecodedSlug) 
    .single();

  if (error) {
    console.error(`Error fetching event by slug ${eventSlug}:`, error);
    return null;
  }

  return event;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const event = await fetchEventDetails(params.slug);
  
  // 백업 이미지 목록 정의
  const backupImages = [
    "/backup_images/event-backup-1.jpg",
    "/backup_images/event-backup-2.jpg",
    "/backup_images/event-backup-3.jpg",
    "/backup_images/event-backup-4.jpg",
    "/backup_images/event-backup-5.jpg",
  ];

  if (!event) {
    notFound();
  }

  const eventTime =
    event.start_time && event.end_time
      ? `${event.start_time} - ${event.end_time}`
      : event.start_time || event.end_time || "시간 미정";

  // 이벤트 이미지가 없으면 백업 이미지 중 하나를 무작위로 선택
  const imageUrlToDisplay = event.image_url || backupImages[Math.floor(Math.random() * backupImages.length)];

  // Google Calendar 이벤트 추가 URL 생성 함수
  const createGoogleCalendarUrl = (event: Event) => {
    const formatDateTime = (date: string, time: string | null) => {
      // YYYY-MM-DDT HHMMSSZ 형식으로 변환 (Google Calendar 요구 사항)
      if (!time) {
        // 시간이 없으면 날짜만 사용 (예: 20250713)
        return format(new Date(date), 'yyyyMMdd');
      }
      // 시간도 있으면 YYYYMMDDTHHMM00Z 형식 (예: 20250713T110000)
      // 시간은 UTC로 간주하거나, 서버 시간대를 고려해야 하지만,
      // 여기서는 이벤트 날짜와 시간을 그대로 문자열로 연결합니다.
      // 실제 앱에서는 `toZonedTime` 등을 사용하여 정확한 UTC 시간을 계산해야 합니다.
      const [hour, minute] = time.split(':');
      const eventDateObj = new Date(date);
      eventDateObj.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);

      // Google Calendar는 Z(UTC) 또는 +-hh:mm 오프셋을 기대합니다.
      // 여기서는 간단하게 Z를 붙여 UTC로 간주하도록 하겠습니다.
      // 실제 시나리오에서는 이벤트의 실제 시간대를 고려해야 합니다.
      return format(eventDateObj, 'yyyyMMdd') + 'T' + format(eventDateObj, 'HHmmss') + 'Z';
    };

    const startDate = formatDateTime(event.event_date, event.start_time);
    const endDate = event.end_time ? formatDateTime(event.event_date, event.end_time) : startDate;

    const googleCalendarBaseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const params = new URLSearchParams();
    params.append('text', event.title);
    params.append('dates', `${startDate}/${endDate}`);
    if (event.description) params.append('details', event.description);
    if (event.location) params.append('location', event.location);
    params.append('sf', 'true'); // Show Free/Busy status
    params.append('output', 'xml'); // Output format

    return `${googleCalendarBaseUrl}&${params.toString()}`;
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* 이미지 컨테이너 크기 고정 및 중앙 정렬 */}
          <div className="relative w-[600px] h-[400px] rounded-lg overflow-hidden shadow-xl mb-8 mx-auto">
            <Image
              src={imageUrlToDisplay}
              alt={event.title}
              width={600} // 고정된 너비
              height={400} // 고정된 높이
              style={{ objectFit: "cover" }} // 이미지가 컨테이너를 채우도록 설정
              className="transition-transform duration-300 hover:scale-105"
              priority
            />
            {event.category && (
              <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md">
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
            {/* 구글 캘린더에 추가 버튼 */}
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <a href={createGoogleCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
                구글 캘린더에 추가
              </a>
            </Button>
            {/* 이벤트 등록/참여 버튼 */}
            <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              <Link href="/join">
                이벤트 등록/참여
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/events">목록으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
