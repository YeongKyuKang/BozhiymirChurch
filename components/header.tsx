// components/header.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context"; // Auth Context 임포트
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Avatar 컴포넌트 임포트
import {
  Tooltip, // Tooltip 임포트
  TooltipContent, // TooltipContent 임포트
  TooltipProvider, // TooltipProvider 임포트
  TooltipTrigger, // TooltipTrigger 임포트
} from "@/components/ui/tooltip";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  // const [isEventsOpen, setIsEventsOpen] = useState(false); // EVENTS 드롭다운 제거로 상태 제거
  const [isFaithOpen, setIsFaithOpen] = useState(false);
  const { user, userProfile, userRole, signOut } = useAuth(); // user, userProfile, userRole 가져오기
  const router = useRouter();

  const aboutItems = [
    { name: "OUR STORY", href: "/story" },
    { name: "JESUS", href: "/jesus" },
    { name: "BELIEFS", href: "/beliefs" },
    { name: "LEADERSHIP", href: "/leadership" },
    { name: "UKRAINIAN MINISTRY", href: "/ukrainian-ministry" },
    
  ];
  
  const faithItems = [
    { name: "THANKS", href: "/thanks" },
    { name: "WORD", href: "/word" },
    { name: "PRAYER", href: "/prayer" },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <TooltipProvider> {/* TooltipProvider로 전체 헤더를 감싸줍니다. */}
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
                        onClick={() => setIsAboutOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Events Link (드롭다운에서 일반 링크로 변경) */}
              <Link
                href="/events" // 직접 /events로 연결
                className="text-white text-sm font-medium hover:text-blue-300 transition-colors tracking-wide"
              >
                EVENTS
              </Link>

              {/* Faith Dropdown (로그인 상태에 따라 활성화/비활성화 및 툴팁) */}
              <div
                className="relative group"
                onMouseEnter={() => setIsFaithOpen(true)}
                onMouseLeave={() => setIsFaithOpen(false)}
              >
                {!user ? ( // user가 로그인하지 않았을 때 툴팁 표시
                  <Tooltip delayDuration={300}> {/* 툴팁 표시 지연 시간 */}
                    <TooltipTrigger asChild>
                      <button
                        className="flex items-center text-sm font-medium transition-colors tracking-wide text-gray-400 cursor-not-allowed"
                        disabled={true} // 항상 비활성화
                      >
                        FAITH
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>로그인 유저만 사용가능</p>
                    </TooltipContent>
                  </Tooltip>
                ) : ( // user가 로그인했을 때 정상적인 버튼 및 드롭다운 렌더링
                  <>
                    <button
                      className="flex items-center text-sm font-medium transition-colors tracking-wide text-white hover:text-blue-300"
                      disabled={false}
                    >
                      FAITH
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    <div
                      className={`absolute top-full left-0 mt-2 transition-all duration-200 ${isFaithOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                    >
                      <div className="w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        {faithItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsFaithOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Link
                href="/join"
                className="text-white text-sm font-medium hover:text-blue-300 transition-colors tracking-wide"
              >
                JOIN
              </Link>
              
              {/* Admin Settings Button */}
              {userRole === "admin" && (
                  <Button variant="ghost" size="icon" asChild>
                      <Link href="/admin">
                          <Settings className="text-white hover:text-blue-300 transition-colors" />
                      </Link>
                  </Button>
              )}

              {/* Authentication Section */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {userProfile?.nickname || user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    {userRole === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <span className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-white text-sm font-medium hover:text-blue-300 transition-colors tracking-wide"
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    REGISTER
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
                          onClick={() => { setIsMenuOpen(false); setIsAboutOpen(false); }}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Events Link (드롭다운에서 일반 링크로 변경) */}
                <Link
                  href="/events" // 직접 /events로 연결
                  className="block text-white text-sm font-medium py-2 hover:text-blue-300"
                  onClick={() => setIsMenuOpen(false)} // 메뉴 닫기
                >
                  EVENTS
                </Link>

                {/* Mobile Faith Section (로그인 상태에 따라 활성화/비활성화 및 툴팁) */}
                <div>
                  {!user ? ( // user가 로그인하지 않았을 때 툴팁 표시
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <button
                          className="flex items-center justify-between w-full text-sm font-medium py-2 text-gray-400 cursor-not-allowed"
                          disabled={true}
                        >
                          FAITH
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>로그인 유저만 사용가능</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : ( // user가 로그인했을 때 정상적인 버튼 및 드롭다운 렌더링
                    <>
                      <button
                        onClick={() => setIsFaithOpen(!isFaithOpen)}
                        className="flex items-center justify-between w-full text-sm font-medium py-2 text-white"
                        disabled={false}
                      >
                        FAITH
                        <ChevronDown className={`h-4 w-4 transition-transform ${isFaithOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isFaithOpen && (
                        <div className="ml-4 mt-2 space-y-2">
                          {faithItems.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="block text-white/80 text-sm py-1 hover:text-blue-300"
                              onClick={() => { setIsMenuOpen(false); setIsFaithOpen(false); }}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <Link
                  href="/join"
                  className="text-white text-sm font-medium py-2 hover:text-blue-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  JOIN
                </Link>

                {/* Mobile Auth Section */}
                {user ? (
                  <div className="border-t border-white/20 pt-3 mt-3">
                    <div className="text-white/80 text-sm mb-2">{userProfile?.nickname || user.email}</div>
                    <Link
                      href="/profile"
                      className="block text-white text-sm font-medium py-2 hover:text-blue-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {userRole === "admin" && (
                      <Link
                        href="/admin"
                        className="block text-white text-sm font-medium py-2 hover:text-blue-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block text-white text-sm font-medium py-2 hover:text-blue-300 w-full text-left"
                    >
                      <span className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-white/20 pt-3 mt-3 space-y-2">
                    <Link
                      href="/login"
                      className="block text-white text-sm font-medium py-2 hover:text-blue-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      LOGIN
                    </Link>
                    <Link
                      href="/register"
                      className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      REGISTER
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>
    </TooltipProvider>
  );
}
