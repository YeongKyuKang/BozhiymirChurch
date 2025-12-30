"use client";

import { useState, useEffect } from "react"; // useState, useEffect 추가
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Home, BookOpen, Utensils, Shirt, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export default function UkrainianMinistryPageClient() {
  const { t } = useLanguage();
  
  // [수정] ssr: false 효과를 내기 위한 마운트 체크 상태
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // [수정] 마운트 전에는 아무것도 보여주지 않거나 로딩 표시 (하이드레이션 에러 방지)
  if (!isMounted) {
    return <div className="min-h-screen bg-white pt-24 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-500"/></div>;
  }

  // 프로그램 데이터
  const programs = [
    {
      icon: <Home className="h-6 w-6 text-blue-900" />,
      title: t('ministry.ukrainian.programs.program1.title'),
      description: t('ministry.ukrainian.programs.program1.desc'),
      stats: t('ministry.ukrainian.programs.program1.stats'),
    },
    {
      icon: <BookOpen className="h-6 w-6 text-blue-900" />,
      title: t('ministry.ukrainian.programs.program2.title'),
      description: t('ministry.ukrainian.programs.program2.desc'),
      stats: t('ministry.ukrainian.programs.program2.stats'),
    },
    {
      icon: <Heart className="h-6 w-6 text-blue-900" />,
      title: t('ministry.ukrainian.programs.program3.title'),
      description: t('ministry.ukrainian.programs.program3.desc'),
      stats: t('ministry.ukrainian.programs.program3.stats'),
    },
    {
      icon: <Utensils className="h-6 w-6 text-blue-900" />,
      title: t('ministry.ukrainian.programs.program4.title'),
      description: t('ministry.ukrainian.programs.program4.desc'),
      stats: t('ministry.ukrainian.programs.program4.stats'),
    },
    {
      icon: <Users className="h-6 w-6 text-blue-900" />,
      title: t('ministry.ukrainian.programs.program5.title'),
      description: t('ministry.ukrainian.programs.program5.desc'),
      stats: t('ministry.ukrainian.programs.program5.stats'),
    },
    {
      icon: <Shirt className="h-6 w-6 text-blue-900" />,
      title: t('ministry.ukrainian.programs.program6.title'),
      description: t('ministry.ukrainian.programs.program6.desc'),
      stats: t('ministry.ukrainian.programs.program6.stats'),
    },
  ];

  // 간증 데이터
  const testimonials = [
    {
      name: "Maria K.",
      role: "Host Mother",
      quote: t('ministry.ukrainian.testimonials.testi1.quote'),
      flag: "🇺🇸",
    },
    {
      name: "Oleksandr",
      role: "Age 12",
      quote: t('ministry.ukrainian.testimonials.testi2.quote'),
      flag: "🇺🇦",
    },
    {
      name: "Pastor Sarah",
      role: "Ministry Leader",
      quote: t('ministry.ukrainian.testimonials.testi3.quote'),
      flag: "⛪",
    },
  ];

  // 도움 방법 데이터
  const helpCards = [
    {
      icon: <Heart className="h-7 w-7 text-yellow-500" />,
      title: t('ministry.ukrainian.help.card1.title'),
      description: t('ministry.ukrainian.help.card1.desc'),
    },
    {
      icon: <Users className="h-7 w-7 text-yellow-500" />,
      title: t('ministry.ukrainian.help.card2.title'),
      description: t('ministry.ukrainian.help.card2.desc'),
    },
    {
      icon: <BookOpen className="h-7 w-7 text-yellow-500" />,
      title: t('ministry.ukrainian.help.card3.title'),
      description: t('ministry.ukrainian.help.card3.desc'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-yellow-500 text-white h-[25vh] flex items-center justify-center border-b-4 border-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2">
            <span className="text-3xl md:text-4xl">🇺🇦</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold mb-3">
            {t('ministry.ukrainian.hero.title')}
          </h1>
          <p className="text-sm md:text-base text-blue-200 max-w-4xl mx-auto leading-relaxed">
            {t('ministry.ukrainian.hero.desc')}
          </p>
        </div>
      </div>

      {/* Impact Stats */}
      <section className="py-8 bg-blue-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-center mb-6 text-blue-900">
            {t('ministry.ukrainian.stats.title')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="bg-white text-gray-900 p-4 rounded-2xl shadow-md border border-gray-200">
                <div className="text-xl md:text-2xl font-bold mb-1">
                  {t(`ministry.ukrainian.stats.stat${num}.number`)}
                </div>
                <div className="text-xs opacity-90 text-gray-700">
                  {t(`ministry.ukrainian.stats.stat${num}.label`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-center text-blue-900 mb-6">
            {t('ministry.ukrainian.programs.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((program, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 shadow-md bg-white"
              >
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <div className="bg-yellow-400 rounded-full p-2 mr-3">{program.icon}</div>
                    <h3 className="text-base font-bold text-blue-900">
                      {program.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
                    {program.description}
                  </p>
                  <div className="bg-blue-100 px-3 py-1.5 rounded-xl border-l-4 border-blue-700">
                    <span className="text-xs text-blue-900 font-bold">
                      {program.stats}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Biblical Foundation */}
      <section className="py-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-y border-white/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold mb-6">
            {t('ministry.ukrainian.foundation.title')}
          </h2>
          <Card className="max-w-5xl mx-auto shadow-2xl border border-gray-600 bg-white/10 backdrop-blur-sm">
            <CardContent className="p-5">
              <blockquote className="text-base italic text-yellow-300 mb-4 leading-relaxed">
                {t('ministry.ukrainian.foundation.quote')}
              </blockquote>
              <p className="text-sm font-semibold text-white mb-4">
                {t('ministry.ukrainian.foundation.reference')}
              </p>
              <div className="text-blue-200">
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {t('ministry.ukrainian.foundation.desc')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-center text-blue-900 mb-6">
            {t('ministry.ukrainian.testimonials.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 shadow-md bg-white"
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-3">{testimonial.flag}</div>
                  <blockquote className="text-sm text-gray-700 italic mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-bold text-blue-900 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Help */}
      <section className="py-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-y border-white/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold mb-6">
            {t('ministry.ukrainian.help.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {helpCards.map((card, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 border border-gray-600"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-yellow-400 rounded-full p-2">{card.icon}</div>
                </div>
                <h3 className="text-base font-bold mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-blue-200 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-blue-900 font-bold px-6 py-2 text-base rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Link href="/join">{t('ministry.ukrainian.help.button')}</Link>
          </Button>
        </div>
      </section>

      {/* Contact */}
      <section className="py-8 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-blue-900 mb-3">
            {t('ministry.ukrainian.contact.title')}
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-4 max-w-4xl mx-auto leading-relaxed">
            {t('ministry.ukrainian.contact.desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-blue-900 font-bold px-6 py-2 text-base rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="mailto:ukrainian@bozhiymirchurch.com">{t('ministry.ukrainian.contact.email_button')}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white font-bold px-6 py-2 text-base rounded-full bg-transparent shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/">{t('ministry.ukrainian.contact.home_button')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}