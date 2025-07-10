// app/join/page.tsx
// "use client" 지시문 제거
import Header from "@/components/header";
import Footer from "@/components/footer";
// 빌드 시점 데이터 패칭을 위해 createServerClient와 cookies를 임포트합니다.
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import JoinPageClient from "@/components/join-page-client"; // 클라이언트 컴포넌트 import


async function fetchJoinContent() {
  const cookieStore = await cookies(); // cookies() 호출 앞에 await 추가

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value, // ✅ 수정
        set: (name: string, value: string, options: CookieOptions) => { // ✅ 수정
          cookieStore.set({ name, value, ...options });
        },
        remove: (name: string, options: CookieOptions) => { // ✅ 수정
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data, error } = await supabase
    .from('content')
    .select('page, section, key, value')
    .eq('page', 'join');
    
  if (error) {
    console.error('Failed to fetch join content on the server:', error);
    // 오류 발생 시 빈 객체 반환
    console.log('fetchJoinContent: Returning empty object due to error.'); // 오류 시 로그
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
  );
}