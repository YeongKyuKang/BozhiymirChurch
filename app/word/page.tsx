// yeongkyukang/bozhiymirchurch/BozhiymirChurch-3007c4235d54890bd3db6acc74558b701965297b/app/word/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabase";
import WordPageClient from "@/components/word-page-client"; // 클라이언트 컴포넌트 이름 변경 및 import 경로 업데이트

async function fetchWordContent() {
  const { data: contentData, error: contentError } = await supabase
    .from("content")
    .select("*")
    .eq("page", "word"); // 'faith-word'에서 'word'로 페이지 이름 변경

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

  return {
    content: contentMap,
  };
}

export default async function WordPage() { // 컴포넌트 이름 변경
  const { content } = await fetchWordContent();

  // TODO: 말씀 게시물 데이터를 가져오는 로직 추가 (향후 'word_posts' 테이블 등)

  return (
    <>
      <Header />
      {/* 초기에는 빈 데이터나 예시 데이터를 전달 */}
      <WordPageClient initialContent={content} initialWordPosts={[]} /> 
      <Footer />
    </>
  );
}