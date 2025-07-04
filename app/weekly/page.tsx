// yeongkyukang/bozhiymirchurch/BozhiymirChurch-3007c4235d54890bd3db6acc74558b701965297b/app/weekly/page.tsx
// "use client" 지시문 제거
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase" // 서버에서 데이터 패칭을 위해 추가
import WeeklyEventsPageClient from "@/components/weekly-events-page-client" // 새로 생성할 클라이언트 컴포넌트 import

// Fetch data on the server
async function fetchWeeklyEventsAndContent() {
  const [eventsRes, contentRes] = await Promise.all([
    // 상시 이벤트를 필터링하도록 수정 (예: recurring: true 또는 category: 'Weekly')
    supabase.from("events").select("*").eq('recurring', true).order("created_at", { ascending: true }),
    supabase.from("content").select("*").eq('page', 'weekly'), // 페이지를 'weekly'로 변경
  ]);

  const contentMap: Record<string, any> = {};
  contentRes.data?.forEach(item => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });
  
  if (eventsRes.error) {
    console.error("Error fetching weekly events:", eventsRes.error);
  }
  if (contentRes.error) {
    console.error("Error fetching weekly content:", contentRes.error);
  }

  return {
    weeklyEvents: eventsRes.data || [],
    content: contentMap,
  };
}

export default async function WeeklyEventsPageWrapper() {
  const { weeklyEvents, content } = await fetchWeeklyEventsAndContent();

  return (
    <>
      <Header />
      <WeeklyEventsPageClient initialEvents={weeklyEvents} initialContent={content} />
      <Footer />
    </>
  );
}