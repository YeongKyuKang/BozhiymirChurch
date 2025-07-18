// app/jesus/page.tsx


import Header from "@/components/header"
import Footer from "@/components/footer"
import { createClient } from "@supabase/supabase-js"
import JesusPageClient from "@/components/jesus-page-client"

async function fetchJesusContent() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const { data: contentData, error: contentError } = await supabase.from("content").select("*").eq("page", "jesus")

  const contentMap: Record<string, any> = {}
  contentData?.forEach((item) => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {}
    }
    contentMap[item.section][item.key] = item.value
  })

  if (contentError) {
    console.error("Error fetching Jesus page content:", contentError)
  }

  return {
    content: contentMap,
  }
}

export default async function JesusPage() {
  const { content } = await fetchJesusContent()

  return (
    <>
      <Header />
      <JesusPageClient initialContent={content} />
      <Footer />
    </>
  )
}