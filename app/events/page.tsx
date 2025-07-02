// app/events/page.tsx
// "use client" 지시문 제거
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase" // 서버에서 데이터 패칭을 위해 추가
import EventsPageClient from "@/components/events-page-client" // 새로 생성할 클라이언트 컴포넌트 import

// Fetch data on the server
async function fetchEventsAndContent() {
  const [eventsRes, contentRes] = await Promise.all([
    supabase.from("events").select("*").order("created_at", { ascending: true }),
    supabase.from("content").select("*").eq('page', 'events'),
  ]);

  const contentMap: Record<string, any> = {};
  contentRes.data?.forEach(item => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });
  
  if (eventsRes.error) {
    console.error("Error fetching events:", eventsRes.error);
  }
  if (contentRes.error) {
    console.error("Error fetching content:", contentRes.error);
  }

  return {
    upcomingEvents: eventsRes.data || [],
    content: contentMap,
  };
}

export default async function EventsPageWrapper() {
  const { upcomingEvents, content } = await fetchEventsAndContent();

  return (
    <>
      <Header />
      <EventsPageClient initialEvents={upcomingEvents} initialContent={content} />
      <Footer />
    </>
  );
}