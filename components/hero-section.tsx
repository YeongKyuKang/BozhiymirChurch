"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
}

export default function HeroSection({
  title = "Welcome",
  subtitle = "Sunday Service",
  description = "Join us",
  ctaText = "Learn More",
}: HeroSectionProps) {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      
      {/* 배경 이미지 (필요시 이미지 경로 수정) */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/bozhiymir4.jpg')" }}
      />

      <div className="relative z-20 container px-4 md:px-6 text-center text-white space-y-6">
        <h2 className="text-xl md:text-2xl font-medium tracking-wide uppercase">
          {subtitle}
        </h2>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90">
          {description}
        </p>
        <div className="pt-4">
          <Link href="/join">
            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground">
              {ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}