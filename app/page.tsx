import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import CommunitySection from "@/components/community-section"
import MinistriesShowcase from "@/components/ministries-showcase"
import KidsMessageForm from "@/components/kids-message-form"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <CommunitySection />
      <MinistriesShowcase />
      <KidsMessageForm />
      <Footer />
    </div>
  )
}
