"use client"
import Image from "next/image"
import { Users, Heart, Handshake } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// 1. 카드 데이터 타입 정의 (shadow 에러 방지)
interface HighlightItem {
  icon: any;
  titleKey: string;
  descKey: string;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  shadow?: string;
}

export default function CommunitySection() {
  const { t } = useLanguage()

  // 하단 3개 카드 설정
  const highlights: HighlightItem[] = [
    { 
      icon: Users, 
      titleKey: "home.community_highlights.highlight1_title", 
      descKey: "home.community_highlights.highlight1_description",
      bgColor: "bg-[#EFF6FF]",
      borderColor: "border-blue-100",
      iconColor: "text-[#2563EB]"
    },
    { 
      icon: Heart, 
      titleKey: "home.community_highlights.highlight2_title", 
      descKey: "home.community_highlights.highlight2_description",
      bgColor: "bg-[#FFFBEB]",
      borderColor: "border-yellow-100",
      iconColor: "text-[#B48A00]",
      shadow: "shadow-md scale-105 z-10" 
    },
    { 
      icon: Handshake, 
      titleKey: "home.community_highlights.highlight3_title", 
      descKey: "home.community_highlights.highlight3_description",
      bgColor: "bg-white",
      borderColor: "border-gray-100",
      iconColor: "text-[#2563EB]"
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-yellow-50">
      <div className="container mx-auto px-4 text-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* 이미지 컨테이너 */}
          <div className="relative w-full max-w-lg aspect-[4/5] md:aspect-[5/6] lg:aspect-[4/5] rounded-2xl shadow-2xl overflow-hidden mx-auto border-4 border-yellow-400">
            <Image
              src="/images/bozhiymir.png"
              alt="Bozhiymir Church Community"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
              style={{ objectFit: "cover" }}
              className="transition-transform duration-500 hover:scale-105"
            />
            {/* 우크라이나 국기 포인트 */}
            <div className="absolute top-6 right-6 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-b from-blue-600 to-yellow-400 rounded-full shadow-xl border-4 border-white z-10 flex items-center justify-center">
              <span className="text-white text-lg font-bold">🇺🇦</span>
            </div>
          </div>

          {/* 텍스트 영역 (Editable 제거, t 함수 적용) */}
          <div className="space-y-8 mt-8 lg:mt-0">
            <div className="space-y-3">
              <h3 className="text-[#1E40AF] text-2xl md:text-3xl tracking-tight">
                {t('home.community_about.section_label')}
              </h3>
              <h2 className="text-[#B48A00] text-xl md:text-2xl leading-tight">
                {t('home.community_about.main_title')}
              </h2>
            </div>
            <div className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {t('home.community_about.paragraph_1')}
            </div>
            <div className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {t('home.community_about.paragraph_2')}
            </div>

            {/* 성경 구절 박스 */}
            <div className="bg-[#EFF6FF] border-y-2 border-blue-100 py-6 px-8 italic text-[#1E40AF] text-center text-xl md:text-2xl font-semibold rounded-lg shadow-sm">
              {t('home.community_about.scripture_text')}
              <br className="hidden md:block" />
              <span className="not-italic text-blue-400 text-lg mt-3 inline-block font-bold">
                {t('home.community_about.scripture_reference')}
              </span>
            </div>
          </div>
        </div>

        {/* 하단 3개 강조 카드 */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item, index) => (
            <div 
              key={index} 
              className={`${item.bgColor} ${item.borderColor} ${item.shadow || ''} border-2 p-5 rounded-[24px] text-center flex flex-col items-center transition-all duration-300 hover:shadow-2xl`}
            >
              <div className={`p-5 rounded-full bg-white mb-4 shadow-sm`}>
                <item.icon className={`w-10 h-10 ${item.iconColor}`} />
              </div>
              <div className="text-xl md:text-base font-bold text-blue-900 mb-2">
                {t(item.titleKey)}
              </div>
              <p className="text-gray-700 text-lg md:text-lg leading-relaxed">
                {t(item.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}