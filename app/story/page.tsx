import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Globe, Star, Church } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EditableText from "@/components/editable-text"
import { createClient } from "@supabase/supabase-js"

async function fetchStoryContent() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const { data, error } = await supabase.from("content").select("page, section, key, value").eq("page", "story")

  if (error) {
    console.error("Failed to fetch story content on the server:", error)
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

export default async function StoryPage() {
  const content = await fetchStoryContent()

  const timeline = [
    {
      year: "2010",
      titleKey: "timeline_2010_title",
      descriptionKey: "timeline_2010_description",
      icon: <Church className="h-4 w-4 md:h-6 md:w-6" />,
    },
    {
      year: "2015",
      titleKey: "timeline_2015_title",
      descriptionKey: "timeline_2015_description",
      icon: <Users className="h-4 w-4 md:h-6 md:w-6" />,
    },
    {
      year: "2018",
      titleKey: "timeline_2018_title",
      descriptionKey: "timeline_2018_description",
      icon: <Star className="h-4 w-4 md:h-6 md:w-6" />,
    },
    {
      year: "2022",
      titleKey: "timeline_2022_title",
      descriptionKey: "timeline_2022_description",
      icon: <Heart className="h-4 w-4 md:h-6 md:w-6" />,
    },
    {
      year: "2024",
      titleKey: "timeline_2024_title",
      descriptionKey: "timeline_2024_description",
      icon: <Globe className="h-4 w-4 md:h-6 md:w-6" />,
    },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="py-8 md:py-12 lg:py-16 px-4 pt-20 md:pt-24 lg:pt-32">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              <EditableText
                page="story"
                section="main"
                contentKey="title"
                initialValue={content?.main?.title}
                tag="span"
                className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900"
              />
            </h1>
            <div className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8">
              <EditableText
                page="story"
                section="main"
                contentKey="description"
                initialValue={content?.main?.description}
                tag="span"
                className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto"
              />
            </div>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-8 md:py-12 lg:py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8">
              <EditableText
                page="story"
                section="mission"
                contentKey="mission_title"
                initialValue={content?.mission?.mission_title}
                tag="span"
                className="text-xl md:text-2xl lg:text-3xl font-bold"
              />
            </h2>
            <blockquote className="text-lg md:text-xl lg:text-2xl italic mb-4 md:mb-6 max-w-4xl mx-auto">
              <EditableText
                page="story"
                section="mission"
                contentKey="mission_quote"
                initialValue={content?.mission?.mission_quote}
                tag="span"
                className="text-lg md:text-xl lg:text-2xl italic"
                isTextArea={true}
              />
            </blockquote>
            <div className="flex justify-center space-x-4 text-2xl md:text-3xl">
              <span>🙏</span>
              <span>❤️</span>
              <span>🇺🇦</span>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-8 md:py-12 lg:py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
              <EditableText
                page="story"
                section="timeline"
                contentKey="timeline_title"
                initialValue={content?.timeline?.timeline_title}
                tag="span"
                className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900"
              />
            </h2>
            <div className="max-w-4xl mx-auto">
              {timeline.map((event, index) => (
                <div key={index} className="flex items-start mb-6 md:mb-8 last:mb-0">
                  <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mr-4 md:mr-6">
                    {event.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center mb-2">
                      <span className="bg-yellow-400 text-black px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold mb-2 md:mb-0 md:mr-4 inline-block w-fit">
                        {event.year}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900">
                        <EditableText
                          page="story"
                          section="timeline"
                          contentKey={event.titleKey}
                          initialValue={content?.timeline?.[event.titleKey]}
                          tag="span"
                          className="text-lg md:text-xl font-bold text-gray-900"
                        />
                      </h3>
                    </div>
                    <div className="text-sm md:text-base text-gray-600 leading-relaxed">
                      <EditableText
                        page="story"
                        section="timeline"
                        contentKey={event.descriptionKey}
                        initialValue={content?.timeline?.[event.descriptionKey]}
                        tag="span"
                        className="text-sm md:text-base text-gray-600 leading-relaxed"
                        isTextArea={true}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-8 md:py-12 lg:py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
              <EditableText
                page="story"
                section="values"
                contentKey="values_title"
                initialValue={content?.values?.values_title}
                tag="span"
                className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900"
              />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <Heart className="h-8 w-8 md:h-12 md:w-12 text-red-500 mx-auto mb-3 md:mb-4" />
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    <EditableText
                      page="story"
                      section="values"
                      contentKey="value1_title"
                      initialValue={content?.values?.value1_title}
                      tag="span"
                      className="text-lg md:text-xl font-bold text-gray-900"
                    />
                  </h3>
                  <div className="text-sm md:text-base text-gray-600">
                    <EditableText
                      page="story"
                      section="values"
                      contentKey="value1_description"
                      initialValue={content?.values?.value1_description}
                      tag="span"
                      className="text-sm md:text-base text-gray-600"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <Users className="h-8 w-8 md:h-12 md:w-12 text-blue-500 mx-auto mb-3 md:mb-4" />
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    <EditableText
                      page="story"
                      section="values"
                      contentKey="value2_title"
                      initialValue={content?.values?.value2_title}
                      tag="span"
                      className="text-lg md:text-xl font-bold text-gray-900"
                    />
                  </h3>
                  <div className="text-sm md:text-base text-gray-600">
                    <EditableText
                      page="story"
                      section="values"
                      contentKey="value2_description"
                      initialValue={content?.values?.value2_description}
                      tag="span"
                      className="text-sm md:text-base text-gray-600"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <Globe className="h-8 w-8 md:h-12 md:w-12 text-green-500 mx-auto mb-3 md:mb-4" />
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    <EditableText
                      page="story"
                      section="values"
                      contentKey="value3_title"
                      initialValue={content?.values?.value3_title}
                      tag="span"
                      className="text-lg md:text-xl font-bold text-gray-900"
                    />
                  </h3>
                  <div className="text-sm md:text-base text-gray-600">
                    <EditableText
                      page="story"
                      section="values"
                      contentKey="value3_description"
                      initialValue={content?.values?.value3_description}
                      tag="span"
                      className="text-sm md:text-base text-gray-600"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <Star className="h-8 w-8 md:h-12 md:w-12 text-yellow-500 mx-auto mb-3 md:mb-4" />
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    <EditableText
                      page="story"
                      section="values"
                      contentKey="value4_title"
                      initialValue={content?.values?.value4_title}
                      tag="span"
                      className="text-lg md:text-xl font-bold text-gray-900"
                    />
                  </h3>
                  <div className="text-sm md:text-base text-gray-600">
                    <EditableText
                      page="story"
                      section="values"
                      contentKey="value4_description"
                      initialValue={content?.values?.value4_description}
                      tag="span"
                      className="text-sm md:text-base text-gray-600"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Ukrainian Ministry Highlight */}
        <section className="py-8 md:py-12 lg:py-16 px-4">
          <div className="container mx-auto">
            <Card className="bg-gradient-to-r from-blue-500 to-yellow-400 text-white overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
                  <div>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
                      <EditableText
                        page="story"
                        section="ministry_highlight"
                        contentKey="highlight_title"
                        initialValue={content?.ministry_highlight?.highlight_title}
                        tag="span"
                        className="text-xl md:text-2xl lg:text-3xl font-bold"
                      />
                    </h2>
                    <div className="text-lg md:text-xl mb-4 md:mb-6 opacity-90">
                      <EditableText
                        page="story"
                        section="ministry_highlight"
                        contentKey="highlight_description"
                        initialValue={content?.ministry_highlight?.highlight_description}
                        tag="span"
                        className="text-lg md:text-xl opacity-90"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl md:text-3xl font-bold">
                          <EditableText
                            page="story"
                            section="ministry_highlight"
                            contentKey="stat1_number"
                            initialValue={content?.ministry_highlight?.stat1_number}
                            tag="span"
                            className="text-2xl md:text-3xl font-bold"
                          />
                        </div>
                        <div className="text-xs md:text-sm opacity-90">
                          <EditableText
                            page="story"
                            section="ministry_highlight"
                            contentKey="stat1_label"
                            initialValue={content?.ministry_highlight?.stat1_label}
                            tag="span"
                            className="text-xs md:text-sm opacity-90"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl md:text-3xl font-bold">
                          <EditableText
                            page="story"
                            section="ministry_highlight"
                            contentKey="stat2_number"
                            initialValue={content?.ministry_highlight?.stat2_number}
                            tag="span"
                            className="text-2xl md:text-3xl font-bold"
                          />
                        </div>
                        <div className="text-xs md:text-sm opacity-90">
                          <EditableText
                            page="story"
                            section="ministry_highlight"
                            contentKey="stat2_label"
                            initialValue={content?.ministry_highlight?.stat2_label}
                            tag="span"
                            className="text-xs md:text-sm opacity-90"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl md:text-8xl mb-3 md:mb-4">🇺🇦</div>
                    <div className="text-base md:text-lg opacity-90">
                      <EditableText
                        page="story"
                        section="ministry_highlight"
                        contentKey="highlight_quote"
                        initialValue={content?.ministry_highlight?.highlight_quote}
                        tag="span"
                        className="text-base md:text-lg opacity-90"
                        isTextArea={true}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-8 md:py-12 lg:py-16 px-4 text-center">
          <div className="container mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              <EditableText
                page="story"
                section="cta"
                contentKey="cta_title"
                initialValue={content?.cta?.cta_title}
                tag="span"
                className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900"
              />
            </h2>
            <div className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8">
              <EditableText
                page="story"
                section="cta"
                contentKey="cta_description"
                initialValue={content?.cta?.cta_description}
                tag="span"
                className="text-base md:text-lg lg:text-xl text-gray-600"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Link href="/join">Join Our Family</Link>
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
