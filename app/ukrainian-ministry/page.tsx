"use client";

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Home, BookOpen, Utensils, Shirt } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EditableText from "@/components/editable-text";

export default function UkrainianMinistryPage() {
  const programs = [
    {
      icon: <Home className="h-8 w-8 text-blue-600" />,
      titleKey: "program1_title",
      descriptionKey: "program1_description",
      statsKey: "program1_stats",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-600" />,
      titleKey: "program2_title",
      descriptionKey: "program2_description",
      statsKey: "program2_stats",
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      titleKey: "program3_title",
      descriptionKey: "program3_description",
      statsKey: "program3_stats",
    },
    {
      icon: <Utensils className="h-8 w-8 text-orange-600" />,
      titleKey: "program4_title",
      descriptionKey: "program4_description",
      statsKey: "program4_stats",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      titleKey: "program5_title",
      descriptionKey: "program5_description",
      statsKey: "program5_stats",
    },
    {
      icon: <Shirt className="h-8 w-8 text-pink-600" />,
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
      flag: "🇺🇦",
    },
    {
      name: "Pastor Sarah",
      role: "Ministry Leader",
      quoteKey: "testi3_quote",
      flag: "⛪",
    },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="py-16 px-4 pt-32">
          <div className="container mx-auto text-center">
            <div className="text-6xl mb-6">🇺🇦</div>
            <EditableText
              page="ukrainian-ministry"
              section="main"
              contentKey="title"
              tag="h1"
              className="text-5xl font-bold text-gray-900 mb-6"
            />
            <EditableText
              page="ukrainian-ministry"
              section="main"
              contentKey="description"
              tag="p"
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
            />
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-yellow-400 text-white">
          <div className="container mx-auto">
            <EditableText page="ukrainian-ministry" section="impact_stats" contentKey="title" tag="h2" className="text-3xl font-bold text-center mb-12" />
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <EditableText page="ukrainian-ministry" section="impact_stats" contentKey="stat1_number" tag="div" className="text-4xl font-bold mb-2" />
                <EditableText page="ukrainian-ministry" section="impact_stats" contentKey="stat1_label" tag="div" className="text-lg opacity-90" />
              </div>
              <div>
                <EditableText page="ukrainian-ministry" section="impact_stats" contentKey="stat2_number" tag="div" className="text-4xl font-bold mb-2" />
                <EditableText page="ukrainian-ministry" section="impact_stats" contentKey="stat2_label" tag="div" className="text-lg opacity-90" />
              </div>
              <div>
                <EditableText page="ukrainian-ministry" section="impact_stats" contentKey="stat3_number" tag="div" className="text-4xl font-bold mb-2" />
                <EditableText page="ukrainian-ministry" section="impact_stats" contentKey="stat3_label" tag="div" className="text-lg opacity-90" />
              </div>
              <div>
                <EditableText page="ukrainian-ministry" section="impact_stats" contentKey="stat4_number" tag="div" className="text-4xl font-bold mb-2" />
                <EditableText page="ukrainian-ministry" section="impact_stats" contentKey="stat4_label" tag="div" className="text-lg opacity-90" />
              </div>
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <EditableText page="ukrainian-ministry" section="programs" contentKey="title" tag="h2" className="text-3xl font-bold text-center text-gray-900 mb-12" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-600"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {program.icon}
                      <h3 className="text-xl font-bold text-gray-900 ml-3">
                          <EditableText page="ukrainian-ministry" section="programs" contentKey={program.titleKey} tag="span" className="ml-0" />
                      </h3>
                    </div>
                    <EditableText page="ukrainian-ministry" section="programs" contentKey={program.descriptionKey} tag="p" className="text-gray-600 mb-4 leading-relaxed" isTextArea={true} />
                    <div className="bg-blue-50 px-3 py-2 rounded-lg">
                      <span className="text-blue-800 font-semibold text-sm">
                        <EditableText page="ukrainian-ministry" section="programs" contentKey={program.statsKey} tag="span" className="text-blue-800 font-semibold" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Biblical Foundation */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto text-center">
            <EditableText page="ukrainian-ministry" section="foundation" contentKey="foundation_title" tag="h2" className="text-3xl font-bold text-gray-900 mb-8" />
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8">
                <EditableText
                    page="ukrainian-ministry"
                    section="foundation"
                    contentKey="scripture_quote"
                    tag="blockquote"
                    className="text-2xl italic text-gray-700 mb-6"
                    isTextArea={true}
                />
                <EditableText page="ukrainian-ministry" section="foundation" contentKey="scripture_reference" tag="p" className="text-xl text-blue-600 font-semibold" />
                <div className="mt-6 text-gray-600">
                  <EditableText page="ukrainian-ministry" section="foundation" contentKey="description" tag="p" className="text-gray-600" isTextArea={true} />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <EditableText page="ukrainian-ministry" section="testimonials" contentKey="title" tag="h2" className="text-3xl font-bold text-center text-gray-900 mb-12" />
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{testimonial.flag}</div>
                    <EditableText page="ukrainian-ministry" section="testimonials" contentKey={testimonial.quoteKey} tag="blockquote" className="text-gray-600 italic mb-4" isTextArea={true} />
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How to Help */}
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="container mx-auto text-center">
            <EditableText page="ukrainian-ministry" section="how_to_help" contentKey="title" tag="h2" className="text-3xl font-bold mb-8" />
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <Heart className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                <EditableText page="ukrainian-ministry" section="how_to_help" contentKey="card1_title" tag="h3" className="text-xl font-bold mb-2" />
                <EditableText page="ukrainian-ministry" section="how_to_help" contentKey="card1_description" tag="p" className="opacity-90" />
              </div>
              <div>
                <Users className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                <EditableText page="ukrainian-ministry" section="how_to_help" contentKey="card2_title" tag="h3" className="text-xl font-bold mb-2" />
                <EditableText page="ukrainian-ministry" section="how_to_help" contentKey="card2_description" tag="p" className="opacity-90" />
              </div>
              <div>
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                <EditableText page="ukrainian-ministry" section="how_to_help" contentKey="card3_title" tag="h3" className="text-xl font-bold mb-2" />
                <EditableText page="ukrainian-ministry" section="how_to_help" contentKey="card3_description" tag="p" className="opacity-90" />
              </div>
            </div>
            <Button asChild size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
              <Link href="/join">Get Involved Today</Link>
            </Button>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 px-4 text-center">
          <div className="container mx-auto">
            <EditableText page="ukrainian-ministry" section="contact" contentKey="title" tag="h2" className="text-3xl font-bold text-gray-900 mb-6" />
            <EditableText page="ukrainian-ministry" section="contact" contentKey="description" tag="p" className="text-xl text-gray-600 mb-8" />
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="mailto:ukrainian@bozhiymirchurch.com">Contact Ministry Team</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}