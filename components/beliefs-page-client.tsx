"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Heart, Users, Globe, Star, Shield } from "lucide-react"
import Link from "next/link"
import EditableText from "@/components/editable-text"

interface BeliefsPageClientProps {
  initialContent: Record<string, any>
}

export default function BeliefsPageClient({ initialContent }: BeliefsPageClientProps) {
  const content = initialContent

  const beliefs = [
    {
      icon: <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />,
      titleKey: "belief1_title",
      descriptionKey: "belief1_description",
      verseKey: "belief1_verse",
    },
    {
      icon: <Heart className="h-6 w-6 md:h-8 md:w-8 text-red-500" />,
      titleKey: "belief2_title",
      descriptionKey: "belief2_description",
      verseKey: "belief2_verse",
    },
    {
      icon: <Users className="h-6 w-6 md:h-8 md:w-8 text-green-600" />,
      titleKey: "belief3_title",
      descriptionKey: "belief3_description",
      verseKey: "belief3_verse",
    },
    {
      icon: <Globe className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />,
      titleKey: "belief4_title",
      descriptionKey: "belief4_description",
      verseKey: "belief4_verse",
    },
    {
      icon: <Star className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />,
      titleKey: "belief5_title",
      descriptionKey: "belief5_description",
      verseKey: "belief5_verse",
    },
    {
      icon: <Shield className="h-6 w-6 md:h-8 md:w-8 text-indigo-600" />,
      titleKey: "belief6_title",
      descriptionKey: "belief6_description",
      verseKey: "belief6_verse",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-8 md:py-12 lg:py-16 px-4 pt-20 md:pt-24 lg:pt-32">
        <div className="container mx-auto text-center">
          <div className="text-4xl md:text-6xl mb-4 md:mb-6">📖</div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            <EditableText
              page="beliefs"
              section="hero"
              contentKey="title"
              initialValue={content?.hero?.title}
              tag="span"
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900"
            />
          </h1>
          <div className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8">
            <EditableText
              page="beliefs"
              section="hero"
              contentKey="subtitle"
              initialValue={content?.hero?.subtitle}
              tag="span"
              className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto"
              isTextArea={true}
            />
          </div>
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Foundation Scripture */}
      <section className="py-8 md:py-12 lg:py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto text-center">
          <blockquote className="text-lg md:text-xl lg:text-2xl italic mb-4 md:mb-6 max-w-4xl mx-auto">
            <EditableText
              page="beliefs"
              section="foundation"
              contentKey="scripture"
              initialValue={content?.foundation?.scripture}
              tag="span"
              className="text-lg md:text-xl lg:text-2xl italic"
              isTextArea={true}
            />
          </blockquote>
          <p className="text-base md:text-lg lg:text-xl font-semibold opacity-90">
            <EditableText
              page="beliefs"
              section="foundation"
              contentKey="reference"
              initialValue={content?.foundation?.reference}
              tag="span"
              className="text-base md:text-lg lg:text-xl font-semibold opacity-90"
            />
          </p>
        </div>
      </section>

      {/* Core Beliefs */}
      <section className="py-8 md:py-12 lg:py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
            <EditableText
              page="beliefs"
              section="core_beliefs"
              contentKey="title"
              initialValue={content?.core_beliefs?.title}
              tag="span"
              className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {beliefs.map((belief, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 h-full">
                <CardContent className="p-4 md:p-6 h-full flex flex-col">
                  <div className="flex items-center mb-3 md:mb-4">
                    {belief.icon}
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 ml-3">
                      <EditableText
                        page="beliefs"
                        section="core_beliefs"
                        contentKey={belief.titleKey}
                        initialValue={content?.core_beliefs?.[belief.titleKey]}
                        tag="span"
                        className="text-lg md:text-xl font-bold text-gray-900"
                      />
                    </h3>
                  </div>
                  <div className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed flex-grow">
                    <EditableText
                      page="beliefs"
                      section="core_beliefs"
                      contentKey={belief.descriptionKey}
                      initialValue={content?.core_beliefs?.[belief.descriptionKey]}
                      tag="span"
                      className="text-sm md:text-base text-gray-600 leading-relaxed"
                      isTextArea={true}
                    />
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg mt-auto">
                    <p className="text-xs md:text-sm text-blue-800 italic font-medium">
                      <EditableText
                        page="beliefs"
                        section="core_beliefs"
                        contentKey={belief.verseKey}
                        initialValue={content?.core_beliefs?.[belief.verseKey]}
                        tag="span"
                        className="text-xs md:text-sm text-blue-800 italic font-medium"
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
      <section className="py-8 md:py-12 lg:py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-6 md:mb-8">
            <EditableText
              page="beliefs"
              section="statement_of_faith"
              contentKey="title"
              initialValue={content?.statement_of_faith?.title}
              tag="span"
              className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900"
            />
          </h2>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed space-y-4">
                  <div>
                    <EditableText
                      page="beliefs"
                      section="statement_of_faith"
                      contentKey="statement1"
                      initialValue={content?.statement_of_faith?.statement1}
                      tag="p"
                      className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed mb-4"
                      isTextArea={true}
                    />
                  </div>
                  <div>
                    <EditableText
                      page="beliefs"
                      section="statement_of_faith"
                      contentKey="statement2"
                      initialValue={content?.statement_of_faith?.statement2}
                      tag="p"
                      className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed mb-4"
                      isTextArea={true}
                    />
                  </div>
                  <div>
                    <EditableText
                      page="beliefs"
                      section="statement_of_faith"
                      contentKey="statement3"
                      initialValue={content?.statement_of_faith?.statement3}
                      tag="p"
                      className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed"
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
      <section className="py-8 md:py-12 lg:py-16 px-4 text-center">
        <div className="container mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
            <EditableText
              page="beliefs"
              section="cta"
              contentKey="title"
              initialValue={content?.cta?.title}
              tag="span"
              className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900"
            />
          </h2>
          <div className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto">
            <EditableText
              page="beliefs"
              section="cta"
              contentKey="description"
              initialValue={content?.cta?.description}
              tag="span"
              className="text-base md:text-lg lg:text-xl text-gray-600"
              isTextArea={true}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Link href="/join">Join Our Community</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              <Link href="/leadership">Meet Our Leaders</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
