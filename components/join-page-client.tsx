// components/join-page-client.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // CardHeader, CardTitle 추가
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Users, Calendar, Mail, Phone, MapPin, Handshake, Church, Lightbulb } from "lucide-react" // 모든 아이콘 임포트
import EditableText from "@/components/editable-text"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link" // Link 컴포넌트 임포트

// Supabase 클라이언트는 서버 컴포넌트에서 초기화되므로,
// 클라이언트 컴포넌트에서는 직접 임포트하지 않고 API 라우트를 통해 통신합니다.
// import { supabase } from "@/lib/supabase" // 이 부분은 제거

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

    // 필수 필드 유효성 검사
    if (!formData.name || !formData.email || !formData.age || formData.interests.length === 0 || !formData.message) {
      toast({
        title: "필수 필드를 채워주세요.",
        description: "이름, 이메일, 연령대, 관심 분야, 메시지는 필수 입력 사항입니다.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.name, // formData.name으로 변경
          email: formData.email,
          phone_number: formData.phone, // formData.phone으로 변경
          age_group: formData.age, // formData.age로 변경
          interests: formData.interests,
          message: formData.message,
          receive_updates: formData.newsletter, // formData.newsletter로 변경
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
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit")
      }
    } catch (error: any) {
      toast({
        title: "오류가 발생했습니다",
        description: error.message || "다시 시도해주세요.",
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

  const interestOptions = [
    "주일 예배",
    "성경 공부",
    "찬양팀",
    "청년부",
    "어린이부",
    "봉사활동",
    "우크라이나 사역",
    "기도 모임",
  ]

  const whyJoinReasons = [ // reasons 배열 이름 변경하여 충돌 방지
    {
      icon: <Heart className="h-7 w-7 text-blue-900" />,
      titleKey: "reason1_title",
      descriptionKey: "reason1_description",
    },
    {
      icon: <Users className="h-7 w-7 text-blue-900" />,
      titleKey: "reason2_title",
      descriptionKey: "reason2_description",
    },
    {
      icon: <Calendar className="h-7 w-7 text-blue-900" />, // Calendar 아이콘 사용
      titleKey: "reason3_title",
      descriptionKey: "reason3_description",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white h-[40vh] flex items-center justify-center border-b-4 border-yellow-500"> {/* h-[50vh] -> h-[40vh] */}
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <span className="text-4xl md:text-5xl">🤝</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-4xl font-extrabold mb-5">
            <EditableText
              page="join"
              section="hero"
              contentKey="title"
              initialValue={content?.hero?.title || "Join Our Church Family"}
              tag="span"
              className="text-white"
            />
          </h1>
          <p className="text-lg md:text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="join"
              section="hero"
              contentKey="description"
              initialValue={
                content?.hero?.description ||
                "Find your spiritual home and grow in faith with a loving community."
              }
              tag="span"
              className="text-lg md:text-xl text-blue-200"
              isTextArea={true}
            />
          </p>
        </div>
      </div>

      {/* Why Join Us */}
      <section className="py-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900"> {/* py-10 -> py-8 */}
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            <EditableText
              page="join"
              section="why_join"
              contentKey="title"
              initialValue={content?.why_join?.title || "Why Join Our Community?"}
              tag="span"
              className="text-3xl md:text-4xl font-bold text-center text-blue-900"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {whyJoinReasons.map((reason, index) => ( // whyJoinReasons 사용
              <div key={index} className="text-center bg-white p-6 rounded-2xl shadow-xl border border-blue-100 transform hover:scale-105 transition-transform duration-300"> {/* p-8 -> p-6 */}
                <div className="flex justify-center mb-4"> {/* mb-6 -> mb-4 */}
                  {reason.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3"> {/* text-xl md:text-2xl -> text-lg md:text-xl, mb-4 -> mb-3 */}
                  <EditableText
                    page="join"
                    section="why_join"
                    contentKey={reason.titleKey}
                    initialValue={content?.why_join?.[reason.titleKey] || `Reason ${index + 1}`}
                    tag="span"
                    className="text-lg md:text-xl font-bold"
                  />
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <EditableText
                    page="join"
                    section="why_join"
                    contentKey={reason.descriptionKey}
                    initialValue={
                      content?.why_join?.[reason.descriptionKey] ||
                      "Description of this reason."
                    }
                    tag="span"
                    className="text-gray-700"
                    isTextArea={true}
                  />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Form */}
      <section className="py-8"> {/* py-10 -> py-8 */}
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-8">
              <EditableText
                page="join"
                section="form"
                contentKey="title"
                initialValue={content?.form?.title || "Get Connected"}
                tag="span"
                className="text-3xl md:text-4xl font-bold text-center text-blue-900"
              />
            </h2>
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50">
              <CardContent className="p-8"> {/* p-12 -> p-8 */}
                <form onSubmit={handleSubmit} className="space-y-6"> {/* space-y-8 -> space-y-6 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* gap-8 -> gap-6 */}
                    <div>
                      <Label htmlFor="fullName" className="text-blue-900 font-semibold text-base"> {/* text-lg -> text-base */}
                        Full Name *</Label>
                      <Input
                        id="fullName"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-3 h-12 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-blue-900 font-semibold text-base"> {/* text-lg -> text-base */}
                        Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-3 h-12 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* gap-8 -> gap-6 */}
                    <div>
                      <Label htmlFor="phone" className="text-blue-900 font-semibold text-base"> {/* text-lg -> text-base */}
                        Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-3 h-12 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age" className="text-blue-900 font-semibold text-base"> {/* text-lg -> text-base */}
                        Age Group</Label>
                      <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                        <SelectTrigger className="mt-3 h-12 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base"> {/* h-14 -> h-12, text-lg -> text-base */}
                          <SelectValue placeholder="Select your age group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10s">10-19</SelectItem>
                          <SelectItem value="20s">20-29</SelectItem>
                          <SelectItem value="30s">30-39</SelectItem>
                          <SelectItem value="40s">40-49</SelectItem>
                          <SelectItem value="50s">50-59</SelectItem>
                          <SelectItem value="60s">60+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-blue-900 font-semibold text-base mb-4 block"> {/* text-lg -> text-base, mb-6 -> mb-4 */}
                      Areas of Interest (Select all that apply)
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {interestOptions.map((interest) => (
                        <div key={interest} className="flex items-center space-x-3">
                          <Checkbox
                            id={interest}
                            checked={formData.interests.includes(interest)}
                            onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                            className="border-blue-500 data-[state=checked]:bg-blue-700 data-[state=checked]:text-white"
                          />
                          <Label htmlFor={interest} className="text-sm cursor-pointer text-gray-700"> {/* text-base -> text-sm */}
                            {interest}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-blue-900 font-semibold text-base"> {/* text-lg -> text-base */}
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-3 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base"
                      rows={4}
                      placeholder="Tell us about yourself or any questions you have"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="newsletter"
                      checked={formData.newsletter}
                      onCheckedChange={(checked) => setFormData({ ...formData, newsletter: checked as boolean })}
                      className="border-blue-500 data-[state=checked]:bg-blue-700 data-[state=checked]:text-white"
                    />
                    <Label htmlFor="newsletter" className="text-sm cursor-pointer text-gray-700"> {/* text-base -> text-sm */}
                      I would like to receive church news and event updates
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-bold text-lg rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-10 bg-gradient-to-r from-blue-700 to-blue-800 text-white"> {/* py-12 -> py-10 */}
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            <EditableText
              page="join"
              section="contact"
              contentKey="title"
              initialValue={content?.contact?.title || "Get In Touch"}
              tag="span"
              className="text-3xl md:text-4xl font-bold text-center"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card className="text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-xl bg-white/10 backdrop-blur-sm">
              <CardContent className="p-6"> {/* p-8 -> p-6 */}
                <MapPin className="h-12 w-12 mx-auto mb-4 text-yellow-500" /> {/* mb-6 -> mb-4 */}
                <h3 className="text-lg md:text-xl font-bold mb-3">Address</h3> {/* text-xl md:text-2xl -> text-lg md:text-xl, mb-4 -> mb-3 */}
                <p className="text-blue-200 leading-relaxed">
                  <EditableText
                    page="join"
                    section="contact"
                    contentKey="address"
                    initialValue={content?.contact?.address || "123 Church Street\nYour City, State 12345"}
                    tag="span"
                    className="text-blue-200"
                    isTextArea={true}
                  />
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-xl bg-white/10 backdrop-blur-sm">
              <CardContent className="p-6"> {/* p-8 -> p-6 */}
                <Phone className="h-12 w-12 mx-auto mb-4 text-yellow-500" /> {/* mb-6 -> mb-4 */}
                <h3 className="text-lg md:text-xl font-bold mb-3">Phone</h3> {/* text-xl md:text-2xl -> text-lg md:text-xl, mb-4 -> mb-3 */}
                <p className="text-blue-200">
                  <EditableText
                    page="join"
                    section="contact"
                    contentKey="phone"
                    initialValue={content?.contact?.phone || "(555) 123-4567"}
                    tag="span"
                    className="text-blue-200"
                  />
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-xl bg-white/10 backdrop-blur-sm">
              <CardContent className="p-6"> {/* p-8 -> p-6 */}
                <Mail className="h-12 w-12 mx-auto mb-4 text-yellow-500" /> {/* mb-6 -> mb-4 */}
                <h3 className="text-lg md:text-xl font-bold mb-3">Email</h3> {/* text-xl md:text-2xl -> text-lg md:text-xl, mb-4 -> mb-3 */}
                <p className="text-blue-200">
                  <EditableText
                    page="join"
                    section="contact"
                    contentKey="email"
                    initialValue={content?.contact?.email || "info@bozhiymirchurch.com"}
                    tag="span"
                    className="text-blue-200"
                  />
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section (기존 Call to Action 섹션 유지) */}
      <section className="py-8 bg-gradient-to-br from-blue-50 via-white to-yellow-50 text-center"> {/* py-10 -> py-8 */}
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-2xl font-extrabold text-blue-900 mb-5">
            <EditableText
              page="join"
              section="cta"
              contentKey="title"
              initialValue={content?.cta?.title || "Ready to Join?"}
              tag="span"
              className="text-blue-900"
            />
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-7 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="join"
              section="cta"
              contentKey="description"
              initialValue={
                content?.cta?.description ||
                "We're excited to welcome you into our church family. Let us know how we can help."
              }
              tag="span"
              className="text-gray-700"
              isTextArea={true}
            />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-bold px-10 py-4 text-xl rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-yellow-700 text-yellow-700 hover:bg-yellow-700 hover:text-white font-bold px-10 py-4 text-xl rounded-full bg-transparent shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/events">View Events</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
