// app/word/page.tsx
export const revalidate = 0; // 페이지 캐싱 비활성화 (요청 시마다 최신 데이터 로드)

import Header from "@/components/header";
import Footer from "@/components/footer";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import WordPageClient from "@/components/word-page-client";
import { format, subDays, isAfter, isBefore, startOfDay } from 'date-fns'; 

// 말씀 게시물 및 관련 데이터를 가져오는 함수
async function fetchWordContentAndPosts({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const cookieStore = await cookies();

  // Supabase 환경 변수 확인 및 로그 (이전 단계에서 추가됨)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Supabase 환경 변수가 설정되지 않았습니다! NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인하세요.");
    return { content: {}, wordPosts: [] }; // 환경 변수 없으면 빈 값 반환
  }

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

  // 'word' 페이지의 content 데이터 가져오기
  const { data: contentData, error: contentError } = await supabase
    .from("content")
    .select("*")
    .eq("page", "word");

  if (contentError) {
    console.error("Error fetching Word page content:", contentError);
  }
  console.log('Fetched raw content data for word page (from DB):', contentData);


  const contentMap: Record<string, any> = {};
  contentData?.forEach((item) => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });
  console.log('Processed content map for word page:', contentMap);


  const now = new Date(); 
  const todayStart = startOfDay(now); 
  const fiveDaysAgoStart = startOfDay(subDays(now, 5)); 

  const dateParam = typeof searchParams?.date === 'string' ? searchParams.date : undefined;
  let queryTargetDate: Date;

  if (dateParam) {
    const parsedDate = startOfDay(new Date(dateParam)); 
    if (
        !isNaN(parsedDate.getTime()) && 
        !isAfter(parsedDate, todayStart) && 
        !isBefore(parsedDate, fiveDaysAgoStart) 
    ) {
      queryTargetDate = parsedDate;
    } else {
      queryTargetDate = todayStart;
    }
  } else {
    queryTargetDate = todayStart;
  }

  // 말씀 게시물 데이터 가져오기 (✅ 수정: 원래의 포괄적인 쿼리로 되돌리기)
  const { data: wordPostsData, error: wordPostsError } = await supabase
    .from("word_posts")
    .select('*, word_reactions(*), word_comments(*), image_url') // ✅ 수정: 원래 쿼리로 복원
    .eq('word_date', format(queryTargetDate, 'yyyy-MM-dd'))
    .order("word_date", { ascending: false });

  if (wordPostsError) {
    console.error("Error fetching Word posts:", wordPostsError);
  }
  console.log('Fetched word posts data for', format(queryTargetDate, 'yyyy-MM-dd'), ':', wordPostsData);


  return {
    content: contentMap,
    wordPosts: wordPostsData || [],
  };
}

// Word 페이지 컴포넌트
export default async function WordPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[]>;
}) {
  const { content, wordPosts } = await fetchWordContentAndPosts({ searchParams });

  return (
    <>
      <Header />
      <WordPageClient initialContent={content} initialWordPosts={wordPosts} />
      <Footer />
    </>
  );
}