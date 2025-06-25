import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Home, BookOpen, Utensils, Shirt } from "lucide-react"
import Link from "next/link"

export default function UkrainianMinistryPage() {
  const programs = [
    {
      icon: <Home className="h-8 w-8 text-blue-600" />,
      title: "Host Family Program",
      description: "Connecting Ukrainian children with loving Portland families who provide temporary homes and care.",
      stats: "25 Host Families",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-600" />,
      title: "Education Support",
      description: "Helping children enroll in local schools and providing tutoring in English and other subjects.",
      stats: "47 Children in School",
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Emotional Care",
      description: "Providing counseling, trauma support, and creating safe spaces for healing and growth.",
      stats: "Weekly Support Groups",
    },
    {
      icon: <Utensils className="h-8 w-8 text-orange-600" />,
      title: "Basic Needs",
      description: "Ensuring children have food, clothing, medical care, and other essential necessities.",
      stats: "100% Needs Met",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Cultural Connection",
      description: "Helping children maintain their Ukrainian heritage while adapting to American culture.",
      stats: "Monthly Cultural Events",
    },
    {
      icon: <Shirt className="h-8 w-8 text-pink-600" />,
      title: "Clothing & Supplies",
      description: "Providing clothing, school supplies, and personal items for growing children.",
      stats: "Ongoing Support",
    },
  ]

  const testimonials = [
    {
      name: "Maria K.",
      role: "Host Mother",
      quote: "Taking in Anya has blessed our family more than we ever imagined. She's brought so much joy to our home.",
      flag: "🇺🇸",
    },
    {
      name: "Oleksandr",
      role: "Age 12",
      quote: "I love my new school and friends. The church family makes me feel safe and loved.",
      flag: "🇺🇦",
    },
    {
      name: "Pastor Sarah",
      role: "Ministry Leader",
      quote: "Watching these children heal and thrive reminds us daily of God's faithfulness and love.",
      flag: "⛪",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Space */}
      <div className="h-20"></div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="text-6xl mb-6">🇺🇦</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Ukrainian <span className="text-blue-600">Children Ministry</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            In response to the Ukrainian crisis, Bozhiymir Church has opened our hearts and doors to provide love, care,
            and hope to Ukrainian orphan children in Portland.
          </p>
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-yellow-400 text-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">47</div>
              <div className="text-lg opacity-90">Ukrainian Children</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25</div>
              <div className="text-lg opacity-90">Host Families</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">8</div>
              <div className="text-lg opacity-90">Countries Represented</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-lg opacity-90">Children in School</div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Programs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-600">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {program.icon}
                    <h3 className="text-xl font-bold text-gray-900 ml-3">{program.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">{program.description}</p>
                  <div className="bg-blue-50 px-3 py-2 rounded-lg">
                    <span className="text-blue-800 font-semibold text-sm">{program.stats}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Biblical Foundation */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Biblical Foundation</h2>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <blockquote className="text-2xl italic text-gray-700 mb-6">
                "Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows in
                their distress and to keep oneself from being polluted by the world."
              </blockquote>
              <p className="text-xl text-blue-600 font-semibold">James 1:27</p>
              <div className="mt-6 text-gray-600">
                <p>
                  This verse guides our Ukrainian children ministry. We believe caring for orphans is not just good
                  work—it's pure religion that pleases God's heart.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Stories of Hope</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{testimonial.flag}</div>
                  <blockquote className="text-gray-600 italic mb-4">"{testimonial.quote}"</blockquote>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Help */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">How You Can Help</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <Heart className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-xl font-bold mb-2">Become a Host Family</h3>
              <p className="opacity-90">Open your home and heart to a Ukrainian child in need.</p>
            </div>
            <div>
              <Users className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-xl font-bold mb-2">Volunteer</h3>
              <p className="opacity-90">Help with tutoring, transportation, or special events.</p>
            </div>
            <div>
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-xl font-bold mb-2">Donate</h3>
              <p className="opacity-90">Support with clothing, school supplies, or financial gifts.</p>
            </div>
          </div>
          <Button asChild size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
            <Link href="/join">Get Involved Today</Link>
          </Button>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Learn More</h2>
          <p className="text-xl text-gray-600 mb-8">
            Interested in supporting our Ukrainian children ministry? We'd love to talk with you.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="mailto:ukrainian@bozhiymirchurch.com">Contact Ministry Team</Link>
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
