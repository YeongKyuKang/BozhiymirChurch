import { Users, Baby, Globe, Music } from "lucide-react"

export default function MinistriesHighlight() {
  const ministries = [
    {
      icon: Users,
      title: "Adult Ministry",
      description: "Bible studies, prayer groups, and fellowship for adults of all ages.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Baby,
      title: "Children & Youth",
      description: "Fun, safe programs for kids and teens to grow in faith and friendship.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Globe,
      title: "Ukrainian Children Ministry",
      description: "Supporting Ukrainian orphan children with love, care, and community in Portland.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Music,
      title: "Worship & Music",
      description: "Join our choir, worship team, or music ministry to praise God through song.",
      color: "bg-purple-100 text-purple-600",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Church Ministries</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At Boshmir Church, we believe everyone has a place to serve, grow, and make a difference in our community
            and beyond.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ministries.map((ministry, index) => {
            const IconComponent = ministry.icon
            return (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-lg ${ministry.color} flex items-center justify-center mb-4`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{ministry.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{ministry.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-8 max-w-4xl mx-auto border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Special Ministry: Ukrainian Children</h3>
            <p className="text-gray-700 leading-relaxed">
              As part of our commitment to loving our neighbors, Boshmir Church has opened our hearts and doors to
              Ukrainian orphan children who have found refuge in Portland. Through this ministry, we provide support,
              care, and a loving church family to help these brave children heal and thrive in their new home.
            </p>
            <div className="mt-4 text-sm text-blue-600 font-medium">
              "Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows in
              their distress..." - James 1:27
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
