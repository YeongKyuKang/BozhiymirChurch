// app/join/page.tsx
// "use client" 지시문 제거
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Clock, Phone, Mail, Users, Heart, Star } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EditableText from "@/components/editable-text";
import { supabase } from "@/lib/supabase" // 서버 컴포넌트에서 DB 패칭을 위해 추가

async function fetchJoinContent() {
  const { data, error } = await supabase
    .from('content')
    .select('page, section, key, value')
    .eq('page', 'join');
    
  if (error) {
    console.error('Failed to fetch join content on the server:', error);
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

export default async function JoinPage() {
  const content = await fetchJoinContent();

  const serviceInfo = [
    {
      time: "9:00 AM",
      styleKey: "service_style_1",
      descriptionKey: "service_description_1",
      icon: <Star className="h-6 w-6" />,
    },
    {
      time: "10:30 AM",
      styleKey: "service_style_2",
      descriptionKey: "service_description_2",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      time: "12:00 PM",
      styleKey: "service_style_3",
      descriptionKey: "service_description_3",
      icon: <Users className="h-6 w-6" />,
    },
  ]

  const whatToExpect = [
    {
      titleKey: "expect_title_1",
      descriptionKey: "expect_description_1",
      icon: "🤝",
    },
    {
      titleKey: "expect_title_2",
      descriptionKey: "expect_description_2",
      icon: "🎶",
    },
    {
      titleKey: "expect_title_3",
      descriptionKey: "expect_description_3",
      icon: "🫂",
    },
    {
      titleKey: "expect_title_4",
      descriptionKey: "expect_description_4",
      icon: "👧",
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
                  page="join"
                  section="main"
                  contentKey="title"
                  initialValue={content?.main?.title}
                  tag="span"
                  className="text-5xl font-bold text-gray-900 mb-6"
              />
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              <EditableText
                  page="join"
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

        {/* Service Times */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              <EditableText page="join" section="services" contentKey="services_title" initialValue={content?.services?.services_title} tag="span" className="text-3xl font-bold text-center text-gray-900 mb-12" />
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {serviceInfo.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow text-center">
                  <CardContent className="p-6">
                    <div className="text-blue-600 mb-4 flex justify-center">{service.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.time}</h3>
                    <h4 className="text-lg font-semibold text-blue-600 mb-3">
                      <EditableText page="join" section="services" contentKey={service.styleKey} initialValue={content?.services?.[service.styleKey]} tag="span" className="text-lg font-semibold text-blue-600 mb-3" />
                    </h4>
                    <p className="text-gray-600">
                      <EditableText page="join" section="services" contentKey={service.descriptionKey} initialValue={content?.services?.[service.descriptionKey]} tag="span" className="text-gray-600" />
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-lg text-gray-600 mb-4">
                <EditableText page="join" section="services" contentKey="services_footer_text" initialValue={content?.services?.services_footer_text} tag="span" className="text-lg text-gray-600 mb-4" />
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Plan Your Visit
              </Button>
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              <EditableText page="join" section="expect" contentKey="expect_title" initialValue={content?.expect?.expect_title} tag="span" className="text-3xl font-bold text-center text-gray-900 mb-12" />
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whatToExpect.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      <EditableText page="join" section="expect" contentKey={item.titleKey} initialValue={content?.expect?.[item.titleKey]} tag="span" className="text-xl font-bold text-gray-900 mb-2" />
                    </h3>
                    <p className="text-gray-600">
                      <EditableText page="join" section="expect" contentKey={item.descriptionKey} initialValue={content?.expect?.[item.descriptionKey]} tag="span" className="text-gray-600" />
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Location & Contact */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  <EditableText page="join" section="contact" contentKey="visit_title" initialValue={content?.contact?.visit_title} tag="span" className="text-3xl font-bold text-gray-900 mb-8" />
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Address</h3>
                      <p className="text-gray-600">
                        <EditableText page="join" section="contact" contentKey="address" initialValue={content?.contact?.address} tag="span" className="text-gray-600" isTextArea={true} />
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Service Times</h3>
                      <p className="text-gray-600">
                        <EditableText page="join" section="contact" contentKey="service_times" initialValue={content?.contact?.service_times} tag="span" className="text-gray-600" isTextArea={true} />
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <p className="text-gray-600">
                        <EditableText page="join" section="contact" contentKey="phone" initialValue={content?.contact?.phone} tag="span" className="text-gray-600" />
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">
                        <EditableText page="join" section="contact" contentKey="email" initialValue={content?.contact?.email} tag="span" className="text-gray-600" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Get Connected</h2>
                <Card>
                  <CardContent className="p-6">
                    <form className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                          <Input placeholder="Your first name" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                          <Input placeholder="Your last name" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <Input type="email" placeholder="your.email@example.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
                        <Input type="tel" placeholder="(503) 555-0123" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">I'm interested in:</label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Visiting for the first time</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Joining the church</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Volunteering opportunities</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Ukrainian children ministry</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                        <Textarea placeholder="Tell us how we can help you connect..." rows={4} />
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Send Message</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Ukrainian Ministry Highlight */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-yellow-400 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              <EditableText page="join" section="ministry_highlight" contentKey="highlight_title" initialValue={content?.ministry_highlight?.highlight_title} tag="span" className="text-3xl font-bold mb-8" />
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="text-6xl mb-6">🇺🇦</div>
              <h3 className="text-2xl font-bold mb-4">
                <EditableText page="join" section="ministry_highlight" contentKey="highlight_subtitle" initialValue={content?.ministry_highlight?.highlight_subtitle} tag="span" className="text-2xl font-bold mb-4" />
              </h3>
              <p className="text-xl mb-8 opacity-90">
                <EditableText page="join" section="ministry_highlight" contentKey="highlight_description" initialValue={content?.ministry_highlight?.highlight_description} tag="span" className="text-xl mb-8 opacity-90" />
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-bold">
                    <EditableText page="join" section="ministry_highlight" contentKey="stat1_number" initialValue={content?.ministry_highlight?.stat1_number} tag="span" className="text-3xl font-bold" />
                  </div>
                  <div className="opacity-90">
                    <EditableText page="join" section="ministry_highlight" contentKey="stat1_label" initialValue={content?.ministry_highlight?.stat1_label} tag="span" className="opacity-90" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    <EditableText page="join" section="ministry_highlight" contentKey="stat2_number" initialValue={content?.ministry_highlight?.stat2_number} tag="span" className="text-3xl font-bold" />
                  </div>
                  <div className="opacity-90">
                    <EditableText page="join" section="ministry_highlight" contentKey="stat2_label" initialValue={content?.ministry_highlight?.stat2_label} tag="span" className="opacity-90" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    <EditableText page="join" section="ministry_highlight" contentKey="stat3_number" initialValue={content?.ministry_highlight?.stat3_number} tag="span" className="text-3xl font-bold" />
                  </div>
                  <div className="opacity-90">
                    <EditableText page="join" section="ministry_highlight" contentKey="stat3_label" initialValue={content?.ministry_highlight?.stat3_label} tag="span" className="opacity-90" />
                  </div>
                </div>
              </div>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/ukrainian-ministry">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 text-center">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              <EditableText page="join" section="cta" contentKey="cta_title" initialValue={content?.cta?.cta_title} tag="span" className="text-3xl font-bold text-gray-900 mb-6" />
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              <EditableText page="join" section="cta" contentKey="cta_description" initialValue={content?.cta?.cta_description} tag="span" className="text-xl text-gray-600 mb-8" />
            </p>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="tel:(503)555-0123">Call Us</Link>
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