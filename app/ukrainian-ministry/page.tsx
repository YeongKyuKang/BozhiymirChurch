import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Home, BookOpen, Utensils, Shirt } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EditableText from "@/components/editable-text"
import { createClient } from "@supabase/supabase-js"

async function fetchUkrainianMinistryContent() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const { data, error } = await supabase
    .from("content")
    .select("page, section, key, value")
    .eq("page", "ukrainian-ministry")

  if (error) {
    console.error("Failed to fetch Ukrainian Ministry content on the server:", error)
    return {}
  }

  const contentMap: Record<string, any> = {}
  data.forEach((item) => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {}
    }
    contentMap[item.section][item.key] = item.value
  })

  return contentMap
}

export default async function UkrainianMinistryPage() {
  const content = await fetchUkrainianMinistryContent()

  const programs = [
    {
      icon: <Home className="h-8 w-8 text-blue-700" />,
      titleKey: "program1_title",
      descriptionKey: "program1_description",
      statsKey: "program1_stats",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-blue-700" />,
      titleKey: "program2_title",
      descriptionKey: "program2_description",
      statsKey: "program2_stats",
    },
    {
      icon: <Heart className="h-8 w-8 text-blue-700" />,
      titleKey: "program3_title",
      descriptionKey: "program3_description",
      statsKey: "program3_stats",
    },
    {
      icon: <Utensils className="h-8 w-8 text-blue-700" />,
      titleKey: "program4_title",
      descriptionKey: "program4_description",
      statsKey: "program4_stats",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-700" />,
      titleKey: "program5_title",
      descriptionKey: "program5_description",
      statsKey: "program5_stats",
    },
    {
      icon: <Shirt className="h-8 w-8 text-blue-700" />,
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

  const helpCards = [
    {
      icon: <Heart className="h-8 w-8 text-yellow-500" />,
      titleKey: "card1_title",
      descriptionKey: "card1_description",
    },
    {
      icon: <Users className="h-8 w-8 text-yellow-500" />,
      titleKey: "card2_title",
      descriptionKey: "card2_description",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-yellow-500" />,
      titleKey: "card3_title",
      descriptionKey: "card3_description",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-yellow-500 text-white py-20 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="text-8xl mb-8">🇺🇦</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            <EditableText
              page="ukrainian-ministry"
              section="main"
              contentKey="title"
              initialValue={content?.main?.title || "Ukrainian Ministry"}
              tag="span"
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
            />
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="ukrainian-ministry"
              section="main"
              contentKey="description"
              initialValue={
                content?.main?.description ||
                "Supporting Ukrainian families with love, hope, and practical assistance in their time of need."
              }
              tag="span"
              className="text-xl md:text-2xl text-blue-200"
            />
          </p>
        </div>
      </div>

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-blue-900">
            <EditableText
              page="ukrainian-ministry"
              section="impact_stats"
              contentKey="title"
              initialValue={content?.impact_stats?.title || "Our Impact"}
              tag="span"
              className="text-3xl md:text-4xl font-bold text-center text-blue-900"
            />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-blue-700 text-white p-8 rounded-2xl shadow-xl">
              <div className="text-3xl md:text-4xl font-bold mb-4">
                <EditableText
                  page="ukrainian-ministry"
                  section="impact_stats"
                  contentKey="stat1_number"
                  initialValue={content?.impact_stats?.stat1_number || "150+"}
                  tag="span"
                  className="text-3xl md:text-4xl font-bold"
                />
              </div>
              <div className="text-lg opacity-90">
                <EditableText
                  page="ukrainian-ministry"
                  section="impact_stats"
                  contentKey="stat1_label"
                  initialValue={content?.impact_stats?.stat1_label || "Families Helped"}
                  tag="span"
                  className="text-lg opacity-90"
                />
              </div>
            </div>
            <div className="bg-blue-700 text-white p-8 rounded-2xl shadow-xl">
              <div className="text-3xl md:text-4xl font-bold mb-4">
                <EditableText
                  page="ukrainian-ministry"
                  section="impact_stats"
                  contentKey="stat2_number"
                  initialValue={content?.impact_stats?.stat2_number || "500+"}
                  tag="span"
                  className="text-3xl md:text-4xl font-bold"
                />
              </div>
              <div className="text-lg opacity-90">
                <EditableText
                  page="ukrainian-ministry"
                  section="impact_stats"
                  contentKey="stat2_label"
                  initialValue={content?.impact_stats?.stat2_label || "Meals Provided"}
                  tag="span"
                  className="text-lg opacity-90"
                />
              </div>
            </div>
            <div className="bg-blue-700 text-white p-8 rounded-2xl shadow-xl">
              <div className="text-3xl md:text-4xl font-bold mb-4">
                <EditableText
                  page="ukrainian-ministry"
                  section="impact_stats"
                  contentKey="stat3_number"
                  initialValue={content?.impact_stats?.stat3_number || "75+"}
                  tag="span"
                  className="text-3xl md:text-4xl font-bold"
                />
              </div>
              <div className="text-lg opacity-90">
                <EditableText
                  page="ukrainian-ministry"
                  section="impact_stats"
                  contentKey="stat3_label"
                  initialValue={content?.impact_stats?.stat3_label || "Children Supported"}
                  tag="span"
                  className="text-lg opacity-90"
                />
              </div>
            </div>
            <div className="bg-blue-700 text-white p-8 rounded-2xl shadow-xl">
              <div className="text-3xl md:text-4xl font-bold mb-4">
                <EditableText
                  page="ukrainian-ministry"
                  section="impact_stats"
                  contentKey="stat4_number"
                  initialValue={content?.impact_stats?.stat4_number || "25+"}
                  tag="span"
                  className="text-3xl md:text-4xl font-bold"
                />
              </div>
              <div className="text-lg opacity-90">
                <EditableText
                  page="ukrainian-ministry"
                  section="impact_stats"
                  contentKey="stat4_label"
                  initialValue={content?.impact_stats?.stat4_label || "Volunteers"}
                  tag="span"
                  className="text-lg opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-16">
            <EditableText
              page="ukrainian-ministry"
              section="programs"
              contentKey="title"
              initialValue={content?.programs?.title || "Our Programs"}
              tag="span"
              className="text-3xl md:text-4xl font-bold text-center text-blue-900"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {programs.map((program, index) => (
              <Card
                key={index}
                className="hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-xl bg-gradient-to-br from-white to-blue-50"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-8">
                    <div className="bg-yellow-500 rounded-full p-4 mr-6">{program.icon}</div>
                    <h3 className="text-xl md:text-2xl font-bold text-blue-900">
                      <EditableText
                        page="ukrainian-ministry"
                        section="programs"
                        contentKey={program.titleKey}
                        initialValue={content?.programs?.[program.titleKey] || `Program ${index + 1}`}
                        tag="span"
                        className="ml-0"
                      />
                    </h3>
                  </div>
                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                    <EditableText
                      page="ukrainian-ministry"
                      section="programs"
                      contentKey={program.descriptionKey}
                      initialValue={content?.programs?.[program.descriptionKey] || "Program description"}
                      tag="span"
                      className="text-lg text-gray-700 leading-relaxed"
                      isTextArea={true}
                    />
                  </p>
                  <div className="bg-gradient-to-r from-blue-100 to-yellow-100 px-6 py-4 rounded-xl border-l-4 border-blue-700">
                    <span className="text-blue-900 font-bold text-base">
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
      <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            <EditableText
              page="ukrainian-ministry"
              section="foundation"
              contentKey="foundation_title"
              initialValue={content?.foundation?.foundation_title || "Our Biblical Foundation"}
              tag="span"
              className="text-3xl md:text-4xl font-bold"
            />
          </h2>
          <Card className="max-w-5xl mx-auto shadow-2xl border-0 bg-white/10 backdrop-blur-sm">
            <CardContent className="p-12">
              <blockquote className="text-2xl md:text-3xl italic text-yellow-300 mb-8 leading-relaxed">
                <EditableText
                  page="ukrainian-ministry"
                  section="foundation"
                  contentKey="scripture_quote"
                  initialValue={
                    content?.foundation?.scripture_quote ||
                    "Do not forget to show hospitality to strangers, for by so doing some people have shown hospitality to angels without knowing it."
                  }
                  tag="span"
                  className="text-2xl md:text-3xl italic text-yellow-300"
                  isTextArea={true}
                />
              </blockquote>
              <p className="text-xl md:text-2xl text-white font-bold mb-8">
                <EditableText
                  page="ukrainian-ministry"
                  section="foundation"
                  contentKey="scripture_reference"
                  initialValue={content?.foundation?.scripture_reference || "Hebrews 13:2"}
                  tag="span"
                  className="text-xl md:text-2xl text-white font-bold"
                />
              </p>
              <div className="text-blue-200">
                <p className="text-lg leading-relaxed">
                  <EditableText
                    page="ukrainian-ministry"
                    section="foundation"
                    contentKey="description"
                    initialValue={
                      content?.foundation?.description ||
                      "Our ministry is rooted in Christ's call to love and serve those in need."
                    }
                    tag="span"
                    className="text-lg text-blue-200"
                    isTextArea={true}
                  />
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-16">
            <EditableText
              page="ukrainian-ministry"
              section="testimonials"
              contentKey="title"
              initialValue={content?.testimonials?.title || "Stories of Hope"}
              tag="span"
              className="text-3xl md:text-4xl font-bold text-center text-blue-900"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-xl bg-gradient-to-br from-white to-yellow-50"
              >
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-8">{testimonial.flag}</div>
                  <blockquote className="text-lg text-gray-700 italic mb-8 leading-relaxed">
                    <EditableText
                      page="ukrainian-ministry"
                      section="testimonials"
                      contentKey={testimonial.quoteKey}
                      initialValue={content?.testimonials?.[testimonial.quoteKey] || "Testimonial quote"}
                      tag="span"
                      className="text-lg text-gray-700 italic"
                      isTextArea={true}
                    />
                  </blockquote>
                  <div>
                    <div className="font-bold text-blue-900 text-xl">{testimonial.name}</div>
                    <div className="text-base text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Help */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            <EditableText
              page="ukrainian-ministry"
              section="how_to_help"
              contentKey="title"
              initialValue={content?.how_to_help?.title || "How You Can Help"}
              tag="span"
              className="text-3xl md:text-4xl font-bold"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            {helpCards.map((card, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex justify-center mb-8">
                  <div className="bg-yellow-500 rounded-full p-4">{card.icon}</div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6">
                  <EditableText
                    page="ukrainian-ministry"
                    section="how_to_help"
                    contentKey={card.titleKey}
                    initialValue={content?.how_to_help?.[card.titleKey] || `Help Option ${index + 1}`}
                    tag="span"
                    className="text-2xl md:text-3xl font-bold"
                  />
                </h3>
                <p className="text-blue-200 text-lg leading-relaxed">
                  <EditableText
                    page="ukrainian-ministry"
                    section="how_to_help"
                    contentKey={card.descriptionKey}
                    initialValue={content?.how_to_help?.[card.descriptionKey] || "Description of how to help"}
                    tag="span"
                    className="text-blue-200"
                  />
                </p>
              </div>
            ))}
          </div>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-blue-900 font-bold px-12 py-4 text-xl rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Link href="/join">Get Involved Today</Link>
          </Button>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">
            <EditableText
              page="ukrainian-ministry"
              section="contact"
              contentKey="title"
              initialValue={content?.contact?.title || "Get in Touch"}
              tag="span"
              className="text-3xl md:text-4xl font-bold text-blue-900"
            />
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="ukrainian-ministry"
              section="contact"
              contentKey="description"
              initialValue={
                content?.contact?.description ||
                "Have questions about our Ukrainian Ministry? We'd love to hear from you."
              }
              tag="span"
              className="text-xl md:text-2xl text-gray-700"
            />
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-blue-900 font-bold px-10 py-4 text-xl rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="mailto:ukrainian@bozhiymirchurch.com">Contact Ministry Team</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white font-bold px-10 py-4 text-xl rounded-full bg-transparent shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
