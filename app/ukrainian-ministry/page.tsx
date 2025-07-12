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
      icon: <Home className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />,
      titleKey: "program1_title",
      descriptionKey: "program1_description",
      statsKey: "program1_stats",
    },
    {
      icon: <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-green-600" />,
      titleKey: "program2_title",
      descriptionKey: "program2_description",
      statsKey: "program2_stats",
    },
    {
      icon: <Heart className="h-6 w-6 md:h-8 md:w-8 text-red-600" />,
      titleKey: "program3_title",
      descriptionKey: "program3_description",
      statsKey: "program3_stats",
    },
    {
      icon: <Utensils className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />,
      titleKey: "program4_title",
      descriptionKey: "program4_description",
      statsKey: "program4_stats",
    },
    {
      icon: <Users className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />,
      titleKey: "program5_title",
      descriptionKey: "program5_description",
      statsKey: "program5_stats",
    },
    {
      icon: <Shirt className="h-6 w-6 md:h-8 md:w-8 text-pink-600" />,
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
        <section className="py-8 md:py-12 lg:py-16 px-4 pt-20 md:pt-24 lg:pt-32">
          <div className="container mx-auto text-center">
            <div className="text-4xl md:text-6xl mb-4 md:mb-6">🇺🇦</div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              <EditableText
                page="ukrainian-ministry"
                section="main"
                contentKey="title"
                initialValue={content?.main?.title}
                tag="span"
                className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900"
              />
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8">
              <EditableText
                page="ukrainian-ministry"
                section="main"
                contentKey="description"
                initialValue={content?.main?.description}
                tag="span"
                className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto"
              />
            </p>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-8 md:py-12 lg:py-16 px-4 bg-gradient-to-r from-blue-600 to-yellow-400 text-white">
          <div className="container mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-8 md:mb-12">
              <EditableText
                page="ukrainian-ministry"
                section="impact_stats"
                contentKey="title"
                initialValue={content?.impact_stats?.title}
                tag="span"
                className="text-xl md:text-2xl lg:text-3xl font-bold text-center"
              />
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
              <div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  <EditableText
                    page="ukrainian-ministry"
                    section="impact_stats"
                    contentKey="stat1_number"
                    initialValue={content?.impact_stats?.stat1_number}
                    tag="span"
                    className="text-2xl md:text-3xl lg:text-4xl font-bold"
                  />
                </div>
                <div className="text-sm md:text-base lg:text-lg opacity-90">
                  <EditableText
                    page="ukrainian-ministry"
                    section="impact_stats"
                    contentKey="stat1_label"
                    initialValue={content?.impact_stats?.stat1_label}
                    tag="span"
                    className="text-sm md:text-base lg:text-lg opacity-90"
                  />
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  <EditableText
                    page="ukrainian-ministry"
                    section="impact_stats"
                    contentKey="stat2_number"
                    initialValue={content?.impact_stats?.stat2_number}
                    tag="span"
                    className="text-2xl md:text-3xl lg:text-4xl font-bold"
                  />
                </div>
                <div className="text-sm md:text-base lg:text-lg opacity-90">
                  <EditableText
                    page="ukrainian-ministry"
                    section="impact_stats"
                    contentKey="stat2_label"
                    initialValue={content?.impact_stats?.stat2_label}
                    tag="span"
                    className="text-sm md:text-base lg:text-lg opacity-90"
                  />
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  <EditableText
                    page="ukrainian-ministry"
                    section="impact_stats"
                    contentKey="stat3_number"
                    initialValue={content?.impact_stats?.stat3_number}
                    tag="span"
                    className="text-2xl md:text-3xl lg:text-4xl font-bold"
                  />
                </div>
                <div className="text-sm md:text-base lg:text-lg opacity-90">
                  <EditableText
                    page="ukrainian-ministry"
                    section="impact_stats"
                    contentKey="stat3_label"
                    initialValue={content?.impact_stats?.stat3_label}
                    tag="span"
                    className="text-sm md:text-base lg:text-lg opacity-90"
                  />
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  <EditableText
                    page="ukrainian-ministry"
                    section="impact_stats"
                    contentKey="stat4_number"
                    initialValue={content?.impact_stats?.stat4_number}
                    tag="span"
                    className="text-2xl md:text-3xl lg:text-4xl font-bold"
                  />
                </div>
                <div className="text-sm md:text-base lg:text-lg opacity-90">
                  <EditableText
                    page="ukrainian-ministry"
                    section="impact_stats"
                    contentKey="stat4_label"
                    initialValue={content?.impact_stats?.stat4_label}
                    tag="span"
                    className="text-sm md:text-base lg:text-lg opacity-90"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="py-8 md:py-12 lg:py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
              <EditableText
                page="ukrainian-ministry"
                section="programs"
                contentKey="title"
                initialValue={content?.programs?.title}
                tag="span"
                className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900"
              />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {programs.map((program, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-600"
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center mb-3 md:mb-4">
                      {program.icon}
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 ml-3">
                        <EditableText
                          page="ukrainian-ministry"
                          section="programs"
                          contentKey={program.titleKey}
                          initialValue={content?.programs?.[program.titleKey]}
                          tag="span"
                          className="ml-0"
                        />
                      </h3>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 leading-relaxed">
                      <EditableText
                        page="ukrainian-ministry"
                        section="programs"
                        contentKey={program.descriptionKey}
                        initialValue={content?.programs?.[program.descriptionKey]}
                        tag="span"
                        className="text-sm md:text-base text-gray-600 leading-relaxed"
                        isTextArea={true}
                      />
                    </p>
                    <div className="bg-blue-50 px-3 py-2 rounded-lg">
                      <span className="text-blue-800 font-semibold text-xs md:text-sm">
                        <EditableText
                          page="ukrainian-ministry"
                          section="programs"
                          contentKey={program.statsKey}
                          initialValue={content?.programs?.[program.statsKey]}
                          tag="span"
                          className="text-blue-800 font-semibold"
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
        <section className="py-8 md:py-12 lg:py-16 px-4 bg-gray-50">
          <div className="container mx-auto text-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
              <EditableText
                page="ukrainian-ministry"
                section="foundation"
                contentKey="foundation_title"
                initialValue={content?.foundation?.foundation_title}
                tag="span"
                className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900"
              />
            </h2>
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-6 md:p-8">
                <blockquote className="text-lg md:text-xl lg:text-2xl italic text-gray-700 mb-4 md:mb-6">
                  <EditableText
                    page="ukrainian-ministry"
                    section="foundation"
                    contentKey="scripture_quote"
                    initialValue={content?.foundation?.scripture_quote}
                    tag="span"
                    className="text-lg md:text-xl lg:text-2xl italic text-gray-700"
                    isTextArea={true}
                  />
                </blockquote>
                <p className="text-lg md:text-xl text-blue-600 font-semibold">
                  <EditableText
                    page="ukrainian-ministry"
                    section="foundation"
                    contentKey="scripture_reference"
                    initialValue={content?.foundation?.scripture_reference}
                    tag="span"
                    className="text-lg md:text-xl text-blue-600 font-semibold"
                  />
                </p>
                <div className="mt-4 md:mt-6 text-gray-600">
                  <p className="text-sm md:text-base">
                    <EditableText
                      page="ukrainian-ministry"
                      section="foundation"
                      contentKey="description"
                      initialValue={content?.foundation?.description}
                      tag="span"
                      className="text-sm md:text-base text-gray-600"
                      isTextArea={true}
                    />
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-8 md:py-12 lg:py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
              <EditableText
                page="ukrainian-ministry"
                section="testimonials"
                contentKey="title"
                initialValue={content?.testimonials?.title}
                tag="span"
                className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900"
              />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="text-3xl md:text-4xl mb-3 md:mb-4">{testimonial.flag}</div>
                    <blockquote className="text-sm md:text-base text-gray-600 italic mb-3 md:mb-4">
                      <EditableText
                        page="ukrainian-ministry"
                        section="testimonials"
                        contentKey={testimonial.quoteKey}
                        initialValue={content?.testimonials?.[testimonial.quoteKey]}
                        tag="span"
                        className="text-sm md:text-base text-gray-600 italic"
                        isTextArea={true}
                      />
                    </blockquote>
                    <div>
                      <div className="font-bold text-gray-900 text-sm md:text-base">{testimonial.name}</div>
                      <div className="text-xs md:text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How to Help */}
        <section className="py-8 md:py-12 lg:py-16 px-4 bg-blue-600 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8">
              <EditableText
                page="ukrainian-ministry"
                section="how_to_help"
                contentKey="title"
                initialValue={content?.how_to_help?.title}
                tag="span"
                className="text-xl md:text-2xl lg:text-3xl font-bold"
              />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
              <div>
                <Heart className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-yellow-400" />
                <h3 className="text-lg md:text-xl font-bold mb-2">
                  <EditableText
                    page="ukrainian-ministry"
                    section="how_to_help"
                    contentKey="card1_title"
                    initialValue={content?.how_to_help?.card1_title}
                    tag="span"
                    className="text-lg md:text-xl font-bold"
                  />
                </h3>
                <p className="opacity-90 text-sm md:text-base">
                  <EditableText
                    page="ukrainian-ministry"
                    section="how_to_help"
                    contentKey="card1_description"
                    initialValue={content?.how_to_help?.card1_description}
                    tag="span"
                    className="opacity-90"
                  />
                </p>
              </div>
              <div>
                <Users className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-yellow-400" />
                <h3 className="text-lg md:text-xl font-bold mb-2">
                  <EditableText
                    page="ukrainian-ministry"
                    section="how_to_help"
                    contentKey="card2_title"
                    initialValue={content?.how_to_help?.card2_title}
                    tag="span"
                    className="text-lg md:text-xl font-bold"
                  />
                </h3>
                <p className="opacity-90 text-sm md:text-base">
                  <EditableText
                    page="ukrainian-ministry"
                    section="how_to_help"
                    contentKey="card2_description"
                    initialValue={content?.how_to_help?.card2_description}
                    tag="span"
                    className="opacity-90"
                  />
                </p>
              </div>
              <div>
                <BookOpen className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-yellow-400" />
                <h3 className="text-lg md:text-xl font-bold mb-2">
                  <EditableText
                    page="ukrainian-ministry"
                    section="how_to_help"
                    contentKey="card3_title"
                    initialValue={content?.how_to_help?.card3_title}
                    tag="span"
                    className="text-lg md:text-xl font-bold"
                  />
                </h3>
                <p className="opacity-90 text-sm md:text-base">
                  <EditableText
                    page="ukrainian-ministry"
                    section="how_to_help"
                    contentKey="card3_description"
                    initialValue={content?.how_to_help?.card3_description}
                    tag="span"
                    className="opacity-90"
                  />
                </p>
              </div>
            </div>
            <Button asChild size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 w-full sm:w-auto">
              <Link href="/join">Get Involved Today</Link>
            </Button>
          </div>
        </section>

        {/* Contact */}
        <section className="py-8 md:py-12 lg:py-16 px-4 text-center">
          <div className="container mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              <EditableText
                page="ukrainian-ministry"
                section="contact"
                contentKey="title"
                initialValue={content?.contact?.title}
                tag="span"
                className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900"
              />
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8">
              <EditableText
                page="ukrainian-ministry"
                section="contact"
                contentKey="description"
                initialValue={content?.contact?.description}
                tag="span"
                className="text-base md:text-lg lg:text-xl text-gray-600"
              />
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Link href="mailto:ukrainian@bozhiymirchurch.com">Contact Ministry Team</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
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
