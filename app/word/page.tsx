// app/word/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import WordPageClient from "@/components/word-page-client"; // WordPageClient 임포트

// 말씀 게시물 및 관련 데이터를 가져오는 함수
async function fetchWordContentAndPosts() {
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
    .eq("page", "word"); // 페이지 이름을 'word'로 지정

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

  // word_posts, word_reactions, word_comments 데이터를 함께 가져오기
  const { data: wordPostsData, error: wordPostsError } = await supabase
    .from("word_posts")
    .select('*, word_reactions(*), word_comments(*)') // word_reactions과 word_comments를 조인하여 가져옴
    .order("word_date", { ascending: false }); // 최신 말씀이 먼저 오도록 날짜 기준으로 정렬

  if (wordPostsError) {
    console.error("Error fetching Word posts:", wordPostsError);
  }

  return {
    content: contentMap,
    wordPosts: wordPostsData || [], // 가져온 데이터를 반환
  };
}

// Word 페이지 컴포넌트
export default async function WordPage() {
  const { content, wordPosts } = await fetchWordContentAndPosts(); // 데이터 가져오는 함수 호출

  return (
    <>
      <Header />
      {/* 가져온 데이터를 initialContent와 initialWordPosts prop으로 WordPageClient에 전달 */}
      <WordPageClient initialContent={content} initialWordPosts={wordPosts} />
      <Footer />
    </>
  );
}
