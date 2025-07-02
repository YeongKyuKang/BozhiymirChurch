// app/beliefs/page.tsx
// "use client" 지시문을 제거하여 Server Component로 만듭니다.
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase" // 서버에서 데이터 패칭을 위해 supabase 클라이언트 import
import BeliefsPageClient from "@/components/beliefs-page-client" // 새로 생성할 클라이언트 컴포넌트 import

// 페이지 로드 시 서버에서 데이터를 비동기적으로 미리 가져오는 함수
async function fetchBeliefsContent() {
  const { data, error } = await supabase
    .from('content')
    .select('page, section, key, value')
    .eq('page', 'beliefs');

  if (error) {
    console.error('Failed to fetch beliefs content from DB on the server:', error);
    // 에러 발생 시 빈 객체를 반환하여 앱이 중단되지 않도록 합니다.
    return {};
  }

  const contentMap: Record<string, any> = {};
  data.forEach(item => {
    // 수정된 부분: contentMap[item.section]이 undefined일 경우에만 초기화하도록 수정
    if (contentMap[item.section] === undefined) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });

  return contentMap;
}

export default async function BeliefsPageWrapper() {
  // 서버에서 초기 콘텐츠를 가져와서 클라이언트 컴포넌트에 prop으로 전달합니다.
  const initialContent = await fetchBeliefsContent(); 

  return (
    <>
      <Header />
      {/* 모든 클라이언트 측 로직은 BeliefsPageClient 컴포넌트 내부에서 처리됩니다. */}
      <BeliefsPageClient initialContent={initialContent} />
      <Footer />
    </>
  );
}