// app/events/page.tsx
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

  const { data: eventsData} = await supabase
    .from("events")
    .select("id, created_at, title, description, event_date, start_time, end_time, location, category, image_url, updated_at, slug")
    .order("event_date", { ascending: true })
    .order("start_time", { ascending: true });

  return {
    initialEvents: eventsData as Event[],
    content: contentMap,
  };
}

export default async function EventsPage() {
  const { initialEvents, content } = await fetchEventsContentAndData();

  return (
    <>
      <SpecificEventsPageClient initialEvents={initialEvents} initialContent={content} />
    </>
  );
}