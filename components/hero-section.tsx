"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"


export default function HeroSection() {
  const { t, language } = useLanguage() // language 가져오기
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const backgroundImages = [
    "/images/bozhiymir2.jpg",
    "/images/bozhiymir3.jpg",
    "/images/bozhiymir4.jpg",
    "/images/bozhiymir5.jpg",
    "/images/bozhiymir6.jpg",
    "/images/bozhiymir7.jpg",
  ]

  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 5000)
  }

  useEffect(() => {
    startAutoSlide()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX)
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > 70) setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    if (distance < -70) setCurrentImageIndex((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length)
    setTouchStart(null); setTouchEnd(null); startAutoSlide()
  }

  return (
    <section 
      className="relative h-[100vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center pt-12 bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image 
              src={src} 
              alt="Background" 
              fill 
              className="object-contain" 
              priority={index === 0}
              unoptimized={true}
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>
        ))}
      </div>

      <div className={`relative z-30 container mx-auto px-4 text-center text-white transition-all duration-1000 ${
        currentImageIndex === 4 || currentImageIndex === 5 
          ? "opacity-0 pointer-events-none" 
          : "opacity-100 translate-y-0"
      }`}>
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-7">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight drop-shadow-xl">
            {t('home.hero.welcome_title')}
            <br />
          </h1>

          <div className="inline-block px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl space-y-2">
            <div className="text-base md:text-lg font-bold text-yellow-400">
               {t('home.hero.service_label')}
            </div>
            <div className="text-xl md:text-2xl font-extrabold tracking-normal">
              {t('home.hero.service_time')}
            </div>
            <div className="flex items-center justify-center gap-1.5 text-sm md:text-base text-blue-100">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>{t('home.hero.service_location')}</span>
            </div>
          </div>

          <div className="pt-4 max-w-[90vw] md:max-w-6xl mx-auto">
            {/* 영어('en')일 때만 md:whitespace-nowrap을 제거하여 자연스럽게 두 줄로 나오게 함 */}
            <p className={`italic text-sm md:text-base lg:text-[17px] text-blue-50/90 leading-relaxed font-medium tracking-tighter md:tracking-tight ${
              language === 'en' ? '' : 'md:whitespace-nowrap'
            }`}>
              {t('home.hero.scripture_text')}
            </p>
            <div className="not-italic text-xs md:text-sm mt-2 text-yellow-200/70 font-bold uppercase tracking-widest">
              {t('home.hero.scripture_reference')}
            </div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-40 flex justify-center gap-2.5">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => { setCurrentImageIndex(index); startAutoSlide(); }}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              index === currentImageIndex 
                ? "bg-yellow-400 w-8" 
                : "bg-white/30 hover:bg-white/50 w-1.5"
            }`}
          />
        ))}
      </div>
    </section>
  )
}