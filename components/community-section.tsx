// components/community-section.tsx
"use client";

import * as React from "react";
import Image from "next/image"; // Image 컴포넌트 임포트
import { Button } from "@/components/ui/button"; // Button 컴포넌트 임포트
import { Users, Heart, Home, Globe } from "lucide-react"; // 필요한 아이콘 임포트
import EditableText from "@/components/editable-text";
import Link from "next/link"; // Link 컴포넌트 임포트
import { Database } from "@/lib/supabase"; // Database 타입 임포트

interface CommunitySectionProps {
  initialContent: Record<string, any>; // initialContent로 통합
  isEditingPage: boolean;
  onContentChange: (section: string, key: string, value: string) => void;
}

export default function CommunitySection({ initialContent, isEditingPage, onContentChange }: CommunitySectionProps) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"> {/* ✅ 수정: 패딩 조정 */}
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"> {/* ✅ 수정: 모바일 그리드, 간격 조정 */}
          {/* 이미지 컨테이너 */}
          <div className="relative w-full max-w-lg aspect-[4/5] md:aspect-[5/6] lg:aspect-[4/5] rounded-xl shadow-2xl overflow-hidden mx-auto"> {/* ✅ 수정: 이미지 가로/세로 비율 원복 및 max-w-sm 추가 */}
            <Image
              src="/images/bozhiymir.png"
              alt="Bozhiymir Church Community"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
              style={{ objectFit: "cover" }}
              className="transition-transform duration-500 hover:scale-105"
            />
            {/* Ukrainian flag accent */}
            <div className="absolute top-4 right-4 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-b from-blue-500 to-yellow-400 rounded-full shadow-lg border-2 border-white z-10"></div> {/* ✅ 수정: 아이콘 크기 조정 */}
          </div>
          
          <div className="space-y-6 mt-8 lg:mt-0"> {/* ✅ 수정: 여백 조정 */}
            <div>
              <EditableText
                page="home"
                section="community_about"
                contentKey="main_title"
                initialValue={initialContent?.community_about?.main_title}
                tag="h2"
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight"
                placeholder="커뮤니티 메인 타이틀"
                isEditingPage={isEditingPage}
                onContentChange={onContentChange}
              />
              <EditableText
                page="home"
                section="community_about"
                contentKey="subtitle"
                initialValue={initialContent?.community_about?.subtitle}
                tag="h3"
                className="text-xl md:text-2xl font-bold text-blue-700 mb-6"
                placeholder="커뮤니티 부제목"
                isEditingPage={isEditingPage}
                onContentChange={onContentChange}
              />
            </div>

            <div className="space-y-4 text-base md:text-lg text-gray-700 leading-relaxed"> {/* ✅ 수정: 폰트 크기 및 여백 조정 */}
              <div className="text-base md:text-lg text-gray-700 leading-relaxed">
                <EditableText
                  page="home"
                  section="community_about"
                  contentKey="paragraph_1"
                  initialValue={initialContent?.community_about?.paragraph_1}
                  tag="span" 
                  className="leading-relaxed"
                  isTextArea={true}
                  placeholder="커뮤니티 설명 첫 번째 문단"
                  isEditingPage={isEditingPage}
                  onContentChange={onContentChange}
                />
              </div>
              <div className="text-base md:text-lg text-gray-700 leading-relaxed">
                <EditableText
                  page="home"
                  section="community_about"
                  contentKey="paragraph_2"
                  initialValue={initialContent?.community_about?.paragraph_2}
                  tag="span" 
                  className="leading-relaxed"
                  isTextArea={true}
                  placeholder="커뮤니티 설명 두 번째 문단"
                  isEditingPage={isEditingPage}
                  onContentChange={onContentChange}
                />
              </div>
              <div className="text-blue-700 font-bold italic border-l-4 border-blue-300 pl-4">
                <EditableText
                  page="home"
                  section="community_about"
                  contentKey="scripture_quote"
                  initialValue={initialContent?.community_about?.scripture_quote}
                  tag="span"
                  className="text-blue-700 font-bold italic"
                  isTextArea={true}
                  placeholder="성경 구절"
                  isEditingPage={isEditingPage}
                  onContentChange={onContentChange}
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-yellow-100 rounded-xl p-6 border-2 border-blue-300 shadow-md"> {/* ✅ 수정: 패딩 및 border-radius 조정 */}
              <h4 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-3 flex items-center"> {/* ✅ 수정: 폰트 크기 및 여백 조정 */}
                <span className="mr-2 text-2xl md:text-3xl">🇺🇦</span> {/* ✅ 수정: 아이콘 크기 조정 */}
                <EditableText page="home" section="community_about" contentKey="ministry_title" initialValue={initialContent?.community_about?.ministry_title} tag="span" className="text-gray-900" placeholder="사역 타이틀" isEditingPage={isEditingPage} onContentChange={onContentChange} />
              </h4>
              <div className="text-gray-800 text-sm md:text-base leading-relaxed"> {/* ✅ 수정: 폰트 크기 조정 */}
                <EditableText page="home" section="community_about" contentKey="ministry_description" initialValue={initialContent?.community_about?.ministry_description} tag="span" className="text-gray-800 text-sm md:text-base leading-relaxed" isTextArea={true} placeholder="사역 설명" isEditingPage={isEditingPage} onContentChange={onContentChange} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6"> {/* ✅ 수정: 간격 및 여백 조정 */}
              <Button asChild className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-3 rounded-full font-bold text-base shadow-lg transform hover:scale-105 transition-transform">
                <Link href="/join">
                  <span>Join Our Family Today</span> {/* ✅ 수정: 텍스트를 span으로 감싸 단일 자식으로 만듭니다. */}
                </Link>
              </Button>
              {/* "Visit This Sunday" 버튼 제거 */}
            </div>
          </div>
        </div>

        {/* Community Highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"> {/* ✅ 수정: 여백 및 그리드 간격 조정 */}
          <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-100 shadow-lg transform hover:scale-105 transition-transform cursor-pointer"> {/* ✅ 수정: 패딩 및 border-radius 조정 */}
            <div className="text-4xl mb-3">🤝</div> {/* ✅ 수정: 아이콘 크기 및 여백 조정 */}
            <EditableText page="home" section="community_highlights" contentKey="highlight1_title" initialValue={initialContent?.community_highlights?.highlight1_title} tag="h4" className="text-lg md:text-xl font-bold text-gray-900 mb-2" placeholder="하이라이트 1 제목" isEditingPage={isEditingPage} onContentChange={onContentChange} /> {/* ✅ 수정: 폰트 크기 및 여백 조정 */}
            <div className="text-gray-700 text-sm md:text-base"> {/* ✅ 수정: 폰트 크기 조정 */}
              <EditableText page="home" section="community_highlights" contentKey="highlight1_description" initialValue={initialContent?.community_highlights?.highlight1_description} tag="span" className="text-gray-700 text-sm md:text-base" placeholder="하이라이트 1 설명" isEditingPage={isEditingPage} onContentChange={onContentChange} />
            </div>
          </div>

          <div className="text-center p-6 bg-yellow-50 rounded-xl border-2 border-yellow-100 shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
            <div className="text-4xl mb-3">🌍</div>
            <EditableText page="home" section="community_highlights" contentKey="highlight2_title" initialValue={initialContent?.community_highlights?.highlight2_title} tag="h4" className="text-lg md:text-xl font-bold text-gray-900 mb-2" placeholder="하이라이트 2 제목" isEditingPage={isEditingPage} onContentChange={onContentChange} />
            <div className="text-gray-700 text-sm md:text-base">
              <EditableText page="home" section="community_highlights" contentKey="highlight2_description" initialValue={initialContent?.community_highlights?.highlight2_description} tag="span" className="text-gray-700 text-sm md:text-base" placeholder="하이라이트 2 설명" isEditingPage={isEditingPage} onContentChange={onContentChange} />
            </div>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-100 shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
            <div className="text-4xl mb-3">❤️‍🩹</div>
            <EditableText page="home" section="community_highlights" contentKey="highlight3_title" initialValue={initialContent?.community_highlights?.highlight3_title} tag="h4" className="text-lg md:text-xl font-bold text-gray-900 mb-2" placeholder="하이라이트 3 제목" isEditingPage={isEditingPage} onContentChange={onContentChange} />
            <div className="text-gray-700 text-sm md:text-base">
              <EditableText page="home" section="community_highlights" contentKey="highlight3_description" initialValue={initialContent?.community_highlights?.highlight3_description} tag="span" className="text-gray-700 text-sm md:text-base" placeholder="하이라이트 3 설명" isEditingPage={isEditingPage} onContentChange={onContentChange} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
