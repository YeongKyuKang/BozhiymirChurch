import { createServerClient, type CookieOptions } from "@supabase/ssr"; 
import { cookies } from "next/headers";
import PrayerPageClient from "@/components/prayer-page-client";

// 페이지를 동적으로 렌더링하도록 설정 (DB/쿠키 사용 시 권장)
export const dynamic = "force-dynamic";

async function fetchPrayerRequests() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // 서버 컴포넌트에서 쿠키 설정 시 에러 무시
          }
        },
      },
    }
  );

  // [수정] content 테이블 조회 로직 삭제 (더 이상 필요 없음)

  const { data: prayerRequestsData, error: prayerRequestsError } = await supabase
    .from("prayer_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (prayerRequestsError) {
    console.error("Error fetching Prayer Requests:", prayerRequestsError);
  }

  return prayerRequestsData || [];
}

export default async function PrayerPage() {
  // [수정] content를 받지 않고 기도 요청 데이터만 가져옴
  const prayerRequests = await fetchPrayerRequests();

  return (
    <>
      {/* [수정] initialContent prop 전달 삭제 */}
      <PrayerPageClient initialPrayerRequests={prayerRequests} /> 
    </>
  );
}