// app/page.tsx
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase"
import HomePageClient from "@/components/home-page-client" // 새로 생성할 클라이언트 컴포넌트 import

// 서버에서 홈페이지 콘텐츠를 미리 가져오는 함수
async function fetchHomePageContent() {
  const { data, error } = await supabase.from("content").select("*").eq('page', 'home');
  if (error) {
    console.error("Error fetching content on the server:", error);
    return {};
  }
  const contentMap: Record<string, any> = {};
  data.forEach(item => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });
  return contentMap;
}

export default async function Home() {
  const initialContent = await fetchHomePageContent();
  
  return (
    <>
      <Header />
      {/* 모든 클라이언트 측 로직은 HomePageClient 컴포넌트 내부에서 처리됩니다. */}
      <HomePageClient initialContent={initialContent} />
      <Footer />
    </>
  )
}