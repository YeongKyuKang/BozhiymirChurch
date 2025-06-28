"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Heart, Star } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import EditableText from "@/components/editable-text"

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  category: string
  recurring: boolean
  icon: string
}

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: true })
      
    if (error) {
      console.error("Error fetching events:", error)
    } else {
      setUpcomingEvents(data || [])
    }
    setLoading(false)
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Heart": return <Heart className="h-6 w-6" />
      case "Users": return <Users className="h-6 w-6" />
      case "Star": return <Star className="h-6 w-6" />
      default: return null
    }
  }

  const categories = [
    { name: "All Events", color: "bg-gray-100 text-gray-800" },
    { name: "Worship", color: "bg-blue-100 text-blue-800" },
    { name: "Special Event", color: "bg-yellow-100 text-yellow-800" },
    { name: "Bible Study", color: "bg-green-100 text-green-800" },
    { name: "Youth", color: "bg-purple-100 text-purple-800" },
    { name: "Outreach", color: "bg-red-100 text-red-800" },
    { name: "Education", color: "bg-orange-100 text-orange-800" },
  ]

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.name === category)
    return cat ? cat.color : "bg-gray-100 text-gray-800"
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header Space */}
        <div className="h-20"></div>

        {/* Hero Section */}
        <section className="py-16 px-4 pt-32">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <EditableText
                  page="events"
                  section="main"
                  contentKey="title"
                  tag="span"
                  className="text-5xl font-bold text-gray-900"
              />
              <span className="text-blue-600">Events</span>
            </h1>
            <EditableText
                page="events"
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

        {/* Category Filter */}
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors hover:opacity-80 ${getCategoryColor(category.name)}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-8 px-4">
          <div className="container mx-auto">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="h-full">
                    <CardContent className="p-0">
                      <Skeleton className="h-40 w-full rounded-t-lg" />
                      <div className="p-6 space-y-3">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-10 w-full mt-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event, index) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                          {getIconComponent(event.icon)}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}
                          >
                            {event.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        {event.recurring && (
                          <span className="inline-block bg-yellow-400 text-blue-900 px-2 py-1 rounded text-xs font-medium">
                            Recurring
                          </span>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-3 text-blue-600" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-3 text-blue-600" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-3 text-blue-600" />
                            <span>{event.location}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Learn More</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Special Ukrainian Events */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-yellow-400 text-white">
          <div className="container mx-auto text-center">
            <EditableText
              page="events"
              section="special_ministry"
              contentKey="title"
              tag="h2"
              className="text-3xl font-bold mb-8"
            />
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🇺🇦</div>
                  <EditableText
                      page="events"
                      section="special_ministry"
                      contentKey="card1_title"
                      tag="h3"
                      className="text-xl font-bold mb-2"
                  />
                  <EditableText
                      page="events"
                      section="special_ministry"
                      contentKey="card1_description"
                      tag="p"
                      className="opacity-90 mb-4"
                  />
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    View Calendar
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                  <EditableText
                      page="events"
                      section="special_ministry"
                      contentKey="card2_title"
                      tag="h3"
                      className="text-xl font-bold mb-2"
                  />
                  <EditableText
                      page="events"
                      section="special_ministry"
                      contentKey="card2_description"
                      tag="p"
                      className="opacity-90 mb-4"
                  />
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    Join Us
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Event Guidelines */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <EditableText
              page="events"
              section="guidelines"
              contentKey="title"
              tag="h2"
              className="text-3xl font-bold text-center text-gray-900 mb-12"
            />
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <EditableText page="events" section="guidelines" contentKey="card1_title" tag="h3" className="text-xl font-bold text-gray-900 mb-2" />
                  <EditableText page="events" section="guidelines" contentKey="card1_description" tag="p" className="text-gray-600" />
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <EditableText page="events" section="guidelines" contentKey="card2_title" tag="h3" className="text-xl font-bold text-gray-900 mb-2" />
                  <EditableText page="events" section="guidelines" contentKey="card2_description" tag="p" className="text-gray-600" />
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <EditableText page="events" section="guidelines" contentKey="card3_title" tag="h3" className="text-xl font-bold text-gray-900 mb-2" />
                  <EditableText page="events" section="guidelines" contentKey="card3_description" tag="p" className="text-gray-600" />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 text-center bg-gray-50">
          <div className="container mx-auto">
            <EditableText page="events" section="cta" contentKey="title" tag="h2" className="text-3xl font-bold text-gray-900 mb-6" />
            <EditableText page="events" section="cta" contentKey="description" tag="p" className="text-xl text-gray-600 mb-8" />
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/join">Join Our Church</Link>
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