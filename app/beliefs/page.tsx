// app/beliefs/page.tsx
// "use client" 지시문을 제거하여 Server Component로 만듭니다.
import Header from "@/components/header";
import Footer from "@/components/footer";
// 빌드 시점 데이터 패칭을 위해 createServerClient와 cookies를 임포트합니다.
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import BeliefsPageClient from "@/components/beliefs-page-client"; // 클라이언트 컴포넌트 import


// 페이지 로드 시 서버에서 데이터를 비동기적으로 미리 가져오는 함수 (빌드 시점에 실행)
async function fetchBeliefsContent() {
  const cookieStore = await cookies(); // 수정: cookies() 호출 앞에 await 추가

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
    .eq('page', 'beliefs');

  if (error) {
    console.error('Failed to fetch beliefs content from DB on the server:', error);
    return {};
  }

  const contentMap: Record<string, any> = {};
  data.forEach(item => {
    if (contentMap[item.section] === undefined) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });

  return contentMap;
}

export default async function BeliefsPageWrapper() {
  const initialContent = await fetchBeliefsContent(); 

  return (
    <>
      <BeliefsPageClient initialContent={initialContent} />
    </>
  );
}
