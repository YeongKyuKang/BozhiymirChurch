import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import EventsBoard from "@/components/events-board"
import AnnouncementsSection from "@/components/announcements-section"
import KidsMessageForm from "@/components/kids-message-form"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <EventsBoard />
      <AnnouncementsSection />
      <KidsMessageForm />
      <Footer />
    </div>
  )
}
