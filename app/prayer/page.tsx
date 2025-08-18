// yeongkyukang/bozhiymirchurch/BozhiymirChurch-3007c4235d54890bd3db6acc74558b701965297b/app/prayer/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import { createServerClient, type CookieOptions } from "@supabase/ssr"; 
import { cookies } from "next/headers";
import PrayerPageClient from "@/components/prayer-page-client";

interface PrayerRequest {
  id: string;
  category: "ukraine" | "bozhiymirchurch" | "members" | "children";
  title: string;
  content: string;
  author_id: string;
  author_nickname: string;
  created_at: string;
  answer_content?: string | null;
  answer_author_id?: string | null;
  answer_author_nickname?: string | null;
  answered_at?: string | null;
}

async function fetchPrayerContentAndRequests() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
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
    .eq("page", "prayer");

  const contentMap: Record<string, any> = {};
  contentData?.forEach((item) => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });

  if (contentError) {
    console.error("Error fetching Prayer page content:", contentError);
  }

  const { data: prayerRequestsData, error: prayerRequestsError } = await supabase
    .from("prayer_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (prayerRequestsError) {
    console.error("Error fetching Prayer Requests:", prayerRequestsError);
  }

  return {
    content: contentMap,
    prayerRequests: prayerRequestsData || [],
  };
}

export default async function PrayerPage() {
  const { content, prayerRequests } = await fetchPrayerContentAndRequests();

  return (
    <>
      <PrayerPageClient initialContent={content} initialPrayerRequests={prayerRequests} /> 
    </>
  );
}