// app/leadership/page.tsx
// "use client" 지시문 제거
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase" // 서버 컴포넌트에서 DB 패칭을 위해 추가
import LeadershipPageClient from "@/components/leadership-page-client" // 새로 생성할 클라이언트 컴포넌트 import

async function fetchLeadershipContent() {
  const { data, error } = await supabase
    .from('content')
    .select('page, section, key, value')
    .eq('page', 'leadership');
    
  if (error) {
    console.error('Failed to fetch leadership content on the server:', error);
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

export default async function LeadershipPageWrapper() {
  const initialContent = await fetchLeadershipContent(); 

  return (
    <>
      <Header />
      <LeadershipPageClient initialContent={initialContent} />
      <Footer />
    </>
  )
}