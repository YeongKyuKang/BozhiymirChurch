import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

// DB 데이터를 컴포넌트에서 쓰기 편한 객체 형태로 변환하는 타입
export type ContentMap = Record<string, Record<string, string>>;

/**
 * 특정 페이지의 텍스트 콘텐츠를 가져와서 객체로 변환합니다.
 * 예: content.hero.title
 */
export async function getPageContent(pageName: string): Promise<ContentMap> {
  return unstable_cache(
    async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("content")
        .select("section, key, value")
        .eq("page", pageName);

      const contentMap: ContentMap = {};
      data?.forEach((item) => {
        if (!contentMap[item.section]) {
          contentMap[item.section] = {};
        }
        contentMap[item.section][item.key] = item.value;
      });

      return contentMap;
    },
    [`content-${pageName}`], 
    { tags: [`content-${pageName}`], revalidate: 3600 } // 1시간 캐시
  )();
}

/**
 * 최신 이벤트 목록 가져오기
 */
export async function getUpcomingEvents(limit = 3) {
  return unstable_cache(
    async () => {
      const supabase = createClient();
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(limit);
      return data || [];
    },
    ["upcoming-events"],
    { tags: ["events"], revalidate: 3600 }
  )();
}