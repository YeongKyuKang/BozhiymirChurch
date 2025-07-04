// app/join/page.tsx
// "use client" 지시문 제거
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase"
import JoinPageClient from "@/components/join-page-client" // 새로 생성할 클라이언트 컴포넌트 import

async function fetchJoinContent() {
  const { data, error } = await supabase
    .from('content')
    .select('page, section, key, value')
    .eq('page', 'join');
    
  if (error) {
    console.error('Failed to fetch join content on the server:', error);
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

export default async function JoinPageWrapper() {
  const initialContent = await fetchJoinContent(); 

  return (
    <>
      <Header />
      <JoinPageClient initialContent={initialContent} />
      <Footer />
    </>
  )
}