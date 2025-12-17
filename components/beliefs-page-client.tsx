"use client";

import { useLanguage } from "@/contexts/language-context";

export default function FaithFoundations() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-slate-50/50">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* 카드 사이즈를 max-w-2xl로 더 조임 */}
        <div className="relative bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
          
          {/* 상단 포인트 라인 */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600" />

          <div className="relative z-10">
            {/* 섹션 제목: 사이즈를 줄이고 정갈하게 */}
            <div className="text-center mb-10">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] block mb-2">
                What We Believe
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 italic">
                {t('about.belief.title')}
              </h2>
            </div>

            {/* 사도신경 본문: 폰트 사이즈를 적절하게 조절 (text-base md:text-lg) */}
            <div className="text-slate-700 text-base md:text-lg leading-relaxed font-serif whitespace-pre-line max-w-xl mx-auto italic text-center border-l-2 border-r-2 border-slate-50 px-6 md:px-10">
              {t('about.belief.content')}
            </div>

            {/* 하단 마무리 */}
            <div className="mt-10 text-center">
              <p className="text-slate-300 text-xl">◈</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}