// app/communityboard/page.tsx
// "use client" 지시문은 제거되었습니다.

import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Eye, Heart, MessageCircle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EditableText from "@/components/editable-text"
import CommunityBoardPageClient from "@/components/community-board-client" // 새로 생성할 클라이언트 컴포넌트 import

// 이 함수는 서버에서만 실행되어 페이지에 필요한 모든 데이터를 미리 가져옵니다.
async function fetchCommunityData() {
  const [postsRes, contentRes] = await Promise.all([
    supabase
      .from("posts")
      .select(`
        id,
        title,
        content,
        media_url,
        author_id,
        view_count,
        likes_count,
        created_at,
        users:users!posts_author_id_fkey (
          nickname,
          profile_picture_url
        ),
        comments(count)
      `)
      .order("created_at", { ascending: false }),
    supabase.from("content").select("*").eq('page', 'communityboard'),
  ]);
  
  if (postsRes.error) {
    console.error("Error fetching posts on the server:", postsRes.error);
  }
  if (contentRes.error) {
    console.error("Error fetching content on the server:", contentRes.error);
  }

  // 콘텐츠 데이터를 섹션별로 정리합니다.
  const contentMap: Record<string, any> = {};
  contentRes.data?.forEach(item => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });

  return {
    posts: postsRes.data || [],
    content: contentMap,
  };
}

// 이 함수는 Next.js의 Server Component로, 서버에서 실행됩니다.
export default async function CommunityBoardPageWrapper() {
  const { posts, content } = await fetchCommunityData();

  return (
    <>
      <Header />
      <CommunityBoardPageClient initialPosts={posts} initialContent={content} />
      <Footer />
    </>
  );
}