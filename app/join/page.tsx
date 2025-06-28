"use client";

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Clock, Phone, Mail, Users, Heart, Star } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EditableText from "@/components/editable-text";
import { useAuth } from "@/contexts/auth-context";

export default function JoinPage() {
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
            <EditableText
              page="join"
              section="main"
              contentKey="title"
              tag="h1"
              className="text-5xl font-bold text-gray-900 mb-6"
            />
            <EditableText
              page="join"
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

        {/* Service Times */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <EditableText page="join" section="services" contentKey="services_title" tag="h2" className="text-3xl font-bold text-center text-gray-900 mb-12" />
            <div className="grid md:grid-cols-3 gap-8">
              {serviceInfo.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow text-center">
                  <CardContent className="p-6">
                    <div className="text-blue-600 mb-4 flex justify-center">{service.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.time}</h3>
                    <EditableText page="join" section="services" contentKey={service.styleKey} tag="h4" className="text-lg font-semibold text-blue-600 mb-3" />
                    <EditableText page="join" section="services" contentKey={service.descriptionKey} tag="p" className="text-gray-600" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <EditableText page="join" section="services" contentKey="services_footer_text" tag="p" className="text-lg text-gray-600 mb-4" />
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Plan Your Visit
              </Button>
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <EditableText page="join" section="expect" contentKey="expect_title" tag="h2" className="text-3xl font-bold text-center text-gray-900 mb-12" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whatToExpect.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <EditableText page="join" section="expect" contentKey={item.titleKey} tag="h3" className="text-xl font-bold text-gray-900 mb-2" />
                    <EditableText page="join" section="expect" contentKey={item.descriptionKey} tag="p" className="text-gray-600" />
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
                <EditableText page="join" section="contact" contentKey="visit_title" tag="h2" className="text-3xl font-bold text-gray-900 mb-8" />
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Address</h3>
                      <EditableText page="join" section="contact" contentKey="address" tag="p" className="text-gray-600" isTextArea={true} />
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Service Times</h3>
                      <EditableText page="join" section="contact" contentKey="service_times" tag="p" className="text-gray-600" isTextArea={true} />
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <EditableText page="join" section="contact" contentKey="phone" tag="p" className="text-gray-600" />
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <EditableText page="join" section="contact" contentKey="email" tag="p" className="text-gray-600" />
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
            <EditableText page="join" section="ministry_highlight" contentKey="highlight_title" tag="h2" className="text-3xl font-bold mb-8" />
            <div className="max-w-4xl mx-auto">
              <div className="text-6xl mb-6"></div>
              <EditableText page="join" section="ministry_highlight" contentKey="highlight_subtitle" tag="h3" className="text-2xl font-bold mb-4" />
              <EditableText page="join" section="ministry_highlight" contentKey="highlight_description" tag="p" className="text-xl mb-8 opacity-90" />
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <EditableText page="join" section="ministry_highlight" contentKey="stat1_number" tag="div" className="text-3xl font-bold" />
                  <EditableText page="join" section="ministry_highlight" contentKey="stat1_label" tag="div" className="opacity-90" />
                </div>
                <div>
                  <EditableText page="join" section="ministry_highlight" contentKey="stat2_number" tag="div" className="text-3xl font-bold" />
                  <EditableText page="join" section="ministry_highlight" contentKey="stat2_label" tag="div" className="opacity-90" />
                </div>
                <div>
                  <EditableText page="join" section="ministry_highlight" contentKey="stat3_number" tag="div" className="text-3xl font-bold" />
                  <EditableText page="join" section="ministry_highlight" contentKey="stat3_label" tag="div" className="opacity-90" />
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
            <EditableText page="join" section="cta" contentKey="cta_title" tag="h2" className="text-3xl font-bold text-gray-900 mb-6" />
            <EditableText page="join" section="cta" contentKey="cta_description" tag="p" className="text-xl text-gray-600 mb-8" />
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