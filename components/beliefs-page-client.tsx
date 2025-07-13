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
      icon: <BookOpen className="h-8 w-8 text-blue-700" />,
      titleKey: "belief1_title",
      descriptionKey: "belief1_description",
      verseKey: "belief1_verse",
    },
    {
      icon: <Heart className="h-8 w-8 text-blue-700" />,
      titleKey: "belief2_title",
      descriptionKey: "belief2_description",
      verseKey: "belief2_verse",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-700" />,
      titleKey: "belief3_title",
      descriptionKey: "belief3_description",
      verseKey: "belief3_verse",
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-700" />,
      titleKey: "belief4_title",
      descriptionKey: "belief4_description",
      verseKey: "belief4_verse",
    },
    {
      icon: <Star className="h-8 w-8 text-blue-700" />,
      titleKey: "belief5_title",
      descriptionKey: "belief5_description",
      verseKey: "belief5_verse",
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-700" />,
      titleKey: "belief6_title",
      descriptionKey: "belief6_description",
      verseKey: "belief6_verse",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-20 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <span className="text-5xl">📖</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            <EditableText
              page="beliefs"
              section="hero"
              contentKey="title"
              initialValue={content?.hero?.title || "What We Believe"}
              tag="span"
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
            />
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="beliefs"
              section="hero"
              contentKey="subtitle"
              initialValue={
                content?.hero?.subtitle || "Our faith is built on the solid foundation of God's Word, the Bible."
              }
              tag="span"
              className="text-xl md:text-2xl text-blue-200"
              isTextArea={true}
            />
          </p>
        </div>
      </div>

      {/* Foundation Scripture */}
      <section className="py-20 bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="text-2xl md:text-3xl italic mb-8 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="beliefs"
              section="foundation"
              contentKey="scripture"
              initialValue={
                content?.foundation?.scripture ||
                "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness."
              }
              tag="span"
              className="text-2xl md:text-3xl italic text-blue-900"
              isTextArea={true}
            />
          </blockquote>
          <p className="text-xl md:text-2xl font-semibold text-blue-800">
            <EditableText
              page="beliefs"
              section="foundation"
              contentKey="reference"
              initialValue={content?.foundation?.reference || "2 Timothy 3:16-17"}
              tag="span"
              className="text-xl md:text-2xl font-semibold text-blue-800"
            />
          </p>
        </div>
      </section>

      {/* Core Beliefs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-16">
            <EditableText
              page="beliefs"
              section="core_beliefs"
              contentKey="title"
              initialValue={content?.core_beliefs?.title || "Our Core Beliefs"}
              tag="span"
              className="text-3xl md:text-4xl font-bold text-center text-blue-900"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {beliefs.map((belief, index) => (
              <Card
                key={index}
                className="hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-xl bg-gradient-to-br from-white to-blue-50"
              >
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex items-center mb-8">
                    <div className="bg-yellow-500 rounded-full p-4 mr-6">{belief.icon}</div>
                    <h3 className="text-xl md:text-2xl font-bold text-blue-900">
                      <EditableText
                        page="beliefs"
                        section="core_beliefs"
                        contentKey={belief.titleKey}
                        initialValue={content?.core_beliefs?.[belief.titleKey] || `Belief ${index + 1}`}
                        tag="span"
                        className="text-xl md:text-2xl font-bold text-blue-900"
                      />
                    </h3>
                  </div>
                  <div className="text-lg text-gray-700 mb-8 leading-relaxed flex-grow">
                    <EditableText
                      page="beliefs"
                      section="core_beliefs"
                      contentKey={belief.descriptionKey}
                      initialValue={content?.core_beliefs?.[belief.descriptionKey] || "Description of this belief."}
                      tag="span"
                      className="text-lg text-gray-700 leading-relaxed"
                      isTextArea={true}
                    />
                  </div>
                  <div className="bg-blue-100 p-6 rounded-xl mt-auto border-l-4 border-blue-700">
                    <p className="text-base text-blue-800 italic font-medium">
                      <EditableText
                        page="beliefs"
                        section="core_beliefs"
                        contentKey={belief.verseKey}
                        initialValue={content?.core_beliefs?.[belief.verseKey] || "Bible verse here"}
                        tag="span"
                        className="text-base text-blue-800 italic font-medium"
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
      <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <EditableText
              page="beliefs"
              section="statement_of_faith"
              contentKey="title"
              initialValue={content?.statement_of_faith?.title || "Our Statement of Faith"}
              tag="span"
              className="text-3xl md:text-4xl font-bold text-center"
            />
          </h2>
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-sm">
              <CardContent className="p-12">
                <div className="text-xl text-blue-200 leading-relaxed space-y-8">
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
                      className="text-xl text-blue-200 leading-relaxed"
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
                      className="text-xl text-blue-200 leading-relaxed"
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
                      className="text-xl text-blue-200 leading-relaxed"
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
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-yellow-50 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">
            <EditableText
              page="beliefs"
              section="cta"
              contentKey="title"
              initialValue={content?.cta?.title || "Join Our Faith Community"}
              tag="span"
              className="text-3xl md:text-4xl font-bold text-blue-900"
            />
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="beliefs"
              section="cta"
              contentKey="description"
              initialValue={
                content?.cta?.description ||
                "If these beliefs resonate with your heart, we invite you to join our church family."
              }
              tag="span"
              className="text-xl md:text-2xl text-gray-700"
              isTextArea={true}
            />
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-bold px-10 py-4 text-xl rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/join">Join Our Community</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white font-bold px-10 py-4 text-xl rounded-full bg-transparent shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/leadership">Meet Our Leaders</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
