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
      icon: <Church className="h-6 w-6" />,
    },
    {
      year: "2015",
      titleKey: "timeline_2015_title",
      descriptionKey: "timeline_2015_description",
      icon: <Users className="h-6 w-6" />,
    },
    {
      year: "2018",
      titleKey: "timeline_2018_title",
      descriptionKey: "timeline_2018_description",
      icon: <Star className="h-6 w-6" />,
    },
    {
      year: "2022",
      titleKey: "timeline_2022_title",
      descriptionKey: "timeline_2022_description",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      year: "2024",
      titleKey: "timeline_2024_title",
      descriptionKey: "timeline_2024_description",
      icon: <Globe className="h-6 w-6" />,
    },
  ]

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-blue-600" />,
      titleKey: "value1_title",
      descriptionKey: "value1_description",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      titleKey: "value2_title",
      descriptionKey: "value2_description",
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      titleKey: "value3_title",
      descriptionKey: "value3_description",
    },
    {
      icon: <Star className="h-8 w-8 text-blue-600" />,
      titleKey: "value4_title",
      descriptionKey: "value4_description",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-20 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <span className="text-5xl">🇺🇦</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            <EditableText
              page="story"
              section="main"
              contentKey="title"
              initialValue={content?.main?.title || "Our Story"}
              tag="span"
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
            />
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="story"
              section="main"
              contentKey="description"
              initialValue={
                content?.main?.description ||
                "Discover the journey of faith, hope, and community that defines Bozhiymir Church."
              }
              tag="span"
              className="text-xl md:text-2xl text-blue-200"
            />
          </p>
        </div>
      </div>

      {/* Mission Statement - Left Aligned */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-900">
                <EditableText
                  page="story"
                  section="mission"
                  contentKey="mission_title"
                  initialValue={content?.mission?.mission_title || "Our Mission"}
                  tag="span"
                  className="text-3xl md:text-4xl font-bold text-blue-900"
                />
              </h2>
              <blockquote className="text-xl md:text-2xl italic mb-8 text-blue-800 leading-relaxed">
                <EditableText
                  page="story"
                  section="mission"
                  contentKey="mission_quote"
                  initialValue={
                    content?.mission?.mission_quote ||
                    "To be a beacon of hope and love in our community, sharing the Gospel of Jesus Christ with all people."
                  }
                  tag="span"
                  className="text-xl md:text-2xl italic text-blue-800"
                  isTextArea={true}
                />
              </blockquote>
            </div>
            <div className="text-center">
              <div className="flex justify-center space-x-6 text-4xl mb-6">
                <span>🙏</span>
                <span>❤️</span>
                <span>🇺🇦</span>
              </div>
              <div className="bg-blue-700 text-white p-8 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Our Foundation</h3>
                <p className="text-lg opacity-90">Built on faith, strengthened by community, guided by love.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline - Right Aligned */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12">
                <EditableText
                  page="story"
                  section="timeline"
                  contentKey="timeline_title"
                  initialValue={content?.timeline?.timeline_title || "Our Journey"}
                  tag="span"
                  className="text-3xl md:text-4xl font-bold text-blue-900"
                />
              </h2>
              <div className="space-y-8">
                {timeline.map((event, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-800 rounded-full flex items-center justify-center text-white mr-6 shadow-lg">
                      {event.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center mb-4">
                        <span className="bg-yellow-500 text-blue-900 px-4 py-2 rounded-full text-sm font-bold mb-2 md:mb-0 md:mr-4 inline-block w-fit">
                          {event.year}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-blue-900">
                          <EditableText
                            page="story"
                            section="timeline"
                            contentKey={event.titleKey}
                            initialValue={content?.timeline?.[event.titleKey] || `Milestone ${event.year}`}
                            tag="span"
                            className="text-xl md:text-2xl font-bold text-blue-900"
                          />
                        </h3>
                      </div>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        <EditableText
                          page="story"
                          section="timeline"
                          contentKey={event.descriptionKey}
                          initialValue={
                            content?.timeline?.[event.descriptionKey] || "A significant moment in our church's history."
                          }
                          tag="span"
                          className="text-lg text-gray-700 leading-relaxed"
                          isTextArea={true}
                        />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:order-1">
              <div className="bg-gradient-to-br from-blue-100 to-yellow-100 p-8 rounded-2xl shadow-xl h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-6">⛪</div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Growing Together</h3>
                  <p className="text-lg text-gray-700">
                    Each milestone represents our commitment to serving God and our community with unwavering faith.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Left Aligned */}
      <section className="py-20 bg-gradient-to-br from-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-12">
                <EditableText
                  page="story"
                  section="values"
                  contentKey="values_title"
                  initialValue={content?.values?.values_title || "Our Values"}
                  tag="span"
                  className="text-3xl md:text-4xl font-bold"
                />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-yellow-500 rounded-full p-3 mr-4">{value.icon}</div>
                      <h3 className="text-xl font-bold">
                        <EditableText
                          page="story"
                          section="values"
                          contentKey={value.titleKey}
                          initialValue={content?.values?.[value.titleKey] || `Value ${index + 1}`}
                          tag="span"
                          className="text-xl font-bold"
                        />
                      </h3>
                    </div>
                    <p className="text-blue-200 leading-relaxed">
                      <EditableText
                        page="story"
                        section="values"
                        contentKey={value.descriptionKey}
                        initialValue={content?.values?.[value.descriptionKey] || "Description of this value"}
                        tag="span"
                        className="text-blue-200"
                      />
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="bg-yellow-500 text-blue-900 p-10 rounded-2xl shadow-2xl">
                <h3 className="text-3xl font-bold mb-6">Faith in Action</h3>
                <p className="text-xl mb-6">
                  Our values guide every decision, every ministry, and every relationship we build.
                </p>
                <div className="text-4xl">✨</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ukrainian Ministry Highlight - Right Aligned */}
      <section className="py-20 bg-gradient-to-br from-yellow-400 to-yellow-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-900">
                <EditableText
                  page="story"
                  section="ministry_highlight"
                  contentKey="highlight_title"
                  initialValue={content?.ministry_highlight?.highlight_title || "Ukrainian Ministry"}
                  tag="span"
                  className="text-3xl md:text-4xl font-bold text-blue-900"
                />
              </h2>
              <p className="text-xl md:text-2xl mb-10 text-blue-800 leading-relaxed">
                <EditableText
                  page="story"
                  section="ministry_highlight"
                  contentKey="highlight_description"
                  initialValue={
                    content?.ministry_highlight?.highlight_description ||
                    "Supporting Ukrainian families in their time of need"
                  }
                  tag="span"
                  className="text-xl md:text-2xl text-blue-800"
                />
              </p>
              <div className="grid grid-cols-2 gap-8 text-center">
                <div className="bg-blue-700 text-white p-6 rounded-xl shadow-lg">
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    <EditableText
                      page="story"
                      section="ministry_highlight"
                      contentKey="stat1_number"
                      initialValue={content?.ministry_highlight?.stat1_number || "150+"}
                      tag="span"
                      className="text-3xl md:text-4xl font-bold"
                    />
                  </div>
                  <div className="text-sm opacity-90">
                    <EditableText
                      page="story"
                      section="ministry_highlight"
                      contentKey="stat1_label"
                      initialValue={content?.ministry_highlight?.stat1_label || "Families Helped"}
                      tag="span"
                      className="text-sm opacity-90"
                    />
                  </div>
                </div>
                <div className="bg-blue-700 text-white p-6 rounded-xl shadow-lg">
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    <EditableText
                      page="story"
                      section="ministry_highlight"
                      contentKey="stat2_number"
                      initialValue={content?.ministry_highlight?.stat2_number || "500+"}
                      tag="span"
                      className="text-3xl md:text-4xl font-bold"
                    />
                  </div>
                  <div className="text-sm opacity-90">
                    <EditableText
                      page="story"
                      section="ministry_highlight"
                      contentKey="stat2_label"
                      initialValue={content?.ministry_highlight?.stat2_label || "Meals Provided"}
                      tag="span"
                      className="text-sm opacity-90"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:order-1 text-center">
              <div className="text-8xl mb-8">🇺🇦</div>
              <div className="bg-blue-700 text-white p-8 rounded-2xl shadow-xl">
                <p className="text-xl leading-relaxed">
                  <EditableText
                    page="story"
                    section="ministry_highlight"
                    contentKey="highlight_quote"
                    initialValue={content?.ministry_highlight?.highlight_quote || "Together we stand with Ukraine"}
                    tag="span"
                    className="text-xl"
                    isTextArea={true}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-yellow-50 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">
            <EditableText
              page="story"
              section="cta"
              contentKey="cta_title"
              initialValue={content?.cta?.cta_title || "Join Our Story"}
              tag="span"
              className="text-3xl md:text-4xl font-bold text-blue-900"
            />
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="story"
              section="cta"
              contentKey="cta_description"
              initialValue={
                content?.cta?.cta_description || "Be part of our continuing story of faith, hope, and love."
              }
              tag="span"
              className="text-xl md:text-2xl text-gray-700"
            />
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-bold px-10 py-4 text-xl rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/join">Join Our Family</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white font-bold px-10 py-4 text-xl rounded-full bg-transparent shadow-lg transform hover:scale-105 transition-all duration-300"
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
