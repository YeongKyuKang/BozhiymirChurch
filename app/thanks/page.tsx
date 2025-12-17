import { supabase } from "@/lib/supabase";
import ThanksPageClient from "@/components/thanks-page-client";

export const revalidate = false;

export default async function ThanksPage({ searchParams }: { searchParams: Promise<any> }) {
  await searchParams;

  const [contentRes, postsRes] = await Promise.all([
    supabase.from("content").select("*").eq("page", "thanks"),
    supabase.from("thanks_posts")
      .select("*", { count: 'exact' })
      .order("created_at", { ascending: false })
      .range(0, 5) // 처음에 6개만 가져옴
  ]);

  const initialContent = contentRes.data?.reduce((acc: any, item: any) => {
    if (!acc[item.section]) acc[item.section] = {};
    acc[item.section][item.key] = item.value;
    return acc;
  }, {}) || {};

  return (
    <ThanksPageClient 
      initialContent={initialContent} 
      initialPosts={postsRes.data || []} 
      initialTotalPages={Math.ceil((postsRes.count || 0) / 6)}
    />
  );
}