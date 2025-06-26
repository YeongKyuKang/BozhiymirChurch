"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, User, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const { user, logout, isAuthenticated, isAdministrator } = useAuth()

  const aboutItems = [
    { name: "LEADERSHIP", href: "/leadership" },
    { name: "BELIEFS", href: "/beliefs" },
    { name: "OUR STORY", href: "/story" },
    { name: "UKRAINIAN MINISTRY", href: "/ukrainian-ministry" },
  ]

  const handleLogout = async () => {
    await logout()
    setIsUserMenuOpen(false)
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
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
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* About Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setIsAboutOpen(true)}
              onMouseLeave={() => setIsAboutOpen(false)}
            >
              <button className="flex items-center text-white text-sm font-medium hover:text-blue-300 transition-colors tracking-wide">
                ABOUT
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              <div
                className={`absolute top-full left-0 mt-2 transition-all duration-200 ${isAboutOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
              >
                <div className="w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {aboutItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/events"
              className="text-white text-sm font-medium hover:text-blue-300 transition-colors tracking-wide"
            >
              EVENTS
            </Link>
            <Link
              href="/ministries"
              className="text-white text-sm font-medium hover:text-blue-300 transition-colors tracking-wide"
            >
              MINISTRIES
            </Link>
            <Link
              href="/join"
              className="text-white text-sm font-medium hover:text-blue-300 transition-colors tracking-wide"
            >
              JOIN
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div
                className="relative"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button className="flex items-center text-white text-sm font-medium hover:text-blue-300 transition-colors tracking-wide">
                  <User className="h-4 w-4 mr-1" />
                  {user?.firstName}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                <div
                  className={`absolute top-full right-0 mt-2 transition-all duration-200 ${isUserMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                >
                  <div className="w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.position}</p>
                    </div>

                    {isAdministrator && (
                      <Link
                        href="/admin/database-content"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Content Manager
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white border-white hover:bg-white hover:text-blue-600"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Join Us
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              {/* Mobile About Section */}
              <div>
                <button
                  onClick={() => setIsAboutOpen(!isAboutOpen)}
                  className="flex items-center justify-between w-full text-white text-sm font-medium py-2"
                >
                  ABOUT
                  <ChevronDown className={`h-4 w-4 transition-transform ${isAboutOpen ? "rotate-180" : ""}`} />
                </button>
                {isAboutOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    {aboutItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block text-white/80 text-sm py-1 hover:text-blue-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/events"
                className="text-white text-sm font-medium py-2 hover:text-blue-300"
                onClick={() => setIsMenuOpen(false)}
              >
                EVENTS
              </Link>
              <Link
                href="/ministries"
                className="text-white text-sm font-medium py-2 hover:text-blue-300"
                onClick={() => setIsMenuOpen(false)}
              >
                MINISTRIES
              </Link>
              <Link
                href="/join"
                className="text-white text-sm font-medium py-2 hover:text-blue-300"
                onClick={() => setIsMenuOpen(false)}
              >
                JOIN
              </Link>

              {/* Mobile User Menu */}
              {isAuthenticated ? (
                <div className="border-t border-white/20 pt-3 mt-3">
                  <p className="text-white text-sm font-medium mb-2">
                    {user?.firstName} {user?.lastName} ({user?.position})
                  </p>
                  {isAdministrator && (
                    <Link
                      href="/admin/database-content"
                      className="block text-white/80 text-sm py-1 hover:text-blue-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Content Manager
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="text-white/80 text-sm py-1 hover:text-red-300"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-white/20 pt-3 mt-3 space-y-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-white border-white hover:bg-white hover:text-blue-600"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                      Join Us
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
