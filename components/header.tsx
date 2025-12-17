"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, User, LogOut, Settings, Globe, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isFaithOpen, setIsFaithOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const pathname = usePathname()
  const router = useRouter()
  
  // userProfile도 가져와서 닉네임 표시에 사용
  const { user, userProfile, userRole, signOut } = useAuth()
  const { t, setLanguage, language } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => setIsMenuOpen(false), [pathname])

  const aboutItems = [
    { name: t('nav.story') || "OUR STORY", href: "/story" },
    { name: t('nav.jesus') || "JESUS", href: "/jesus" },
    { name: t('nav.beliefs') || "BELIEFS", href: "/beliefs" },
    { name: t('nav.leadership') || "LEADERSHIP", href: "/leadership" },
    { name: t('nav.ukrainian') || "UKRAINIAN MINISTRY", href: "/ukrainian-ministry" },
  ]

  const faithItems = [
    { name: t('nav.thanks') || "THANKS", href: "/thanks" },
    { name: t('nav.word') || "WORD", href: "/word" },
    { name: t('nav.prayer') || "PRAYER", href: "/prayer" },
  ]

  // ★ 수정된 부분: 라우팅 이동 로직 삭제 ★
  // auth-context에서 window.location.href로 이동시키므로 여기서는 호출만 합니다.
  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <TooltipProvider>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-black/80 backdrop-blur-md shadow-lg py-2" 
            : "bg-black/40 backdrop-blur-sm py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-10 w-40">
                <Image
                  src="/images/Bozhiy-Mir_LOGO.png"
                  alt="Bozhiymir Church Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                  unoptimized
                />
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
                <button className="flex items-center text-white text-sm font-bold hover:text-yellow-400 transition-colors tracking-widest">
                  {t('nav.about') || "ABOUT"}
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`absolute top-full left-0 pt-4 transition-all duration-200 ${isAboutOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
                  <div className="w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 overflow-hidden">
                    {aboutItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-3 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/events/1" className="text-white text-sm font-bold hover:text-yellow-400 transition-colors tracking-widest">
                {t('nav.events') || "EVENTS"}
              </Link>

              {/* Faith Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setIsFaithOpen(true)}
                onMouseLeave={() => setIsFaithOpen(false)}
              >
                {!user ? (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <button className="flex items-center text-sm font-bold tracking-widest text-white/40 cursor-not-allowed">
                        {t('nav.faith') || "FAITH"}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-red-500 text-white border-none">
                      <p>{t('nav.login_required') || "Login required"}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    <button className="flex items-center text-sm font-bold tracking-widest text-white hover:text-yellow-400 transition-colors">
                      {t('nav.faith') || "FAITH"}
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isFaithOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`absolute top-full left-0 pt-4 transition-all duration-200 ${isFaithOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
                      <div className="w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 overflow-hidden">
                        {faithItems.map((item) => (
                          <Link key={item.href} href={item.href} className="block px-5 py-3 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Link href="/join/1" className="text-white text-sm font-bold hover:text-yellow-400 transition-colors tracking-widest">
                {t('nav.join') || "JOIN"}
              </Link>

              {/* Global Controls */}
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-white/20">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                      <Globe className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white rounded-xl">
                    <DropdownMenuItem onClick={() => setLanguage('ko')}>한국어</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('ru')}>Русский</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-white bg-white/10 hover:bg-white/20 rounded-full px-4">
                        <User className="h-4 w-4 mr-2" />
                        <span className="text-xs font-bold">{userProfile?.nickname || user.email?.split('@')[0]}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white rounded-xl shadow-2xl">
                      <DropdownMenuItem asChild><Link href="/profile"><Settings className="mr-2 h-4 w-4"/>Profile Settings</Link></DropdownMenuItem>
                      {userRole === "admin" && (
                        <DropdownMenuItem asChild><Link href="/admin" className="text-blue-600 font-bold"><LayoutDashboard className="mr-2 h-4 w-4"/>Admin Panel</Link></DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-red-500 font-bold">
                        <LogOut className="mr-2 h-4 w-4" />Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link href="/login" className="text-white text-xs font-bold hover:text-yellow-400 transition-colors">LOGIN</Link>
                    <Button asChild size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-black rounded-full px-6 shadow-lg shadow-yellow-500/20">
                      <Link href="/register">REGISTER</Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="lg:hidden text-white bg-white/10 h-10 w-10 rounded-xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-6 animate-in slide-in-from-top duration-300">
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="about" className="border-none">
                    <AccordionTrigger className="text-white text-lg font-bold py-3 hover:no-underline">{t('nav.about') || "ABOUT"}</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-2 pl-4">
                        {aboutItems.map(item => (
                          <Link key={item.href} href={item.href} className="text-white/70 py-2 font-medium">{item.name}</Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <Link href="/events/1" className="flex items-center h-14 text-white text-lg font-bold">EVENTS</Link>

                  <AccordionItem value="faith" className="border-none">
                    <AccordionTrigger className={`text-lg font-bold py-3 hover:no-underline ${!user ? 'text-white/20' : 'text-white'}`}>
                      {t('nav.faith') || "FAITH"}
                    </AccordionTrigger>
                    <AccordionContent>
                      {user ? (
                        <div className="grid grid-cols-1 gap-2 pl-4">
                          {faithItems.map(item => (
                            <Link key={item.href} href={item.href} className="text-white/70 py-2 font-medium">{item.name}</Link>
                          ))}
                        </div>
                      ) : (
                        <p className="pl-4 text-red-400 text-sm">Please login to access faith content.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Link href="/join/1" className="flex items-center h-14 text-white text-lg font-bold">JOIN</Link>

                <div className="pt-6 space-y-4">
                  {user ? (
                    <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-yellow-500 rounded-full flex items-center justify-center text-blue-900 font-bold mr-3">
                          {userProfile?.nickname?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-white font-bold">{userProfile?.nickname || "User"}</p>
                          <Link href="/profile" className="text-xs text-white/50 underline">Edit Profile</Link>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-red-400"><LogOut className="h-5 w-5"/></Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Button asChild variant="outline" className="bg-transparent text-white border-white/20 rounded-2xl h-12">
                        <Link href="/login">LOGIN</Link>
                      </Button>
                      <Button asChild className="bg-yellow-500 text-blue-900 font-bold rounded-2xl h-12">
                        <Link href="/register">REGISTER</Link>
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-between bg-white/5 rounded-2xl p-2">
                    {['ko', 'en', 'ru'].map((l) => (
                      <Button 
                        key={l}
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setLanguage(l as any)}
                        className={`flex-1 rounded-xl h-10 font-bold ${language === l ? 'bg-yellow-500 text-blue-900' : 'text-white/60'}`}
                      >
                        {l === 'ko' ? '한국어' : l === 'en' ? 'ENG' : 'RUS'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </TooltipProvider>
  )
}