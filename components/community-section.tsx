"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Users, Heart, Home, Globe } from "lucide-react"
import EditableText from "@/components/editable-text"
import Link from "next/link"

export default function CommunitySection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* 이미지 컨테이너 - 통계 오버레이 삭제 */}
          <div className="relative w-full aspect-[4/5] md:aspect-[5/6] lg:aspect-[4/5] rounded-xl shadow-2xl overflow-hidden mx-auto">
            <Image
              src="/images/bozhiymir.png"
              alt="Bozhiymir Church Community"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
              style={{ objectFit: "cover" }}
              className="transition-transform duration-500 hover:scale-105"
            />
            {/* Ukrainian flag accent */}
            <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-b from-blue-500 to-yellow-400 rounded-full shadow-lg border-2 border-white z-10"></div>
          </div>
          
          <div className="space-y-8 mt-16 lg:mt-0">
            <div>
              <EditableText
                page="home"
                section="community_about"
                contentKey="main_title"
                tag="h2"
                className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
              />
              <EditableText
                page="home"
                section="community_about"
                contentKey="subtitle"
                tag="h3"
                className="text-3xl font-bold text-blue-700 mb-8"
              />
            </div>

            <div className="space-y-6 text-xl text-gray-700 leading-relaxed">
              <EditableText
                page="home"
                section="community_about"
                contentKey="paragraph_1"
                tag="p"
                className="text-xl text-gray-700 leading-relaxed"
                isTextArea={true}
              />
              <EditableText
                page="home"
                section="community_about"
                contentKey="paragraph_2"
                tag="p"
                className="text-xl text-gray-700 leading-relaxed"
                isTextArea={true}
              />
              {/* p 태그를 div 태그로 변경 */}
              <div className="text-blue-700 font-bold italic border-l-4 border-blue-300 pl-4">
                <EditableText
                  page="home"
                  section="community_about"
                  contentKey="scripture_quote"
                  tag="span"
                  className="text-blue-700 font-bold italic"
                  isTextArea={true}
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-yellow-100 rounded-2xl p-8 border-2 border-blue-300 shadow-md">
              <h4 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center">
                <span className="mr-2 text-3xl">🇺🇦</span>
                <EditableText page="home" section="community_about" contentKey="ministry_title" tag="span" className="text-gray-900" />
              </h4>
              <EditableText page="home" section="community_about" contentKey="ministry_description" tag="p" className="text-gray-800 text-base leading-relaxed" isTextArea={true} />
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mt-8">
              <Button className="bg-blue-600 hover:bg-blue-800 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transform hover:scale-105 transition-transform">
                Join Our Family Today
              </Button>
              <Button
                variant="outline"
                className="border-4 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
              >
                Visit This Sunday
              </Button>
            </div>
          </div>
        </div>

        {/* Community Highlights */}
        <div className="mt-20 grid md:grid-cols-3 gap-10">
          <div className="text-center p-8 bg-blue-50 rounded-2xl border-2 border-blue-100 shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
            <div className="text-5xl mb-4">🤝</div>
            <EditableText page="home" section="community_highlights" contentKey="highlight1_title" tag="h4" className="text-2xl font-bold text-gray-900 mb-3" />
            <EditableText page="home" section="community_highlights" contentKey="highlight1_description" tag="p" className="text-gray-700 text-base" />
          </div>

          <div className="text-center p-8 bg-yellow-50 rounded-2xl border-2 border-yellow-100 shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
            <div className="text-5xl mb-4">🌍</div>
            <EditableText page="home" section="community_highlights" contentKey="highlight2_title" tag="h4" className="text-2xl font-bold text-gray-900 mb-3" />
            <EditableText page="home" section="community_highlights" contentKey="highlight2_description" tag="p" className="text-gray-700 text-base" />
          </div>

          <div className="text-center p-8 bg-green-50 rounded-2xl border-2 border-green-100 shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
            <div className="text-5xl mb-4">❤️‍🩹</div>
            <EditableText page="home" section="community_highlights" contentKey="highlight3_title" tag="h4" className="text-2xl font-bold text-gray-900 mb-3" />
            <EditableText page="home" section="community_highlights" contentKey="highlight3_description" tag="p" className="text-gray-700 text-base" />
          </div>
        </div>
      </div>
    </section>
  )
}