// components/jesus-page-client.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Cross, Star, Users, BookOpen, Lightbulb, Calendar as CalendarIcon } from "lucide-react" // CalendarIcon 추가
import Link from "next/link"
import EditableText from "@/components/editable-text"
import { useState } from "react" // 클라이언트 컴포넌트임을 명시

interface JesusPageClientProps {
  initialContent: Record<string, any>
}

export default function JesusPageClient({ initialContent }: JesusPageClientProps) {
  const content = initialContent

  const teachings = [
    {
      icon: <Heart className="h-6 w-6 text-blue-900" />, // h-8 w-8 -> h-6 w-6
      titleKey: "teaching1_title",
      descriptionKey: "teaching1_description",
      verseKey: "teaching1_verse",
    },
    {
      icon: <Cross className="h-6 w-6 text-blue-900" />, // h-8 w-8 -> h-6 w-6
      titleKey: "teaching2_title",
      descriptionKey: "teaching2_description",
      verseKey: "teaching2_verse",
    },
    {
      icon: <Star className="h-6 w-6 text-blue-900" />, // h-8 w-8 -> h-6 w-6
      titleKey: "teaching3_title",
      descriptionKey: "teaching3_description",
      verseKey: "teaching3_verse",
    },
    {
      icon: <Users className="h-6 w-6 text-blue-900" />, // h-8 w-8 -> h-6 w-6
      titleKey: "teaching4_title",
      descriptionKey: "teaching4_description",
      verseKey: "teaching4_verse",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-blue-900" />, // h-8 w-8 -> h-6 w-6
      titleKey: "teaching5_title",
      descriptionKey: "teaching5_description",
      verseKey: "teaching5_verse",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-blue-900" />, // h-8 w-8 -> h-6 w-6
      titleKey: "teaching6_title",
      descriptionKey: "teaching6_description",
      verseKey: "teaching6_verse",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16"> {/* Added pt-24 */}
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white h-[25vh] flex items-center justify-center border-b-4 border-yellow-500"> {/* h-[60vh] -> h-[25vh] */}
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2"> {/* mb-4 -> mb-2 */}
            <span className="text-3xl md:text-4xl">✝️</span> {/* text-4xl md:text-5xl -> text-3xl md:text-4xl */}
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold mb-3"> {/* text-3xl md:text-4xl lg:text-4xl -> text-2xl md:text-3xl lg:text-3xl, mb-5 -> mb-3 */}
            <EditableText
              page="jesus"
              section="hero"
              contentKey="title"
              initialValue={content?.hero?.title || "Meet Jesus Christ"}
              tag="span"
              className="text-white"
            />
          </h1>
          <p className="text-sm md:text-base text-blue-200 max-w-4xl mx-auto leading-relaxed"> {/* text-lg md:text-xl -> text-sm md:text-base */}
            <EditableText
              page="jesus"
              section="hero"
              contentKey="subtitle"
              initialValue={
                content?.hero?.subtitle ||
                "Discover the love, grace, and salvation found in Jesus Christ, our Lord and Savior."
              }
              tag="span"
              className="text-sm md:text-base text-blue-200"
              isTextArea={true}
            />
          </p>
        </div>
      </div>

      {/* Main Scripture */}
      <section className="py-8 bg-blue-50 border-b border-gray-200"> {/* py-12 -> py-8, bg-gray-100 -> bg-blue-50 */}
        <div className="container mx-auto px-4 text-center">
          <blockquote className="text-base italic mb-3 max-w-4xl mx-auto leading-relaxed text-gray-700"> {/* text-lg -> text-base, mb-5 -> mb-3 */}
            <EditableText
              page="jesus"
              section="main_scripture"
              contentKey="quote"
              initialValue={
                content?.main_scripture?.quote ||
                "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
              }
              tag="span"
              className="text-base italic text-gray-700"
              isTextArea={true}
            />
          </blockquote>
          <p className="text-sm font-semibold text-gray-700"> {/* text-base -> text-sm */}
            <EditableText
              page="jesus"
              section="main_scripture"
              contentKey="reference"
              initialValue={content?.main_scripture?.reference || "John 3:16"}
              tag="span"
              className="text-sm font-semibold text-gray-700"
            />
          </p>
        </div>
      </section>

      {/* Who is Jesus */}
      <section className="py-8 bg-white"> {/* py-12 -> py-8, implicit bg-white */}
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-center text-blue-900 mb-6"> {/* text-2xl md:text-2xl -> text-xl md:text-2xl, mb-8 -> mb-6 */}
            <EditableText
              page="jesus"
              section="who_is_jesus"
              contentKey="title"
              initialValue={content?.who_is_jesus?.title || "Who is Jesus?"}
              tag="span"
              className="text-blue-900"
            />
          </h2>
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-2xl border border-gray-200 bg-gradient-to-br from-white to-blue-50"> {/* Added border, bg-gradient */}
              <CardContent className="p-5"> {/* p-6 -> p-5 */}
                <div className="text-sm text-gray-700 leading-relaxed space-y-3"> {/* text-base -> text-sm, space-y-4 -> space-y-3 */}
                  <div>
                    <EditableText
                      page="jesus"
                      section="who_is_jesus"
                      contentKey="description1"
                      initialValue={
                        content?.who_is_jesus?.description1 ||
                        "Jesus Christ is the Son of God, born of the Virgin Mary over 2,000 years ago in Bethlehem."
                      }
                      tag="p"
                      className="text-sm text-gray-700 leading-relaxed"
                      isTextArea={true}
                    />
                  </div>
                  <div>
                    <EditableText
                      page="jesus"
                      section="who_is_jesus"
                      contentKey="description2"
                      initialValue={
                        content?.who_is_jesus?.description2 ||
                        "Through His death on the cross, Jesus paid the penalty for our sins."
                      }
                      tag="p"
                      className="text-sm text-gray-700 leading-relaxed"
                      isTextArea={true}
                    />
                  </div>
                  <div>
                    <EditableText
                      page="jesus"
                      section="who_is_jesus"
                      contentKey="description3"
                      initialValue={
                        content?.who_is_jesus?.description3 ||
                        "Jesus is not just a historical figure - He is the living God who desires a personal relationship with each of us."
                      }
                      tag="p"
                      className="text-sm text-gray-700 leading-relaxed"
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
      <section className="py-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-y border-white/20"> {/* py-12 -> py-8 */}
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-center mb-6"> {/* text-2xl md:text-2xl -> text-xl md:text-2xl, mb-8 -> mb-6 */}
            <EditableText
              page="jesus"
              section="teachings"
              contentKey="title"
              initialValue={content?.teachings?.title || "The Teachings of Jesus"}
              tag="span"
              className="text-white"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* gap-6 -> gap-4 */}
            {teachings.map((teaching, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-600 bg-white/10 backdrop-blur-sm"
              >
                <CardContent className="p-4 text-center"> {/* p-5 -> p-4 */}
                  <div className="flex justify-center mb-3"> {/* mb-5 -> mb-3 */}
                    <div className="bg-yellow-400 rounded-full p-2">{teaching.icon}</div> {/* p-3 -> p-2 */}
                  </div>
                  <h3 className="text-base font-bold mb-2"> {/* text-lg -> text-base, mb-4 -> mb-2 */}
                    <EditableText
                      page="jesus"
                      section="teachings"
                      contentKey={teaching.titleKey}
                      initialValue={content?.teachings?.[teaching.titleKey] || `Teaching ${index + 1}`}
                      tag="span"
                      className="text-white"
                    />
                  </h3>
                  <div className="text-sm text-blue-200 mb-4 leading-relaxed"> {/* text-base -> text-sm, mb-5 -> mb-4 */}
                    <EditableText
                      page="jesus"
                      section="teachings"
                      contentKey={teaching.descriptionKey}
                      initialValue={content?.teachings?.[teaching.descriptionKey] || "Description of this teaching."}
                      tag="span"
                      className="text-sm text-blue-200 leading-relaxed"
                      isTextArea={true}
                    />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-xl border-l-4 border-blue-500"> {/* p-4 -> p-3 */}
                    <p className="text-xs text-gray-700 italic font-medium"> {/* text-sm -> text-xs */}
                      <EditableText
                        page="jesus"
                        section="teachings"
                        contentKey={teaching.verseKey}
                        initialValue={content?.teachings?.[teaching.verseKey] || "Bible verse here"}
                        tag="span"
                        className="text-xs text-gray-700 italic font-medium"
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
      <section className="py-8 bg-yellow-50 border-y border-gray-200"> {/* py-12 -> py-8, bg-gray-100 -> bg-yellow-50 */}
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold text-blue-900 mb-4"> {/* text-2xl md:text-2xl -> text-xl md:text-2xl, mb-5 -> mb-4 */}
            <EditableText
              page="jesus"
              section="salvation"
              contentKey="title"
              initialValue={content?.salvation?.title || "The Gift of Salvation"}
              tag="span"
              className="text-blue-900"
            />
          </h2>
          <div className="max-w-5xl mx-auto">
            <p className="text-base md:text-lg mb-4 text-gray-700 leading-relaxed"> {/* text-lg md:text-xl -> text-base md:text-lg, mb-5 -> mb-4 */}
              <EditableText
                page="jesus"
                section="salvation"
                contentKey="message"
                initialValue={
                  content?.salvation?.message || "Salvation is God's free gift to humanity through Jesus Christ."
                }
                tag="span"
                className="text-base md:text-lg text-gray-700"
                isTextArea={true}
              />
            </p>
            <blockquote className="text-base italic mb-4 leading-relaxed text-gray-800"> {/* text-lg -> text-base, mb-5 -> mb-4 */}
              <EditableText
                page="jesus"
                section="salvation"
                contentKey="verse"
                initialValue={
                  content?.salvation?.verse ||
                  "If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved."
                }
                tag="span"
                className="text-base italic text-gray-800"
                isTextArea={true}
              />
            </blockquote>
            <p className="text-sm font-semibold text-gray-700 mb-4"> {/* text-base -> text-sm, mb-5 -> mb-4 */}
              <EditableText
                page="jesus"
                section="salvation"
                contentKey="verse_reference"
                initialValue={content?.salvation?.verse_reference || "Romans 10:9"}
                tag="span"
                className="text-sm font-semibold text-gray-700"
              />
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-6 bg-gradient-to-br from-blue-50 via-white to-yellow-50 text-center"> {/* py-12 -> py-6 */}
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-blue-900 mb-3"> {/* text-2xl md:text-2xl -> text-xl md:text-2xl, mb-5 -> mb-3 */}
            <EditableText
              page="jesus"
              section="cta"
              contentKey="title"
              initialValue={content?.cta?.title || "Ready to Accept Jesus?"}
              tag="span"
              className="text-blue-900"
            />
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-4 max-w-4xl mx-auto leading-relaxed"> {/* text-lg md:text-xl -> text-base md:text-lg, mb-7 -> mb-4 */}
            <EditableText
              page="jesus"
              section="cta"
              contentKey="description"
              initialValue={
                content?.cta?.description ||
                "If you feel God calling you to accept Jesus as your Lord and Savior, we would love to pray with you."
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
              <Link href="/join">Accept Jesus Today</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-yellow-700 text-yellow-700 hover:bg-yellow-700 hover:text-white font-bold px-6 py-2 text-base rounded-full bg-transparent shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/prayer">Request Prayer</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
