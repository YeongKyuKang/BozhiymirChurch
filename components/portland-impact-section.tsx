import { Users, Home, GraduationCap, Heart } from "lucide-react"

export default function PortlandImpactSection() {
  const stats = [
    {
      icon: Users,
      number: "47",
      label: "Ukrainian Children Supported",
      sublabel: "Підтримуваних дітей",
      color: "text-blue-600",
    },
    {
      icon: Home,
      number: "23",
      label: "Families in Portland",
      sublabel: "Сімей у Портленді",
      color: "text-yellow-600",
    },
    {
      icon: GraduationCap,
      number: "31",
      label: "Children in School",
      sublabel: "Дітей у школі",
      color: "text-green-600",
    },
    {
      icon: Heart,
      number: "∞",
      label: "Love & Hope Given",
      sublabel: "Любові та надії",
      color: "text-red-500",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-yellow-400">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Impact in Portland</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Together, we're building a brighter future for Ukrainian orphan children in the Pacific Northwest
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <IconComponent className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white font-semibold mb-1">{stat.label}</div>
                <div className="text-white/80 text-sm">{stat.sublabel}</div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">🌲 Portland's Ukrainian Children Community</h3>
            <p className="text-white/90 leading-relaxed">
              In the heart of Portland, Oregon, we've created a safe haven where Ukrainian orphan children can heal,
              learn, and thrive. From the Columbia River to Mount Hood, our community embraces these brave children with
              open arms, providing them with education, healthcare, and most importantly - a loving family environment.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
