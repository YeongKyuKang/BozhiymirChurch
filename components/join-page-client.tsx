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
import { Heart, Users, Calendar, Mail, Phone, MapPin, Handshake, Church, Lightbulb } from "lucide-react"
import EditableText from "@/components/editable-text"
import { useToast } from "@/hooks/use-toast" // ✅ 경로 수정됨 (components/ui -> hooks)
import { useLanguage } from "@/contexts/language-context"

interface JoinPageClientProps {
  initialContent: Record<string, any>
}

export default function JoinPageClient({ initialContent }: JoinPageClientProps) {
  const content = initialContent
  const { toast } = useToast()
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.age ||
      formData.interests.length === 0 ||
      !formData.message ||
      formData.message.length < 50
    ) {
      toast({
        title: t("필수 필드를 채워주세요."),
        description: t("이름, 성, 이메일, 전화번호, 연령대, 관심 분야, 메시지(최소 50자)는 필수 입력 사항입니다."),
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
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          age_group: formData.age,
          interests: formData.interests,
          message: formData.message,
          receive_updates: formData.newsletter,
          type: "join_request",
          subject: t("새로운 교회 가입 신청"),
        }),
      })

      if (response.ok) {
        toast({
          title: t("신청이 완료되었습니다!"),
          description: t("곧 연락드리겠습니다. 감사합니다."),
        })
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          age: "",
          interests: [],
          message: "",
          newsletter: false,
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || t("다시 시도해주세요."));
      }
    } catch (error: any) {
      toast({
        title: t("오류가 발생했습니다"),
        description: error.message || t("다시 시도해주세요."),
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
    "Sunday Service",
    "Bible Study",
    "Worship Team",
    "Youth & Young Adults",
    "Children's Ministry",
    "Volunteering",
    "Ukrainian Ministry",
    "Prayer Meeting",
  ]

  const whyJoinReasons = [
    {
      icon: <Heart className="h-7 w-7 text-blue-900" />,
      contentKeyTitle: "Community & Fellowship",
      contentKeyDescription: "Experience genuine connection and support within our vibrant church family.",
    },
    {
      icon: <Users className="h-7 w-7 text-blue-900" />,
      contentKeyTitle: "Spiritual Growth",
      contentKeyDescription: "Deepen your faith through engaging worship, insightful teachings, and prayer.",
    },
    {
      icon: <Calendar className="h-7 w-7 text-blue-900" />,
      contentKeyTitle: "Service & Outreach",
      contentKeyDescription: "Discover opportunities to serve others and make a positive impact in our community and beyond.",
    },
    {
      icon: <Lightbulb className="h-7 w-7 text-blue-900" />,
      contentKeyTitle: "Biblical Teaching",
      contentKeyDescription: "Receive sound, practical teaching rooted in God's Word that applies to everyday life.",
    },
    {
      icon: <Handshake className="h-7 w-7 text-blue-900" />,
      contentKeyTitle: "Prayer & Support",
      contentKeyDescription: "Find comfort and strength in our dedicated prayer ministry and caring support network.",
    },
    {
      icon: <Church className="h-7 w-7 text-blue-900" />,
      contentKeyTitle: "Mission & Vision",
      contentKeyDescription: "Be part of a church with a clear mission to spread the Gospel and make disciples.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white h-[25vh] flex items-center justify-center border-b-4 border-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <span className="text-4xl md:text-5xl">🤝</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-4xl font-extrabold mb-5">
            <EditableText
              page="join"
              section="main"
              contentKey="title"
              initialValue={content?.main?.title || "Join Our Church Family"}
              tag="span"
              className="text-white"
            />
          </h1>
          <p className="text-lg md:text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="join"
              section="main"
              contentKey="description"
              initialValue={
                content?.main?.description ||
                "Discover how to connect with Bozhiymir Church, attend our services, and become part of our loving community."
              }
              tag="span"
              className="text-lg md:text-xl text-blue-200"
              isTextArea={true}
            />
          </p>
        </div>
      </div>

      {/* Why Join Us */}
      <section className="py-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900">
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
            {whyJoinReasons.map((reason, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-2xl shadow-xl border border-blue-100 transform hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-4">
                  {reason.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3">
                  <EditableText
                    page="join"
                    section="why_join"
                    contentKey={`reason${index + 1}_title`}
                    initialValue={content?.why_join?.[`reason${index + 1}_title`] || reason.contentKeyTitle}
                    tag="span"
                    className="text-lg md:text-xl font-bold"
                  />
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  <EditableText
                    page="join"
                    section="why_join"
                    contentKey={`reason${index + 1}_description`}
                    initialValue={content?.why_join?.[`reason${index + 1}_description`] || reason.contentKeyDescription}
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
      <section className="py-8">
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
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-blue-900 font-semibold text-base">
                        {t("First Name")} *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="mt-3 h-12 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base"
                        placeholder={t("Enter your first name")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-blue-900 font-semibold text-base">
                        {t("Last Name")} *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="mt-3 h-12 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base"
                        placeholder={t("Enter your last name")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email" className="text-blue-900 font-semibold text-base">
                        {t("Email Address")} *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-3 h-12 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base"
                        placeholder={t("Enter your email address")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-blue-900 font-semibold text-base">
                        {t("Phone Number")} *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-3 h-12 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base"
                        placeholder={t("Enter your phone number")} 
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="age" className="text-blue-900 font-semibold text-base">
                      {t("Age Group")}</Label>
                    <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })} required>
                      <SelectTrigger className="mt-3 h-12 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base">
                        <SelectValue placeholder={t("Select your age group")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10s">{t("10-19")}</SelectItem>
                        <SelectItem value="20s">{t("20-29")}</SelectItem>
                        <SelectItem value="30s">{t("30-39")}</SelectItem>
                        <SelectItem value="40s">{t("40-49")}</SelectItem>
                        <SelectItem value="50s">{t("50-59")}</SelectItem>
                        <SelectItem value="60s">{t("60+")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-blue-900 font-semibold text-base mb-4 block">
                      {t("Areas of Interest (Select all that apply)")}
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
                          <Label htmlFor={interest} className="text-sm cursor-pointer text-gray-700">
                            {t(interest)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-blue-900 font-semibold text-base">
                      {t("Message")} *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-3 border-blue-300 focus:border-blue-700 focus:ring-blue-700 text-base"
                      placeholder={t("Tell us about yourself or any questions you have (minimum 50 characters)")}
                      required
                      minLength={50}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-bold text-lg rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {isSubmitting ? t("Submitting...") : t("Submit Application")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-10 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
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
              <CardContent className="p-6">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-lg md:text-xl font-bold mb-3">
                  {t("Address")}
                </h3>
                <p className="text-blue-200 leading-relaxed">
                  <EditableText
                    page="join"
                    section="contact"
                    contentKey="address"
                    initialValue={content?.contact?.address || "Poloneza 87,\n02-826 Warszawa"}
                    tag="span"
                    className="text-blue-200"
                    isTextArea={true}
                  />
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-xl bg-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <Phone className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-lg md:text-xl font-bold mb-3">
                  {t("Phone")}
                </h3>
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
              <CardContent className="p-6">
                <Mail className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-lg md:text-xl font-bold mb-3">
                  {t("Email")}
                </h3>
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
          {/* Service Times (EditableText로 관리되지 않는 텍스트) */}
          <div className="mt-8 text-center text-blue-200">
            <p className="text-xl font-semibold mb-2">
              {t("Service Times")}
            </p>
            <p className="text-lg">
              {t("Sunday: 9:00 AM, 10:30 AM, 12:00 PM\nWednesday: 7:00 PM")}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}