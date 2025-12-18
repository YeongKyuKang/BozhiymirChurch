import { supabase } from "@/lib/supabase";
import WordPageClient from "@/components/word-page-client";
import { cookies } from "next/headers";

// 1시간마다 페이지 재생성 (캐싱)
export const revalidate = 3600;

async function getInitialData() {
  // 1. 페이지 공통 콘텐츠 가져오기
  const { data: contentData } = await supabase
    .from("content")
    .select("*")
    .eq("page", "word");

  const initialContent = contentData?.reduce((acc: any, item) => {
    if (!acc[item.section]) acc[item.section] = {};
    acc[item.section][item.key] = item.value;
    return acc;
  }, {}) || {};

  // 2. 말씀 포스트 가져오기 (초기 데이터)
  const { data: initialWordPosts } = await supabase
    .from("word_posts")
    .select(`
      *,
      likes:word_reactions(user_id)
    `)
    .eq("word_reactions.reaction_type", "like")
    .order("word_date", { ascending: false });

  return { initialContent, initialWordPosts: initialWordPosts || [] };
}

export default async function WordPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[]>;
}) {
  // 서버에서 데이터 직접 페칭
  const { initialContent, initialWordPosts } = await getInitialData();

  return (
    <WordPageClient 
      initialContent={initialContent} 
      initialWordPosts={initialWordPosts} 
    />
  );
}
