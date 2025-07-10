// app/word/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import WordPageClient from "@/components/word-page-client";
// date-fns에서 필요한 함수들을 임포트합니다. isFuture, isPast, startOfDay 추가
import { format, subDays, isAfter, isBefore, startOfDay } from 'date-fns'; 

// 말씀 게시물 및 관련 데이터를 가져오는 함수
async function fetchWordContentAndPosts({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
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

  // 'word' 페이지의 content 데이터 가져오기
  const { data: contentData, error: contentError } = await supabase
    .from("content")
    .select("*")
    .eq("page", "word");

  const contentMap: Record<string, any> = {};
  contentData?.forEach((item) => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });

  if (contentError) {
    console.error("Error fetching Word page content:", contentError);
  }

  const now = new Date(); 
  const todayStart = startOfDay(now); 
  const fiveDaysAgoStart = startOfDay(subDays(now, 5)); 

  const dateParam = typeof searchParams?.date === 'string' ? searchParams.date : undefined;
  let queryTargetDate: Date;

  if (dateParam) {
    const parsedDate = startOfDay(new Date(dateParam)); 
    if (
        !isNaN(parsedDate.getTime()) && // 유효한 날짜인지 확인 (NaN이 아닌지)
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

  // word_posts, word_reactions, word_comments 데이터를 함께 가져오기
  const { data: wordPostsData, error: wordPostsError } = await supabase
    .from("word_posts")
    .select('*, word_reactions(*), word_comments(*), image_url') 
    .eq('word_date', format(queryTargetDate, 'yyyy-MM-dd'))
    .order("word_date", { ascending: false });

  if (wordPostsError) {
    console.error("Error fetching Word posts:", wordPostsError);
  }

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