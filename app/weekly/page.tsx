// yeongkyukang/bozhiymirchurch/BozhiymirChurch-3007c4235d54890bd3db6acc74558b701965297b/app/events/page.tsx
// "use client" 지시문 제거
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase" // 서버에서 데이터 패칭을 위해 추가
import SpecificEventsPageClient from "@/components/specific-events-page-client" // 새로 생성할 클라이언트 컴포넌트 import

// Fetch data on the server
async function fetchSpecificEventsAndContent() {
  const [eventsRes, contentRes] = await Promise.all([
    // 특정일 이벤트를 필터링하도록 수정 (예: recurring: false)
    supabase.from("events").select("*").eq('recurring', false).order("date", { ascending: true }),
    supabase.from("content").select("*").eq('page', 'events'), // 페이지는 'events' 유지
  ]);

  const contentMap: Record<string, any> = {};
  contentRes.data?.forEach(item => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });
  
  if (eventsRes.error) {
    console.error("Error fetching specific events:", eventsRes.error);
  }
  if (contentRes.error) {
    console.error("Error fetching events content:", contentRes.error);
  }

  return {
    specificEvents: eventsRes.data || [],
    content: contentMap,
  };
}

export default async function SpecificEventsPageWrapper() {
  const { specificEvents, content } = await fetchSpecificEventsAndContent();

  return (
    <>
      <Header />
      <SpecificEventsPageClient initialEvents={specificEvents} initialContent={content} />
      <Footer />
    </>
  );
}