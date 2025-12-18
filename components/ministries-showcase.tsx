"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { ItemText } from "@radix-ui/react-select";

export default function MinistriesShowcase() {
  const { t } = useLanguage();

  // 사역 아이템 설정 (아이콘과 번역 키 매핑)
  const ministryItems = [
    {
      icon: Heart,
      iconColor: "text-red-500",
      titleKey: "home.ministries.ministry1_title",
      descKey: "home.ministries.ministry1_description",
      timeKey: "home.ministries.ministry1_time"
    },
    {
      icon: Users,
      iconColor: "text-blue-500",
      titleKey: "home.ministries.ministry2_title",
      descKey: "home.ministries.ministry2_description",
      timeKey: "home.ministries.ministry2_time"
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* 섹션 제목: JSON 연동 */}
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 text-center mb-16 leading-tight italic">
          {t('home.ministries.title')}
        </h2>

        {/* 3열 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center">
          {ministryItems.map((item, index) => (
            <Card key={index} className="border-none shadow-none hover:shadow-xl transition-all duration-300 rounded-[32px] bg-[#F9FAFB] group">
              <CardContent className="p-5 flex flex-col items-center">
                
                {/* 아이콘 영역 */}
                <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <item.icon className={`h-16 w-16 ${item.iconColor}`} />
                </div>

                {/* 카드 제목: JSON 연동 */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {t(item.titleKey)}
                </h3>

                {/* 카드 설명: JSON 연동 */}
                <div className="text-gray-600 text-base md:text-lg leading-relaxed">
                  {t(item.descKey)}
                </div>

                <div className="p-2 text-gray-600 text-base font-black md:text-lg leading-relaxed">
                  {t(item.timeKey)}
                </div>


              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
