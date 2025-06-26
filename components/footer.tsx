import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 grid grid-cols-2 gap-1">
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <div>
            <span className="text-white font-bold text-xl tracking-wide">BOZHIYMIR</span>
            <div className="text-white/80 text-xs font-medium">CHURCH</div>
          </div>
        </div>
        <ul className="space-y-4"></ul>
        <p className="text-gray-400 mt-4">A welcoming community where families grow together in faith and fellowship.</p>
      </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about/leadership" className="text-gray-400 hover:text-white transition-colors">
                  Leadership
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/ministries" className="text-gray-400 hover:text-white transition-colors">
                  Ministries
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-gray-400 hover:text-white transition-colors">
                  Join Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  123 Community Street
                  <br />
                  Porland, OR 97201
                </span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">(503) 555-0123</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">info@bozhiymirchurch.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Service Times</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <div className="text-sm">
                  <p>Sunday: 9:00 AM, 10:30 AM, 12:00 PM</p>
                  <p>Wednesday: 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Bozhiymir Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
