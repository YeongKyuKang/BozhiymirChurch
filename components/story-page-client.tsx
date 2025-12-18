"use client"

import { useLanguage } from "@/contexts/language-context"
import { Church, Users, Heart, Star, Globe } from "lucide-react"

export default function StoryPageClient() {
  const { t } = useLanguage()

  const timeline = [
    { 
      id: "foundation",
      icon: <Church className="h-5 w-5" />, 
      titleKey: "about.story.timeline.item1_title", 
      descKey: "about.story.timeline.item1_description" 
    },
    { 
      id: "refugee",
      icon: <Globe className="h-5 w-5" />, 
      titleKey: "about.story.timeline.item2_title", 
      descKey: "about.story.timeline.item2_description" 
    },
    { 
      id: "mothers",
      icon: <Users className="h-5 w-5" />, 
      titleKey: "about.story.timeline.item3_title", 
      descKey: "about.story.timeline.item3_description" 
    },
    { 
      id: "ossa",
      icon: <Star className="h-5 w-5" />, 
      titleKey: "about.story.timeline.item4_title", 
      descKey: "about.story.timeline.item4_description" 
    },
    { 
      id: "lodz",
      icon: <Heart className="h-5 w-5" />, 
      titleKey: "about.story.timeline.item5_title", 
      descKey: "about.story.timeline.item5_description" 
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션: 더 깊이감 있는 그라데이션과 깔끔한 타이포그래피 */}
      <section className="relative pt-32 pb-20 bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium tracking-wider">
            SINCE 2022 🇺🇦
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            {t('about.story.main.title')}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-light">
            {t('about.story.main.description')}
          </p>
        </div>
      </section>

      {/* 타임라인 섹션: 선과 점을 이용한 버티컬 레이아웃 */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="relative">
            
            {/* 중앙 수직선 (데스크탑 기준) */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2" />

            <div className="space-y-16 md:space-y-24">
              {timeline.map((event, index) => (
                <div key={event.id} className={`relative flex items-center justify-between md:justify-normal group ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}>
                  
                  {/* 중앙 아이콘 노드 */}
                  <div className="absolute left-4 md:left-1/2 w-10 h-10 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center z-10 -translate-x-1/2 transition-transform duration-300 group-hover:scale-125 group-hover:border-blue-500">
                    <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
                      {event.icon}
                    </div>
                  </div>

                  {/* 콘텐츠 카드 */}
                  <div className={`w-[calc(100%-3rem)] md:w-[45%] ml-12 md:ml-0 p-6 md:p-8 rounded-[32px] transition-all duration-300 ${
                    index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                  } hover:bg-slate-50`}>
                    <div className={`inline-block px-3 py-1 rounded-full bg-yellow-400 text-[#0F172A] text-xs font-black mb-4 tracking-tighter`}>
                      {t(event.titleKey)}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                       {/* 타이틀을 날짜로 쓰고 내용을 아래에 배치 */}
                       {t(event.descKey).split('(')[0]} 
                    </h3>
                    <p className="text-slate-500 text-base md:text-lg leading-relaxed font-medium">
                      {t(event.descKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 전 마지막 장식 */}
      <section className="py-20 text-center border-t border-slate-100">
        <div className="text-blue-600/20 text-6xl">♰</div>
      </section>
    </div>
  )
}
