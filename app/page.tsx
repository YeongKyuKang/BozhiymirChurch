import { getPageContent, getUpcomingEvents } from "@/lib/data";
import HeroSection from "@/components/hero-section";
import CommunitySection from "@/components/community-section";
import EventsSection from "@/components/events-section";

// 캐싱된 데이터를 사용하여 페이지 렌더링 (서버 컴포넌트)
export default async function HomePage() {
  // 1. 필요한 데이터를 병렬로 한 번에 가져옵니다.
  const [content, events] = await Promise.all([
    getPageContent("home"),
    getUpcomingEvents(3),
  ]);

  return (
    <main className="flex flex-col min-h-screen">
      {/* 2. 각 섹션에 필요한 데이터만 props로 전달합니다. */}
      
      <HeroSection 
        title={content.hero?.title}
        subtitle={content.hero?.subtitle}
        description={content.hero?.description}
        ctaText={content.hero?.cta_text}
      />

      <CommunitySection 
        title={content.community_about?.main_title}
        subtitle={content.community_about?.subtitle}
        paragraph1={content.community_about?.paragraph_1}
        paragraph2={content.community_about?.paragraph_2}
        highlights={content.community_highlights}
      />

      <EventsSection events={events} />
    </main>
  );
}