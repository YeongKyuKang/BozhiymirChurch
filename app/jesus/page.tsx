// yeongkyukang/bozhiymirchurch/BozhiymirChurch-3007c4235d54890bd3db6acc74558b701965297b/app/jesus/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabase";
import JesusPageClient from "@/components/jesus-page-client"; // 클라이언트 컴포넌트 import

async function fetchJesusContent() {
  const { data: contentData, error: contentError } = await supabase
    .from("content")
    .select("*")
    .eq("page", "jesus"); // 'jesus' 페이지 콘텐츠 가져오기

  const contentMap: Record<string, any> = {};
  contentData?.forEach((item) => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });

  if (contentError) {
    console.error("Error fetching Jesus page content:", contentError);
  }

  return {
    content: contentMap,
  };
}

export default async function JesusPage() {
  const { content } = await fetchJesusContent();

  return (
    <>
      <Header />
      <JesusPageClient initialContent={content} />
      <Footer />
    </>
  );
}