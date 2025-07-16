// app/ukrainian-ministry/page.tsx
import Header from "@/components/header" // Header 컴포넌트 임포트
import Footer from "@/components/footer"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import dynamic from 'next/dynamic';
import { Database } from "@/lib/supabase";

// 클라이언트 컴포넌트를 동적으로 임포트 (SSR 비활성화)
const UkrainianMinistryPageClient = dynamic(() => import("@/components/ukrainian-ministry-page-client"), { ssr: false });

type Event = Database['public']['Tables']['events']['Row']; // 이 타입은 events 페이지에서 사용되므로, 여기서는 필요 없을 수 있습니다.

async function fetchUkrainianMinistryContent() {
  const cookieStore = cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name: string, options: CookieOptions) => {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: contentData, error: contentError } = await supabase
    .from("content")
    .select("page, section, key, value") // 명확한 컬럼 선택
    .eq("page", "ukrainian-ministry")

  if (contentError) {
    console.error("Failed to fetch Ukrainian Ministry content on the server:", contentError)
    return {}
  }

  const contentMap: Record<string, any> = {}
  contentData?.forEach((item) => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {}
    }
    contentMap[item.section][item.key] = item.value
  })

  return contentMap
}

export default async function UkrainianMinistryPage() {
  const content = await fetchUkrainianMinistryContent()

  return (
    <>
      <Header /> {/* Header 컴포넌트 렌더링 */}
      <UkrainianMinistryPageClient initialContent={content} />
      <Footer />
    </>
  )
}
