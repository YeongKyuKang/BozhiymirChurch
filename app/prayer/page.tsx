// yeongkyukang/bozhiymirchurch/BozhiymirChurch-3007c4235d54890bd3db6acc74558b701965297b/app/prayer/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabase";
import PrayerPageClient from "@/components/prayer-page-client"; // 클라이언트 컴포넌트 이름 변경 및 import 경로 업데이트

async function fetchPrayerContent() {
  const { data: contentData, error: contentError } = await supabase
    .from("content")
    .select("*")
    .eq("page", "prayer"); // 'faith-prayer'에서 'prayer'로 페이지 이름 변경

  const contentMap: Record<string, any> = {};
  contentData?.forEach((item) => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });

  if (contentError) {
    console.error("Error fetching Prayer page content:", contentError);
  }

  // TODO: 기도 제목 데이터를 가져오는 로직 추가 (향후 'prayer_requests' 테이블 등)

  return {
    content: contentMap,
  };
}

export default async function PrayerPage() { // 컴포넌트 이름 변경
  const { content } = await fetchPrayerContent();

  return (
    <>
      <Header />
      {/* 초기에는 빈 데이터나 예시 데이터를 전달 */}
      <PrayerPageClient initialContent={content} initialPrayerRequests={[]} /> 
      <Footer />
    </>
  );
}