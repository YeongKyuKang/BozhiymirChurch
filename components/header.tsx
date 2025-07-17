// components/header.tsx (Modified file)
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, User, LogOut, Settings, Globe } from "lucide-react" // Globe 아이콘 추가
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context" // 언어 컨텍스트 훅 추가
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isFaithOpen, setIsFaithOpen] = useState(false)
  const { user, userProfile, userRole, signOut } = useAuth()
  const { t, setLanguage } = useLanguage() // 번역 함수와 언어 설정 함수 가져오기
  const router = useRouter()

  const aboutItems = [
    { name: "OUR STORY", href: "/story" },
    { name: "JESUS", href: "/jesus" },
    { name: "BELIEFS", href: "/beliefs" },
    { name: "LEADERSHIP", href: "/leadership" },
    { name: "UKRAINIAN MINISTRY", href: "/ukrainian-ministry" },
  ]

  const faithItems = [
    { name: "THANKS", href: "/thanks" },
    { name: "WORD", href: "/word" },
    { name: "PRAYER", href: "/prayer" },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <TooltipProvider>
      <header className="absolute top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
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
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {/* About Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setIsAboutOpen(true)}
                onMouseLeave={() => setIsAboutOpen(false)}
              >
                <button className="flex items-center text-white text-sm font-medium hover:text-yellow-300 transition-colors tracking-wide">
                  {t('ABOUT')}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div
                  className={`absolute top-full left-0 mt-2 transition-all duration-200 ${isAboutOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                >
                  <div className="w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                    {aboutItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsAboutOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/events" className="text-white text-sm font-medium hover:text-yellow-300 transition-colors tracking-wide">
                {t('EVENTS')}
              </Link>

              {/* Faith Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setIsFaithOpen(true)}
                onMouseLeave={() => setIsFaithOpen(false)}
              >
                {!user ? (
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <button className="flex items-center text-sm font-medium transition-colors tracking-wide text-gray-400 cursor-not-allowed" disabled>
                        {t('FAITH')}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent><p className="text-sm">로그인 유저만 사용가능</p></TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    <button className="flex items-center text-sm font-medium transition-colors tracking-wide text-white hover:text-yellow-300">
                      {t('FAITH')}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    <div className={`absolute top-full left-0 mt-2 transition-all duration-200 ${isFaithOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                      <div className="w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                        {faithItems.map((item) => (
                          <Link key={item.name} href={item.href} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={() => setIsFaithOpen(false)}>
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Link href="/join" className="text-white text-sm font-medium hover:text-yellow-300 transition-colors tracking-wide">
                {t('JOIN')}
              </Link>
              
              {/* Admin Settings Button */}
              {userRole === "admin" && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin">
                    <Settings className="h-5 w-5 text-white hover:text-yellow-300 transition-colors" />
                  </Link>
                </Button>
              )}

              {/* --- 언어 선택 드롭다운 메뉴 --- */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Globe className="h-5 w-5 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white rounded-xl shadow-xl">
                  <DropdownMenuItem onClick={() => setLanguage('ko')}>{t('korean')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('en')}>{t('english')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('ru')}>{t('russian')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Authentication Section */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700/30 text-sm px-3 py-2 rounded-lg">
                      <User className="h-4 w-4 mr-2" />
                      {userProfile?.nickname || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white rounded-xl shadow-xl">
                    <DropdownMenuItem asChild><Link href="/profile" className="text-sm">Profile</Link></DropdownMenuItem>
                    {userRole === "admin" && (<DropdownMenuItem asChild><Link href="/admin" className="text-sm">Admin Panel</Link></DropdownMenuItem>)}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-sm"><LogOut className="h-4 w-4 mr-2" />Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login" className="text-white text-sm font-medium hover:text-yellow-300 transition-colors tracking-wide">{t('LOGIN')}</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-blue-900 font-bold transition-all duration-300 transform hover:scale-105">
                     <Link href="/register">{t('REGISTER')}</Link>
                  </Button>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-blue-700/30 h-10 w-10 rounded-lg" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
             <nav className="lg:hidden mt-4 pb-4">
               {/* 모바일 메뉴 구현은 다음 단계에서 진행하겠습니다. */}
             </nav>
          )}
        </div>
      </header>
    </TooltipProvider>
  )
}