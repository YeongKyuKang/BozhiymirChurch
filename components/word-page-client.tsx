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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* Hero Section */}
      <section className="py-20 md:py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="text-5xl md:text-6xl mb-6">📖</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-8">
            <EditableText
              page="word"
              section="hero"
              contentKey="title"
              initialValue={content?.hero?.title}
              tag="span"
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900"
            />
          </h1>
          <div className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-10">
            <EditableText
              page="word"
              section="hero"
              contentKey="subtitle"
              initialValue={content?.hero?.subtitle}
              tag="span"
              className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto"
              isTextArea={true}
            />
          </div>
          <div className="flex items-center justify-center space-x-3 text-blue-600">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Scripture */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="container mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl italic mb-8 max-w-5xl mx-auto">
            <EditableText
              page="word"
              section="scripture"
              contentKey="verse"
              initialValue={content?.scripture?.verse}
              tag="span"
              className="text-2xl md:text-3xl italic text-white"
              isTextArea={true}
            />
          </blockquote>
          <p className="text-xl md:text-2xl font-semibold text-blue-200 opacity-90">
            <EditableText
              page="word"
              section="scripture"
              contentKey="reference"
              initialValue={content?.scripture?.reference}
              tag="span"
              className="text-xl md:text-2xl font-semibold text-blue-200 opacity-90"
            />
          </p>
        </div>
      </section>

      {/* Date Navigation */}
      <section className="py-12 px-4 bg-white border-b border-yellow-100">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousDay}
                className="text-base md:text-lg bg-transparent border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                이전
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-base md:text-lg bg-transparent h-12 border-blue-300 focus:border-blue-700 focus:ring-blue-700"
                  >
                    <CalendarIcon className="h-5 w-5 md:h-6 md:w-6 mr-3 text-blue-700" />
                    {format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })}
                    {isToday(selectedDate) && (
                      <Badge variant="secondary" className="ml-2 text-sm bg-yellow-100 text-yellow-800">
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
                className="text-base md:text-lg bg-transparent border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                다음
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </div>
            <span className="text-sm md:text-base text-gray-600">{wordPosts.length}개의 말씀</span>
          </div>
        </div>
      </section>

      {/* Word Posts */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-4 border-blue-700 mx-auto mb-6"></div>
              <p className="text-base md:text-lg text-blue-800">말씀을 불러오는 중...</p>
            </div>
          ) : wordPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl md:text-7xl mb-6">😔</div>
              <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">이 날의 말씀이 없습니다</h3>
              <p className="text-base md:text-lg text-gray-700">다른 날짜를 선택해보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
              {wordPosts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden bg-gradient-to-br from-white to-yellow-50 border-0 shadow-xl"
                >
                  {post.image_url && (
                    <div className="relative h-64 md:h-72 bg-gradient-to-br from-blue-100 to-yellow-100">
                      <Image
                        src={post.image_url || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        <BookOpen className="h-4 w-4 mr-2" />
                        오늘의 말씀
                      </Badge>
                      <span className="text-sm text-gray-600">{formatDate(post.word_date)}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-900 mb-4">{post.title}</h3>
                    <div className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </div>
                    <div className="flex items-center justify-between border-t border-blue-100 pt-4">
                      <span className="text-sm md:text-base text-gray-600 font-medium">by {post.author_nickname}</span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-red-600">
                          <Heart className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                          <span className="text-sm md:text-base">{post.word_reactions?.length || 0}</span>
                        </div>
                        <div className="flex items-center text-blue-600">
                          <MessageCircle className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                          <span className="text-sm md:text-base">댓글</span>
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
      <section className="py-20 px-4 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
            <EditableText
              page="word"
              section="cta"
              contentKey="title"
              initialValue={content?.cta?.title}
              tag="span"
              className="text-3xl md:text-4xl lg:text-5xl font-bold"
            />
          </h2>
          <div className="text-xl md:text-2xl lg:text-3xl mb-10 opacity-95 max-w-4xl mx-auto">
            <EditableText
              page="word"
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
              className="bg-yellow-500 text-blue-900 hover:bg-yellow-600 w-full sm:w-auto font-bold px-10 py-4 text-xl rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/join">교회 가입하기</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white w-full sm:w-auto bg-transparent font-bold px-10 py-4 text-xl rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/prayer">기도 요청하기</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
