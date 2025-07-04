// app/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import HomePageClient from "@/components/home-page-client";

// 이 페이지는 정적으로 생성되므로, revalidate 설정을 명시적으로 하지 않거나 0으로 설정합니다.
// revalidate를 설정하지 않으면 기본적으로 SSG로 동작합니다.
// export const revalidate = 0; // 필요시 명시적으로 설정

// 서버에서 홈페이지 콘텐츠를 미리 가져오는 함수 (빌드 시점에 실행)
async function fetchHomePageContent() {
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
      <HomePageClient initialContent={initialContent} />
      <Footer />
    </>
  );
}