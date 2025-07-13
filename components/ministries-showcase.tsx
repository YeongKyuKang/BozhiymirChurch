import { Button } from "@/components/ui/button"
import { Church, Heart, Users, Globe } from "lucide-react"
import Link from "next/link"

export default function MinistriesShowcase() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Ministries</h2>
        <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
          Discover the various ways we serve God and our community, both locally and globally.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white/10 p-8 rounded-xl shadow-lg border border-blue-500/30 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
            <Church className="h-12 w-12 text-yellow-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-4">Worship & Teaching</h3>
            <p className="text-blue-100 leading-relaxed">
              Engage in inspiring worship and deep biblical teaching every week.
            </p>
          </div>
          <div className="bg-white/10 p-8 rounded-xl shadow-lg border border-blue-500/30 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
            <Heart className="h-12 w-12 text-yellow-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-4">Community Outreach</h3>
            <p className="text-blue-100 leading-relaxed">
              Serve our local community through various outreach programs and events.
            </p>
          </div>
          <div className="bg-white/10 p-8 rounded-xl shadow-lg border border-blue-500/30 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
            <Users className="h-12 w-12 text-yellow-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-4">Family & Youth</h3>
            <p className="text-blue-100 leading-relaxed">
              Programs designed to nurture faith in children, youth, and families.
            </p>
          </div>
          <div className="bg-white/10 p-8 rounded-xl shadow-lg border border-blue-500/30 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
            <Globe className="h-12 w-12 text-yellow-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-4">Global Missions</h3>
            <p className="text-blue-100 leading-relaxed">
              Support our missionaries and global initiatives spreading the Gospel worldwide.
            </p>
          </div>
        </div>

        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-blue-900 font-bold px-10 py-4 text-xl rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <Link href="/ukrainian-ministry">Explore All Ministries</Link>
        </Button>
      </div>
    </section>
  )
}
