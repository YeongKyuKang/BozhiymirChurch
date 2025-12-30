import { supabase } from "@/lib/supabase";
import EventsPageClient from "@/components/events-page-client";
import { notFound } from "next/navigation";

const ITEMS_PER_PAGE = 6;

export const revalidate = 60; // 1분 캐싱
export const dynamicParams = true;

// 정적 경로 생성 (선택 사항)
export async function generateStaticParams() {
  const { count } = await supabase.from("events").select("*", { count: 'exact', head: true });
  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE) || 1;

  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

export default async function EventsPaginationPage({ 
  params 
}: { 
  params: Promise<{ page: string }> 
}) {
  const resolvedParams = await params;
  const pageNumber = parseInt(resolvedParams.page);
  
  if (isNaN(pageNumber) || pageNumber < 1) notFound();

  const from = (pageNumber - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // [수정] start_date 기준으로 정렬
  const { data: events, count } = await supabase
    .from("events")
    .select("*", { count: 'exact' })
    .order("start_date", { ascending: true }) 
    .range(from, to);

  if ((!events || events.length === 0) && pageNumber > 1) notFound();

  return (
    <EventsPageClient 
      events={events || []} 
      totalCount={count || 0}
      currentPage={pageNumber}
      itemsPerPage={ITEMS_PER_PAGE}
    />
  );
}