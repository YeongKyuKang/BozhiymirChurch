// app/word/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import dynamic from 'next/dynamic'; 
import { format, subDays, isAfter, isBefore, startOfDay } from 'date-fns'; 

const WordPageClient = dynamic(() => import("@/components/word-page-client"), { ssr: false });

async function fetchWordContentAndPosts({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const cookieStore = await cookies();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Supabase 환경 변수가 설정되지 않았습니다! NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인하세요.");
    return { content: {}, wordPosts: [] }; 
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

  // word_posts 데이터 가져오기 (✅ 수정: word_comments(*) 제거)
  const { data: wordPostsData, error: wordPostsError } = await supabase
    .from("word_posts")
    .select('*, word_reactions(*), image_url') // ✅ 수정: word_comments(*) 제거
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