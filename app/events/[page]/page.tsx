import { supabase } from "@/lib/supabase";
import EventsPageClient from "@/components/events-page-client";
import { notFound } from "next/navigation";

const ITEMS_PER_PAGE = 4;

// 빌드 시점에 모든 페이지 번호를 정적으로 생성 (Edge Request 절감)
export async function generateStaticParams() {
  const { count } = await supabase.from("events").select("*", { count: 'exact', head: true });
  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE) || 1;

  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

// 수동 재검증 전까지 영구 캐싱
export const revalidate = false;
export const dynamicParams = true;

async function getPaginatedEvents(page: number) {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const [contentRes, eventsRes] = await Promise.all([
    supabase.from("content").select("*").eq("page", "events"),
    supabase.from("events")
      .select("*", { count: 'exact' })
      .order("event_date", { ascending: true })
      .range(from, to)
  ]);

  const initialContent = contentRes.data?.reduce((acc: any, item: any) => {
    if (!acc[item.section]) acc[item.section] = {};
    acc[item.section][item.key] = item.value;
    return acc;
  }, {}) || {};

  return { 
    initialContent, 
    events: eventsRes.data || [],
    totalCount: eventsRes.count || 0,
    currentPage: page
  };
}

export default async function EventsPaginationPage({ 
  params 
}: { 
  params: Promise<{ page: string }> 
}) {
  const { page } = await params;
  const pageNumber = parseInt(page);
  
  if (isNaN(pageNumber) || pageNumber < 1) notFound();

  const { initialContent, events, totalCount, currentPage } = await getPaginatedEvents(pageNumber);

  if (events.length === 0 && pageNumber > 1) notFound();

  return (
    <EventsPageClient 
      initialContent={initialContent} 
      events={events} 
      totalCount={totalCount}
      currentPage={currentPage}
      itemsPerPage={ITEMS_PER_PAGE}
    />
  );
}