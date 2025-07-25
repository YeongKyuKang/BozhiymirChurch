// app/story/page.tsx
import Header from "@/components/header" // Header 컴포넌트 임포트
import Footer from "@/components/footer"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import dynamic from 'next/dynamic'

// 클라이언트 컴포넌트를 동적으로 임포트 (SSR 비활성화)
const StoryPageClient = dynamic(() => import("@/components/story-page-client"), { ssr: false });

async function fetchStoryContent() {
  const cookieStore = cookies();

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: CookieOptions) => {
        cookieStore.set({ name, value, ...options });
      },
      remove: (name: string, options: CookieOptions) => {
        cookieStore.set({ name, value: '', ...options });
      },
    },
  })

  const { data, error } = await supabase.from("content").select("page, section, key, value").eq("page", "story")

  if (error) {
    console.error("Failed to fetch story content on the server:", error)
    return {}
  }

  const contentMap: Record<string, any> = {}
  data.forEach((item) => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {}
    }
    contentMap[item.section][item.key] = item.value
  })

  return contentMap
}

export default async function StoryPage() {
  const content = await fetchStoryContent()

  return (
    <>
      <Header /> {/* Header 컴포넌트 렌더링 */}
      <StoryPageClient initialContent={content} />
      <Footer />
    </>
  )
}
