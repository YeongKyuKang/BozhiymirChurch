import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ThanksPageClient from "@/components/thanks-page-client";
import { format } from "date-fns";
import { toZonedTime } from 'date-fns-tz';

const POLAND_TIMEZONE = 'Europe/Warsaw';

async function fetchThanksData(resolvedParams: any) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  // 콘텐츠 및 게시물 조회 (기존 로직 유지)
  const { data: contentData } = await supabase.from("content").select("*").eq("page", "thanks");
  const contentMap: Record<string, any> = {};
  contentData?.forEach((item) => {
    if (!contentMap[item.section]) contentMap[item.section] = {};
    contentMap[item.section][item.key] = item.value;
  });

  const { role, date, sort } = resolvedParams;
  let query = supabase.from("thanks_posts").select("*, author:users(role)");

  // 필터링 및 정렬 로직 (이전 버전과 동일)
  if (date) query = query.gte("created_at", `${date}T00:00:00Z`).lte("created_at", `${date}T23:59:59Z`);
  query = query.order("created_at", { ascending: sort === "created_at_asc" });

  const { data: postsData } = await query;
  let finalPosts = postsData || [];
  if (role && role !== "all") finalPosts = finalPosts.filter(p => p.category === role);

  return { content: contentMap, thanksPosts: finalPosts };
}

export default async function ThanksPageWrapper({ 
  searchParams 
}: { 
  searchParams: Promise<Record<string, string | string[] | undefined>> 
}) {
  const resolvedSearchParams = await searchParams; // Promise 해결
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const { content, thanksPosts } = await fetchThanksData(resolvedSearchParams);

  return <ThanksPageClient initialContent={content} initialThanksPosts={thanksPosts as any} />;
}