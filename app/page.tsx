// app/page.tsx
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import CommunitySection from "@/components/community-section"
import MinistriesShowcase from "@/components/ministries-showcase"
import KidsMessageForm from "@/components/kids-message-form"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase"

// This is now a Server Component, so you can fetch data directly.
// It will run on the server during the build process or on each request (if not cached).
async function fetchPageContent() {
  const { data, error } = await supabase.from("content").select("*");
  if (error) {
    console.error("Error fetching content on the server:", error);
    return [];
  }
  return data;
}

export default async function Home() {
  const contentData = await fetchPageContent();
  const contentMap = contentData.reduce((acc, item) => {
    if (!acc[item.page]) {
      acc[item.page] = {};
    }
    if (!acc[item.page][item.section]) {
      acc[item.page][item.section] = {};
    }
    acc[item.page][item.section][item.key] = item.value;
    return acc;
  }, {});
  
  const homeContent = contentMap['home'] || {};

  // Pass fetched content to client components as props
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection heroContent={homeContent.hero || {}} />
      <CommunitySection communityContent={homeContent.community_about || {}} communityHighlights={homeContent.community_highlights || {}} />
      <MinistriesShowcase />
      <KidsMessageForm />
      <Footer />
    </div>
  )
}