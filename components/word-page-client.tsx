"use client"

import Link from "next/link"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { BookOpen, CalendarIcon, Heart, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { format, addDays, subDays, startOfDay } from "date-fns"
import { ko } from "date-fns/locale"
import Image from "next/image"
import EditableText from "@/components/editable-text"

interface WordPost {
  id: string
  title: string
  content: string
  word_date: string
  author_id: string
  author_nickname: string
  created_at: string
  image_url?: string
  word_reactions: any[]
}

interface WordPageClientProps {
  initialContent: Record<string, any>
  initialWordPosts: WordPost[]
}

export default function WordPageClient({ initialContent, initialWordPosts }: WordPageClientProps) {
  const content = initialContent
  const [wordPosts, setWordPosts] = useState<WordPost[]>(initialWordPosts)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const fetchWordPosts = async (date: Date) => {
    setIsLoading(true)
    try {
      const dateStr = format(date, "yyyy-MM-dd")
      const response = await fetch(`/word?date=${dateStr}`)
      if (response.ok) {
        const data = await response.json()
        setWordPosts(data.wordPosts || [])
      }
    } catch (error) {
      console.error("Failed to fetch word posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      fetchWordPosts(date)
    }
  }

  const goToPreviousDay = () => {
    const prevDay = subDays(selectedDate, 1)
    setSelectedDate(prevDay)
    fetchWordPosts(prevDay)
  }

  const goToNextDay = () => {
    const nextDay = addDays(selectedDate, 1)
    const today = startOfDay(new Date())
    if (nextDay <= today) {
      setSelectedDate(nextDay)
      fetchWordPosts(nextDay)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "yyyy년 MM월 dd일", { locale: ko })
  }

  const isToday = (date: Date) => {
    const today = startOfDay(new Date())
    return startOfDay(date).getTime() === today.getTime()
  }

  const canGoNext = () => {
    const nextDay = addDays(selectedDate, 1)
    const today = startOfDay(new Date())
    return nextDay <= today
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="py-8 md:py-12 lg:py-16 px-4 pt-20 md:pt-24 lg:pt-32">
        <div className="container mx-auto text-center">
          <div className="text-4xl md:text-6xl mb-4 md:mb-6">📖</div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            <EditableText
              page="word"
              section="hero"
              contentKey="title"
              initialValue={content?.hero?.title}
              tag="span"
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900"
            />
          </h1>
          <div className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8">
            <EditableText
              page="word"
              section="hero"
              contentKey="subtitle"
              initialValue={content?.hero?.subtitle}
              tag="span"
              className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto"
              isTextArea={true}
            />
          </div>
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Scripture */}
      <section className="py-8 md:py-12 lg:py-16 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto text-center">
          <blockquote className="text-lg md:text-xl lg:text-2xl italic mb-4 md:mb-6 max-w-4xl mx-auto">
            <EditableText
              page="word"
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
              page="word"
              section="scripture"
              contentKey="reference"
              initialValue={content?.scripture?.reference}
              tag="span"
              className="text-base md:text-lg lg:text-xl font-semibold opacity-90"
            />
          </p>
        </div>
      </section>

      {/* Date Navigation */}
      <section className="py-4 md:py-6 px-4 bg-white border-b">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousDay}
                className="text-xs md:text-sm bg-transparent"
              >
                <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                이전
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="text-xs md:text-sm bg-transparent">
                    <CalendarIcon className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                    {format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })}
                    {isToday(selectedDate) && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        오늘
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    disabled={(date) => date > new Date() || date < subDays(new Date(), 5)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextDay}
                disabled={!canGoNext()}
                className="text-xs md:text-sm bg-transparent"
              >
                다음
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
            <span className="text-xs md:text-sm text-gray-500">{wordPosts.length}개의 말씀</span>
          </div>
        </div>
      </section>

      {/* Word Posts */}
      <section className="py-8 md:py-12 lg:py-16 px-4">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-sm md:text-base text-gray-600">말씀을 불러오는 중...</p>
            </div>
          ) : wordPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl md:text-6xl mb-4">📖</div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">이 날의 말씀이 없습니다</h3>
              <p className="text-sm md:text-base text-gray-500">다른 날짜를 선택해보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {wordPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  {post.image_url && (
                    <div className="relative h-48 md:h-64 bg-gradient-to-br from-green-100 to-blue-100">
                      <Image
                        src={post.image_url || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <BookOpen className="h-3 w-3 mr-1" />
                        오늘의 말씀
                      </Badge>
                      <span className="text-xs text-gray-500">{formatDate(post.word_date)}</span>
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                      {post.title}
                    </h3>
                    <div className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm text-gray-500">by {post.author_nickname}</span>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-red-500">
                          <Heart className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          <span className="text-xs md:text-sm">{post.word_reactions?.length || 0}</span>
                        </div>
                        <div className="flex items-center text-blue-500">
                          <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          <span className="text-xs md:text-sm">댓글</span>
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
      <section className="py-8 md:py-12 lg:py-16 px-4 bg-green-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
            <EditableText
              page="word"
              section="cta"
              contentKey="title"
              initialValue={content?.cta?.title}
              tag="span"
              className="text-xl md:text-2xl lg:text-3xl font-bold"
            />
          </h2>
          <div className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 opacity-95 max-w-3xl mx-auto">
            <EditableText
              page="word"
              section="cta"
              contentKey="description"
              initialValue={content?.cta?.description}
              tag="span"
              className="text-base md:text-lg lg:text-xl opacity-95"
              isTextArea={true}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-yellow-400 text-green-900 hover:bg-yellow-300 w-full sm:w-auto">
              <Link href="/join">교회 가입하기</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-green-600 w-full sm:w-auto bg-transparent"
            >
              <Link href="/prayer">기도 요청하기</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
