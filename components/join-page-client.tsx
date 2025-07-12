"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Users, Calendar, Mail, Phone, MapPin } from "lucide-react"
import EditableText from "@/components/editable-text"
import { useToast } from "@/components/ui/use-toast"

interface JoinPageClientProps {
  initialContent: Record<string, any>
}

export default function JoinPageClient({ initialContent }: JoinPageClientProps) {
  const content = initialContent
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    interests: [] as string[],
    message: "",
    newsletter: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type: "join_request",
          subject: "새로운 교회 가입 신청",
        }),
      })

      if (response.ok) {
        toast({
          title: "신청이 완료되었습니다!",
          description: "곧 연락드리겠습니다. 감사합니다.",
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          age: "",
          interests: [],
          message: "",
          newsletter: false,
        })
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      toast({
        title: "오류가 발생했습니다",
        description: "다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked ? [...prev.interests, interest] : prev.interests.filter((i) => i !== interest),
    }))
  }

  const interests = [
    "주일 예배",
    "성경 공부",
    "찬양팀",
    "청년부",
    "어린이부",
    "봉사활동",
    "우크라이나 사역",
    "기도 모임",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-8 md:py-12 lg:py-16 px-4 pt-20 md:pt-24 lg:pt-32">
        <div className="container mx-auto text-center">
          <div className="text-4xl md:text-6xl mb-4 md:mb-6">🏠</div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            <EditableText
              page="join"
              section="hero"
              contentKey="title"
              initialValue={content?.hero?.title}
              tag="span"
              className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900"
            />
          </h1>
          <div className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8">
            <EditableText
              page="join"
              section="hero"
              contentKey="subtitle"
              initialValue={content?.hero?.subtitle}
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

      {/* Why Join Us */}
      <section className="py-8 md:py-12 lg:py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-8 md:mb-12">
            <EditableText
              page="join"
              section="why_join"
              contentKey="title"
              initialValue={content?.why_join?.title}
              tag="span"
              className="text-xl md:text-2xl lg:text-3xl font-bold text-center"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <Heart className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-yellow-400" />
              <h3 className="text-lg md:text-xl font-bold mb-2">
                <EditableText
                  page="join"
                  section="why_join"
                  contentKey="reason1_title"
                  initialValue={content?.why_join?.reason1_title}
                  tag="span"
                  className="text-lg md:text-xl font-bold"
                />
              </h3>
              <div className="text-sm md:text-base opacity-90">
                <EditableText
                  page="join"
                  section="why_join"
                  contentKey="reason1_description"
                  initialValue={content?.why_join?.reason1_description}
                  tag="span"
                  className="text-sm md:text-base opacity-90"
                  isTextArea={true}
                />
              </div>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-yellow-400" />
              <h3 className="text-lg md:text-xl font-bold mb-2">
                <EditableText
                  page="join"
                  section="why_join"
                  contentKey="reason2_title"
                  initialValue={content?.why_join?.reason2_title}
                  tag="span"
                  className="text-lg md:text-xl font-bold"
                />
              </h3>
              <div className="text-sm md:text-base opacity-90">
                <EditableText
                  page="join"
                  section="why_join"
                  contentKey="reason2_description"
                  initialValue={content?.why_join?.reason2_description}
                  tag="span"
                  className="text-sm md:text-base opacity-90"
                  isTextArea={true}
                />
              </div>
            </div>
            <div className="text-center">
              <Calendar className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-yellow-400" />
              <h3 className="text-lg md:text-xl font-bold mb-2">
                <EditableText
                  page="join"
                  section="why_join"
                  contentKey="reason3_title"
                  initialValue={content?.why_join?.reason3_title}
                  tag="span"
                  className="text-lg md:text-xl font-bold"
                />
              </h3>
              <div className="text-sm md:text-base opacity-90">
                <EditableText
                  page="join"
                  section="why_join"
                  contentKey="reason3_description"
                  initialValue={content?.why_join?.reason3_description}
                  tag="span"
                  className="text-sm md:text-base opacity-90"
                  isTextArea={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Form */}
      <section className="py-8 md:py-12 lg:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-6 md:mb-8">
            <EditableText
              page="join"
              section="form"
              contentKey="title"
              initialValue={content?.form?.title}
              tag="span"
              className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900"
            />
          </h2>
          <Card>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <Label htmlFor="name" className="text-sm md:text-base">
                      이름 *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1"
                      placeholder="성함을 입력해주세요"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm md:text-base">
                      이메일 *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1"
                      placeholder="이메일을 입력해주세요"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-sm md:text-base">
                      전화번호
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1"
                      placeholder="전화번호를 입력해주세요"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-sm md:text-base">
                      연령대
                    </Label>
                    <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="연령대를 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10s">10대</SelectItem>
                        <SelectItem value="20s">20대</SelectItem>
                        <SelectItem value="30s">30대</SelectItem>
                        <SelectItem value="40s">40대</SelectItem>
                        <SelectItem value="50s">50대</SelectItem>
                        <SelectItem value="60s">60대 이상</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm md:text-base mb-3 block">관심 있는 활동 (복수 선택 가능)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {interests.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={formData.interests.includes(interest)}
                          onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                        />
                        <Label htmlFor={interest} className="text-xs md:text-sm cursor-pointer">
                          {interest}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm md:text-base">
                    메시지
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-1"
                    rows={4}
                    placeholder="교회에 대해 궁금한 점이나 하고 싶은 말씀을 자유롭게 적어주세요"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.newsletter}
                    onCheckedChange={(checked) => setFormData({ ...formData, newsletter: checked as boolean })}
                  />
                  <Label htmlFor="newsletter" className="text-xs md:text-sm cursor-pointer">
                    교회 소식 및 이벤트 알림을 받겠습니다
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-base md:text-lg py-3"
                >
                  {isSubmitting ? "제출 중..." : "가입 신청하기"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-8 md:py-12 lg:py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
            <EditableText
              page="join"
              section="contact"
              contentKey="title"
              initialValue={content?.contact?.title}
              tag="span"
              className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-900"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <MapPin className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-blue-600" />
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">주소</h3>
                <div className="text-sm md:text-base text-gray-600">
                  <EditableText
                    page="join"
                    section="contact"
                    contentKey="address"
                    initialValue={content?.contact?.address}
                    tag="span"
                    className="text-sm md:text-base text-gray-600"
                    isTextArea={true}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Phone className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-green-600" />
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">전화</h3>
                <div className="text-sm md:text-base text-gray-600">
                  <EditableText
                    page="join"
                    section="contact"
                    contentKey="phone"
                    initialValue={content?.contact?.phone}
                    tag="span"
                    className="text-sm md:text-base text-gray-600"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Mail className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-purple-600" />
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">이메일</h3>
                <div className="text-sm md:text-base text-gray-600">
                  <EditableText
                    page="join"
                    section="contact"
                    contentKey="email"
                    initialValue={content?.contact?.email}
                    tag="span"
                    className="text-sm md:text-base text-gray-600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
