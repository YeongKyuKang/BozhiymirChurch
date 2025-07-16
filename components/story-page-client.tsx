// components/story-page-client.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Heart, Users, Globe, Star, Church } from "lucide-react"
import Link from "next/link"
import EditableText from "@/components/editable-text"
import { useState } from "react" // 클라이언트 컴포넌트임을 명시하기 위해 useState 임포트

interface StoryPageClientProps {
  initialContent: Record<string, any>
}

export default function StoryPageClient({ initialContent }: StoryPageClientProps) {
  const content = initialContent

  const timeline = [
    {
      year: "2010",
      titleKey: "timeline_2010_title",
      descriptionKey: "timeline_2010_description",
      icon: <Church className="h-4 w-4" />, // h-5 w-5 -> h-4 w-4
    },
    {
      year: "2015",
      titleKey: "timeline_2015_title",
      descriptionKey: "timeline_2015_description",
      icon: <Users className="h-4 w-4" />, // h-5 w-5 -> h-4 w-4
    },
    {
      year: "2018",
      titleKey: "timeline_2018_title",
      descriptionKey: "timeline_2018_description",
      icon: <Star className="h-4 w-4" />, // h-5 w-5 -> h-4 w-4
    },
    {
      year: "2022",
      titleKey: "timeline_2022_title",
      descriptionKey: "timeline_2022_description",
      icon: <Heart className="h-4 w-4" />, // h-5 w-5 -> h-4 w-4
    },
    {
      year: "2024",
      titleKey: "timeline_2024_title",
      descriptionKey: "timeline_2024_description",
      icon: <Globe className="h-4 w-4" />, // h-5 w-5 -> h-4 w-4
    },
  ]

  const values = [
    {
      icon: <Heart className="h-6 w-6 text-blue-600" />, // h-7 w-7 -> h-6 w-6
      titleKey: "value1_title",
      descriptionKey: "value1_description",
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />, // h-7 w-7 -> h-6 w-6
      titleKey: "value2_title",
      descriptionKey: "value2_description",
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-600" />, // h-7 w-7 -> h-6 w-6
      titleKey: "value3_title",
      descriptionKey: "value3_description",
    },
    {
      icon: <Star className="h-6 w-6 text-blue-600" />, // h-7 w-7 -> h-6 w-6
      titleKey: "value4_title",
      descriptionKey: "value4_description",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16"> {/* Added pt-24 to push content below header */}
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white h-[25vh] flex items-center justify-center border-b-4 border-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2">
            <span className="text-3xl md:text-4xl">🇺🇦</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold mb-3">
            <EditableText
              page="story"
              section="main"
              contentKey="title"
              initialValue={content?.main?.title || "Our Story"}
              tag="span"
              className="text-white"
            />
          </h1>
          <p className="text-sm md:text-base text-blue-200 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="story"
              section="main"
              contentKey="description"
              initialValue={
                content?.main?.description ||
                "Discover the journey of faith, hope, and community that defines Bozhiymir Church."
              }
              tag="span"
              className="text-blue-200"
            />
          </p>
        </div>
      </div>

      {/* Mission Statement - Left Aligned */}
      <section className="py-8 bg-blue-50"> {/* py-10 -> py-8, bg-gradient-to-br from-blue-50 to-white -> bg-blue-50 */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold mb-3 text-gray-900">
                <EditableText
                  page="story"
                  section="mission"
                  contentKey="mission_title"
                  initialValue={content?.mission?.mission_title || "Our Mission"}
                  tag="span"
                  className="text-gray-900"
                />
              </h2>
              <blockquote className="text-base italic mb-3 text-gray-700 leading-relaxed">
                <EditableText
                  page="story"
                  section="mission"
                  contentKey="mission_quote"
                  initialValue={
                    content?.mission?.mission_quote ||
                    "To be a beacon of hope and love in our community, sharing the Gospel of Jesus Christ with all people."
                  }
                  tag="span"
                  className="text-gray-700"
                  isTextArea={true}
                />
              </blockquote>
            </div>
            <div className="text-center">
              <div className="flex justify-center space-x-1 text-xl mb-1">
                <span>🙏</span>
                <span>❤️</span>
                <span>🇺🇦</span>
              </div>
              <div className="bg-blue-700 text-white p-4 rounded-2xl shadow-xl border border-blue-600">
                <h3 className="text-base font-bold mb-1">Our Foundation</h3>
                <p className="text-sm opacity-90">Built on faith, strengthened by community, guided by love.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline - Right Aligned */}
      <section className="py-8 bg-white"> {/* py-10 -> py-8, bg-gradient-to-br from-white to-blue-50 -> bg-white */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div className="lg:order-2">
              <h2 className="text-xl md:text-2xl font-extrabold text-blue-900 mb-4">
                <EditableText
                  page="story"
                  section="timeline"
                  contentKey="timeline_title"
                  initialValue={content?.timeline?.timeline_title || "Our Journey"}
                  tag="span"
                  className="text-blue-900"
                />
              </h2>
              <div className="space-y-3">
                {timeline.map((event, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-700 to-blue-800 rounded-full flex items-center justify-center text-white mr-2 shadow-lg">
                      {event.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center mb-0.5">
                        <span className="bg-yellow-400 text-gray-900 px-1.5 py-0.5 rounded-full text-xxs font-bold mb-0.5 md:mb-0 md:mr-1.5 inline-block w-fit">
                          {event.year}
                        </span>
                        <h3 className="text-base font-bold text-blue-900">
                          <EditableText
                            page="story"
                            section="timeline"
                            contentKey={event.titleKey}
                            initialValue={content?.timeline?.[event.titleKey] || `Milestone ${event.year}`}
                            tag="span"
                            className="text-blue-900"
                          />
                        </h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <EditableText
                          page="story"
                          section="timeline"
                          contentKey={event.descriptionKey}
                          initialValue={
                            content?.timeline?.[event.descriptionKey] || "A significant moment in our church's history."
                          }
                          tag="span"
                          className="text-gray-700"
                          isTextArea={true}
                        />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:order-1">
              <div className="bg-gray-50 text-gray-700 p-5 rounded-2xl shadow-xl border border-gray-200 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-1">⛪</div>
                  <h3 className="text-base font-bold text-blue-900 mb-0.5">Growing Together</h3>
                  <p className="text-sm text-gray-700">
                    Each milestone represents our commitment to serving God and our community with unwavering faith.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Left Aligned */}
      <section className="py-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-y border-white/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold mb-4">
                <EditableText
                  page="story"
                  section="values"
                  contentKey="values_title"
                  initialValue={content?.values?.values_title || "Our Values"}
                  tag="span"
                  className="text-white"
                />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-lg hover:bg-white/20 transition-all duration-300 border border-gray-600">
                    <div className="flex items-center mb-1">
                      <div className="bg-yellow-500 rounded-full p-1.5 mr-1.5">
                        {value.icon}
                      </div>
                      <h3 className="text-base font-bold text-white">
                        <EditableText
                          page="story"
                          section="values"
                          contentKey={value.titleKey}
                          initialValue={content?.values?.[value.titleKey] || `Value ${index + 1}`}
                          tag="span"
                          className="text-white"
                        />
                      </h3>
                    </div>
                    <p className="text-sm text-blue-200 leading-relaxed">
                      <EditableText
                        page="story"
                        section="values"
                        contentKey={value.descriptionKey}
                        initialValue={content?.values?.[value.descriptionKey] || "Description of this value"}
                        tag="span"
                        className="text-blue-200"
                      />
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="bg-yellow-400 text-blue-900 p-4 rounded-2xl shadow-2xl border border-yellow-500">
                <h3 className="text-xl font-bold mb-2">Faith in Action</h3>
                <p className="text-base mb-3 text-gray-800">
                  Our values guide every decision, every ministry, and every relationship we build.
                </p>
                <div className="text-xl">✨</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ukrainian Ministry Highlight - Right Aligned */}
      <section className="py-8 bg-yellow-50"> {/* py-10 -> py-8, bg-gradient-to-br from-blue-50 to-white -> bg-yellow-50 */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
            <div className="lg:order-2">
              <h2 className="text-xl md:text-2xl font-extrabold mb-3 text-blue-900">
                <EditableText
                  page="story"
                  section="ministry_highlight"
                  contentKey="highlight_title"
                  initialValue={content?.ministry_highlight?.highlight_title || "Ukrainian Ministry"}
                  tag="span"
                  className="text-blue-900"
                />
              </h2>
              <p className="text-base md:text-lg mb-4 text-blue-800 leading-relaxed">
                <EditableText
                  page="story"
                  section="ministry_highlight"
                  contentKey="highlight_description"
                  initialValue={
                    content?.ministry_highlight?.highlight_description ||
                    "Supporting Ukrainian families in their time of need"
                  }
                  tag="span"
                  className="text-blue-800"
                />
              </p>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-blue-700 text-white p-3 rounded-xl shadow-lg border border-blue-600">
                  <div className="text-xl md:text-2xl font-bold mb-0.5">
                    <EditableText
                      page="story"
                      section="ministry_highlight"
                      contentKey="stat1_number"
                      initialValue={content?.ministry_highlight?.stat1_number || "150+"}
                      tag="span"
                      className="text-xl md:text-2xl font-bold"
                    />
                  </div>
                  <div className="text-xs opacity-90">
                    <EditableText
                      page="story"
                      section="ministry_highlight"
                      contentKey="stat1_label"
                      initialValue={content?.ministry_highlight?.stat1_label || "Families Helped"}
                      tag="span"
                      className="text-xs opacity-90"
                    />
                  </div>
                </div>
                <div className="bg-blue-700 text-white p-3 rounded-xl shadow-lg border border-blue-600">
                  <div className="text-xl md:text-2xl font-bold mb-0.5">
                    <EditableText
                      page="story"
                      section="ministry_highlight"
                      contentKey="stat2_number"
                      initialValue={content?.ministry_highlight?.stat2_number || "500+"}
                      tag="span"
                      className="text-xl md:text-2xl font-bold"
                    />
                  </div>
                  <div className="text-xs opacity-90">
                    <EditableText
                      page="story"
                      section="ministry_highlight"
                      contentKey="stat2_label"
                      initialValue={content?.ministry_highlight?.stat2_label || "Meals Provided"}
                      tag="span"
                      className="text-xs opacity-90"
                    />
                    </div>
                </div>
              </div>
            </div>
            <div className="lg:order-1 text-center">
              <div className="text-3xl mb-3">🇺🇦</div>
              <div className="bg-blue-700 text-white p-2 rounded-2xl shadow-xl border border-blue-600">
                <p className="text-sm leading-relaxed">
                  <EditableText
                    page="story"
                    section="ministry_highlight"
                    contentKey="highlight_quote"
                    initialValue={content?.ministry_highlight?.highlight_quote || "Together we stand with Ukraine"}
                    tag="span"
                    className="text-sm"
                    isTextArea={true}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-6 bg-gradient-to-br from-blue-50 via-white to-yellow-50 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-blue-900 mb-3">
            <EditableText
              page="story"
              section="cta"
              contentKey="cta_title"
              initialValue={content?.cta?.cta_title || "Join Our Story"}
              tag="span"
              className="text-blue-900"
            />
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-4 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="story"
              section="cta"
              contentKey="cta_description"
              initialValue={
                content?.cta?.cta_description || "Be part of our continuing story of faith, hope, and love."
              }
              tag="span"
              className="text-gray-700"
              isTextArea={true}
            />
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-bold px-6 py-2 text-base rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/join">Join Our Family</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-yellow-700 text-yellow-700 hover:bg-yellow-700 hover:text-white font-bold px-6 py-2 text-base rounded-full bg-transparent shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
