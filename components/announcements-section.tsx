import { Bell, Info, Heart, Star } from "lucide-react"

export default function AnnouncementsSection() {
  const announcements = [
    {
      id: 1,
      type: "important",
      icon: Bell,
      title: "Holiday Schedule Changes",
      message: "Please note our modified schedule during the holiday season. Check the events board for details.",
      date: "December 20, 2024",
    },
    {
      id: 2,
      type: "info",
      icon: Info,
      title: "New Kids Program Starting",
      message: "We're excited to announce a new after-school program for children ages 6-10 starting in January.",
      date: "December 18, 2024",
    },
    {
      id: 3,
      type: "community",
      icon: Heart,
      title: "Thank You Volunteers!",
      message: "A huge thank you to all volunteers who helped with our recent community outreach event.",
      date: "December 15, 2024",
    },
    {
      id: 4,
      type: "celebration",
      icon: Star,
      title: "Congratulations!",
      message: "Congratulations to the Johnson family on the birth of their new baby girl, Emma!",
      date: "December 12, 2024",
    },
  ]

  const getAnnouncementStyle = (type: string) => {
    switch (type) {
      case "important":
        return "border-l-red-500 bg-red-50"
      case "info":
        return "border-l-blue-500 bg-blue-50"
      case "community":
        return "border-l-green-500 bg-green-50"
      case "celebration":
        return "border-l-yellow-500 bg-yellow-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "important":
        return "text-red-500"
      case "info":
        return "text-blue-500"
      case "community":
        return "text-green-500"
      case "celebration":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Church Announcements</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest news and updates from our church community.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {announcements.map((announcement) => {
            const IconComponent = announcement.icon
            return (
              <div
                key={announcement.id}
                className={`border-l-4 p-6 rounded-r-lg ${getAnnouncementStyle(announcement.type)}`}
              >
                <div className="flex items-start space-x-4">
                  <IconComponent className={`h-6 w-6 mt-1 ${getIconColor(announcement.type)}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{announcement.title}</h3>
                      <span className="text-sm text-gray-500">{announcement.date}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{announcement.message}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
