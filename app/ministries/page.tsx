import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, BookOpen, Music, Baby, Globe, Utensils, Shirt } from "lucide-react"
import Link from "next/link"

export default function MinistriesPage() {
  const ministries = [
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Ukrainian Children Ministry",
      description:
        "Our flagship ministry supporting 47 Ukrainian orphan children through host families, education, and emotional care.",
      features: ["Host Family Program", "Education Support", "Trauma Counseling", "Cultural Events"],
      contact: "ukrainian@bozhiymirchurch.com",
      highlight: true,
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Adult Ministry",
      description: "Bible studies, prayer groups, and fellowship opportunities for adults of all ages and backgrounds.",
      features: ["Weekly Bible Study", "Prayer Groups", "Men's & Women's Groups", "Marriage Ministry"],
      contact: "adults@bozhiymirchurch.com",
      highlight: false,
    },
    {
      icon: <Baby className="h-8 w-8 text-pink-600" />,
      title: "Children's Ministry",
      description: "Fun, engaging programs for children from nursery through elementary school with biblical teaching.",
      features: ["Sunday School", "VBS", "Children's Choir", "Family Events"],
      contact: "children@bozhiymirchurch.com",
      highlight: false,
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-600" />,
      title: "Youth Ministry",
      description: "Dynamic programs for teenagers including Bible study, community service, and fun activities.",
      features: ["Friday Youth Group", "Summer Camps", "Mission Trips", "Leadership Training"],
      contact: "youth@bozhiymirchurch.com",
      highlight: false,
    },
    {
      icon: <Music className="h-8 w-8 text-purple-600" />,
      title: "Worship & Music",
      description: "Multiple worship teams and choirs that lead our congregation in praising God through music.",
      features: ["Adult Choir", "Worship Team", "Children's Choir", "Special Music"],
      contact: "music@bozhiymirchurch.com",
      highlight: false,
    },
    {
      icon: <Globe className="h-8 w-8 text-orange-600" />,
      title: "Community Outreach",
      description:
        "Serving our Portland community through food distribution, neighborhood cleanup, and social services.",
      features: ["Food Bank", "Community Cleanup", "Homeless Ministry", "Senior Care"],
      contact: "outreach@bozhiymirchurch.com",
      highlight: false,
    },
    {
      icon: <Utensils className="h-8 w-8 text-yellow-600" />,
      title: "Fellowship & Events",
      description: "Building community through shared meals, special events, and social gatherings.",
      features: ["Monthly Potlucks", "Holiday Celebrations", "Game Nights", "Cultural Events"],
      contact: "fellowship@bozhiymirchurch.com",
      highlight: false,
    },
    {
      icon: <Shirt className="h-8 w-8 text-teal-600" />,
      title: "Benevolence Ministry",
      description: "Providing practical assistance to families in need with clothing, food, and emergency support.",
      features: ["Clothing Closet", "Emergency Assistance", "Utility Help", "Transportation"],
      contact: "benevolence@bozhiymirchurch.com",
      highlight: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Space */}
      <div className="h-20"></div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-blue-600">Ministries</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            At Bozhiymir Church, we believe everyone has a place to serve and grow. Discover the many ways you can get
            involved and make a difference in our community.
          </p>
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Featured Ministry - Ukrainian Children */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-blue-500 to-yellow-400 text-white overflow-hidden mb-16">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-4">
                    <Heart className="h-10 w-10 mr-4" />
                    <h2 className="text-3xl font-bold">Featured Ministry</h2>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Ukrainian Children Ministry</h3>
                  <p className="text-xl mb-6 opacity-90">
                    Our heart and passion - caring for 47 Ukrainian orphan children through loving host families and
                    comprehensive support programs.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center mb-6">
                    <div>
                      <div className="text-3xl font-bold">47</div>
                      <div className="text-sm opacity-90">Children Supported</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">25</div>
                      <div className="text-sm opacity-90">Host Families</div>
                    </div>
                  </div>
                  <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    <Link href="/ukrainian-ministry">Learn More</Link>
                  </Button>
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

      {/* All Ministries Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">All Our Ministries</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((ministry, index) => (
              <Card
                key={index}
                className={`hover:shadow-lg transition-shadow duration-300 ${ministry.highlight ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {ministry.icon}
                    <h3 className="text-xl font-bold text-gray-900 ml-3">{ministry.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">{ministry.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">What We Offer:</h4>
                    <ul className="space-y-1">
                      {ministry.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Involved</Button>
                    <div className="text-center">
                      <a href={`mailto:${ministry.contact}`} className="text-sm text-blue-600 hover:underline">
                        {ministry.contact}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ministry Values */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Ministry Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Love</h3>
              <p className="text-gray-600">Every ministry is rooted in Christ's love for all people.</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">Building authentic relationships and welcoming everyone.</p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Service</h3>
              <p className="text-gray-600">Serving others as Jesus served, with humility and joy.</p>
            </div>
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Growth</h3>
              <p className="text-gray-600">Helping everyone grow in their faith and spiritual gifts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Serve?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            God has given each of us unique gifts and talents. Find your place to serve and make a difference in our
            church and community.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="text-4xl mb-4">🙋‍♀️</div>
              <h3 className="text-xl font-bold mb-2">New Volunteers</h3>
              <p className="opacity-90">Never volunteered before? We'll help you find the perfect fit!</p>
            </div>
            <div>
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-bold mb-2">Flexible Scheduling</h3>
              <p className="opacity-90">Serve on your schedule with opportunities that fit your life.</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">Team Support</h3>
              <p className="opacity-90">Join a team of caring volunteers who support each other.</p>
            </div>
          </div>
          <Button asChild size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
            <Link href="/join">Start Volunteering</Link>
          </Button>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Find Your Ministry</h2>
          <p className="text-xl text-gray-600 mb-8">
            Whether you're looking to serve, grow, or connect, there's a place for you at Bozhiymir Church.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/join">Get Connected</Link>
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
