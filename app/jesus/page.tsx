// yeongkyukang/bozhiymirchurch/BozhiymirChurch-3007c4235d54890bd3db6acc74558b701965297b/app/jesus/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
// 수정: createServerClient 대신 기본 createClient를 사용하고 cookies import 제거
import { createClient } from "@supabase/supabase-js";
import JesusPageClient from "@/components/jesus-page-client"; // 클라이언트 컴포넌트 import

async function fetchJesusContent() {
  // 수정: createClient로 supabase 인스턴스 생성 (cookies 관련 로직 제거)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: contentData, error: contentError } = await supabase
    .from("content")
    .select("*")
    .eq("page", "jesus"); // 'jesus' 페이지 콘텐츠 가져오기

  const contentMap: Record<string, any> = {};
  contentData?.forEach((item) => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });

  if (contentError) {
    console.error("Error fetching Jesus page content:", contentError);
  }

  return {
    content: contentMap,
  };
}

export default async function JesusPage() {
  const { content } = await fetchJesusContent();

  return (
    <>
      <Header />
      <JesusPageClient initialContent={content} />
      <Footer />
    </>
  );
}
