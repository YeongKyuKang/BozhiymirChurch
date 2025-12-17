"use client"

import HeroSection from "@/components/hero-section"
import CommunitySection from "@/components/community-section"
import MinistriesShowcase from "@/components/ministries-showcase"

export default function HomePageClient() {
  // 1. 더 이상 Props로 initialContent를 받을 필요가 없습니다.
  // 2. 모든 섹션이 내부적으로 useLanguage() 훅을 사용하여 다국어를 처리합니다.

  return (
    <main className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <HeroSection />

      {/* 커뮤니티 소개 섹션 */}
      <CommunitySection />

      {/* 사역 안내 섹션 */}
      <MinistriesShowcase />

    </main>
  )
}