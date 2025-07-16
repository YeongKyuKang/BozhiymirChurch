
// components/ukrainian-ministry-client.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Home, BookOpen, Utensils, Shirt } from "lucide-react"
import Link from "next/link"
import EditableText from "@/components/editable-text"
import { useState } from "react" // 클라이언트 컴포넌트임을 명시하기 위해 useState 임포트

interface UkrainianMinistryPageClientProps {
  initialContent: Record<string, any>
}

export default function UkrainianMinistryPageClient({ initialContent }: UkrainianMinistryPageClientProps) {
  const content = initialContent

  const programs = [
    {
      icon: <Home className="h-6 w-6 text-blue-900" />, // h-7 w-7 -> h-6 w-6
      titleKey: "program1_title",
      descriptionKey: "program1_description",
      statsKey: "program1_stats",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-blue-900" />, // h-7 w-7 -> h-6 w-6
      titleKey: "program2_title",
      descriptionKey: "program2_description",
      statsKey: "program2_stats",
    },
    {
      icon: <Heart className="h-6 w-6 text-blue-900" />, // h-7 w-7 -> h-6 w-6
      titleKey: "program3_title",
      descriptionKey: "program3_description",
      statsKey: "program3_stats",
    },
    {
      icon: <Utensils className="h-6 w-6 text-blue-900" />, // h-7 w-7 -> h-6 w-6
      titleKey: "program4_title",
      descriptionKey: "program4_description",
      statsKey: "program4_stats",
    },
    {
      icon: <Users className="h-6 w-6 text-blue-900" />, // h-7 w-7 -> h-6 w-6
      titleKey: "program5_title",
      descriptionKey: "program5_description",
      statsKey: "program5_stats",
    },
    {
      icon: <Shirt className="h-6 w-6 text-blue-900" />, // h-7 w-7 -> h-6 w-6
      titleKey: "program6_title",
      descriptionKey: "program6_description",
      statsKey: "program6_stats",
    },
  ]

  const testimonials = [
    {
      name: "Maria K.",
      role: "Host Mother",
      quoteKey: "testi1_quote",
      flag: "🇺🇸",
    },
    {
      name: "Oleksandr",
      role: "Age 12",
      quoteKey: "testi2_quote",
      flag: "�🇦",
    },
    {
      name: "Pastor Sarah",
      role: "Ministry Leader",
      quoteKey: "testi3_quote",
      flag: "⛪",
    },
  ]

  const helpCards = [
    {
      icon: <Heart className="h-7 w-7 text-yellow-500" />, // h-8 w-8 -> h-7 w-7
      titleKey: "card1_title",
      descriptionKey: "card1_description",
    },
    {
      icon: <Users className="h-7 w-7 text-yellow-500" />, // h-8 w-8 -> h-7 w-7
      titleKey: "card2_title",
      descriptionKey: "card2_description",
    },
    {
      icon: <BookOpen className="h-7 w-7 text-yellow-500" />, // h-8 w-8 -> h-7 w-7
      titleKey: "card3_title",
      descriptionKey: "card3_description",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16"> {/* Added pt-24 */}
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-yellow-500 text-white h-[25vh] flex items-center justify-center border-b-4 border-yellow-500"> {/* h-[60vh] -> h-[25vh] */}
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2"> {/* mb-4 -> mb-2 */}
            <span className="text-3xl md:text-4xl">🇺🇦</span> {/* text-4xl md:text-5xl -> text-3xl md:text-4xl */}
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold mb-3"> {/* text-3xl md:text-4xl lg:text-4xl -> text-2xl md:text-3xl lg:text-3xl, mb-5 -> mb-3 */}
            <EditableText
              page="ukrainian-ministry"
              section="main"
              contentKey="title"
              initialValue={content?.main?.title || "Ukrainian Children Ministry"}
              tag="span"
              className="text-white"
            />
          </h1>
          <p className="text-sm md:text-base text-blue-200 max-w-4xl mx-auto leading-relaxed"> {/* text-lg md:text-xl -> text-sm md:text-base */}
            <EditableText
              page="ukrainian-ministry"
              section="main"
              contentKey="description"
              initialValue={
                content?.main?.description ||
                "Supporting Ukrainian families with love, hope, and practical assistance in their time of need."
              }
              tag="span"
              className="text-sm md:text-base text-blue-200"
              isTextArea={true}
            />
          </p>
        </div>
      </div>

      {/* Impact Stats */}
      <section className="py-8 bg-blue-50 border-b border-gray-200"> {/* py-12 -> py-8, bg-gray-100 -> bg-blue-50 */}
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-center mb-6 text-blue-900"> {/* text-2xl md:text-2xl -> text-xl md:text-2xl, mb-8 -> mb-6 */}
            <EditableText
              page="ukrainian-ministry"
              section="impact_stats"
              contentKey="title"
              initialValue={content?.impact_stats?.title || "Our Impact"}
              tag="span"
              className="text-blue-900"
            />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"> {/* gap-6 -> gap-4 */}
            <div className="bg-white text-gray-900 p-4 rounded-2xl shadow-md border border-gray-200"> {/* p-6 -> p-4 */}
              <div className="text-xl md:text-2xl font-bold mb-1"> {/* text-2xl md:text-3xl -> text-xl md:text-2xl, mb-2 -> mb-1 */}
                <EditableText
                  page="ukrainian-ministry"
                  section="impact_stats"
                  contentKey="stat1_number"
                  initialValue={content?.impact_stats?.stat1_number || "150+"}
                  tag="span"
                  className="text-xl md:text-2xl font-bold"
                />
              </div>
              <div className="text-xs opacity-90 text-gray-700"> {/* text-sm -> text-xs */}
                <EditableText
                  page="ukrainian-ministry"
                  section="impact_stats"
                  contentKey="stat1_label"
                  initialValue={content?.impact_stats?.stat1_label || "Families Helped"}
                  tag="span"
                  className="text-xs opacity-90"
                />
              </div>
            </div>
            <div className="bg-white text-gray-900 p-4 rounded-2xl shadow-md border border-gray-200"> {/* p-6 -> p-4 */}
              <div className="text-xl md:text-2xl font-bold mb-1"> {/* text-2xl md:text-3xl -> text-xl md:text-2xl, mb-2 -> mb-1 */}
                <EditableText
                  page="ukrainian-ministry"
                  section="impact_stats"
                  contentKey="stat2_number"
                  initialValue={content?.impact_stats?.stat2_number || "500+"}
                  tag="span"
                  className="text-xl md:text-2xl font-bold"
                />
              </div>
              <div className="text-xs opacity-90 text-gray-700"> {/* text-sm -> text-xs */}
                <EditableText
                  page="ukrainian-ministry"
                  section="impact_stats"
                  contentKey="stat2_label"
                  initialValue={content?.impact_stats?.stat2_label || "Meals Provided"}
                  tag="span"
                  className="text-xs opacity-90"
                />
              </div>
            </div>
            <div className="bg-white text-gray-900 p-4 rounded-2xl shadow-md border border-gray-200"> {/* p-6 -> p-4 */}
              <div className="text-xl md:text-2xl font-bold mb-1"> {/* text-2xl md:text-3xl -> text-xl md:text-2xl, mb-2 -> mb-1 */}
                <EditableText
                  page="ukrainian-ministry"
                  section="impact_stats"
                  contentKey="stat3_number"
                  initialValue={content?.impact_stats?.stat3_number || "75+"}
                  tag="span"
                  className="text-xl md:text-2xl font-bold"
                />
              </div>
              <div className="text-xs opacity-90 text-gray-700"> {/* text-sm -> text-xs */}
                <EditableText
                  page="ukrainian-ministry"
                  section="impact_stats"
                  contentKey="stat3_label"
                  initialValue={content?.impact_stats?.stat3_label || "Children Supported"}
                  tag="span"
                  className="text-xs opacity-90"
                />
              </div>
            </div>
            <div className="bg-white text-gray-900 p-4 rounded-2xl shadow-md border border-gray-200"> {/* p-6 -> p-4 */}
              <div className="text-xl md:text-2xl font-bold mb-1"> {/* text-2xl md:text-3xl -> text-xl md:text-2xl, mb-2 -> mb-1 */}
                <EditableText
                  page="ukrainian-ministry"
                  section="impact_stats"
                  contentKey="stat4_number"
                  initialValue={content?.impact_stats?.stat4_number || "25+"}
                  tag="span"
                  className="text-xl md:text-2xl font-bold"
                />
              </div>
              <div className="text-xs opacity-90 text-gray-700"> {/* text-sm -> text-xs */}
                <EditableText
                  page="ukrainian-ministry"
                  section="impact_stats"
                  contentKey="stat4_label"
                  initialValue={content?.impact_stats?.stat4_label || "Volunteers"}
                  tag="span"
                  className="text-xs opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-8 bg-white"> {/* py-12 -> py-8, implicit bg-white */}
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-center text-blue-900 mb-6"> {/* text-2xl md:text-2xl -> text-xl md:text-2xl, mb-8 -> mb-6 */}
            <EditableText
              page="ukrainian-ministry"
              section="programs"
              contentKey="title"
              initialValue={content?.programs?.title || "Our Programs"}
              tag="span"
              className="text-blue-900"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* gap-6 -> gap-4 */}
            {programs.map((program, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 shadow-md bg-white"
              >
                <CardContent className="p-4"> {/* p-6 -> p-4 */}
                  <div className="flex items-center mb-3"> {/* mb-5 -> mb-3 */}
                    <div className="bg-yellow-400 rounded-full p-2 mr-3">{program.icon}</div> {/* p-3 -> p-2, mr-4 -> mr-3 */}
                    <h3 className="text-base font-bold text-blue-900"> {/* text-lg -> text-base, mb-3 -> mb-2 */}
                      <EditableText
                        page="ukrainian-ministry"
                        section="programs"
                        contentKey={program.titleKey}
                        initialValue={content?.programs?.[program.titleKey] || `Program ${index + 1}`}
                        tag="span"
                        className="text-blue-900"
                      />
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed"> {/* text-base -> text-sm, mb-6 -> mb-4 */}
                    <EditableText
                      page="ukrainian-ministry"
                      section="programs"
                      contentKey={program.descriptionKey}
                      initialValue={content?.programs?.[program.descriptionKey] || "Program description"}
                      tag="span"
                      className="text-sm text-gray-700 leading-relaxed"
                      isTextArea={true}
                    />
                  </p>
                  <div className="bg-blue-100 px-3 py-1.5 rounded-xl border-l-4 border-blue-700"> {/* px-4 py-2 -> px-3 py-1.5 */}
                    <span className="text-xs text-blue-900 font-bold"> {/* text-sm -> text-xs */}
                      <EditableText
                        page="ukrainian-ministry"
                        section="programs"
                        contentKey={program.statsKey}
                        initialValue={content?.programs?.[program.statsKey] || "Program stats"}
                        tag="span"
                        className="text-blue-900 font-bold"
                      />
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Biblical Foundation */}
      <section className="py-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-y border-white/20"> {/* py-12 -> py-8 */}
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold mb-6"> {/* text-2xl md:text-2xl -> text-xl md:text-2xl, mb-8 -> mb-6 */}
            <EditableText
              page="ukrainian-ministry"
              section="foundation"
              contentKey="foundation_title"
              initialValue={content?.foundation?.foundation_title || "Our Biblical Foundation"}
              tag="span"
              className="text-white"
            />
          </h2>
          <Card className="max-w-5xl mx-auto shadow-2xl border border-gray-600 bg-white/10 backdrop-blur-sm">
            <CardContent className="p-5"> {/* p-6 -> p-5 */}
              <blockquote className="text-base italic text-yellow-300 mb-4 leading-relaxed"> {/* text-lg -> text-base, mb-6 -> mb-4 */}
                <EditableText
                  page="ukrainian-ministry"
                  section="foundation"
                  contentKey="scripture_quote"
                  initialValue={
                    content?.foundation?.scripture_quote ||
                    "Do not forget to show hospitality to strangers, for by so doing some people have shown hospitality to angels without knowing it."
                  }
                  tag="span"
                  className="text-base italic text-yellow-300"
                  isTextArea={true}
                />
              </blockquote>
              <p className="text-sm font-semibold text-white mb-4"> {/* text-base -> text-sm, mb-6 -> mb-4 */}
                <EditableText
                  page="ukrainian-ministry"
                  section="foundation"
                  contentKey="scripture_reference"
                  initialValue={content?.foundation?.scripture_reference || "Hebrews 13:2"}
                  tag="span"
                  className="text-sm font-semibold text-white"
                />
              </p>
              <div className="text-blue-200">
                <p className="text-sm leading-relaxed"> {/* text-base -> text-sm */}
                  <EditableText
                    page="ukrainian-ministry"
                    section="foundation"
                    contentKey="description"
                    initialValue={
                      content?.foundation?.description ||
                      "Our ministry is rooted in Christ's call to love and serve those in need."
                    }
                    tag="span"
                    className="text-sm text-blue-200"
                    isTextArea={true}
                  />
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 bg-white border-b border-gray-200"> {/* py-12 -> py-8, bg-gray-100 -> bg-white */}
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-center text-blue-900 mb-6"> {/* text-2xl md:text-2xl -> text-xl md:text-2xl, mb-8 -> mb-6 */}
            <EditableText
              page="ukrainian-ministry"
              section="testimonials"
              contentKey="title"
              initialValue={content?.testimonials?.title || "Stories of Hope"}
              tag="span"
              className="text-blue-900"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* gap-6 -> gap-4 */}
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 shadow-md bg-white"
              >
                <CardContent className="p-4 text-center"> {/* p-6 -> p-4 */}
                  <div className="text-2xl mb-3">{testimonial.flag}</div> {/* text-3xl -> text-2xl, mb-5 -> mb-3 */}
                  <blockquote className="text-sm text-gray-700 italic mb-4 leading-relaxed"> {/* text-base -> text-sm, mb-6 -> mb-4 */}
                    <EditableText
                      page="ukrainian-ministry"
                      section="testimonials"
                      contentKey={testimonial.quoteKey}
                      initialValue={content?.testimonials?.[testimonial.quoteKey] || "Testimonial quote"}
                      tag="span"
                      className="text-sm text-gray-700 italic"
                      isTextArea={true}
                    />
                  </blockquote>
                  <div>
                    <div className="font-bold text-blue-900 text-sm">{testimonial.name}</div> {/* text-base -> text-sm */}
                    <div className="text-xs text-gray-600">{testimonial.role}</div> {/* text-sm -> text-xs */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Help */}
      <section className="py-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-y border-white/20"> {/* py-12 -> py-8 */}
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold mb-6"> {/* text-2xl md:text-2xl -> text-xl md:text-2xl, mb-8 -> mb-6 */}
            <EditableText
              page="ukrainian-ministry"
              section="how_to_help"
              contentKey="title"
              initialValue={content?.how_to_help?.title || "How You Can Help"}
              tag="span"
              className="text-xl md:text-2xl font-extrabold"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"> {/* gap-6 -> gap-4, mb-8 -> mb-6 */}
            {helpCards.map((card, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 border border-gray-600"
              >
                <div className="flex justify-center mb-4"> {/* mb-6 -> mb-4 */}
                  <div className="bg-yellow-400 rounded-full p-2">{card.icon}</div> {/* p-3 -> p-2 */}
                </div>
                <h3 className="text-base font-bold mb-3"> {/* text-lg -> text-base, mb-4 -> mb-3 */}
                  <EditableText
                    page="ukrainian-ministry"
                    section="how_to_help"
                    contentKey={card.titleKey}
                    initialValue={content?.how_to_help?.[card.titleKey] || `Help Option ${index + 1}`}
                    tag="span"
                    className="text-base font-bold"
                  />
                </h3>
                <p className="text-sm text-blue-200 leading-relaxed"> {/* text-base -> text-sm */}
                  <EditableText
                    page="ukrainian-ministry"
                    section="how_to_help"
                    contentKey={card.descriptionKey}
                    initialValue={content?.how_to_help?.[card.descriptionKey] || "Description of how to help"}
                    tag="span"
                    className="text-sm text-blue-200"
                  />
                </p>
              </div>
            ))}
          </div>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-blue-900 font-bold px-6 py-2 text-base rounded-full shadow-xl transform hover:scale-105 transition-all duration-300" 
          >
            <Link href="/join">Get Involved Today</Link>
          </Button>
        </div>
      </section>

      {/* Contact */}
      <section className="py-8 bg-blue-50"> {/* py-12 -> py-8, bg-white (implicit) -> bg-blue-50 */}
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-blue-900 mb-3"> {/* mb-5 -> mb-3 */}
            <EditableText
              page="ukrainian-ministry"
              section="contact"
              contentKey="title"
              initialValue={content?.contact?.title || "Get in Touch"}
              tag="span"
              className="text-xl md:text-2xl font-extrabold text-blue-900"
            />
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-4 max-w-4xl mx-auto leading-relaxed"> {/* text-lg md:text-xl -> text-base md:text-lg, mb-7 -> mb-4 */}
            <EditableText
              page="ukrainian-ministry"
              section="contact"
              contentKey="description"
              initialValue={
                content?.contact?.description ||
                "Have questions about our Ukrainian Ministry? We'd love to hear from you."
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
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-blue-900 font-bold px-6 py-2 text-base rounded-full shadow-xl transform hover:scale-105 transition-all duration-300" 
            >
              <Link href="mailto:ukrainian@bozhiymirchurch.com">Contact Ministry Team</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white font-bold px-6 py-2 text-base rounded-full bg-transparent shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
