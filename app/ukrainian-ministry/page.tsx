import { supabase } from "@/lib/supabase";
import UkrainianMinistryPageClient from "@/components/ukrainian-ministry-page-client";
import { Database } from "@/lib/supabase";

// 관리자가 수동으로 캐시를 밀어줄 때까지 영구 캐싱 (Edge Request 절감)
export const revalidate = false;

async function getUkrainianData() {
  // 1. 공통 콘텐츠 페칭
  const { data: contentData } = await supabase
    .from("content")
    .select("*")
    .eq("page", "ukrainian");

  const initialContent = contentData?.reduce((acc: any, item) => {
    if (!acc[item.section]) acc[item.section] = {};
    acc[item.section][item.key] = item.value;
    return acc;
  }, {}) || {};

  // 2. 우크라이나 사역 포스트 페칭
  const { data: posts } = await supabase
    .from("ukrainian_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return { initialContent, posts: posts || [] };
}

export default async function UkrainianMinistryPage() {
  // 서버에서 데이터 로드
  const { initialContent, posts } = await getUkrainianData();

  // ssr: false 없이 일반 컴포넌트로 호출 (빌드 에러 해결)
  return (
    <UkrainianMinistryPageClient 
      initialContent={initialContent} 
      initialPosts={posts} 
    />
  );
}