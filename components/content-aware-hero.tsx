"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useContent } from "@/lib/database-content"

export default function ContentAwareHeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Use content hooks for dynamic content
  const { content: title } = useContent("hero.title", "Welcome to")
  const { content: subtitle } = useContent("hero.subtitle", "Bozhiymir Church")
  const { content: serviceTime } = useContent("hero.serviceTime", "SUNDAY MORNINGS AT")
  const { content: serviceTimes } = useContent("hero.serviceTimes", "9:00AM (TRADITIONAL), 10:30AM, OR 12:00PM")
  const { content: description } = useContent(
    "hero.description",
    "🇺🇦 A loving community in Portland where Ukrainian children find hope and healing",
  )
  const { content: descriptionUkrainian } = useContent(
    "hero.descriptionUkrainian",
    "Любляча спільнота в Портленді, де українські діти знаходять надію",
  )
  const { content: callToAction } = useContent("hero.callToAction", "Join our church family this Sunday")
  const { content: scripture } = useContent(
    "hero.scripture",
    '"He defends the cause of the fatherless and the widow, and loves the foreigner residing among you" - Deuteronomy 10:18',
  )

  // Array of background images for the slideshow
  const backgroundImages = [
    "/images/hero-collage.jpeg",
    "/placeholder.svg?height=1080&width=1920&text=Church+Community+1",
    "/placeholder.svg?height=1080&width=1920&text=Ukrainian+Children+2",
    "/placeholder.svg?height=1080&width=1920&text=Church+Worship+3",
    "/placeholder.svg?height=1080&width=1920&text=Community+Fellowship+4",
    "/placeholder.svg?height=1080&width=1920&text=Church+Activities+5",
  ]

  // Auto-change images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Photo Slideshow Background */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Bozhiymir Church community photo ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
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

      {/* Content - Now using dynamic content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          {title}
          <br />
          <span className="text-blue-300">{subtitle}</span>
        </h1>

        <div className="mb-8">
          <p className="text-lg md:text-xl font-medium mb-2">{serviceTime}</p>
          <p className="text-xl md:text-2xl font-bold tracking-wide">{serviceTimes}</p>
          <p className="text-sm md:text-base text-blue-200 mt-4 font-medium">
            {description}
            <br />
            <span className="text-yellow-200">{descriptionUkrainian}</span>
          </p>
        </div>

        <div className="mt-8">
          <p className="text-lg text-white/90 mb-4">{callToAction}</p>
          <p className="text-sm text-blue-200">{scripture}</p>
        </div>
      </div>
    </section>
  )
}
