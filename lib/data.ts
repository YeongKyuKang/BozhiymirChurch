import { createClientForCache } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { Database } from "@/lib/supabase";

type ContentRow = Database['public']['Tables']['content']['Row'];
type EventRow = Database['public']['Tables']['events']['Row'];

export async function getPageContent(pageName: string) {
  return unstable_cache(
    async () => {
      const supabase = createClientForCache();
      const { data } = await supabase
        .from("content")
        .select("*")
        .eq("page", pageName)
        .returns<ContentRow[]>();

      const contentMap: Record<string, Record<string, string>> = {};
      if (data) {
        data.forEach((item) => {
          if (!contentMap[item.section]) contentMap[item.section] = {};
          contentMap[item.section][item.key] = item.value;
        });
      }
      return contentMap;
    },
    [`content-${pageName}`], // 캐시 키
    { tags: [`content-${pageName}`], revalidate: 3600 }
  )();
}

export async function getUpcomingEvents(limit = 10) {
  return unstable_cache(
    async () => {
      const supabase = createClientForCache();
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(limit)
        .returns<EventRow[]>();
      return data || [];
    },
    ["upcoming-events"],
    { tags: ["events"], revalidate: 3600 }
  )();
}