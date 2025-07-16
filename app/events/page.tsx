// app/events/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import dynamic from 'next/dynamic';
import { Database } from "@/lib/supabase";

// 클라이언트 컴포넌트를 동적으로 임포트 (SSR 비활성화)
const SpecificEventsPageClient = dynamic(() => import("@/components/events-page-client"), { ssr: false });

type Event = Database['public']['Tables']['events']['Row'];

async function fetchEventsContentAndData() {
  const cookieStore = cookies();

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

  // 'events' 테이블에서 이벤트 데이터 가져오기 (slug 필드 포함)
  const { data: eventsData, error: eventsError } = await supabase
    .from("events")
    .select("id, created_at, title, description, event_date, start_time, end_time, location, category, image_url, updated_at, slug") // slug 필드 추가
    .order("event_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (eventsError) {
    console.error("Error fetching events:", eventsError);
    console.warn("Falling back to mock event data. Please ensure 'events' table exists and is populated with correct schema.");
    
    // 데이터 가져오기 실패 시 목업 데이터 사용 (slug 필드 포함)
    const mockEvents: Event[] = [
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        created_at: new Date().toISOString(),
        title: "주일 예배",
        slug: "juil-yebae", // 목업 데이터에도 slug 추가
        description: "매주 주일 드리는 온 가족 예배입니다. 찬양과 말씀으로 함께 은혜를 나눕니다.",
        event_date: "2025-07-13",
        start_time: "11:00",
        end_time: "12:30",
        location: "본당",
        category: "예배",
        image_url: "https://placehold.co/600x400/FFDDC1/000000?text=Worship+Service",
        updated_at: new Date().toISOString()
      },
      {
        id: "b1fcc100-0d1c-4f19-8a7e-7cc0cc481b22",
        created_at: new Date().toISOString(),
        title: "어린이 성경학교",
        slug: "eorini-seonggyeonghakgyo",
        description: "아이들이 즐겁게 성경을 배우고 신앙을 키울 수 있는 프로그램입니다.",
        event_date: "2025-07-20",
        start_time: "10:00",
        end_time: "12:00",
        location: "유아실",
        category: "어린이",
        image_url: "https://placehold.co/600x400/D1E7FF/000000?text=Kids+Bible+School",
        updated_at: new Date().toISOString()
      },
      {
        id: "c2gdd211-1e2d-4g20-9b8f-8dd1dd592c33",
        created_at: new Date().toISOString(),
        title: "청년부 모임",
        slug: "cheongnyeonbu-moim",
        description: "젊은이들을 위한 교제와 신앙 성장을 위한 시간입니다.",
        event_date: "2025-07-15",
        start_time: "19:00",
        end_time: "21:00",
        location: "소그룹실",
        category: "청소년/청년",
        image_url: "https://placehold.co/600x400/E6CCFF/000000?text=Youth+Group",
        updated_at: new Date().toISOString()
      },
      {
        id: "d3hee322-2f3e-4h21-0c9a-9ee2ee6a3d44",
        created_at: new Date().toISOString(),
        title: "수요 성경공부",
        slug: "suyo-seonggyeonggongbu",
        description: "성경을 깊이 있게 공부하며 삶에 적용하는 시간입니다.",
        event_date: "2025-07-16",
        start_time: "20:00",
        end_time: "21:30",
        location: "온라인 (Zoom)",
        category: "성경공부",
        image_url: "https://placehold.co/600x400/C1FFD1/000000?text=Bible+Study",
        updated_at: new Date().toISOString()
      },
      {
        id: "e4iff433-3g4f-4i22-1da0-afe3ff7b4e55",
        created_at: new Date().toISOString(),
        title: "새벽 기도회",
        slug: "saebyeok-gidohoe",
        description: "매일 새벽 하나님께 나아가 기도하는 시간입니다.",
        event_date: "2025-07-14",
        start_time: "06:00",
        end_time: "07:00",
        location: "본당",
        category: "예배",
        image_url: "https://placehold.co/600x400/FFC1C1/000000?text=Morning+Prayer",
        updated_at: new Date().toISOString()
      },
      {
        id: "f5jgg544-4h5g-4j23-2eb1-bfg4gg8c5f66",
        created_at: new Date().toISOString(),
        title: "여성 모임",
        slug: "yeoseong-moim",
        description: "여성들을 위한 교제와 나눔의 시간입니다.",
        event_date: "2025-07-25",
        start_time: "14:00",
        end_time: "16:00",
        location: "친교실",
        category: "공동체",
        image_url: "https://placehold.co/600x400/C1FFFF/000000?text=Women's+Fellowship",
        updated_at: new Date().toISOString()
      },
      {
        id: "g6khh655-5i6h-4k24-3fc2-cgh5hh9d6g77",
        created_at: new Date().toISOString(),
        title: "남성 모임",
        slug: "namseong-moim",
        description: "남성들을 위한 교제와 나눔의 시간입니다.",
        event_date: "2025-07-26",
        start_time: "14:00",
        end_time: "16:00",
        location: "친교실",
        category: "공동체",
        image_url: "https://placehold.co/600x400/E0C1FF/000000?text=Men's+Fellowship",
        updated_at: new Date().toISOString()
      },
      {
        id: "h7lii766-6j7i-4l25-4gd3-dij6ii0e7h88",
        created_at: new Date().toISOString(),
        title: "새 신자 환영회",
        slug: "saesin-ja-hwanyeonghoe",
        description: "교회에 새로 오신 분들을 환영하고 소개하는 자리입니다.",
        event_date: "2025-08-03",
        start_time: "13:00",
        end_time: "14:00",
        location: "카페테리아",
        category: "공동체",
        image_url: "https://placehold.co/600x400/FFD700/000000?text=New+Comers",
        updated_at: new Date().toISOString()
      }
    ];
    return {
      initialEvents: mockEvents,
      content: contentMap,
    };
  }

  return {
    initialEvents: eventsData as Event[],
    content: contentMap,
  };
}

export default async function EventsPage() {
  const { initialEvents, content } = await fetchEventsContentAndData();

  return (
    <>
      <Header />
      <SpecificEventsPageClient initialEvents={initialEvents} initialContent={content} />
      <Footer />
    </>
  );
}
