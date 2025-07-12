"use client"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Settings, Save, X, Heart, Users, Globe, Baby, Plus, MessageCircle } from "lucide-react" // 아이콘 추가
import { Card, CardContent } from "@/components/ui/card"
import EditableText from "@/components/editable-text"
import Link from "next/link" // Link import 추가
import { Badge } from "@/components/ui/badge"

interface PrayerRequest {
  id: string
  category: "ukraine" | "bozhiymirchurch" | "members" | "children"
  title: string
  content: string // 기도제목 내용 (3-6줄)
  author_id: string
  author_nickname: string
  created_at: string
  answer_content?: string | null // string | null 추가
  answer_author_id?: string | null // string | null 추가
  answer_author_nickname?: string | null // string | null 추가
  answered_at?: string | null // string | null 추가
}

interface PrayerPageClientProps {
  initialContent: Record<string, any>
  initialPrayerRequests: PrayerRequest[]
}

export default function PrayerPageClient({ initialContent, initialPrayerRequests }: PrayerPageClientProps) {
  const { user, userProfile, userRole } = useAuth()
  const [isPageEditing, setIsPageEditing] = useState(false)
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({})
  const [isSavingAll, setIsSavingAll] = useState(false)
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(initialPrayerRequests)
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null)
  const [currentAnswer, setCurrentAnswer] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const handleContentChange = (section: string, key: string, value: string) => {
    setChangedContent((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value,
      },
    }))
  }

  const handleSaveAll = async () => {
    setIsSavingAll(true)
    let updateCount = 0
    let revalidated = false

    for (const section in changedContent) {
      for (const key in changedContent[section]) {
        const value = changedContent[section][key]
        const { error } = await supabase.from("content").upsert({
          page: "prayer",
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString(),
        })

        if (error) {
          console.error(`Error updating content for prayer.${section}.${key}:`, error)
        } else {
          updateCount++
        }
      }
    }

    if (updateCount > 0) {
      try {
        const revalidateResponse = await fetch(
          `/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/prayer`,
        )
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json()
          console.error("Revalidation failed:", errorData.message)
        } else {
          revalidated = true
          console.log("Prayer page revalidated successfully!")
        }
      } catch (err) {
        console.error("Failed to call revalidate API:", err)
      }
    }

    setIsSavingAll(false)
    setIsPageEditing(false)
    setChangedContent({})

    if (updateCount > 0 && revalidated) {
      alert("모든 변경 사항이 저장되고 기도 페이지가 업데이트되었습니다. 새로고침하면 반영됩니다.")
    } else if (updateCount > 0 && !revalidated) {
      alert("일부 변경 사항은 저장되었지만, 기도 페이지 재검증에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.")
    } else {
      alert("변경된 내용이 없거나 저장에 실패했습니다.")
    }
  }

  const handleCancelAll = () => {
    if (confirm("모든 변경 사항을 취소하시겠습니까?")) {
      setChangedContent({})
      setIsPageEditing(false)
    }
  }

  // 응답 받은 내용 편집 시작
  const handleEditAnswer = (prayerId: string, currentAnswerContent: string) => {
    setEditingAnswerId(prayerId)
    setCurrentAnswer(currentAnswerContent)
  }

  // 응답 받은 내용 저장
  const handleSaveAnswer = async (prayerId: string) => {
    if (!user || !userProfile?.id || !userProfile?.nickname) {
      alert("로그인해야 응답을 작성할 수 있습니다.")
      return
    }

    const { error } = await supabase
      .from("prayer_requests") // 'prayer_requests' 테이블 가정
      .update({
        answer_content: currentAnswer,
        answer_author_id: user.id,
        answer_author_nickname: userProfile.nickname,
        answered_at: new Date().toISOString(),
      })
      .eq("id", prayerId)

    if (error) {
      console.error("Error saving answer:", error.message)
      alert(`응답 저장 중 오류 발생: ${error.message}`)
    } else {
      setPrayerRequests((prev) =>
        prev.map((req) =>
          req.id === prayerId
            ? {
                ...req,
                answer_content: currentAnswer,
                answer_author_id: user.id,
                answer_author_nickname: userProfile.nickname,
                answered_at: new Date().toISOString(),
              }
            : req,
        ),
      )
      setEditingAnswerId(null)
      setCurrentAnswer("")
      alert("응답이 성공적으로 저장되었습니다!")
    }
  }

  // 응답 받은 내용 취소
  const handleCancelAnswer = () => {
    setEditingAnswerId(null)
    setCurrentAnswer("")
  }

  const prayerCategories = [
    { key: "ukraine", titleKey: "ukraine_title", descriptionKey: "ukraine_description", icon: "🇺🇦" },
    { key: "bozhiymirchurch", titleKey: "church_title", descriptionKey: "church_description", icon: "⛪" },
    { key: "members", titleKey: "members_title", descriptionKey: "members_description", icon: "👨‍👩‍👧‍👦" },
    { key: "children", titleKey: "children_title", descriptionKey: "children_description", icon: "👧👦" },
  ]

  const categories = [
    { key: "all", label: "전체", icon: <Heart className="h-4 w-4" />, color: "bg-gray-100" },
    { key: "ukraine", label: "우크라이나", icon: <Globe className="h-4 w-4" />, color: "bg-blue-100" },
    { key: "bozhiymirchurch", label: "교회", icon: <Users className="h-4 w-4" />, color: "bg-green-100" },
    { key: "members", label: "성도", icon: <Heart className="h-4 w-4" />, color: "bg-red-100" },
    { key: "children", label: "어린이", icon: <Baby className="h-4 w-4" />, color: "bg-yellow-100" },
  ]

  const filteredRequests =
    selectedCategory === "all"
      ? prayerRequests
      : prayerRequests.filter((request) => request.category === selectedCategory)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getCategoryInfo = (category: string) => {
    return categories.find((cat) => cat.key === category) || categories[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {userRole === "admin" && (
        <div className="fixed top-24 right-8 z-50 flex flex-col space-y-2">
          {!isPageEditing ? (
            <Button variant="outline" size="icon" onClick={() => setIsPageEditing(true)}>
              <Settings className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button variant="outline" size="icon" onClick={handleSaveAll} disabled={isSavingAll}>
                {isSavingAll ? (
                  <span className="animate-spin text-blue-500">🔄</span>
                ) : (
                  <Save className="h-5 w-5 text-green-600" />
                )}
              </Button>
              <Button variant="outline" size="icon" onClick={handleCancelAll} disabled={isSavingAll}>
                <X className="h-5 w-5 text-red-600" />
              </Button>
            </>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section className="py-8 md:py-12 lg:py-16 px-4 pt-20 md:pt-24 lg:pt-32">
        <div className="container mx-auto text-center">
          <div className="text-4xl md:text-6xl mb-4 md:mb-6">🙏</div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            <EditableText
              page="prayer"
              section="hero"
              contentKey="title"
              initialValue={initialContent?.hero?.title || "기도 요청"}
              tag="span"
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900"
            />
          </h1>
          <div className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8">
            <EditableText
              page="prayer"
              section="hero"
              contentKey="subtitle"
              initialValue={initialContent?.hero?.subtitle || "우리의 공동 기도"}
              tag="span"
              className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto"
              isTextArea={true}
            />
          </div>
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Prayer Scripture */}
      <section className="py-8 md:py-12 lg:py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto text-center">
          <blockquote className="text-lg md:text-xl lg:text-2xl italic mb-4 md:mb-6 max-w-4xl mx-auto">
            <EditableText
              page="prayer"
              section="scripture"
              contentKey="verse"
              initialValue={initialContent?.scripture?.verse || "기도 말씀"}
              tag="span"
              className="text-lg md:text-xl lg:text-2xl italic"
              isTextArea={true}
            />
          </blockquote>
          <p className="text-base md:text-lg lg:text-xl font-semibold opacity-90">
            <EditableText
              page="prayer"
              section="scripture"
              contentKey="reference"
              initialValue={initialContent?.scripture?.reference || "기도 말씀 참조"}
              tag="span"
              className="text-base md:text-lg lg:text-xl font-semibold opacity-90"
            />
          </p>
        </div>
      </section>

      {/* Add Prayer Button */}
      <section className="py-6 md:py-8 px-4 bg-white border-b">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">기도 요청</h2>
              <p className="text-sm md:text-base text-gray-600">함께 기도해요</p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Link href="/prayer/new">
                <Plus className="h-4 w-4 mr-2" />
                기도 요청하기
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-4 md:py-6 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.key)}
                className="text-xs md:text-sm"
              >
                {category.icon}
                <span className="ml-1">{category.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Prayer Requests */}
      <section className="py-8 md:py-12 lg:py-16 px-4">
        <div className="container mx-auto">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl md:text-6xl mb-4">🙏</div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">아직 기도 요청이 없습니다</h3>
              <p className="text-sm md:text-base text-gray-500 mb-6">첫 번째 기도 요청을 올려보세요.</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/prayer/new">기도 요청하기</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {filteredRequests.map((request) => {
                const categoryInfo = getCategoryInfo(request.category)
                return (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className={`${categoryInfo.color} text-xs`}>
                          {categoryInfo.icon}
                          <span className="ml-1">{categoryInfo.label}</span>
                        </Badge>
                        <span className="text-xs text-gray-500">{formatDate(request.created_at)}</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">{request.title}</h3>
                      <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {request.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm text-gray-500">by {request.author_nickname}</span>
                        {request.answer_content && (
                          <div className="flex items-center text-green-600">
                            <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span className="text-xs md:text-sm">답변됨</span>
                          </div>
                        )}
                      </div>
                      {request.answer_content && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                          <p className="text-xs md:text-sm text-green-800 mb-1">
                            <strong>답변:</strong>
                          </p>
                          <p className="text-xs md:text-sm text-green-700 line-clamp-2">{request.answer_content}</p>
                          <p className="text-xs text-green-600 mt-2">
                            - {request.answer_author_nickname} ({formatDate(request.answered_at || "")})
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 md:py-12 lg:py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
            <EditableText
              page="prayer"
              section="cta"
              contentKey="title"
              initialValue={initialContent?.cta?.title || "기도 요청하기"}
              tag="span"
              className="text-xl md:text-2xl lg:text-3xl font-bold"
            />
          </h2>
          <div className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 opacity-95 max-w-3xl mx-auto">
            <EditableText
              page="prayer"
              section="cta"
              contentKey="description"
              initialValue={initialContent?.cta?.description || "우리와 함께 기도해요"}
              tag="span"
              className="text-base md:text-lg lg:text-xl opacity-95"
              isTextArea={true}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 w-full sm:w-auto">
              <Link href="/prayer/new">기도 요청하기</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto bg-transparent"
            >
              <Link href="/join">교회 가입하기</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
