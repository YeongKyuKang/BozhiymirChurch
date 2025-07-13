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
      icon: <Heart className="h-8 w-8 text-blue-700" />,
      titleKey: "teaching1_title",
      descriptionKey: "teaching1_description",
      verseKey: "teaching1_verse",
    },
    {
      icon: <Cross className="h-8 w-8 text-blue-700" />,
      titleKey: "teaching2_title",
      descriptionKey: "teaching2_description",
      verseKey: "teaching2_verse",
    },
    {
      icon: <Star className="h-8 w-8 text-blue-700" />,
      titleKey: "teaching3_title",
      descriptionKey: "teaching3_description",
      verseKey: "teaching3_verse",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-700" />,
      titleKey: "teaching4_title",
      descriptionKey: "teaching4_description",
      verseKey: "teaching4_verse",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-blue-700" />,
      titleKey: "teaching5_title",
      descriptionKey: "teaching5_description",
      verseKey: "teaching5_verse",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-blue-700" />,
      titleKey: "teaching6_title",
      descriptionKey: "teaching6_description",
      verseKey: "teaching6_verse",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-20 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="text-5xl mb-6">✝️</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            <EditableText
              page="jesus"
              section="hero"
              contentKey="title"
              initialValue={content?.hero?.title || "Meet Jesus Christ"}
              tag="span"
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
            />
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="jesus"
              section="hero"
              contentKey="subtitle"
              initialValue={
                content?.hero?.subtitle ||
                "Discover the love, grace, and salvation found in Jesus Christ, our Lord and Savior."
              }
              tag="span"
              className="text-xl md:text-2xl text-blue-200"
              isTextArea={true}
            />
          </p>
        </div>
      </div>

      {/* Main Scripture */}
      <section className="py-20 bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="text-2xl md:text-3xl italic mb-8 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="jesus"
              section="main_scripture"
              contentKey="quote"
              initialValue={
                content?.main_scripture?.quote ||
                "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
              }
              tag="span"
              className="text-2xl md:text-3xl italic text-blue-900"
              isTextArea={true}
            />
          </blockquote>
          <p className="text-xl md:text-2xl font-semibold text-blue-800">
            <EditableText
              page="jesus"
              section="main_scripture"
              contentKey="reference"
              initialValue={content?.main_scripture?.reference || "John 3:16"}
              tag="span"
              className="text-xl md:text-2xl font-semibold text-blue-800"
            />
          </p>
        </div>
      </section>

      {/* Who is Jesus */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-16">
            <EditableText
              page="jesus"
              section="who_is_jesus"
              contentKey="title"
              initialValue={content?.who_is_jesus?.title || "Who is Jesus?"}
              tag="span"
              className="text-3xl md:text-4xl font-bold text-center text-blue-900"
            />
          </h2>
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50">
              <CardContent className="p-12">
                <div className="text-xl text-gray-700 leading-relaxed space-y-8">
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
                      className="text-xl text-gray-700 leading-relaxed"
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
                      className="text-xl text-gray-700 leading-relaxed"
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
                      className="text-xl text-gray-700 leading-relaxed"
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
      <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <EditableText
              page="jesus"
              section="teachings"
              contentKey="title"
              initialValue={content?.teachings?.title || "The Teachings of Jesus"}
              tag="span"
              className="text-3xl md:text-4xl font-bold text-center"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {teachings.map((teaching, index) => (
              <Card
                key={index}
                className="hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-xl bg-white/10 backdrop-blur-sm"
              >
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-8">
                    <div className="bg-yellow-500 rounded-full p-4">{teaching.icon}</div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-6">
                    <EditableText
                      page="jesus"
                      section="teachings"
                      contentKey={teaching.titleKey}
                      initialValue={content?.teachings?.[teaching.titleKey] || `Teaching ${index + 1}`}
                      tag="span"
                      className="text-xl md:text-2xl font-bold"
                    />
                  </h3>
                  <div className="text-blue-200 mb-8 leading-relaxed">
                    <EditableText
                      page="jesus"
                      section="teachings"
                      contentKey={teaching.descriptionKey}
                      initialValue={content?.teachings?.[teaching.descriptionKey] || "Description of this teaching."}
                      tag="span"
                      className="text-blue-200 leading-relaxed"
                      isTextArea={true}
                    />
                  </div>
                  <div className="bg-yellow-100 p-6 rounded-xl border-l-4 border-yellow-500">
                    <p className="text-base text-blue-900 italic font-medium">
                      <EditableText
                        page="jesus"
                        section="teachings"
                        contentKey={teaching.verseKey}
                        initialValue={content?.teachings?.[teaching.verseKey] || "Bible verse here"}
                        tag="span"
                        className="text-base text-blue-900 italic font-medium"
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
      <section className="py-20 bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            <EditableText
              page="jesus"
              section="salvation"
              contentKey="title"
              initialValue={content?.salvation?.title || "The Gift of Salvation"}
              tag="span"
              className="text-3xl md:text-4xl font-bold text-blue-900"
            />
          </h2>
          <div className="max-w-5xl mx-auto">
            <p className="text-xl md:text-2xl mb-8 text-blue-800 leading-relaxed">
              <EditableText
                page="jesus"
                section="salvation"
                contentKey="message"
                initialValue={
                  content?.salvation?.message || "Salvation is God's free gift to humanity through Jesus Christ."
                }
                tag="span"
                className="text-xl md:text-2xl text-blue-800"
                isTextArea={true}
              />
            </p>
            <blockquote className="text-2xl md:text-3xl italic mb-8 leading-relaxed">
              <EditableText
                page="jesus"
                section="salvation"
                contentKey="verse"
                initialValue={
                  content?.salvation?.verse ||
                  "If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved."
                }
                tag="span"
                className="text-2xl md:text-3xl italic text-blue-900"
                isTextArea={true}
              />
            </blockquote>
            <p className="text-xl font-semibold text-blue-800 mb-8">
              <EditableText
                page="jesus"
                section="salvation"
                contentKey="verse_reference"
                initialValue={content?.salvation?.verse_reference || "Romans 10:9"}
                tag="span"
                className="text-xl font-semibold text-blue-800"
              />
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-yellow-50 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">
            <EditableText
              page="jesus"
              section="cta"
              contentKey="title"
              initialValue={content?.cta?.title || "Ready to Accept Jesus?"}
              tag="span"
              className="text-3xl md:text-4xl font-bold text-blue-900"
            />
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="jesus"
              section="cta"
              contentKey="description"
              initialValue={
                content?.cta?.description ||
                "If you feel God calling you to accept Jesus as your Lord and Savior, we would love to pray with you."
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
              <Link href="/join">Accept Jesus Today</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white font-bold px-10 py-4 text-xl rounded-full bg-transparent shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/prayer">Request Prayer</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
