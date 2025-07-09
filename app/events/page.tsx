// app/events/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import { createServerClient, type CookieOptions } from "@supabase/ssr"; // 서버용 supabase 임포트
import { cookies } from "next/headers";
import SpecificEventsPageClient from "@/components/events-page-client"; // 컴포넌트 이름 일관성 유지
import { Database } from "@/lib/supabase"; // lib/supabase.ts에서 Database 타입 임포트

// Event 인터페이스를 Database 타입에서 파생
type Event = Database['public']['Tables']['events']['Row'];

// 이벤트 및 페이지 콘텐츠 데이터를 가져오는 함수
async function fetchEventsContentAndData() {
  const cookieStore = cookies();

  const supabase = createServerClient<Database>( // Database 타입 사용
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

  // 'events' 페이지의 content 데이터 가져오기
  const { data: contentData, error: contentError } = await supabase
    .from("content")
    .select("*")
    .eq("page", "events");

  const contentMap: Record<string, any> = {};
  contentData?.forEach((item) => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });

  if (contentError) {
    console.error("Error fetching Events page content:", contentError);
  }

  // 'events' 테이블에서 이벤트 데이터 가져오기
  // supabase.ts의 events 스키마 필드에 맞춰 쿼리 수정
  const { data: eventsData, error: eventsError } = await supabase
    .from("events")
    .select("id, created_at, title, description, date, time, location, category, recurring, icon, updated_at") // supabase.ts의 events 스키마 필드 사용
    .order("date", { ascending: true }) // 'date' 필드로 정렬
    .order("time", { ascending: true }); // 'time' 필드로 정렬

  if (eventsError) {
    console.error("Error fetching events:", eventsError);
    // 데이터 가져오기 실패 시 목업 데이터 사용 (supabase.ts 스키마에 맞춰 수정)
    console.warn("Falling back to mock event data. Please ensure 'events' table exists and is populated with correct schema.");
    const mockEvents: Event[] = [ // Event[] 타입 명시
      {
        id: "event-1",
        created_at: new Date().toISOString(),
        title: "주일 예배",
        description: "매주 주일 드리는 온 가족 예배입니다. 찬양과 말씀으로 함께 은혜를 나눕니다.",
        date: "2025-07-13",
        time: "11:00",
        location: "본당",
        category: "예배",
        recurring: true, // recurring 필드 추가
        icon: "https://placehold.co/600x400/FFDDC1/000000?text=Worship+Service", // icon 필드 사용
        updated_at: new Date().toISOString()
      },
      {
        id: "event-2",
        created_at: new Date().toISOString(),
        title: "어린이 성경학교",
        description: "아이들이 즐겁게 성경을 배우고 신앙을 키울 수 있는 프로그램입니다.",
        date: "2025-07-20",
        time: "10:00",
        location: "유아실",
        category: "어린이",
        recurring: false,
        icon: "https://placehold.co/600x400/D1E7FF/000000?text=Kids+Bible+School",
        updated_at: new Date().toISOString()
      },
      {
        id: "event-3",
        created_at: new Date().toISOString(),
        title: "청년부 모임",
        description: "젊은이들을 위한 교제와 신앙 성장을 위한 시간입니다.",
        date: "2025-07-15",
        time: "19:00",
        location: "소그룹실",
        category: "청소년/청년",
        recurring: true,
        icon: "https://placehold.co/600x400/E6CCFF/000000?text=Youth+Group",
        updated_at: new Date().toISOString()
      },
      {
        id: "event-4",
        created_at: new Date().toISOString(),
        title: "수요 성경공부",
        description: "성경을 깊이 있게 공부하며 삶에 적용하는 시간입니다.",
        date: "2025-07-16",
        time: "20:00",
        location: "온라인 (Zoom)",
        category: "성경공부",
        recurring: true,
        icon: "https://placehold.co/600x400/C1FFD1/000000?text=Bible+Study",
        updated_at: new Date().toISOString()
      },
      {
        id: "event-5",
        created_at: new Date().toISOString(),
        title: "새벽 기도회",
        description: "매일 새벽 하나님께 나아가 기도하는 시간입니다.",
        date: "2025-07-14",
        time: "06:00",
        location: "본당",
        category: "예배",
        recurring: true,
        icon: "https://placehold.co/600x400/FFC1C1/000000?text=Morning+Prayer",
        updated_at: new Date().toISOString()
      },
      {
        id: "event-6",
        created_at: new Date().toISOString(),
        title: "여성 모임",
        description: "여성들을 위한 교제와 나눔의 시간입니다.",
        date: "2025-07-25",
        time: "14:00",
        location: "친교실",
        category: "공동체",
        recurring: false,
        icon: "https://placehold.co/600x400/C1FFFF/000000?text=Women's+Fellowship",
        updated_at: new Date().toISOString()
      },
      {
        id: "event-7",
        created_at: new Date().toISOString(),
        title: "남성 모임",
        description: "남성들을 위한 교제와 나눔의 시간입니다.",
        date: "2025-07-26",
        time: "14:00",
        location: "친교실",
        category: "공동체",
        recurring: false,
        icon: "https://placehold.co/600x400/E0C1FF/000000?text=Men's+Fellowship",
        updated_at: new Date().toISOString()
      },
      {
        id: "event-8",
        created_at: new Date().toISOString(),
        title: "새 신자 환영회",
        description: "교회에 새로 오신 분들을 환영하고 소개하는 자리입니다.",
        date: "2025-08-03",
        time: "13:00",
        location: "카페테리아",
        category: "공동체",
        recurring: false,
        icon: "https://placehold.co/600x400/FFD700/000000?text=New+Comers",
        updated_at: new Date().toISOString()
      }
    ];
    return {
      initialEvents: mockEvents,
      content: contentMap,
    };
  }

  return {
    initialEvents: eventsData as Event[], // 타입 단언 추가
    content: contentMap,
  };
}

// Events 페이지 컴포넌트
export default async function EventsPage() {
  const { initialEvents, content } = await fetchEventsContentAndData();

  return (
    <>
      <Header />
      {/* 가져온 데이터를 initialContent와 initialEvents prop으로 SpecificEventsPageClient에 전달 */}
      <SpecificEventsPageClient initialEvents={initialEvents} initialContent={content} />
      <Footer />
    </>
  );
}
