import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import ThanksPageClient from "@/components/thanks-page-client";

// 페이지를 동적으로 렌더링 (DB 데이터 최신화)
export const dynamic = "force-dynamic";

export default async function ThanksPage() {
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
            // 서버 컴포넌트에서 쿠키 설정 에러 무시
          }
        },
      },
    }
  );

  // 1. 감사 나눔 게시글 가져오기
  const { data: posts, error } = await supabase
    .from("thanks_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching thanks posts:", error);
  }

  return (
    <>
      <ThanksPageClient 
        initialPosts={posts || []} 
      />
    </>
  );
}