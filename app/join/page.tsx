// app/join/page.tsx
import Header from "@/components/header"
import Footer from "@/components/footer"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import dynamic from 'next/dynamic'

// 클라이언트 컴포넌트를 동적으로 임포트 (SSR 비활성화)
const JoinPageClient = dynamic(() => import("@/components/join-page-client"), { ssr: false });

async function fetchJoinContent() {
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

  const { data, error } = await supabase.from("content").select("page, section, key, value").eq("page", "join")

  if (error) {
    console.error("Failed to fetch join content on the server:", error)
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

export default async function JoinPage() {
  const content = await fetchJoinContent()

  return (
    <>
      <Header />
      <JoinPageClient initialContent={content} />
      <Footer />
    </>
  )
}
