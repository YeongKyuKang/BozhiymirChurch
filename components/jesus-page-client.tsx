"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Cross, Star, Users, BookOpen, Lightbulb } from "lucide-react"
import Link from "next/link"
import EditableText from "@/components/editable-text"

interface JesusPageClientProps {
  initialContent: Record<string, any>
}

export default function JesusPageClient({ initialContent }: JesusPageClientProps) {
  const content = initialContent

  const teachings = [
    {
      icon: <Heart className="h-6 w-6 md:h-8 md:w-8 text-red-500" />,
      titleKey: "teaching1_title",
      descriptionKey: "teaching1_description",
      verseKey: "teaching1_verse",
    },
    {
      icon: <Cross className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />,
      titleKey: "teaching2_title",
      descriptionKey: "teaching2_description",
      verseKey: "teaching2_verse",
    },
    {
      icon: <Star className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />,
      titleKey: "teaching3_title",
      descriptionKey: "teaching3_description",
      verseKey: "teaching3_verse",
    },
    {
      icon: <Users className="h-6 w-6 md:h-8 md:w-8 text-green-600" />,
      titleKey: "teaching4_title",
      descriptionKey: "teaching4_description",
      verseKey: "teaching4_verse",
    },
    {
      icon: <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />,
      titleKey: "teaching5_title",
      descriptionKey: "teaching5_description",
      verseKey: "teaching5_verse",
    },
    {
      icon: <Lightbulb className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />,
      titleKey: "teaching6_title",
      descriptionKey: "teaching6_description",
      verseKey: "teaching6_verse",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-8 md:py-12 lg:py-16 px-4 pt-20 md:pt-24 lg:pt-32">
        <div className="container mx-auto text-center">
          <div className="text-4xl md:text-6xl mb-4 md:mb-6">✝️</div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            <EditableText
              page="jesus"
              section="hero"
              contentKey="title"
              initialValue={content?.hero?.title}
              tag="span"
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900"
            />
          </h1>
          <div className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8">
            <EditableText
              page="jesus"
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

      {/* Main Scripture */}
      <section className="py-8 md:py-12 lg:py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto text-center">
          <blockquote className="text-lg md:text-xl lg:text-2xl italic mb-4 md:mb-6 max-w-4xl mx-auto">
            <EditableText
              page="jesus"
              section="main_scripture"
              contentKey="quote"
              initialValue={content?.main_scripture?.quote}
              tag="span"
              className="text-lg md:text-xl lg:text-2xl italic"
              isTextArea={true}
            />
          </blockquote>
          <p className="text-base md:text-lg lg:text-xl font-semibold opacity-90">
            <EditableText
              page="jesus"
              section="main_scripture"
              contentKey="reference"
              initialValue={content?.main_scripture?.reference}
              tag="span"
              className="text-base md:text-lg lg:text-xl font-semibold opacity-90"
            />
          </p>
        </div>
      </section>

      {/* Who is Jesus */}
      <section className="py-8 md:py-12 lg:py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-6 md:mb-8">
            <EditableText
              page="jesus"
              section="who_is_jesus"
              contentKey="title"
              initialValue={content?.who_is_jesus?.title}
              tag="span"
              className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900"
            />
          </h2>
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6 md:mb-8">
              <CardContent className="p-6 md:p-8">
                <div className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed space-y-4">
                  <div>
                    <EditableText
                      page="jesus"
                      section="who_is_jesus"
                      contentKey="description1"
                      initialValue={content?.who_is_jesus?.description1}
                      tag="p"
                      className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed mb-4"
                      isTextArea={true}
                    />
                  </div>
                  <div>
                    <EditableText
                      page="jesus"
                      section="who_is_jesus"
                      contentKey="description2"
                      initialValue={content?.who_is_jesus?.description2}
                      tag="p"
                      className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed mb-4"
                      isTextArea={true}
                    />
                  </div>
                  <div>
                    <EditableText
                      page="jesus"
                      section="who_is_jesus"
                      contentKey="description3"
                      initialValue={content?.who_is_jesus?.description3}
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

      {/* Jesus' Teachings */}
      <section className="py-8 md:py-12 lg:py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
            <EditableText
              page="jesus"
              section="teachings"
              contentKey="title"
              initialValue={content?.teachings?.title}
              tag="span"
              className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {teachings.map((teaching, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="flex justify-center mb-3 md:mb-4">{teaching.icon}</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                    <EditableText
                      page="jesus"
                      section="teachings"
                      contentKey={teaching.titleKey}
                      initialValue={content?.teachings?.[teaching.titleKey]}
                      tag="span"
                      className="text-lg md:text-xl font-bold text-gray-900"
                    />
                  </h3>
                  <div className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 leading-relaxed">
                    <EditableText
                      page="jesus"
                      section="teachings"
                      contentKey={teaching.descriptionKey}
                      initialValue={content?.teachings?.[teaching.descriptionKey]}
                      tag="span"
                      className="text-sm md:text-base text-gray-600 leading-relaxed"
                      isTextArea={true}
                    />
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs md:text-sm text-blue-800 italic font-medium">
                      <EditableText
                        page="jesus"
                        section="teachings"
                        contentKey={teaching.verseKey}
                        initialValue={content?.teachings?.[teaching.verseKey]}
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

      {/* Salvation Message */}
      <section className="py-8 md:py-12 lg:py-16 px-4 bg-gradient-to-r from-red-500 to-pink-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8">
            <EditableText
              page="jesus"
              section="salvation"
              contentKey="title"
              initialValue={content?.salvation?.title}
              tag="span"
              className="text-xl md:text-2xl lg:text-3xl font-bold"
            />
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 opacity-95">
              <EditableText
                page="jesus"
                section="salvation"
                contentKey="message"
                initialValue={content?.salvation?.message}
                tag="span"
                className="text-base md:text-lg lg:text-xl opacity-95"
                isTextArea={true}
              />
            </div>
            <blockquote className="text-lg md:text-xl lg:text-2xl italic mb-4 md:mb-6">
              <EditableText
                page="jesus"
                section="salvation"
                contentKey="verse"
                initialValue={content?.salvation?.verse}
                tag="span"
                className="text-lg md:text-xl lg:text-2xl italic"
                isTextArea={true}
              />
            </blockquote>
            <p className="text-base md:text-lg font-semibold opacity-90 mb-6 md:mb-8">
              <EditableText
                page="jesus"
                section="salvation"
                contentKey="verse_reference"
                initialValue={content?.salvation?.verse_reference}
                tag="span"
                className="text-base md:text-lg font-semibold opacity-90"
              />
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 md:py-12 lg:py-16 px-4 text-center">
        <div className="container mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
            <EditableText
              page="jesus"
              section="cta"
              contentKey="title"
              initialValue={content?.cta?.title}
              tag="span"
              className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900"
            />
          </h2>
          <div className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto">
            <EditableText
              page="jesus"
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
              <Link href="/join">Accept Jesus Today</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              <Link href="/prayer">Request Prayer</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
