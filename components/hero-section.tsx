"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Array of background images for the slideshow
  const backgroundImages = [
    "/images/bozhiymir2.jpg",
    "/images/녕.png",
    "/images/하.png",
    "/images/세.png",
    "/images/요.png",
    "/images/!!.png",
  ]

  // Auto-change images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  return (
    // 이곳을 수정했습니다: 상단 패딩 (pt-*) 클래스 추가
    // 헤더의 높이에 따라 pt-16, md:pt-20, lg:pt-24 등의 값을 조절하세요.
    // h-[70vh]는 Hero 섹션의 전체 높이를 화면 높이의 70%로 유지합니다.
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden pt-16 md:pt-20 lg:pt-24">
      {/* Photo Slideshow Background */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            } flex items-center justify-center`} // 이미지를 중앙에 배치하기 위해 flexbox 추가
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Bozhiymir Church community photo ${index + 1}`}
              width={1920} // 실제 이미지의 너비 또는 적절한 기준 너비
              height={1080} // 실제 이미지의 높이 또는 적절한 기준 높이
              className="max-w-full max-h-full object-contain" // 컨테이너 안에 이미지 전체가 보이도록
              priority={index === 0}
            />
          </div>
        ))}
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Slideshow Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Floating Ukrainian Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-16 w-4 h-4 bg-blue-300 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-60 right-32 w-3 h-3 bg-yellow-300 rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Content */}
      {/* 이 div의 위치는 section의 pt-* 값에 영향을 받습니다. */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Welcome to
          <br />
          <span className="text-blue-300">Bozhiymir Church</span>
        </h1>

        <div className="mb-8">
          <p className="text-lg md:text-xl font-medium mb-2">SUNDAY MORNINGS AT</p>
          <p className="text-xl md:text-2xl font-bold tracking-wide">9:00AM (TRADITIONAL), 10:30AM, OR 12:00PM</p>
          <p className="text-sm md:text-base text-blue-200 mt-4 font-medium">
            🇺🇦 A loving community in Portland where Ukrainian children find hope and healing
            <br />
            <span className="text-yellow-200">Любляча спільнота в Портленді, де українські діти знаходять надію</span>
          </p>
        </div>

        <div className="mt-8">
          <p className="text-lg text-white/90 mb-4">Join our church family this Sunday</p>
          <p className="text-sm text-blue-200">
            "He defends the cause of the fatherless and the widow, and loves the foreigner residing among you" -
            Deuteronomy 10:18
          </p>
        </div>
      </div>
    </section>
  )
}
