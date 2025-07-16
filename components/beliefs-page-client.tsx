// components/beliefs-page-client.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Heart, Users, Globe, Star, Shield } from "lucide-react"
import Link from "next/link"
import EditableText from "@/components/editable-text"
import { useState } from "react" // 클라이언트 컴포넌트임을 명시

interface BeliefsPageClientProps {
  initialContent: Record<string, any>
}

export default function BeliefsPageClient({ initialContent }: BeliefsPageClientProps) {
  const content = initialContent

  const beliefs = [
    {
      icon: <BookOpen className="h-6 w-6 text-blue-900" />, // h-7 w-7 -> h-6 w-6
      titleKey: "belief1_title",
      descriptionKey: "belief1_description",
      verseKey: "belief1_verse",
    },
    {
      icon: <Heart className="h-6 w-6 text-blue-900" />, // h-7 w-7 -> h-6 w-6
      titleKey: "belief2_title",
      descriptionKey: "belief2_description",
      verseKey: "belief2_verse",
    },
    {
      icon: <Users className="h-6 w-6 text-blue-900" />, // h-7 w-7 -> h-6 w-6
      titleKey: "belief3_title",
      descriptionKey: "belief3_description",
      verseKey: "belief3_verse",
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-900" />, // h-7 w-7 -> h-6 w-6
      titleKey: "belief4_title",
      descriptionKey: "belief4_description",
      verseKey: "belief4_verse",
    },
    {
      icon: <Star className="h-6 w-6 text-blue-900" />, // h-7 w-7 -> h-6 w-6
      titleKey: "belief5_title",
      descriptionKey: "belief5_description",
      verseKey: "belief5_verse",
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-900" />, // h-7 w-7 -> h-6 w-6
      titleKey: "belief6_title",
      descriptionKey: "belief6_description",
      verseKey: "belief6_verse",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16"> {/* Added pt-24 */}
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white h-[25vh] flex items-center justify-center border-b-4 border-yellow-500"> {/* h-[60vh] -> h-[25vh] */}
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2"> {/* mb-4 -> mb-2 */}
            <span className="text-3xl md:text-4xl">📖</span> {/* text-4xl md:text-5xl -> text-3xl md:text-4xl */}
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold mb-3"> {/* text-3xl md:text-4xl lg:text-4xl -> text-2xl md:text-3xl lg:text-3xl, mb-5 -> mb-3 */}
            <EditableText
              page="beliefs"
              section="hero"
              contentKey="title"
              initialValue={content?.hero?.title || "What We Believe"}
              tag="span"
              className="text-white"
            />
          </h1>
          <p className="text-sm md:text-base text-blue-200 max-w-4xl mx-auto leading-relaxed"> {/* text-lg md:text-xl -> text-sm md:text-base */}
            <EditableText
              page="beliefs"
              section="hero"
              contentKey="subtitle"
              initialValue={
                content?.hero?.subtitle || "Our faith is built on the solid foundation of God's Word, the Bible."
              }
              tag="span"
              className="text-sm md:text-base text-blue-200"
              isTextArea={true}
            />
          </p>
        </div>
      </div>

      {/* Foundation Scripture */}
      <section className="py-8 bg-blue-50 border-b border-gray-200"> {/* py-12 -> py-8, bg-gray-100 -> bg-blue-50 */}
        <div className="container mx-auto px-4 text-center">
          <blockquote className="text-base italic mb-3 max-w-4xl mx-auto leading-relaxed text-gray-700"> {/* text-lg -> text-base, mb-5 -> mb-3 */}
            <EditableText
              page="beliefs"
              section="foundation"
              contentKey="scripture"
              initialValue={
                content?.foundation?.scripture ||
                "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness."
              }
              tag="span"
              className="text-base italic text-gray-700"
              isTextArea={true}
            />
          </blockquote>
          <p className="text-sm font-semibold text-gray-700"> {/* text-base -> text-sm */}
            <EditableText
              page="beliefs"
              section="foundation"
              contentKey="reference"
              initialValue={content?.foundation?.reference || "2 Timothy 3:16-17"}
              tag="span"
              className="text-sm font-semibold text-gray-700"
            />
          </p>
        </div>
      </section>

      {/* Core Beliefs */}
      <section className="py-8 bg-white"> {/* py-12 -> py-8, implicit bg-white */}
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-center text-blue-900 mb-6"> {/* text-2xl md:text-2xl -> text-xl md:text-2xl, mb-8 -> mb-6 */}
            <EditableText
              page="beliefs"
              section="core_beliefs"
              contentKey="title"
              initialValue={content?.core_beliefs?.title || "Our Core Beliefs"}
              tag="span"
              className="text-blue-900"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* gap-6 -> gap-4 */}
            {beliefs.map((belief, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 shadow-md bg-white"
              >
                <CardContent className="p-4 h-full flex flex-col"> {/* p-6 -> p-4 */}
                  <div className="flex items-center mb-3"> {/* mb-5 -> mb-3 */}
                    <div className="bg-yellow-400 rounded-full p-2 mr-3">{belief.icon}</div> {/* p-3 -> p-2, mr-4 -> mr-3 */}
                    <h3 className="text-base font-bold text-blue-900"> {/* text-lg -> text-base */}
                      <EditableText
                        page="beliefs"
                        section="core_beliefs"
                        contentKey={belief.titleKey}
                        initialValue={content?.core_beliefs?.[belief.titleKey] || `Belief ${index + 1}`}
                        tag="span"
                        className="text-blue-900"
                      />
                    </h3>
                  </div>
                  <div className="text-sm text-gray-700 mb-4 leading-relaxed flex-grow"> {/* text-base -> text-sm, mb-6 -> mb-4 */}
                    <EditableText
                      page="beliefs"
                      section="core_beliefs"
                      contentKey={belief.descriptionKey}
                      initialValue={content?.core_beliefs?.[belief.descriptionKey] || "Description of this belief."}
                      tag="span"
                      className="text-gray-700"
                      isTextArea={true}
                    />
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl mt-auto border-l-4 border-blue-500"> {/* p-4 -> p-3 */}
                    <p className="text-xs text-blue-800 italic font-medium"> {/* text-sm -> text-xs */}
                      <EditableText
                        page="beliefs"
                        section="core_beliefs"
                        contentKey={belief.verseKey}
                        initialValue={content?.core_beliefs?.[belief.verseKey] || "Bible verse here"}
                        tag="span"
                        className="text-blue-800 italic font-medium"
                      />
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statement of Faith */}
      <section className="py-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-y border-white/20"> {/* py-12 -> py-8 */}
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-center mb-6"> {/* text-2xl md:text-2xl -> text-xl md:text-2xl, mb-8 -> mb-6 */}
            <EditableText
              page="beliefs"
              section="statement_of_faith"
              contentKey="title"
              initialValue={content?.statement_of_faith?.title || "Our Statement of Faith"}
              tag="span"
              className="text-white"
            />
          </h2>
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-2xl border border-gray-600 bg-white/10 backdrop-blur-sm">
              <CardContent className="p-5"> {/* p-6 -> p-5 */}
                <div className="text-sm text-blue-200 leading-relaxed space-y-3"> {/* text-base -> text-sm, space-y-4 -> space-y-3 */}
                  <div>
                    <EditableText
                      page="beliefs"
                      section="statement_of_faith"
                      contentKey="statement1"
                      initialValue={
                        content?.statement_of_faith?.statement1 ||
                        "We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit."
                      }
                      tag="p"
                      className="text-sm text-blue-200 leading-relaxed"
                      isTextArea={true}
                    />
                  </div>
                  <div>
                    <EditableText
                      page="beliefs"
                      section="statement_of_faith"
                      contentKey="statement2"
                      initialValue={
                        content?.statement_of_faith?.statement2 ||
                        "We believe in the virgin birth, sinless life, substitutionary death, bodily resurrection, and ascension of Jesus Christ."
                      }
                      tag="p"
                      className="text-sm text-blue-200 leading-relaxed"
                      isTextArea={true}
                    />
                  </div>
                  <div>
                    <EditableText
                      page="beliefs"
                      section="statement_of_faith"
                      contentKey="statement3"
                      initialValue={
                        content?.statement_of_faith?.statement3 ||
                        "We believe in the necessity of personal faith in Jesus Christ for salvation."
                      }
                      tag="p"
                      className="text-sm text-blue-200 leading-relaxed"
                      isTextArea={true}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-6 bg-gradient-to-br from-blue-50 via-white to-yellow-50 text-center"> {/* py-12 -> py-6 */}
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-blue-900 mb-4"> {/* text-2xl md:text-2xl -> text-xl md:text-2xl, mb-5 -> mb-4 */}
            <EditableText
              page="beliefs"
              section="cta"
              contentKey="title"
              initialValue={content?.cta?.title || "Join Our Faith Community"}
              tag="span"
              className="text-blue-900"
            />
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-6 max-w-4xl mx-auto leading-relaxed"> {/* text-lg md:text-xl -> text-base md:text-lg, mb-7 -> mb-6 */}
            <EditableText
              page="beliefs"
              section="cta"
              contentKey="description"
              initialValue={
                content?.cta?.description ||
                "If these beliefs resonate with your heart, we invite you to join our church family."
              }
              tag="span"
              className="text-base md:text-lg text-gray-700"
              isTextArea={true}
            />
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center"> {/* gap-4 -> gap-2 */}
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-bold px-6 py-2 text-base rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/join">Join Our Community</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-yellow-700 text-yellow-700 hover:bg-yellow-700 hover:text-white font-bold px-6 py-2 text-base rounded-full bg-transparent shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/leadership">Meet Our Leaders</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
