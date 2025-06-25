import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Users, Heart, Home, Globe } from "lucide-react"

export default function CommunitySection() {
  const communityStats = [
    {
      icon: Users,
      number: "200+",
      label: "Church Members",
      color: "text-blue-600",
    },
    {
      icon: Heart,
      number: "47",
      label: "Ukrainian Children",
      color: "text-yellow-600",
    },
    {
      icon: Home,
      number: "25",
      label: "Host Families",
      color: "text-green-600",
    },
    {
      icon: Globe,
      number: "8",
      label: "Countries Represented",
      color: "text-purple-600",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Image
              src="/placeholder.svg?height=600&width=500&text=Community+Photo"
              alt="Bozhiymir Church Community"
              width={500}
              height={600}
              className="rounded-lg shadow-xl"
            />
            {/* Ukrainian flag accent */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-b from-blue-500 to-yellow-400 rounded-full shadow-lg"></div>

            {/* Community stats overlay */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-4 border-2 border-blue-100">
              <div className="grid grid-cols-2 gap-4">
                {communityStats.map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={index} className="text-center">
                      <IconComponent className={`h-6 w-6 mx-auto mb-1 ${stat.color}`} />
                      <div className="text-lg font-bold text-gray-900">{stat.number}</div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Our Community</h2>
              <h3 className="text-2xl font-semibold text-blue-600 mb-6">A Family United by Faith and Love</h3>
            </div>

            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Bozhiymir Church is more than a place of worship—we're a diverse, loving family that spans cultures,
                languages, and backgrounds. Our community has grown stronger through welcoming Ukrainian families and
                children who have found refuge in Portland.
              </p>
              <p>
                From our traditional Sunday services to our vibrant children's programs, every person who walks through
                our doors becomes part of something beautiful. We believe that God's love knows no borders, and our
                community reflects that truth every day.
              </p>
              <p className="text-blue-600 font-medium">
                "There is neither Jew nor Gentile, neither slave nor free, nor is there male and female, for you are all
                one in Christ Jesus." - Galatians 3:28
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg p-6 border border-blue-200">
              <h4 className="text-xl font-bold text-gray-900 mb-3">🇺🇦 Our Ukrainian Ministry</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                We've opened our hearts and homes to Ukrainian orphan children, providing them with not just shelter,
                but a loving church family. Through host families, educational support, and community care, we're
                helping these brave children heal and build new lives filled with hope.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold">
                Join Our Community
              </Button>
              <Button
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-full font-semibold"
              >
                Visit This Sunday
              </Button>
            </div>
          </div>
        </div>

        {/* Community Highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-3xl mb-4">🤝</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Welcoming Spirit</h4>
            <p className="text-gray-600 text-sm">
              Every person is welcomed with open arms, regardless of background, language, or life circumstances.
            </p>
          </div>

          <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="text-3xl mb-4">🌍</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Global Family</h4>
            <p className="text-gray-600 text-sm">
              Our community represents multiple countries and cultures, creating a rich tapestry of faith and
              fellowship.
            </p>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
            <div className="text-3xl mb-4">💝</div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Caring Support</h4>
            <p className="text-gray-600 text-sm">
              From practical needs to emotional support, our community rallies around each member with Christ's love.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
