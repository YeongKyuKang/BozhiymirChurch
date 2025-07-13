"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import EditableText from "@/components/editable-text"
import Link from "next/link"
import { Users, Heart, Handshake } from "lucide-react"

interface CommunitySectionProps {
  initialContent: Record<string, any>
  isEditingPage: boolean
  onContentChange: (section: string, key: string, value: string) => void
}

export default function CommunitySection({ initialContent, isEditingPage, onContentChange }: CommunitySectionProps) {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-yellow-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
          <EditableText
            page="home"
            section="community_about"
            contentKey="main_title"
            initialValue={initialContent?.community_about?.main_title}
            tag="span"
            className="text-3xl md:text-4xl font-bold text-blue-900 mb-6"
            placeholder="커뮤니티 메인 타이틀"
            isEditingPage={isEditingPage}
            onContentChange={onContentChange}
          />
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
          <EditableText
            page="home"
            section="community_about"
            contentKey="subtitle"
            initialValue={initialContent?.community_about?.subtitle}
            tag="span"
            className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed"
            placeholder="커뮤니티 부제목"
            isEditingPage={isEditingPage}
            onContentChange={onContentChange}
          />
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Container */}
          <div className="relative w-full max-w-lg aspect-[4/5] md:aspect-[5/6] lg:aspect-[4/5] rounded-2xl shadow-2xl overflow-hidden mx-auto border-4 border-yellow-400">
            <Image
              src="/images/bozhiymir.png"
              alt="Bozhiymir Church Community"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
              style={{ objectFit: "cover" }}
              className="transition-transform duration-500 hover:scale-105"
            />
            {/* Ukrainian flag accent */}
            <div className="absolute top-6 right-6 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-b from-blue-600 to-yellow-400 rounded-full shadow-xl border-4 border-white z-10 flex items-center justify-center">
              <span className="text-white text-lg font-bold">🇺🇦</span>
            </div>
          </div>

          <div className="space-y-8 mt-8 lg:mt-0">
            <div>
              <EditableText
                page="home"
                section="community_about"
                contentKey="main_title"
                initialValue={initialContent?.community_about?.main_title}
                tag="h2"
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-900 mb-6 leading-tight"
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
                className="text-2xl md:text-3xl font-bold text-yellow-600 mb-8"
                placeholder="커뮤니티 부제목"
                isEditingPage={isEditingPage}
                onContentChange={onContentChange}
              />
            </div>

            <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
              <div className="text-lg md:text-xl text-gray-700 leading-relaxed">
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
              <div className="text-lg md:text-xl text-gray-700 leading-relaxed">
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
              <div className="bg-gradient-to-r from-blue-100 to-yellow-100 border-l-6 border-blue-600 pl-6 py-4 rounded-r-xl">
                <EditableText
                  page="home"
                  section="community_about"
                  contentKey="scripture_quote"
                  initialValue={initialContent?.community_about?.scripture_quote}
                  tag="span"
                  className="text-blue-800 font-bold italic text-xl"
                  isTextArea={true}
                  placeholder="성경 구절"
                  isEditingPage={isEditingPage}
                  onContentChange={onContentChange}
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 border-4 border-yellow-400 shadow-xl">
              <h4 className="text-2xl md:text-3xl font-extrabold text-white mb-4 flex items-center">
                <span className="mr-3 text-3xl md:text-4xl">🇺🇦</span>
                <EditableText
                  page="home"
                  section="community_about"
                  contentKey="ministry_title"
                  initialValue={initialContent?.community_about?.ministry_title}
                  tag="span"
                  className="text-white"
                  placeholder="사역 타이틀"
                  isEditingPage={isEditingPage}
                  onContentChange={onContentChange}
                />
              </h4>
              <div className="text-blue-100 text-lg md:text-xl leading-relaxed">
                <EditableText
                  page="home"
                  section="community_about"
                  contentKey="ministry_description"
                  initialValue={initialContent?.community_about?.ministry_description}
                  tag="span"
                  className="text-blue-100 text-lg md:text-xl leading-relaxed"
                  isTextArea={true}
                  placeholder="사역 설명"
                  isEditingPage={isEditingPage}
                  onContentChange={onContentChange}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mt-8">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Link href="/join">
                  <span>Join Our Family Today</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-300 bg-transparent"
              >
                <Link href="/ukrainian-ministry">
                  <span>Ukrainian Ministry</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Community Highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-6" />
            <EditableText
              page="home"
              section="community_highlights"
              contentKey="highlight1_title"
              initialValue={initialContent?.community_highlights?.highlight1_title}
              tag="h4"
              className="text-xl md:text-2xl font-bold text-blue-900 mb-4"
              placeholder="하이라이트 1 제목"
              isEditingPage={isEditingPage}
              onContentChange={onContentChange}
            />
            <div className="text-gray-700 text-lg md:text-xl">
              <EditableText
                page="home"
                section="community_highlights"
                contentKey="highlight1_description"
                initialValue={initialContent?.community_highlights?.highlight1_description}
                tag="span"
                className="text-gray-700 text-lg md:text-xl"
                placeholder="하이라이트 1 설명"
                isEditingPage={isEditingPage}
                onContentChange={onContentChange}
              />
            </div>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border-2 border-yellow-200 shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <Heart className="h-12 w-12 text-yellow-600 mx-auto mb-6" />
            <EditableText
              page="home"
              section="community_highlights"
              contentKey="highlight2_title"
              initialValue={initialContent?.community_highlights?.highlight2_title}
              tag="h4"
              className="text-xl md:text-2xl font-bold text-yellow-800 mb-4"
              placeholder="하이라이트 2 제목"
              isEditingPage={isEditingPage}
              onContentChange={onContentChange}
            />
            <div className="text-gray-700 text-lg md:text-xl">
              <EditableText
                page="home"
                section="community_highlights"
                contentKey="highlight2_description"
                initialValue={initialContent?.community_highlights?.highlight2_description}
                tag="span"
                className="text-gray-700 text-lg md:text-xl"
                placeholder="하이라이트 2 설명"
                isEditingPage={isEditingPage}
                onContentChange={onContentChange}
              />
            </div>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-blue-50 via-white to-yellow-50 rounded-2xl border-2 border-blue-200 shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <Handshake className="h-12 w-12 text-blue-600 mx-auto mb-6" />
            <EditableText
              page="home"
              section="community_highlights"
              contentKey="highlight3_title"
              initialValue={initialContent?.community_highlights?.highlight3_title}
              tag="h4"
              className="text-xl md:text-2xl font-bold text-blue-900 mb-4"
              placeholder="하이라이트 3 제목"
              isEditingPage={isEditingPage}
              onContentChange={onContentChange}
            />
            <div className="text-gray-700 text-lg md:text-xl">
              <EditableText
                page="home"
                section="community_highlights"
                contentKey="highlight3_description"
                initialValue={initialContent?.community_highlights?.highlight3_description}
                tag="span"
                className="text-gray-700 text-lg md:text-xl"
                placeholder="하이라이트 3 설명"
                isEditingPage={isEditingPage}
                onContentChange={onContentChange}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
