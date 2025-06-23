import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-background.jpeg"
          alt="Church community photos"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Welcome to Our
          <br />
          Church Community
        </h1>

        <p className="text-lg md:text-xl mb-8 font-medium">
          Stay updated with our latest events, announcements, and activities
          <br />
          Join our community and be part of something special
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/events">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-full"
            >
              VIEW EVENTS
            </Button>
          </Link>
          <Link href="/kids-corner">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg font-semibold rounded-full bg-transparent"
            >
              KIDS CORNER
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
