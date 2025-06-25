import { Users, Baby, Globe, Music, Heart, BookOpen } from "lucide-react"

export default function MinistriesShowcase() {
  const ministries = [
    {
      icon: Users,
      title: "Adult Ministry",
      description: "Bible studies, prayer groups, and fellowship",
      color: "bg-blue-600",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: Baby,
      title: "Kids & Youth",
      description: "Fun programs for children and teenagers",
      color: "bg-green-600",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: Globe,
      title: "Ukrainian Children",
      description: "Special ministry for Ukrainian orphan children 🇺🇦",
      color: "bg-gradient-to-r from-blue-500 to-yellow-400",
      image: "/placeholder.svg?height=200&width=300",
      special: true,
    },
    {
      icon: Music,
      title: "Worship & Arts",
      description: "Choir, worship team, and creative ministries",
      color: "bg-purple-600",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: Heart,
      title: "Community Outreach",
      description: "Serving Portland with love and compassion",
      color: "bg-red-600",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      icon: BookOpen,
      title: "Small Groups",
      description: "Connect deeper through small group studies",
      color: "bg-indigo-600",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Ministries</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At Boshmir Church, we believe everyone has a place to serve, grow, and make a difference. Discover where you
            belong in our church family.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ministries.map((ministry, index) => {
            const IconComponent = ministry.icon
            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group ${
                  ministry.special ? "ring-2 ring-yellow-400 ring-offset-2" : ""
                }`}
              >
                {/* Background Image */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <div className={`absolute inset-0 ${ministry.color} opacity-90`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <IconComponent className="h-16 w-16 text-white" />
                  </div>
                  {ministry.special && <div className="absolute top-3 right-3 text-2xl">🇺🇦</div>}
                </div>

                {/* Content */}
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{ministry.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{ministry.description}</p>

                  <div className="mt-4">
                    <button className="text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors">
                      Learn More →
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Special Ukrainian Ministry Highlight */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl p-8 border border-blue-200">
          <div className="text-center">
            <div className="text-3xl mb-4">🇺🇦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ukrainian Children Ministry</h3>
            <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Our church family has embraced Ukrainian orphan children who have found refuge in Portland. Through love,
              care, and community support, we're helping these brave children heal and build new lives filled with hope
              and opportunity.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors">
                Support This Ministry
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-colors">
                Meet the Children
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
