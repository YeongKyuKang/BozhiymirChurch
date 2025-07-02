"use client"; // 이 파일은 클라이언트 컴포넌트임을 명시합니다.

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Settings, Save, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import EditableText from "@/components/editable-text";
import { MapPin, Clock, Phone, Mail, Users, Heart, Star } from "lucide-react";
import { Input } from "@/components/ui/input"; // 폼에 사용될 Input
import { Textarea } from "@/components/ui/textarea"; // 폼에 사용될 Textarea
import { Checkbox } from "@/components/ui/checkbox"; // 폼에 사용될 Checkbox
import { Label } from "@/components/ui/label"; // 폼에 사용될 Label


interface JoinPageClientProps {
  initialContent: Record<string, any>;
}

export default function JoinPageClient({ initialContent }: JoinPageClientProps) {
  const { userRole } = useAuth();
  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);

  const handleContentChange = (section: string, key: string, value: string) => {
    setChangedContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value
      }
    }));
  };

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    let updateCount = 0;
    let revalidated = false;

    for (const section in changedContent) {
      for (const key in changedContent[section]) {
        const value = changedContent[section][key];
        const { error } = await supabase.from('content').upsert({
          page: 'join',
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.error(`Error updating content for join.${section}.${key}:`, error);
        } else {
          updateCount++;
        }
      }
    }

    if (updateCount > 0) {
      try {
        const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/join`);
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json();
          console.error("Revalidation failed:", errorData.message);
        } else {
          revalidated = true;
          console.log("Join page revalidated successfully!");
        }
      } catch (err) {
        console.error("Failed to call revalidate API:", err);
      }
    }

    setIsSavingAll(false);
    setIsPageEditing(false);
    setChangedContent({});

    if (updateCount > 0 && revalidated) {
      alert("모든 변경 사항이 저장되고 가입 페이지가 업데이트되었습니다. 새로고침하면 반영됩니다.");
    } else if (updateCount > 0 && !revalidated) {
        alert("일부 변경 사항은 저장되었지만, 가입 페이지 재검증에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.");
    } else {
        alert("변경된 내용이 없거나 저장에 실패했습니다.");
    }
  };

  const handleCancelAll = () => {
    if (confirm("모든 변경 사항을 취소하시겠습니까?")) {
      setChangedContent({});
      setIsPageEditing(false);
    }
  };

  const serviceInfo = [
    {
      time: "9:00 AM",
      styleKey: "service_style_1",
      descriptionKey: "service_description_1",
      icon: <Star className="h-6 w-6" />,
    },
    {
      time: "10:30 AM",
      styleKey: "service_style_2",
      descriptionKey: "service_description_2",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      time: "12:00 PM",
      styleKey: "service_style_3",
      descriptionKey: "service_description_3",
      icon: <Users className="h-6 w-6" />,
    },
  ]

  const whatToExpect = [
    {
      titleKey: "expect_title_1",
      descriptionKey: "expect_description_1",
      icon: "🤝",
    },
    {
      titleKey: "expect_title_2",
      descriptionKey: "expect_description_2",
      icon: "🎶",
    },
    {
      titleKey: "expect_title_3",
      descriptionKey: "expect_description_3",
      icon: "🫂",
    },
    {
      titleKey: "expect_title_4",
      descriptionKey: "expect_description_4",
      icon: "👧",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 전역 편집 모드 버튼 */}
      {userRole === 'admin' && (
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
              <Button variant="outline" size="icon" onClick={handleCancelAll} disabled={isSavingAll}>
                <X className="h-5 w-5 text-red-600" />
              </Button>
            </>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 px-4 pt-32">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <EditableText
                page="join"
                section="main"
                contentKey="title"
                initialValue={initialContent?.main?.title}
                isEditingPage={isPageEditing}
                onContentChange={handleContentChange}
                tag="span"
                className="text-5xl font-bold text-gray-900 mb-6"
            />
          </h1>
          {/* <p> 태그를 <div>로 변경 */}
          <div className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            <EditableText
                page="join"
                section="main"
                contentKey="description"
                initialValue={initialContent?.main?.description}
                isEditingPage={isPageEditing}
                onContentChange={handleContentChange}
                tag="span"
                className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
            />
          </div>
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            <EditableText page="join" section="services" contentKey="services_title" initialValue={initialContent?.services?.services_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold text-center text-gray-900 mb-12" />
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {serviceInfo.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <div className="text-blue-600 mb-4 flex justify-center">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.time}</h3>
                  <h4 className="text-lg font-semibold text-blue-600 mb-3">
                    <EditableText page="join" section="services" contentKey={service.styleKey} initialValue={initialContent?.services?.[service.styleKey]} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-lg font-semibold text-blue-600 mb-3" />
                  </h4>
                  <div className="text-gray-600">
                    <EditableText page="join" section="services" contentKey={service.descriptionKey} initialValue={initialContent?.services?.[service.descriptionKey]} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <div className="text-lg text-gray-600 mb-4">
              <EditableText page="join" section="services" contentKey="services_footer_text" initialValue={initialContent?.services?.services_footer_text} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-lg text-gray-600 mb-4" />
            </div>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Plan Your Visit
            </Button>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            <EditableText page="join" section="expect" contentKey="expect_title" initialValue={initialContent?.expect?.expect_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold text-center text-gray-900 mb-12" />
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whatToExpect.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    <EditableText page="join" section="expect" contentKey={item.titleKey} initialValue={initialContent?.expect?.[item.titleKey]} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-xl font-bold text-gray-900 mb-2" />
                  </h3>
                  <div className="text-gray-600">
                    <EditableText page="join" section="expect" contentKey={item.descriptionKey} initialValue={initialContent?.expect?.[item.descriptionKey]} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                <EditableText page="join" section="contact" contentKey="visit_title" initialValue={initialContent?.contact?.visit_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold text-gray-900 mb-8" />
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <div className="text-gray-600">
                      <EditableText page="join" section="contact" contentKey="address" initialValue={initialContent?.contact?.address} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-gray-600" isTextArea={true} />
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Service Times</h3>
                    <div className="text-gray-600">
                      <EditableText page="join" section="contact" contentKey="service_times" initialValue={initialContent?.contact?.service_times} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-gray-600" isTextArea={true} />
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <div className="text-gray-600">
                      <EditableText page="join" section="contact" contentKey="phone" initialValue={initialContent?.contact?.phone} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-gray-600" />
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <div className="text-gray-600">
                      <EditableText page="join" section="contact" contentKey="email" initialValue={initialContent?.contact?.email} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Get Connected</h2>
              <Card>
                <CardContent className="p-6">
                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">First Name</Label>
                        <Input id="name" placeholder="Your first name" />
                      </div>
                      <div>
                        <Label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-2">Last Name</Label>
                        <Input id="last-name" placeholder="Your last name" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</Label>
                      <Input id="email" type="email" placeholder="your.email@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</Label>
                      <Input id="phone" type="tel" placeholder="(503) 555-0123" />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">I'm interested in:</Label>
                      <div className="space-y-2">
                        <label htmlFor="visiting" className="flex items-center">
                          <Checkbox id="visiting" className="mr-2" />
                          <span className="text-sm">Visiting for the first time</span>
                        </label>
                        <label htmlFor="joining" className="flex items-center">
                          <Checkbox id="joining" className="mr-2" />
                          <span className="text-sm">Joining the church</span>
                        </label>
                        <label htmlFor="volunteering" className="flex items-center">
                          <Checkbox id="volunteering" className="mr-2" />
                          <span className="text-sm">Volunteering opportunities</span>
                        </label>
                        <label htmlFor="ukrainian-ministry" className="flex items-center">
                          <Checkbox id="ukrainian-ministry" className="mr-2" />
                          <span className="text-sm">Ukrainian children ministry</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</Label>
                      <Textarea id="message" placeholder="Tell us how we can help you connect..." rows={4} />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Ukrainian Ministry Highlight */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-yellow-400 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            <EditableText page="join" section="ministry_highlight" contentKey="highlight_title" initialValue={initialContent?.ministry_highlight?.highlight_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold mb-8" />
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="text-6xl mb-6">🇺🇦</div>
            <h3 className="text-2xl font-bold mb-4">
              <EditableText page="join" section="ministry_highlight" contentKey="highlight_subtitle" initialValue={initialContent?.ministry_highlight?.highlight_subtitle} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-2xl font-bold mb-4" />
            </h3>
            <div className="text-xl mb-8 opacity-90">
              <EditableText page="join" section="ministry_highlight" contentKey="highlight_description" initialValue={initialContent?.ministry_highlight?.highlight_description} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-xl mb-8 opacity-90" />
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-3xl font-bold">
                  <EditableText page="join" section="ministry_highlight" contentKey="stat1_number" initialValue={initialContent?.ministry_highlight?.stat1_number} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold" />
                </div>
                <div className="opacity-90">
                  <EditableText page="join" section="ministry_highlight" contentKey="stat1_label" initialValue={initialContent?.ministry_highlight?.stat1_label} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="opacity-90" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  <EditableText page="join" section="ministry_highlight" contentKey="stat2_number" initialValue={initialContent?.ministry_highlight?.stat2_number} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold" />
                </div>
                <div className="opacity-90">
                  <EditableText page="join" section="ministry_highlight" contentKey="stat2_label" initialValue={initialContent?.ministry_highlight?.stat2_label} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="opacity-90" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  <EditableText page="join" section="ministry_highlight" contentKey="stat3_number" initialValue={initialContent?.ministry_highlight?.stat3_number} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold" />
                </div>
                <div className="opacity-90">
                  <EditableText page="join" section="ministry_highlight" contentKey="stat3_label" initialValue={initialContent?.ministry_highlight?.stat3_label} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="opacity-90" />
                </div>
              </div>
            </div>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/ukrainian-ministry">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            <EditableText page="join" section="cta" contentKey="cta_title" initialValue={initialContent?.cta?.cta_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold text-gray-900 mb-6" />
          </h2>
          <div className="text-xl text-gray-600 mb-8">
            <EditableText page="join" section="cta" contentKey="cta_description" initialValue={initialContent?.cta?.cta_description} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-xl text-gray-600 mb-8" />
          </div>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="tel:(503)555-0123">Call Us</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}