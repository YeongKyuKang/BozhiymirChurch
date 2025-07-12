import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-6">
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
            </div>
            <p className="text-gray-400 mt-3 text-sm leading-relaxed">
              A welcoming community where families grow together in faith and fellowship.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-base mb-3">Quick Links</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/leadership" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Leadership
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Join Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-base mb-3">Contact Info</h4>
            <div className="space-y-2">
              <div className="flex items-start text-gray-400">
                <MapPin className="h-3 w-3 mr-2 mt-1 flex-shrink-0" />
                <span className="text-sm">
                  123 Community Street
                  <br />
                  Portland, OR 97201
                </span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="h-3 w-3 mr-2" />
                <span className="text-sm">(503) 555-0123</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="h-3 w-3 mr-2" />
                <span className="text-sm">info@bozhiymirchurch.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-base mb-3">Service Times</h4>
            <div className="space-y-1 text-gray-400">
              <div className="flex items-start">
                <Clock className="h-3 w-3 mr-2 mt-1" />
                <div className="text-sm">
                  <p>Sunday: 9:00 AM, 10:30 AM, 12:00 PM</p>
                  <p>Wednesday: 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400">
          <p className="text-sm">&copy; {new Date().getFullYear()} Bozhiymir Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
