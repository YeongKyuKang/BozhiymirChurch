// app/join/page.tsx
// "use client" 지시문 제거
import Header from "@/components/header";
import Footer from "@/components/footer";
// 빌드 시점 데이터 패칭을 위해 createServerClient와 cookies를 임포트합니다.
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import JoinPageClient from "@/components/join-page-client"; // 클라이언트 컴포넌트 import

// 이 페이지는 정적으로 생성되므로, revalidate 설정을 명시적으로 하지 않거나 0으로 설정합니다.
// revalidate를 설정하지 않으면 기본적으로 SSG로 동작합니다.
// export const revalidate = 0; // 필요시 명시적으로 설정

async function fetchJoinContent() {
  const cookieStore = await cookies(); // cookies() 호출 앞에 await 추가

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
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