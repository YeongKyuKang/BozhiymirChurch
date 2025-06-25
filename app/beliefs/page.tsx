import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Book, Cross, Users, Globe, DotIcon as Dove } from "lucide-react"
import Link from "next/link"

export default function BeliefsPage() {
  const beliefs = [
    {
      icon: <Book className="h-8 w-8 text-blue-600" />,
      title: "The Bible",
      description:
        "We believe the Bible is the inspired, infallible Word of God and our ultimate authority for faith and life.",
    },
    {
      icon: <Cross className="h-8 w-8 text-red-600" />,
      title: "Jesus Christ",
      description:
        "We believe Jesus Christ is the Son of God, who died for our sins and rose again, offering salvation to all who believe.",
    },
    {
      icon: <Dove className="h-8 w-8 text-green-600" />,
      title: "Holy Spirit",
      description:
        "We believe in the Holy Spirit who guides, comforts, and empowers believers in their daily walk with God.",
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-600" />,
      title: "Love & Compassion",
      description:
        "We believe in showing God's love through caring for orphans, refugees, and those in need, especially Ukrainian children.",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Community",
      description:
        "We believe in the importance of Christian fellowship and building a diverse, welcoming church family.",
    },
    {
      icon: <Globe className="h-8 w-8 text-orange-600" />,
      title: "Mission",
      description: "We believe in sharing the Gospel locally and globally, serving our Portland community and beyond.",
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
            Our <span className="text-blue-600">Beliefs</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            At Bozhiymir Church, our faith is built on the solid foundation of God's Word. These core beliefs guide
            everything we do as a church family.
          </p>
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Beliefs Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beliefs.map((belief, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-600">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {belief.icon}
                    <h3 className="text-xl font-bold text-gray-900 ml-3">{belief.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{belief.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Scripture Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Foundation Scripture</h2>
          <blockquote className="text-2xl italic mb-6 max-w-4xl mx-auto">
            "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish
            but have eternal life."
          </blockquote>
          <p className="text-xl opacity-90">John 3:16</p>
        </div>
      </section>

      {/* Ukrainian Ministry Connection */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-blue-500 to-yellow-400 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Living Our Beliefs</h2>
              <p className="text-xl mb-6 opacity-90">
                Our care for Ukrainian orphan children reflects our belief in God's heart for the vulnerable and our
                call to love our neighbors.
              </p>
              <div className="flex justify-center space-x-4">
                <span className="text-2xl">🇺🇦</span>
                <span className="text-2xl">❤️</span>
                <span className="text-2xl">🙏</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Want to Learn More?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join us for worship and discover how these beliefs come alive in our church community.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/join">Visit Us</Link>
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
