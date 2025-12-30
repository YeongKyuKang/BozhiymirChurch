import { supabase } from "@/lib/supabase";
import EventsPageClient from "@/components/events-page-client";

const ITEMS_PER_PAGE = 6; // 페이지당 6개 (3열 그리드에 맞춤)

// 항상 최신 데이터 로드
export const dynamic = "force-dynamic";

export default async function EventsIndexPage() {
  // 1페이지 데이터 (0 ~ 5)
  const { data: events, count } = await supabase
    .from("events")
    .select("*", { count: 'exact' })
    .order("start_date", { ascending: true }) // 날짜순 정렬
    .range(0, ITEMS_PER_PAGE - 1);

  return (
    <EventsPageClient 
      events={events || []} 
      totalCount={count || 0}
      currentPage={1}
      itemsPerPage={ITEMS_PER_PAGE}
    />
  );
}