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
        return "bg-green-100 text-green-800"
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
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Hero Section */}
      <section className="py-8 md:py-12 lg:py-16 px-4 pt-20 md:pt-24 lg:pt-32">
        <div className="container mx-auto text-center">
          <div className="text-4xl md:text-6xl mb-4 md:mb-6">🙏</div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            <EditableText
              page="thanks"
              section="hero"
              contentKey="title"
              initialValue={content?.hero?.title}
              tag="span"
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900"
            />
          </h1>
          <div className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8">
            <EditableText
              page="thanks"
              section="hero"
              contentKey="subtitle"
              initialValue={content?.hero?.subtitle}
              tag="span"
              className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto"
              isTextArea={true}
            />
          </div>
          <div className="flex items-center justify-center space-x-2 text-yellow-600">
            <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Gratitude Scripture */}
      <section className="py-8 md:py-12 lg:py-16 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
        <div className="container mx-auto text-center">
          <blockquote className="text-lg md:text-xl lg:text-2xl italic mb-4 md:mb-6 max-w-4xl mx-auto">
            <EditableText
              page="thanks"
              section="scripture"
              contentKey="verse"
              initialValue={content?.scripture?.verse}
              tag="span"
              className="text-lg md:text-xl lg:text-2xl italic"
              isTextArea={true}
            />
          </blockquote>
          <p className="text-base md:text-lg lg:text-xl font-semibold opacity-90">
            <EditableText
              page="thanks"
              section="scripture"
              contentKey="reference"
              initialValue={content?.scripture?.reference}
              tag="span"
              className="text-base md:text-lg lg:text-xl font-semibold opacity-90"
            />
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-4 md:py-6 px-4 bg-white border-b">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Filter className="h-4 w-4 md:h-5 md:w-5 mr-2 text-gray-600" />
              <span className="text-sm md:text-base font-medium text-gray-700">필터:</span>
            </div>
            <span className="text-xs md:text-sm text-gray-500">{filteredAndSortedPosts.length}개의 감사 인사</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="text-xs md:text-sm">
                <SelectValue placeholder="역할 선택" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.key} value={role.key} className="text-xs md:text-sm">
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="text-xs md:text-sm justify-start bg-transparent">
                  <CalendarIcon className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                  {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="text-xs md:text-sm">
                <SelectValue placeholder="정렬 방식" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key} className="text-xs md:text-sm">
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
              className="text-xs md:text-sm"
            >
              필터 초기화
            </Button>
          </div>
        </div>
      </section>

      {/* Thanks Posts */}
      <section className="py-8 md:py-12 lg:py-16 px-4">
        <div className="container mx-auto">
          {filteredAndSortedPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl md:text-6xl mb-4">🙏</div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">감사 인사가 없습니다</h3>
              <p className="text-sm md:text-base text-gray-500">다른 필터를 선택해보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {filteredAndSortedPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={`${getRoleColor(post.author_role)} text-xs`}>
                        <User className="h-3 w-3 mr-1" />
                        {getRoleLabel(post.author_role)}
                      </Badge>
                      <span className="text-xs text-gray-500">{formatDate(post.created_at)}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-4 leading-relaxed">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm text-gray-500">by {post.author_nickname}</span>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-red-500">
                          <ThumbsUp className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          <span className="text-xs md:text-sm">{post.thanks_reactions?.length || 0}</span>
                        </div>
                        <div className="flex items-center text-blue-500">
                          <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          <span className="text-xs md:text-sm">{post.thanks_comments?.length || 0}</span>
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
      <section className="py-8 md:py-12 lg:py-16 px-4 bg-yellow-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
            <EditableText
              page="thanks"
              section="cta"
              contentKey="title"
              initialValue={content?.cta?.title}
              tag="span"
              className="text-xl md:text-2xl lg:text-3xl font-bold"
            />
          </h2>
          <div className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 opacity-95 max-w-3xl mx-auto">
            <EditableText
              page="thanks"
              section="cta"
              contentKey="description"
              initialValue={content?.cta?.description}
              tag="span"
              className="text-base md:text-lg lg:text-xl opacity-95"
              isTextArea={true}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-white text-yellow-600 hover:bg-gray-100 w-full sm:w-auto">
              <Link href="/join">교회 가입하기</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-yellow-600 w-full sm:w-auto bg-transparent"
            >
              <Link href="/prayer">기도 요청하기</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
