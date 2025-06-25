import { ArrowRight, Church, Users, Calendar, Heart } from "lucide-react"
import Link from "next/link"

export default function FourColumnSection() {
  const sections = [
    {
      title: "WORSHIP & SERVICES",
      description: "Join us for inspiring worship, biblical teaching, and meaningful fellowship every Sunday.",
      href: "/worship",
      bgColor: "bg-gradient-to-br from-blue-600 to-blue-700",
      textColor: "text-white",
      icon: Church,
    },
    {
      title: "OUR MINISTRIES",
      description: "Discover ways to grow in faith through our various ministries for all ages and life stages.",
      href: "/ministries",
      bgColor: "bg-gradient-to-br from-blue-400 to-blue-500",
      textColor: "text-white",
      icon: Users,
    },
    {
      title: "CHURCH EVENTS",
      description: "Stay connected with community events, fellowship gatherings, and special celebrations.",
      href: "/events",
      bgColor: "bg-gradient-to-br from-green-400 to-green-500",
      textColor: "text-white",
      icon: Calendar,
    },
    {
      title: "GET CONNECTED",
      description: "Find your place in our church family through small groups, volunteering, and community service.",
      href: "/get-connected",
      bgColor: "bg-gradient-to-br from-yellow-400 to-yellow-500",
      textColor: "text-gray-900",
      icon: Heart,
    },
  ]

  return (
    <section className="grid md:grid-cols-2 lg:grid-cols-4">
      {sections.map((section, index) => {
        const IconComponent = section.icon
        return (
          <Link
            key={index}
            href={section.href}
            className={`${section.bgColor} ${section.textColor} p-8 lg:p-10 min-h-[300px] flex flex-col justify-between hover:scale-105 transition-all duration-300 group`}
          >
            <div>
              <IconComponent className="h-8 w-8 mb-6 opacity-90" />
              <h3 className="text-xl font-bold mb-4 tracking-wide">{section.title}</h3>
              <p className="text-sm leading-relaxed opacity-90">{section.description}</p>
            </div>
            <ArrowRight className="h-6 w-6 mt-6 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        )
      })}
    </section>
  )
}
