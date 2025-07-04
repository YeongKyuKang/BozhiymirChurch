// app/story/page.tsx
// "use client" 지시문 제거
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Globe, Star, Church } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EditableText from "@/components/editable-text";
import { supabase } from "@/lib/supabase" // 서버 컴포넌트에서 DB 패칭을 위해 추가

async function fetchStoryContent() {
  const { data, error } = await supabase
    .from('content')
    .select('page, section, key, value')
    .eq('page', 'story');
    
  if (error) {
    console.error('Failed to fetch story content on the server:', error);
    return {};
  }
  
  const contentMap: Record<string, any> = {};
  data.forEach(item => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });
  
  return contentMap;
}

export default async function StoryPage() {
  const content = await fetchStoryContent();

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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="py-16 px-4 pt-32">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <EditableText
                  page="story"
                  section="main"
                  contentKey="title"
                  initialValue={content?.main?.title}
                  tag="span"
                  className="text-5xl font-bold text-gray-900"
              />
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              <EditableText
                  page="story"
                  section="main"
                  contentKey="description"
                  initialValue={content?.main?.description}
                  tag="span"
                  className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
              />
            </p>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              <EditableText
                  page="story"
                  section="mission"
                  contentKey="mission_title"
                  initialValue={content?.mission?.mission_title}
                  tag="span"
                  className="text-3xl font-bold mb-8"
              />
            </h2>
            <blockquote className="text-2xl italic mb-6 max-w-4xl mx-auto">
              <EditableText
                  page="story"
                  section="mission"
                  contentKey="mission_quote"
                  initialValue={content?.mission?.mission_quote}
                  tag="span"
                  className="text-2xl italic mb-6 max-w-4xl mx-auto"
                  isTextArea={true}
              />
            </blockquote>
            <div className="flex justify-center space-x-4 text-3xl">
              <span>🙏</span>
              <span>❤️</span>
              <span>🇺🇦</span>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              <EditableText
                  page="story"
                  section="timeline"
                  contentKey="timeline_title"
                  initialValue={content?.timeline?.timeline_title}
                  tag="span"
                  className="text-3xl font-bold text-center text-gray-900 mb-12"
              />
            </h2>
            <div className="max-w-4xl mx-auto">
              {timeline.map((event, index) => (
                <div key={index} className="flex items-start mb-8 last:mb-0">
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mr-6">
                    {event.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center mb-2">
                      <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold mr-4">
                        {event.year}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">
                        <EditableText page="story" section="timeline" contentKey={event.titleKey} initialValue={content?.timeline?.[event.titleKey]} tag="span" className="text-xl font-bold text-gray-900" />
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      <EditableText page="story" section="timeline" contentKey={event.descriptionKey} initialValue={content?.timeline?.[event.descriptionKey]} tag="span" className="text-gray-600 leading-relaxed" isTextArea={true} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              <EditableText page="story" section="values" contentKey="values_title" initialValue={content?.values?.values_title} tag="span" className="text-3xl font-bold text-center text-gray-900 mb-12" />
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    <EditableText page="story" section="values" contentKey="value1_title" initialValue={content?.values?.value1_title} tag="span" className="text-xl font-bold text-gray-900 mb-2" />
                  </h3>
                  <p className="text-gray-600">
                    <EditableText page="story" section="values" contentKey="value1_description" initialValue={content?.values?.value1_description} tag="span" className="text-gray-600" />
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    <EditableText page="story" section="values" contentKey="value2_title" initialValue={content?.values?.value2_title} tag="span" className="text-xl font-bold text-gray-900 mb-2" />
                  </h3>
                  <p className="text-gray-600">
                    <EditableText page="story" section="values" contentKey="value2_description" initialValue={content?.values?.value2_description} tag="span" className="text-gray-600" />
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Globe className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    <EditableText page="story" section="values" contentKey="value3_title" initialValue={content?.values?.value3_title} tag="span" className="text-xl font-bold text-gray-900 mb-2" />
                  </h3>
                  <p className="text-gray-600">
                    <EditableText page="story" section="values" contentKey="value3_description" initialValue={content?.values?.value3_description} tag="span" className="text-gray-600" />
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    <EditableText page="story" section="values" contentKey="value4_title" initialValue={content?.values?.value4_title} tag="span" className="text-xl font-bold text-gray-900 mb-2" />
                  </h3>
                  <p className="text-gray-600">
                    <EditableText page="story" section="values" contentKey="value4_description" initialValue={content?.values?.value4_description} tag="span" className="text-gray-600" />
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Ukrainian Ministry Highlight */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <Card className="bg-gradient-to-r from-blue-500 to-yellow-400 text-white overflow-hidden">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">
                      <EditableText page="story" section="ministry_highlight" contentKey="highlight_title" initialValue={content?.ministry_highlight?.highlight_title} tag="span" className="text-3xl font-bold mb-4" />
                    </h2>
                    <p className="text-xl mb-6 opacity-90">
                      <EditableText page="story" section="ministry_highlight" contentKey="highlight_description" initialValue={content?.ministry_highlight?.highlight_description} tag="span" className="text-xl mb-6 opacity-90" />
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold">
                          <EditableText page="story" section="ministry_highlight" contentKey="stat1_number" initialValue={content?.ministry_highlight?.stat1_number} tag="span" className="text-3xl font-bold" />
                        </div>
                        <div className="text-sm opacity-90">
                          <EditableText page="story" section="ministry_highlight" contentKey="stat1_label" initialValue={content?.ministry_highlight?.stat1_label} tag="span" className="text-sm opacity-90" />
                        </div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold">
                          <EditableText page="story" section="ministry_highlight" contentKey="stat2_number" initialValue={content?.ministry_highlight?.stat2_number} tag="span" className="text-3xl font-bold" />
                        </div>
                        <div className="text-sm opacity-90">
                          <EditableText page="story" section="ministry_highlight" contentKey="stat2_label" initialValue={content?.ministry_highlight?.stat2_label} tag="span" className="text-sm opacity-90" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-8xl mb-4">🇺🇦</div>
                    <p className="text-lg opacity-90">
                      <EditableText page="story" section="ministry_highlight" contentKey="highlight_quote" initialValue={content?.ministry_highlight?.highlight_quote} tag="span" className="text-lg opacity-90" isTextArea={true} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 text-center">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              <EditableText page="story" section="cta" contentKey="cta_title" initialValue={content?.cta?.cta_title} tag="span" className="text-3xl font-bold text-gray-900" />
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              <EditableText page="story" section="cta" contentKey="cta_description" initialValue={content?.cta?.cta_description} tag="span" className="text-xl text-gray-600" />
            </p>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/join">Join Our Family</Link>
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