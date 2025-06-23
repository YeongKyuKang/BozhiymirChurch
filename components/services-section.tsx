export default function ServicesSection() {
  const services = [
    {
      title: "Sunday Services",
      time: "8:30AM, 10AM, 11:30AM",
      description: "Join us for worship, teaching, and community every Sunday morning.",
    },
    {
      title: "Online Experience",
      time: "Live & On-Demand",
      description: "Can't make it in person? Join us online from anywhere in the world.",
    },
    {
      title: "Kids Ministry",
      time: "During Services",
      description: "Safe, fun, and engaging programs for children of all ages.",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Service Times</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer multiple service times to accommodate your schedule and worship preferences.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-lg font-semibold text-gray-700 mb-4">{service.time}</p>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
