"use client"

import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

export default function LeadershipPageClient() {
  const { t } = useLanguage()

  const leaders = [
    { 
      id: "peter", 
      key: "leader1", 
      image: "/images/leaders/peter.jpg",
      showImage: true 
    },
    { 
      id: "vyacheslav", 
      key: "leader2", 
      image: "/images/bozhiymir.png", // 로고 경로 사용
      showImage: false 
    },
    { 
      id: "diana", 
      key: "leader3", 
      image: "/images/leaders/diana.jpg",
      showImage: true 
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* 히어로 섹션 */}
      <div className="bg-[#0F172A] text-white py-24 border-b-4 border-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-6 italic tracking-tight">
            {t('about.leadership.title')}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            {t('about.leadership.description')}
          </p>
        </div>
      </div>

      {/* 리더십 프로필 리스트 */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {leaders.map((leader) => (
              <div 
                key={leader.id} 
                className="group flex flex-col items-center text-center"
              >
                {/* 사진/로고 영역 */}
                <div className="relative w-48 h-48 md:w-56 md:h-56 mb-8 rounded-[60px] bg-white shadow-xl shadow-slate-200 overflow-hidden border-8 border-white transition-all duration-500 group-hover:scale-105">
                  
                  {leader.showImage ? (
                    /* 사진 공개 대상 (사진 준비 전까지는 로고/텍스트 처리) */
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300 italic text-xs">
                      {/* 사진을 받으면 아래 주석 해제 */}
                      {/* <Image src={leader.image} alt={t(`about.leadership.${leader.key}.name`)} fill className="object-cover" /> */}
                      Photo Coming Soon
                    </div>
                  ) : (
                    /* 사진 비공개 대상: 교회 로고를 중앙에 예쁘게 배치 */
                    <div className="w-full h-full p-8 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                      <div className="relative w-full h-full opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                        <Image 
                          src="/images/Bozhiymir_LOGO.png" 
                          alt="Bozhiymir Church Logo"
                          fill
                          className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 텍스트 영역 */}
                <div className="space-y-4 px-4">
                  <div>
                    <span className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] block mb-2">
                      {t('about.leadership.' + leader.key + '.role')}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                      {t('about.leadership.' + leader.key + '.name')}
                    </h3>
                  </div>

                  <div className="w-10 h-1 bg-yellow-400 mx-auto rounded-full" />

                  <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                    {t('about.leadership.' + leader.key + '.bio')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
