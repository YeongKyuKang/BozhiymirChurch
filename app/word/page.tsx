import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import WordPageClient from "@/components/word-page-client";

export const dynamic = "force-dynamic";

export default async function WordPage() {
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

  // 1. 말씀 포스트 데이터 가져오기
  const { data: wordPosts, error } = await supabase
    .from("word_posts")
    .select("*")
    .order("word_date", { ascending: false });

  if (error) {
    console.error("Error fetching word posts:", error);
  }

  return (
    <>
      <WordPageClient 
        initialPosts={wordPosts || []} 
      />
    </>
  );
}