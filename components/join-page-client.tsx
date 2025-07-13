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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-20 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="text-5xl mb-6">🏠</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            <EditableText
              page="join"
              section="hero"
              contentKey="title"
              initialValue={content?.hero?.title || "Join Our Family"}
              tag="span"
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
            />
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="join"
              section="hero"
              contentKey="subtitle"
              initialValue={
                content?.hero?.subtitle ||
                "Become part of our loving church community where faith, hope, and love come together."
              }
              tag="span"
              className="text-xl md:text-2xl text-blue-200"
              isTextArea={true}
            />
          </p>
        </div>
      </div>

      {/* Why Join Us */}
      <section className="py-20 bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
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
            <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-blue-100 transform hover:scale-105 transition-transform duration-300">
              <Heart className="h-12 w-12 mx-auto mb-6 text-blue-700" />
              <h3 className="text-xl md:text-2xl font-bold mb-4">
                <EditableText
                  page="join"
                  section="why_join"
                  contentKey="reason1_title"
                  initialValue={content?.why_join?.reason1_title || "Spiritual Growth"}
                  tag="span"
                  className="text-xl md:text-2xl font-bold"
                />
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <EditableText
                  page="join"
                  section="why_join"
                  contentKey="reason1_description"
                  initialValue={
                    content?.why_join?.reason1_description ||
                    "Grow in your faith through worship, Bible study, and fellowship with other believers."
                  }
                  tag="span"
                  className="text-gray-700"
                  isTextArea={true}
                />
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-yellow-100 transform hover:scale-105 transition-transform duration-300">
              <Users className="h-12 w-12 mx-auto mb-6 text-yellow-700" />
              <h3 className="text-xl md:text-2xl font-bold mb-4">
                <EditableText
                  page="join"
                  section="why_join"
                  contentKey="reason2_title"
                  initialValue={content?.why_join?.reason2_title || "Community"}
                  tag="span"
                  className="text-xl md:text-2xl font-bold"
                />
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <EditableText
                  page="join"
                  section="why_join"
                  contentKey="reason2_description"
                  initialValue={
                    content?.why_join?.reason2_description ||
                    "Build meaningful relationships and find support in our caring church family."
                  }
                  tag="span"
                  className="text-gray-700"
                  isTextArea={true}
                />
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-blue-100 transform hover:scale-105 transition-transform duration-300">
              <Calendar className="h-12 w-12 mx-auto mb-6 text-blue-700" />
              <h3 className="text-xl md:text-2xl font-bold mb-4">
                <EditableText
                  page="join"
                  section="why_join"
                  contentKey="reason3_title"
                  initialValue={content?.why_join?.reason3_title || "Purpose"}
                  tag="span"
                  className="text-xl md:text-2xl font-bold"
                />
              </h3>
              <p className="text-gray-700 leading-relaxed">
                <EditableText
                  page="join"
                  section="why_join"
                  contentKey="reason3_description"
                  initialValue={
                    content?.why_join?.reason3_description ||
                    "Discover your calling and make a difference in your community and the world."
                  }
                  tag="span"
                  className="text-gray-700"
                  isTextArea={true}
                />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-16">
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
              <CardContent className="p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <Label htmlFor="name" className="text-blue-900 font-semibold text-lg">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-3 h-14 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-lg"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-blue-900 font-semibold text-lg">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-3 h-14 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-lg"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <Label htmlFor="phone" className="text-blue-900 font-semibold text-lg">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-3 h-14 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-lg"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age" className="text-blue-900 font-semibold text-lg">
                        Age Group
                      </Label>
                      <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                        <SelectTrigger className="mt-3 h-14 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-lg">
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
                    <Label className="text-blue-900 font-semibold text-lg mb-6 block">
                      Areas of Interest (Select all that apply)
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {interests.map((interest) => (
                        <div key={interest} className="flex items-center space-x-3">
                          <Checkbox
                            id={interest}
                            checked={formData.interests.includes(interest)}
                            onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                            className="border-blue-500 data-[state=checked]:bg-blue-700 data-[state=checked]:text-white"
                          />
                          <Label htmlFor={interest} className="text-base cursor-pointer text-gray-700">
                            {interest}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-blue-900 font-semibold text-lg">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-3 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-lg"
                      rows={5}
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
                    <Label htmlFor="newsletter" className="text-base cursor-pointer text-gray-700">
                      I would like to receive church news and event updates
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-bold text-xl rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
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
      <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
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
              <CardContent className="p-8">
                <MapPin className="h-12 w-12 mx-auto mb-6 text-yellow-500" />
                <h3 className="text-xl md:text-2xl font-bold mb-4">Address</h3>
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
              <CardContent className="p-8">
                <Phone className="h-12 w-12 mx-auto mb-6 text-yellow-500" />
                <h3 className="text-xl md:text-2xl font-bold mb-4">Phone</h3>
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
              <CardContent className="p-8">
                <Mail className="h-12 w-12 mx-auto mb-6 text-yellow-500" />
                <h3 className="text-xl md:text-2xl font-bold mb-4">Email</h3>
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
    </div>
  )
}
