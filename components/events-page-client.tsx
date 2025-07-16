// components/events-page-client.tsx
"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Settings, Save, X, CalendarIcon, MapPin, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import EditableText from "@/components/editable-text"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Link from "next/link"
import type { Database } from "@/lib/supabase"

type Event = Database["public"]["Tables"]["events"]["Row"]

interface SpecificEventsPageClientProps {
  initialContent: Record<string, any>
  initialEvents: Event[]
}

export default function SpecificEventsPageClient({ initialEvents, initialContent }: SpecificEventsPageClientProps) {
  const { userRole } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isPageEditing, setIsPageEditing] = useState(false)
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({})
  const [isSavingAll, setIsSavingAll] = useState(false)

  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date") as string) : undefined,
  )
  const [timezoneOffset, setTimezoneOffset] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimezoneOffset(new Date().getTimezoneOffset())
    }
  }, [])

  useEffect(() => {
    setEvents(initialEvents)
  }, [initialEvents])

  const createQueryString = useCallback(
    (name: string, value: string | number | null | undefined) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value !== null && value !== undefined && value !== "") {
        params.set(name, String(value))
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams],
  )

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    router.push(pathname + "?" + createQueryString("category", value))
  }

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
    const dateString = date ? format(date, "yyyy-MM-dd") : ""

    let newQueryString = createQueryString("date", dateString)
    if (timezoneOffset !== null) {
      newQueryString = createQueryString("timezoneOffset", timezoneOffset)
    }
    router.push(pathname + "?" + newQueryString)
  }

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
          page: "events",
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString(),
        })

        if (error) {
          console.error(`Error updating content for events.${section}.${key}:`, error)
        } else {
          updateCount++
        }
      }
    }

    if (updateCount > 0) {
      try {
        const revalidateResponse = await fetch(
          `/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/events`,
        )
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json()
          throw new Error(errorData.message || "재검증 실패")
        }
        revalidated = true
      } catch (error) {
        console.error("재검증 중 오류 발생:", error)
        alert("콘텐츠 업데이트는 성공했지만 페이지 재검증에 실패했습니다. 수동으로 새로고침해야 할 수 있습니다.")
      }
    }

    setChangedContent({})
    setIsPageEditing(false)
    setIsSavingAll(false)

    if (updateCount > 0) {
      alert(`콘텐츠가 성공적으로 업데이트되었습니다.${revalidated ? "" : " (재검증 실패)"}`)
      router.refresh()
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

  const isAdmin = userRole === "admin"

  const categories = useMemo(() => {
    const cats = ["all", ...new Set(events.map((event) => event.category).filter(Boolean) as string[])]
    return cats
  }, [events])

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (selectedCategory !== "all") {
      filtered = filtered.filter((event) => event.category === selectedCategory);
    }
    if (selectedDate) {
      const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
      filtered = filtered.filter((event) => format(new Date(event.event_date), "yyyy-MM-dd") === selectedDateStr);
    }
    return filtered;
  }, [events, selectedCategory, selectedDate]);


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    })
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "시간 미정"
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="fixed top-24 right-8 z-50 flex flex-col space-y-2">
          {!isPageEditing ? (
            <Button variant="outline" size="icon" onClick={() => setIsPageEditing(true)}>
              <Settings className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button variant="outline" size="icon" onClick={handleSaveAll} disabled={isSavingAll}>
                {isSavingAll ? <span className="animate-spin text-blue-500">🔄</span> : <Save className="h-5 w-5 text-green-600" />}
              </Button>
              <Button variant="outline" size="icon" onClick={handleCancelAll} className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent">
                <X className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white h-[25vh] flex items-center justify-center border-b-4 border-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2">
            <span className="text-3xl md:text-4xl">📅</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold mb-3">
            <EditableText
              page="events"
              section="header"
              contentKey="title"
              initialValue={initialContent.header?.title || "Church Events"}
              onContentChange={(section: string, key: string, value: string) =>
                handleContentChange("header", "title", value)
              }
              isEditingPage={isPageEditing}
              tag="span"
              className="text-white"
            />
          </h1>
          <p className="text-sm md:text-base text-blue-200 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="events"
              section="header"
              contentKey="description"
              initialValue={
                initialContent.header?.description ||
                "Join us for worship, fellowship, and community events that strengthen our faith together."
              }
              onContentChange={(section: string, key: string, value: string) =>
                handleContentChange("header", "description", value)
              }
              isEditingPage={isPageEditing}
              tag="span"
              className="text-sm md:text-base text-blue-200"
            />
          </p>
        </div>
      </div>

      {/* Filters */}
      <section className="py-8 bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-3xl mx-auto">
            <div className="flex-1 min-w-[200px]">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="h-10 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-blue-700" />
                    {selectedDate ? format(selectedDate, "yyyy년 MM월 dd일") : <span>Select Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border border-gray-200 rounded-md shadow-lg">
                  <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {selectedDate && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDateChange(undefined)}
                className="text-blue-700 hover:bg-blue-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-8">
         <div className="container mx-auto px-4 max-w-4xl">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">😔</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">No Events Found</h3>
              <p className="text-gray-700 text-base">Try selecting a different category or date.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex flex-col lg:flex-row cursor-pointer border border-gray-200 shadow-md bg-white w-full h-[220px]"> {/* 고정 높이 적용 */}
                  <Link href={`/events/${event.slug}`} passHref className="flex flex-grow flex-col lg:flex-row w-full h-full">
                    {event.image_url && (
                      <div className="relative w-full h-28 lg:h-full lg:w-[220px] flex-shrink-0">
                        <img
                          src={event.image_url || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/600x400/CCCCCC/000000?text=No+Image`
                          }}
                        />
                        {/* Date Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                          <span className="text-3xl font-bold">{format(new Date(event.event_date), "dd")}</span>
                          <span className="text-base font-medium">{format(new Date(event.event_date), "MMM yyyy")}</span>
                        </div>
                        {event.category && (
                          <span className="absolute top-4 left-4 bg-blue-700 text-yellow-300 text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                            {event.category}
                          </span>
                        )}
                      </div>
                    )}

                    <CardContent className="flex-grow p-2 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-blue-900 mb-0.5 line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-700 mb-1 line-clamp-3 leading-relaxed overflow-hidden"> {/* line-clamp-3 및 overflow-hidden 적용 */}
                          {event.description}
                        </p>
                      </div>

                      <div className="space-y-0.5 text-gray-700 border-t border-blue-100 pt-1">
                        {event.event_date && (
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2 text-blue-700" />
                            <span className="text-sm font-medium">{formatDate(event.event_date)}</span>
                          </div>
                        )}
                        {(event.start_time || event.end_time) && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                            <span className="text-sm font-medium">
                              {formatTime(event.start_time)}
                              {event.end_time && ` - ${formatTime(event.end_time)}`}
                            </span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-blue-700" />
                            <span className="text-sm font-medium">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}