import { getPageContent, getUpcomingEvents } from "@/lib/data";
import HomePageClient from "@/components/home-page-client";

export default async function Page() {
  // 서버에서 기본 데이터를 미리 fetch하여 캐싱합니다.
  const [content, events] = await Promise.all([
    getPageContent("home"),
    getUpcomingEvents(10),
  ]);

  return <HomePageClient />;
}
