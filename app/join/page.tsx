import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Clock, Phone, Mail, Users, Heart, Star } from "lucide-react"
import Link from "next/link"

export default function JoinPage() {
  const serviceInfo = [
    {
      time: "9:00 AM",
      style: "Traditional Service",
      description: "Classic hymns, choir, and traditional worship format",
      icon: <Star className="h-6 w-6" />,
    },
    {
      time: "10:30 AM",
      style: "Contemporary Service",
      description: "Modern worship music and casual atmosphere",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      time: "12:00 PM",
      style: "Family Service",
      description: "Family-friendly with children's activities",
      icon: <Users className="h-6 w-6" />,
    },
  ]

  const whatToExpect = [
    {
      title: "Warm Welcome",
      description: "Our greeters will welcome you and help you find your way around.",
      icon: "👋",
    },
    {
      title: "Inspiring Worship",
      description: "Experience meaningful worship through music and biblical teaching.",
      icon: "🎵",
    },
    {
      title: "Friendly Community",
      description: "Meet our diverse church family from many different backgrounds.",
      icon: "🤝",
    },
    {
      title: "Kids Programs",
      description: "Safe, fun programs for children during the service.",
      icon: "👶",
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
            <span className="text-blue-600">Join</span> Our Family
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We'd love to welcome you to Bozhiymir Church! Whether you're visiting for the first time or looking to
            become part of our church family, there's a place for you here.
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
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Sunday Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {serviceInfo.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <div className="text-blue-600 mb-4 flex justify-center">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.time}</h3>
                  <h4 className="text-lg font-semibold text-blue-600 mb-3">{service.style}</h4>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-lg text-gray-600 mb-4">All services held every Sunday</p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Plan Your Visit
            </Button>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What to Expect</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whatToExpect.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Visit Us</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      1234 Portland Avenue
                      <br />
                      Portland, OR 97201
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Service Times</h3>
                    <p className="text-gray-600">
                      Sunday: 9:00 AM, 10:30 AM, 12:00 PM
                      <br />
                      Wednesday Bible Study: 7:00 PM
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">(503) 555-0123</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">info@bozhiymirchurch.com</p>
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
          <h2 className="text-3xl font-bold mb-8">Special Ministry Opportunity</h2>
          <div className="max-w-4xl mx-auto">
            <div className="text-6xl mb-6">🇺🇦</div>
            <h3 className="text-2xl font-bold mb-4">Ukrainian Children Ministry</h3>
            <p className="text-xl mb-8 opacity-90">
              Join us in caring for Ukrainian orphan children in Portland. Whether through hosting, volunteering, or
              supporting, there are many ways to make a difference.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-3xl font-bold">47</div>
                <div className="opacity-90">Children Supported</div>
              </div>
              <div>
                <div className="text-3xl font-bold">25</div>
                <div className="opacity-90">Host Families</div>
              </div>
              <div>
                <div className="text-3xl font-bold">100%</div>
                <div className="opacity-90">In School</div>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Visit?</h2>
          <p className="text-xl text-gray-600 mb-8">
            We can't wait to meet you and welcome you into our church family. Come as you are - you belong here!
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
  )
}
