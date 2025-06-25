import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function PastorSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Image
              src="/placeholder.svg?height=600&width=500"
              alt="Pastor of Bozhiymir Church"
              width={500}
              height={600}
              className="rounded-lg shadow-xl"
            />
            {/* Ukrainian flag accent */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-b from-blue-500 to-yellow-400 rounded-full shadow-lg"></div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Pastor</h2>
              <h3 className="text-2xl font-semibold text-blue-600 mb-6">Rev. [Pastor Name]</h3>
            </div>

            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Welcome to Bozhiymir Church! I'm passionate about building a community where every person feels loved,
                valued, and connected to God's purpose for their life.
              </p>
              <p>
                Our church has been blessed to open our hearts and doors to Ukrainian families and children who have
                found refuge in Portland. Through God's love, we're creating a safe haven where healing, hope, and new
                beginnings flourish.
              </p>
              <p className="text-blue-600 font-medium">
                "He defends the cause of the fatherless and the widow, and loves the foreigner residing among you,
                giving them food and clothing." - Deuteronomy 10:18
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold">
                Meet Our Team
              </Button>
              <Button
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-full font-semibold"
              >
                Our Story
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
