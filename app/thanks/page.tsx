import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ThanksPageClient from "@/components/thanks-page-client";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grace Sharing | Bozhiymir Church',
  description: 'Share your gratitude, testimonies, and answered prayers with the community.',
};

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const date = typeof resolvedParams.date === 'string' ? resolvedParams.date : undefined;
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : 'created_at_desc';
  const filterCategory = typeof resolvedParams.role === 'string' && resolvedParams.role !== 'all' ? resolvedParams.role : undefined;

  // 병렬 데이터 페칭
  const [contentResult, postsResult] = await Promise.all([
    supabase.from("content").select("*").eq("page", "thanks"),
    (async () => {
      let query = supabase
        .from("thanks_posts")
        .select("*, author:users(role)") // role 정보 join
        .order("created_at", { ascending: sort === "created_at_asc" });

      if (date) query = query.gte("created_at", `${date}T00:00:00Z`).lte("created_at", `${date}T23:59:59Z`);
      if (filterCategory) query = query.eq("category", filterCategory);
      
      return query;
    })()
  ]);

  const contentMap: Record<string, any> = {};
  contentResult.data?.forEach((item: any) => {
    if (!contentMap[item.section]) contentMap[item.section] = {};
    contentMap[item.section][item.key] = item.value;
  });

  return (
    <ThanksPageClient 
      initialContent={contentMap}
      initialThanksPosts={postsResult.data || []} 
    />
  );
}