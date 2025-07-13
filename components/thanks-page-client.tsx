"use client"

import Link from "next/link"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, ThumbsUp, MessageCircle, User } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import EditableText from "@/components/editable-text"

interface ThanksPost {
  id: string
  title: string
  content: string
  author_id: string
  author_nickname: string
  created_at: string
  author_role: string | null
  thanks_reactions: any[]
  thanks_comments: any[]
}

interface ThanksPageClientProps {
  initialContent: Record<string, any>
  initialThanksPosts: ThanksPost[]
}

export default function ThanksPageClient({ initialContent, initialThanksPosts }: ThanksPageClientProps) {
  const content = initialContent
  const [thanksPosts] = useState<ThanksPost[]>(initialThanksPosts)
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [sortBy, setSortBy] = useState<string>("created_at_desc")

  const roles = [
    { key: "all", label: "전체" },
    { key: "admin", label: "관리자" },
    { key: "member", label: "성도" },
    { key: "visitor", label: "방문자" },
  ]

  const sortOptions = [
    { key: "created_at_desc", label: "최신순" },
    { key: "created_at_asc", label: "오래된순" },
  ]

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = thanksPosts

    // Role filter
    if (selectedRole !== "all") {
      filtered = filtered.filter((post) => post.author_role === selectedRole)
    }

    // Date filter
    if (selectedDate) {
      const selectedDateStr = format(selectedDate, "yyyy-MM-dd")
      filtered = filtered.filter((post) => {
        const postDate = format(new Date(post.created_at), "yyyy-MM-dd")
        return postDate === selectedDateStr
      })
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return sortBy === "created_at_desc" ? dateB - dateA : dateA - dateB
    })

    return filtered
  }, [thanksPosts, selectedRole, selectedDate, sortBy])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "yyyy년 MM월 dd일", { locale: ko })
  }

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "member":
        return "bg-blue-100 text-blue-800"
      case "visitor":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleLabel = (role: string | null) => {
    switch (role) {
      case "admin":
        return "관리자"
      case "member":
        return "성도"
      case "visitor":
        return "방문자"
      default:
        return "사용자"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* Hero Section */}
      <section className="py-20 md:py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="text-5xl md:text-6xl mb-6">🙏</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-8">
            <EditableText
              page="thanks"
              section="hero"
              contentKey="title"
              initialValue={content?.hero?.title}
              tag="span"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900"
            />
          </h1>
          <div className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-10">
            <EditableText
              page="thanks"
              section="hero"
              contentKey="subtitle"
              initialValue={content?.hero?.subtitle}
              tag="span"
              className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto"
              isTextArea={true}
            />
          </div>
          <div className="flex items-center justify-center space-x-3 text-yellow-600">
            <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Gratitude Scripture */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900">
        <div className="container mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl italic mb-8 max-w-5xl mx-auto">
            <EditableText
              page="thanks"
              section="scripture"
              contentKey="verse"
              initialValue={content?.scripture?.verse}
              tag="span"
              className="text-2xl md:text-3xl italic text-blue-900"
              isTextArea={true}
            />
          </blockquote>
          <p className="text-xl md:text-2xl font-semibold text-blue-800 opacity-90">
            <EditableText
              page="thanks"
              section="scripture"
              contentKey="reference"
              initialValue={content?.scripture?.reference}
              tag="span"
              className="text-xl md:text-2xl font-semibold text-blue-800 opacity-90"
            />
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 px-4 bg-white border-b border-blue-100">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Filter className="h-5 w-5 md:h-6 md:w-6 mr-3 text-blue-700" />
              <span className="text-base md:text-lg font-medium text-blue-900">필터:</span>
            </div>
            <span className="text-sm md:text-base text-gray-600">{filteredAndSortedPosts.length}개의 감사 인사</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="text-base md:text-lg h-12 border-blue-300 focus:border-blue-700 focus:ring-blue-700">
                <SelectValue placeholder="역할 선택" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.key} value={role.key} className="text-base md:text-lg">
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="text-base md:text-lg justify-start bg-transparent h-12 border-blue-300 focus:border-blue-700 focus:ring-blue-700"
                >
                  <CalendarIcon className="h-5 w-5 md:h-6 md:w-6 mr-3 text-blue-700" />
                  {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="text-base md:text-lg h-12 border-blue-300 focus:border-blue-700 focus:ring-blue-700">
                <SelectValue placeholder="정렬 방식" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key} className="text-base md:text-lg">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSelectedRole("all")
                setSelectedDate(undefined)
                setSortBy("created_at_desc")
              }}
              className="text-base md:text-lg h-12 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            >
              필터 초기화
            </Button>
          </div>
        </div>
      </section>

      {/* Thanks Posts */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          {filteredAndSortedPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl md:text-7xl mb-6">😔</div>
              <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">감사 인사가 없습니다</h3>
              <p className="text-base md:text-lg text-gray-700">다른 필터를 선택해보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
              {filteredAndSortedPosts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-white to-blue-50 border-0 shadow-xl"
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={`${getRoleColor(post.author_role)} text-sm px-3 py-1 rounded-full`}>
                        <User className="h-4 w-4 mr-2" />
                        {getRoleLabel(post.author_role)}
                      </Badge>
                      <span className="text-sm text-gray-600">{formatDate(post.created_at)}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-base md:text-lg text-gray-700 mb-6 line-clamp-4 leading-relaxed">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between border-t border-blue-100 pt-4">
                      <span className="text-sm md:text-base text-gray-600 font-medium">by {post.author_nickname}</span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-red-600">
                          <ThumbsUp className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                          <span className="text-sm md:text-base">{post.thanks_reactions?.length || 0}</span>
                        </div>
                        <div className="flex items-center text-blue-600">
                          <MessageCircle className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                          <span className="text-sm md:text-base">{post.thanks_comments?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
            <EditableText
              page="thanks"
              section="cta"
              contentKey="title"
              initialValue={content?.cta?.title}
              tag="span"
              className="text-3xl md:text-4xl lg:text-5xl font-bold"
            />
          </h2>
          <div className="text-xl md:text-2xl lg:text-3xl mb-10 opacity-95 max-w-4xl mx-auto">
            <EditableText
              page="thanks"
              section="cta"
              contentKey="description"
              initialValue={content?.cta?.description}
              tag="span"
              className="text-xl md:text-2xl lg:text-3xl opacity-95"
              isTextArea={true}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-blue-700 text-white hover:bg-blue-800 w-full sm:w-auto font-bold px-10 py-4 text-xl rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/join">교회 가입하기</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white w-full sm:w-auto bg-transparent font-bold px-10 py-4 text-xl rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/prayer">기도 요청하기</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
