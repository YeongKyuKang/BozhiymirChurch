"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Image from "next/image"
import EditableText from "@/components/editable-text"
import Link from "next/link"
import { Users, Heart, Handshake } from "lucide-react"

interface HeroSectionProps {
  heroContent: Record<string, string>
  isEditingPage: boolean
  onContentChange: (section: string, key: string, value: string) => void
}

export default function HeroSection({ heroContent, isEditingPage, onContentChange }: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const backgroundImages = [
    "/images/bozhiymir2.jpg",
    "/images/bozhiymir3.jpg",
    "/images/bozhiymir4.jpg",
    "/images/bozhiymir5.jpg",
    "/images/bozhiymir6.jpg", // index 4
    "/images/bozhiymir7.jpg", // index 5
  ]

  // 자동 슬라이드 기능
  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, 4000)
  }

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    startAutoSlide()
    return () => stopAutoSlide()
  }, [backgroundImages.length])

  // 터치 이벤트 핸들러
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    stopAutoSlide()
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      startAutoSlide()
      return
    }

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    } else if (isRightSwipe) {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1))
    }

    setTimeout(() => startAutoSlide(), 1000)
  }

  return (
    <section className="relative h-[70vh] md:h-[80vh] lg:h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20 lg:pt-24">
      {/* Fixed background layer now a plain black color */}
      <div className="absolute inset-0 z-0 bg-black"></div>

      {/* Dynamic images carousel */}
      <div className="absolute inset-0" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            } flex items-center justify-center`}
            style={{ zIndex: 10 }}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Bozhiymir Church community photo ${index + 1}`}
              fill
              sizes="100vw"
              style={{
                objectFit: index === 4 || index === 5 ? "contain" : "cover",
                objectPosition: "center",
              }}
              priority={index === 0}
              unoptimized={true}
            />
          </div>
        ))}

        {/* Black overlay */}
        <div
          className={`absolute inset-0 bg-black/70 transition-opacity duration-1000`}
          style={{ zIndex: 15 }}
        ></div>
      </div>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentImageIndex(index)
              stopAutoSlide()
              setTimeout(() => startAutoSlide(), 2000)
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${ // 모바일과 데스크톱 크기를 통일
              index === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Floating Ukrainian Elements */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <div className="absolute top-20 left-10 w-2 h-2 md:w-3 md:h-3 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-16 w-3 h-3 md:w-4 md:h-4 bg-blue-300 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-60 right-32 w-2 h-2 md:w-3 md:h-3 bg-yellow-300 rounded-full animate-pulse delay-700"></div>
      </div>

      <div
        className={`relative z-30 text-center text-white px-4 max-w-4xl mx-auto transition-opacity duration-1000 ${
          currentImageIndex === 4 || currentImageIndex === 5 ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4 leading-tight">
          <EditableText
            page="home"
            section="hero"
            contentKey="title"
            initialValue={heroContent?.title}
            tag="span"
            className="text-white"
            placeholder="환영 타이틀"
            isEditingPage={isEditingPage}
            onContentChange={onContentChange}
          />
          <br />
          <span className="text-blue-300">Bozhiymir Church</span>
        </h1>

        <div className="mb-4 md:mb-6">
          <div className="text-sm md:text-base lg:text-lg font-medium mb-2">
            <EditableText
              page="home"
              section="hero"
              contentKey="subtitle"
              initialValue={heroContent?.subtitle}
              tag="span"
              className="text-white"
              placeholder="부제목"
              isEditingPage={isEditingPage}
              onContentChange={onContentChange}
            />
          </div>
          <div className="text-base md:text-lg lg:text-xl font-bold tracking-wide">
            <EditableText
              page="home"
              section="hero"
              contentKey="sunday_service_times"
              initialValue={heroContent?.sunday_service_times}
              tag="span"
              className="text-white"
              placeholder="예배 시간"
              isEditingPage={isEditingPage}
              onContentChange={onContentChange}
            />
          </div>
          <div className="text-xs md:text-sm lg:text-base text-blue-200 mt-3 md:mt-4 font-medium">
            <EditableText
              page="home"
              section="hero"
              contentKey="description"
              initialValue={heroContent?.description}
              tag="span"
              className="text-blue-200"
              isTextArea={true}
              placeholder="설명 문구"
              isEditingPage={isEditingPage}
              onContentChange={onContentChange}
            />
            <br />
            <span className="text-yellow-200">
              <EditableText
                page="home"
                section="hero"
                contentKey="ukrainian_translation"
                initialValue={heroContent?.ukrainian_translation}
                tag="span"
                className="text-yellow-200"
                placeholder="우크라이나어 번역"
                isEditingPage={isEditingPage}
                onContentChange={onContentChange}
              />
            </span>
          </div>
        </div>

        <div className="mt-6 md:mt-8">
          <div className="text-sm md:text-base lg:text-lg text-white/90 mb-3 md:mb-4">
            <EditableText
              page="home"
              section="hero"
              contentKey="cta_text"
              initialValue={heroContent?.cta_text}
              tag="span"
              className="text-white/90"
              placeholder="행동 유도 문구"
              isEditingPage={isEditingPage}
              onContentChange={onContentChange}
            />
          </div>
          <p className="text-xs md:text-sm text-blue-200 leading-relaxed">
            "He defends the cause of the fatherless and the widow, and loves the foreigner residing among you" -
            Deuteronomy 10:18
          </p>
        </div>
      </div>
    </section>
  )
}
