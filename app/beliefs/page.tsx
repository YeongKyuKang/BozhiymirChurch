"use client";

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Book, Cross, Users, Globe } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EditableText from "@/components/editable-text"

export default function BeliefsPage() {
  const beliefs = [
    {
      icon: <Book className="h-8 w-8 text-blue-600" />,
      titleKey: "bible_title",
      descriptionKey: "bible_description",
    },
    {
      icon: <Cross className="h-8 w-8 text-red-600" />,
      titleKey: "jesus_title",
      descriptionKey: "jesus_description",
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      titleKey: "holyspirit_title",
      descriptionKey: "holyspirit_description",
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-600" />,
      titleKey: "love_title",
      descriptionKey: "love_description",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      titleKey: "community_title",
      descriptionKey: "community_description",
    },
    {
      icon: <Globe className="h-8 w-8 text-orange-600" />,
      titleKey: "mission_title",
      descriptionKey: "mission_description",
    },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header Space */}
        <div className="h-20"></div>

        {/* Hero Section */}
        <section className="py-16 px-4 pt-32">
          <div className="container mx-auto text-center">
            <EditableText
                page="beliefs"
                section="main"
                contentKey="title"
                tag="h1"
                className="text-5xl font-bold text-gray-900 mb-6"
            />
            <EditableText
                page="beliefs"
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

        {/* Beliefs Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {beliefs.map((belief, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-600"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {belief.icon}
                      <h3 className="text-xl font-bold text-gray-900 ml-3">
                        <EditableText page="beliefs" section="grid_items" contentKey={belief.titleKey} tag="span" className="ml-0" />
                      </h3>
                    </div>
                    <EditableText page="beliefs" section="grid_items" contentKey={belief.descriptionKey} tag="p" className="text-gray-600 leading-relaxed" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Scripture Section */}
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="container mx-auto text-center">
            <EditableText
                page="beliefs"
                section="scripture"
                contentKey="scripture_title"
                tag="h2"
                className="text-3xl font-bold mb-8"
            />
            <EditableText
                page="beliefs"
                section="scripture"
                contentKey="scripture_quote"
                tag="blockquote"
                className="text-2xl italic mb-6 max-w-4xl mx-auto"
                isTextArea={true}
            />
            <EditableText
                page="beliefs"
                section="scripture"
                contentKey="scripture_reference"
                tag="p"
                className="text-xl opacity-90"
            />
          </div>
        </section>

        {/* Ukrainian Ministry Connection */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <Card className="bg-gradient-to-r from-blue-500 to-yellow-400 text-white">
              <CardContent className="p-8 text-center">
                <EditableText
                    page="beliefs"
                    section="ministry_connection"
                    contentKey="ministry_title"
                    tag="h2"
                    className="text-3xl font-bold mb-4"
                />
                <EditableText
                    page="beliefs"
                    section="ministry_connection"
                    contentKey="ministry_description"
                    tag="p"
                    className="text-xl mb-6 opacity-90"
                />
                <div className="flex justify-center space-x-4">
                  <span className="text-2xl">🇺🇦</span>
                  <span className="text-2xl">❤️</span>
                  <span className="text-2xl">🙏</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 text-center">
          <div className="container mx-auto">
            <EditableText
                page="beliefs"
                section="cta"
                contentKey="cta_title"
                tag="h2"
                className="text-3xl font-bold text-gray-900 mb-6"
            />
            <EditableText
                page="beliefs"
                section="cta"
                contentKey="cta_description"
                tag="p"
                className="text-xl text-gray-600 mb-8"
            />
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/join">Visit Us</Link>
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