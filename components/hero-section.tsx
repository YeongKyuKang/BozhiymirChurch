"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import EditableText from "@/components/editable-text"

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
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden pt-16 md:pt-20 lg:pt-24">
      {/* Photo Slideshow Background */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            } flex items-center justify-center`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Bozhiymir Church community photo ${index + 1}`}
              width={1920}
              height={1080}
              className="max-w-full max-h-full object-contain"
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
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          <EditableText page="home" section="hero" contentKey="title" tag="span" className="text-white" />
          <br />
          <span className="text-blue-300">Bozhiymir Church</span>
        </h1>

        <div className="mb-8">
          {/* p 태그를 div 태그로 변경 */}
          <div className="text-lg md:text-xl font-medium mb-2">
            <EditableText page="home" section="hero" contentKey="subtitle" tag="span" className="text-white" />
          </div>
          <div className="text-xl md:text-2xl font-bold tracking-wide">
            <EditableText page="home" section="hero" contentKey="sunday_service_times" tag="span" className="text-white" />
          </div>
          {/* p 태그를 div 태그로 변경 */}
          <div className="text-sm md:text-base text-blue-200 mt-4 font-medium">
            <EditableText page="home" section="hero" contentKey="description" tag="span" className="text-blue-200" isTextArea={true} />
            <br />
            <span className="text-yellow-200">
              <EditableText page="home" section="hero" contentKey="ukrainian_translation" tag="span" className="text-yellow-200" />
            </span>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-lg text-white/90 mb-4">
            <EditableText page="home" section="hero" contentKey="cta_text" tag="span" className="text-white/90" />
          </div>
          <p className="text-sm text-blue-200">
            "He defends the cause of the fatherless and the widow, and loves the foreigner residing among you" -
            Deuteronomy 10:18
          </p>
        </div>
      </div>
    </section>
  )
}