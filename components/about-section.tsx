import Image from "next/image"

export default function AboutSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">About Us</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              First Orlando is a community of believers committed to following Jesus and making a difference in our city
              and beyond. We believe that everyone has a place here, regardless of where you are in your faith journey.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our mission is to help people discover their purpose, connect with others, and make a lasting impact in
              the world around us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                Learn More About Us
              </button>
              <button className="border-2 border-black text-black px-6 py-3 rounded-full font-semibold hover:bg-black hover:text-white transition-colors">
                Our Beliefs
              </button>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/placeholder.svg?height=500&width=600"
              alt="Church pastor or leader"
              width={600}
              height={500}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
