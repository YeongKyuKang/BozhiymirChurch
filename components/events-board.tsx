import { Calendar, Clock, MapPin, Users } from "lucide-react"

export default function EventsBoard() {
  const events = [
    {
      id: 1,
      title: "Sunday Family Service",
      date: "Every Sunday",
      time: "10:00 AM",
      location: "Main Sanctuary",
      description: "Join us for worship, fellowship, and community every Sunday morning.",
      category: "Weekly",
      attendees: "All Ages",
    },
    {
      id: 2,
      title: "Youth Group Meeting",
      date: "December 28, 2024",
      time: "6:00 PM",
      location: "Youth Hall",
      description: "Fun activities, games, and discussions for teenagers.",
      category: "Youth",
      attendees: "Ages 13-18",
    },
    {
      id: 3,
      title: "Kids Christmas Party",
      date: "December 30, 2024",
      time: "3:00 PM",
      location: "Fellowship Hall",
      description: "Special Christmas celebration with games, snacks, and gifts for children.",
      category: "Kids",
      attendees: "Ages 5-12",
    },
    {
      id: 4,
      title: "New Year Prayer Service",
      date: "December 31, 2024",
      time: "11:00 PM",
      location: "Main Sanctuary",
      description: "Welcome the new year with prayer, reflection, and community.",
      category: "Special",
      attendees: "All Ages",
    },
    {
      id: 5,
      title: "Community Food Drive",
      date: "January 5, 2025",
      time: "9:00 AM",
      location: "Church Parking Lot",
      description: "Help us collect food donations for local families in need.",
      category: "Community",
      attendees: "Volunteers Needed",
    },
    {
      id: 6,
      title: "Bible Study Group",
      date: "Every Wednesday",
      time: "7:00 PM",
      location: "Conference Room",
      description: "Weekly Bible study and discussion group for adults.",
      category: "Weekly",
      attendees: "Adults",
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Weekly":
        return "bg-blue-100 text-blue-800"
      case "Youth":
        return "bg-green-100 text-green-800"
      case "Kids":
        return "bg-yellow-100 text-yellow-800"
      case "Special":
        return "bg-purple-100 text-purple-800"
      case "Community":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Church Events & Activities</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay connected with our community through upcoming events and regular activities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(event.category)}`}>
                  {event.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">{event.attendees}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
