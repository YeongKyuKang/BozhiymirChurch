import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="font-bold text-xl">BOSHMIR CHURCH</span>
            </div>
            <p className="text-gray-400">A welcoming community where families grow together in faith and fellowship.</p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="text-gray-400 hover:text-white">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="text-gray-400 hover:text-white">
                  Announcements
                </Link>
              </li>
              <li>
                <Link href="/kids-corner" className="text-gray-400 hover:text-white">
                  Kids Corner
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-gray-400 hover:text-white">
                  About Us
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
                  123 John Young Parkway
                  <br />
                  Orlando, FL 32804
                </span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">(407) 555-0123</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">info@boshmirchurch.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Service Times</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <div className="text-sm">
                  <p>Sunday: 10:00 AM</p>
                  <p>Wednesday: 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Boshmir Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
