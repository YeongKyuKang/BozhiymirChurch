import { createClient } from "@/lib/supabase/server";
import JoinPageClient from "@/components/join-page-client";

async function fetchJoinContent() {
  const supabase = await createClient();

  // 1. 데이터 조회
  const { data, error } = await supabase
    .from("content")
    .select("*")
    .eq("page", "join");

  // 2. 에러가 있거나 데이터가 없으면 빈 객체 반환
  if (error || !data) {
    console.error("Failed to fetch join content:", error);
    return {};
  }

  const contentMap: Record<string, any> = {};
  
  // 3. ★ 핵심 수정: (data as any[])로 강제 변환하여 'never' 오류 해결 ★
  (data as any[]).forEach((item) => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    // 이제 item.section, item.key 등에 접근해도 에러가 나지 않습니다.
    contentMap[item.section][item.key] = item.value;
  });

  return contentMap;
}

export default async function JoinPage() {
  const content = await fetchJoinContent();

  return (
    <>
      <JoinPageClient initialContent={content} />
    </>
  );
}