import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Heart, Star } from "lucide-react"
import Link from "next/link"

export default function EventsPage() {
  const upcomingEvents = [
    {
      title: "Sunday Worship Service",
      date: "Every Sunday",
      time: "9:00 AM, 10:30 AM, 12:00 PM",
      location: "Main Sanctuary",
      description: "Join us for inspiring worship, biblical teaching, and community fellowship.",
      category: "Worship",
      recurring: true,
      icon: <Star className="h-6 w-6" />,
    },
    {
      title: "Ukrainian Children's Cultural Day",
      date: "January 15, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Fellowship Hall",
      description: "Celebrating Ukrainian culture with traditional food, music, and activities for children.",
      category: "Special Event",
      recurring: false,
      icon: <Heart className="h-6 w-6" />,
    },
    {
      title: "Family Bible Study",
      date: "Every Wednesday",
      time: "7:00 PM - 8:30 PM",
      location: "Room 201",
      description: "Deep dive into God's Word with discussion and prayer for the whole family.",
      category: "Bible Study",
      recurring: true,
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Youth Group Meeting",
      date: "Every Friday",
      time: "6:00 PM - 8:00 PM",
      location: "Youth Center",
      description: "Fun activities, games, and spiritual growth for teenagers.",
      category: "Youth",
      recurring: true,
      icon: <Star className="h-6 w-6" />,
    },
    {
      title: "Community Outreach Day",
      date: "January 20, 2025",
      time: "9:00 AM - 3:00 PM",
      location: "Various Locations",
      description: "Serving our Portland community with food distribution and neighborhood cleanup.",
      category: "Outreach",
      recurring: false,
      icon: <Heart className="h-6 w-6" />,
    },
    {
      title: "Ukrainian Language Class",
      date: "Every Saturday",
      time: "10:00 AM - 11:30 AM",
      location: "Classroom A",
      description: "Learn basic Ukrainian to better connect with our Ukrainian children and families.",
      category: "Education",
      recurring: true,
      icon: <Users className="h-6 w-6" />,
    },
  ]

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Space */}
      <div className="h-20"></div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Church <span className="text-blue-600">Events</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join us for worship, fellowship, and community events. There's always something happening at Bozhiymir
            Church for every age and interest.
          </p>
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors hover:opacity-80 ${category.color}`}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      {event.icon}
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
        </div>
      </section>

      {/* Special Ukrainian Events */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-yellow-400 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Ukrainian Ministry Events</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🇺🇦</div>
                <h3 className="text-xl font-bold mb-2">Monthly Cultural Celebrations</h3>
                <p className="opacity-90 mb-4">
                  Join us for Ukrainian cultural events featuring traditional food, music, and activities.
                </p>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  View Calendar
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-xl font-bold mb-2">Host Family Gatherings</h3>
                <p className="opacity-90 mb-4">
                  Special events for host families and Ukrainian children to connect and share experiences.
                </p>
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Event Information</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">All Welcome</h3>
                <p className="text-gray-600">
                  All our events are open to everyone, regardless of background or church membership.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Family Friendly</h3>
                <p className="text-gray-600">
                  Most events are designed for families and include activities for children of all ages.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Easy to Find</h3>
                <p className="text-gray-600">
                  All events are held at our church campus with clear directions and parking available.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 text-center bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Don't Miss Out!</h2>
          <p className="text-xl text-gray-600 mb-8">
            Stay connected with all our events and activities. Join our church family today!
          </p>
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
  )
}
