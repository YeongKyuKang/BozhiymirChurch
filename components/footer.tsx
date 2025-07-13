import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 border-t-4 border-yellow-500">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 grid grid-cols-2 gap-1">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div>
                <span className="text-white font-bold text-lg tracking-wide">BOZHIYMIR</span>
                <div className="text-white/80 text-xs font-medium">CHURCH</div>
              </div>
            <div>
                <span className="text-white font-bold text-xl tracking-wide">BOZHIYMIR</span>
                <div className="text-yellow-300 text-sm font-medium">CHURCH</div>
              </div>
            </div>
            <p className="text-blue-200 text-base leading-relaxed">
              A welcoming community where families grow together in faith and fellowship.
            </p>
            <div className="mt-4 text-2xl">🇺🇦</div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-yellow-300">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/leadership" className="text-blue-200 hover:text-yellow-300 transition-colors text-base">
                  Leadership
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-blue-200 hover:text-yellow-300 transition-colors text-base">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-blue-200 hover:text-yellow-300 transition-colors text-base">
                  Join Us
                </Link>
              </li>
              <li>
                <Link
                  href="/ukrainian-ministry"
                  className="text-blue-200 hover:text-yellow-300 transition-colors text-base"
                >
                  Ukrainian Ministry
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-yellow-300">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start text-blue-200">
                <MapPin className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-yellow-300" />
                <span className="text-base">
                  123 Community Street
                  <br />
                  Poland, OR 97201
                </span>
              </div>
              <div className="flex items-center text-blue-200">
                <Phone className="h-5 w-5 mr-3 text-yellow-300" />
                <span className="text-base">(503) 555-0123</span>
              </div>
              <div className="flex items-center text-blue-200">
                <Mail className="h-5 w-5 mr-3 text-yellow-300" />
                <span className="text-base">info@bozhiymirchurch.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-yellow-300">Service Times</h4>
            <div className="space-y-2 text-blue-200">
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 mt-1 text-yellow-300" />
                <div className="text-base">
                  <p>Sunday: 9:00 AM, 10:30 AM, 12:00 PM</p>
                  <p>Wednesday: 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-8 pt-8 text-center text-blue-300">
          <p className="text-base">&copy; {new Date().getFullYear()} Bozhiymir Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}