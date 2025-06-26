import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Globe, Star, Church } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function StoryPage() {
  const timeline = [
    {
      year: "2010",
      title: "Church Founded",
      description: "Bozhiymir Church was established in Portland with a vision to serve the diverse community.",
      icon: <Church className="h-6 w-6" />,
    },
    {
      year: "2015",
      title: "Community Growth",
      description: "Our congregation grew to over 100 members, representing 12 different countries.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      year: "2018",
      title: "Youth Ministry Launch",
      description: "Started dedicated programs for children and teenagers in our community.",
      icon: <Star className="h-6 w-6" />,
    },
    {
      year: "2022",
      title: "Ukrainian Ministry Begins",
      description: "In response to the Ukrainian crisis, we began our ministry to support Ukrainian orphan children.",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      year: "2024",
      title: "Expanding Impact",
      description: "Now supporting 47 Ukrainian children and 25 host families in the Portland area.",
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
              Our <span className="text-blue-600">Story</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              From humble beginnings to a thriving community church, discover how God has been faithful in building
              Bozhiymir Church into a beacon of hope in Portland.
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
            <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
            <blockquote className="text-2xl italic mb-6 max-w-4xl mx-auto">
              "To be a loving church family that welcomes all people, shares the Gospel of Jesus Christ, and serves our
              community with special care for the vulnerable, including Ukrainian orphan children."
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
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Journey</h2>
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
                      <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Love</h3>
                  <p className="text-gray-600">Showing Christ's love to all people, especially the vulnerable.</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Community</h3>
                  <p className="text-gray-600">Building authentic relationships and welcoming all backgrounds.</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Globe className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Service</h3>
                  <p className="text-gray-600">Serving locally and globally with hands-on compassion.</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Hope</h3>
                  <p className="text-gray-600">Bringing hope through the Gospel and practical care.</p>
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
                    <h2 className="text-3xl font-bold mb-4">A Special Calling</h2>
                    <p className="text-xl mb-6 opacity-90">
                      When the Ukrainian crisis began, God placed a special burden on our hearts for Ukrainian orphan
                      children. Today, this ministry is central to who we are as Bozhiymir Church.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold">47</div>
                        <div className="text-sm opacity-90">Children Supported</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold">25</div>
                        <div className="text-sm opacity-90">Host Families</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-8xl mb-4">🇺🇦</div>
                    <p className="text-lg opacity-90">
                      "Religion that God our Father accepts as pure and faultless is this: to look after orphans and
                      widows in their distress." - James 1:27
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Be Part of Our Story</h2>
            <p className="text-xl text-gray-600 mb-8">
              God is still writing the story of Bozhiymir Church. We'd love for you to be part of the next chapter.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/join">Join Our Family</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/ukrainian-ministry">Learn About Our Ministry</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
