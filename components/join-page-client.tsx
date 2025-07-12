// components/join-page-client.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Settings, Save, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import EditableText from "@/components/editable-text";
import { MapPin, Clock, Phone, Mail, Users, Heart, Star, HelpingHand } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


interface JoinPageClientProps {
  initialContent: Record<string, any>;
}

export default function JoinPageClient({ initialContent }: JoinPageClientProps) {
  const { userRole } = useAuth();
  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    interests: {
      visiting: false,
      joining: false,
      volunteering: false,
      ukrainianMinistry: false,
    },
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isError, setIsError] = useState(false);


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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      interests: {
        ...prev.interests,
        [id]: checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitMessage('');
    setIsError(false);

    try {
      if (!formData.first_name || !formData.last_name || !formData.email) {
        setSubmitMessage('이름과 이메일은 필수 입력 사항입니다.');
        setIsError(true);
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          interests: Object.keys(formData.interests).filter(key => (formData.interests as any)[key]),
          message: formData.message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '폼 제출에 실패했습니다.');
      }

      setSubmitMessage('메시지가 성공적으로 전송되었습니다!');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        interests: {
          visiting: false,
          joining: false,
          volunteering: false,
          ukrainianMinistry: false,
        },
        message: '',
      });
    } catch (error: any) {
      console.error('폼 제출 오류:', error);
      setSubmitMessage(`폼 제출에 실패했습니다: ${error.message}`);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };


  const isAdmin = userRole === 'admin';

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
      {isAdmin && (
        <div className="fixed top-24 right-8 z-50 flex flex-col space-y-2">
          {!isPageEditing ? (
            <Button variant="outline" size="icon" onClick={() => setIsPageEditing(true)}>
              <Settings className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button onClick={handleSaveAll} className="mr-2" disabled={isSavingAll}>
                {isSavingAll ? <span className="animate-spin text-blue-500">🔄</span> : <Save className="h-5 w-5 text-green-600" />}
              </Button>
              <Button onClick={handleCancelAll} variant="outline">
                <X className="h-5 w-5 text-red-600" />
              </Button>
            </>
          )}
        </div>
      )}

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
                placeholder="가입 페이지 제목" // ✅ 추가
            />
          </h1>
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
                placeholder="가입 페이지 설명" // ✅ 추가
            />
          </div>
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            <EditableText page="join" section="services" contentKey="services_title" initialValue={initialContent?.services?.services_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold text-center text-gray-900 mb-12" placeholder="예배 시간 제목" /> {/* ✅ 추가 */}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {serviceInfo.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <div className="text-blue-600 mb-4 flex justify-center">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.time}</h3>
                  <h4 className="text-lg font-semibold text-blue-600 mb-3">
                    <EditableText page="join" section="services" contentKey={service.styleKey} initialValue={initialContent?.services?.[service.styleKey]} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-lg font-semibold text-blue-600 mb-3" placeholder="예배 스타일" /> {/* ✅ 추가 */}
                  </h4>
                  <div className="text-gray-600">
                    <EditableText page="join" section="services" contentKey={service.descriptionKey} initialValue={initialContent?.services?.[service.descriptionKey]} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="p" className="text-gray-600" placeholder="예배 설명" /> {/* ✅ 추가 */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <div className="text-lg text-gray-600 mb-4">
              <EditableText page="join" section="services" contentKey="services_footer_text" initialValue={initialContent?.services?.services_footer_text} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-lg text-gray-600 mb-4" placeholder="예배 시간 푸터 텍스트" /> {/* ✅ 추가 */}
            </div>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Plan Your Visit
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            <EditableText page="join" section="expect" contentKey="expect_title" initialValue={initialContent?.expect?.expect_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold text-center text-gray-900 mb-12" placeholder="무엇을 기대할 수 있나요?" /> {/* ✅ 추가 */}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whatToExpect.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    <EditableText page="join" section="expect" contentKey={item.titleKey} initialValue={initialContent?.expect?.[item.titleKey]} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-xl font-bold text-gray-900 mb-2" placeholder="기대하는 점 제목" /> {/* ✅ 추가 */}
                  </h3>
                  <div className="text-gray-600">
                    <EditableText page="join" section="expect" contentKey={item.descriptionKey} initialValue={initialContent?.expect?.[item.descriptionKey]} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-gray-600" placeholder="기대하는 점 설명" /> {/* ✅ 추가 */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                <EditableText page="join" section="contact" contentKey="visit_title" initialValue={initialContent?.contact?.visit_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold text-gray-900 mb-8" placeholder="방문 정보 제목" /> {/* ✅ 추가 */}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <div className="text-gray-600">
                      <EditableText page="join" section="contact" contentKey="address" initialValue={initialContent?.contact?.address} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-gray-600" isTextArea={true} placeholder="주소" /> {/* ✅ 추가 */}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Service Times</h3>
                    <div className="text-gray-600">
                      <EditableText page="join" section="contact" contentKey="service_times" initialValue={initialContent?.contact?.service_times} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-gray-600" isTextArea={true} placeholder="예배 시간" /> {/* ✅ 추가 */}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <div className="text-gray-600">
                      <EditableText page="join" section="contact" contentKey="phone" initialValue={initialContent?.contact?.phone} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-gray-600" placeholder="전화번호" /> {/* ✅ 추가 */}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-blue-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <div className="text-gray-600">
                      <EditableText page="join" section="contact" contentKey="email" initialValue={initialContent?.contact?.email} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-gray-600" placeholder="이메일" /> {/* ✅ 추가 */}
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
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">First Name</Label>
                        <Input id="first_name" placeholder="Your first name" value={formData.first_name} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">Last Name</Label>
                        <Input id="last_name" placeholder="Your last name" value={formData.last_name} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</Label>
                      <Input id="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</Label>
                      <Input id="phone" type="tel" placeholder="(503) 555-0123" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">I'm interested in:</Label>
                      <div className="space-y-2">
                        <label htmlFor="visiting_first_time" className="flex items-center">
                          <Checkbox id="visiting_first_time" className="mr-2" checked={formData.interests.visiting} onCheckedChange={(checked) => handleCheckboxChange({ target: { id: 'visiting', checked: checked as boolean } } as React.ChangeEvent<HTMLInputElement>)} />
                          <span className="text-sm">Visiting for the first time</span>
                        </label>
                        <label htmlFor="joining" className="flex items-center">
                          <Checkbox id="joining" className="mr-2" checked={formData.interests.joining} onCheckedChange={(checked) => handleCheckboxChange({ target: { id: 'joining', checked: checked as boolean } } as React.ChangeEvent<HTMLInputElement>)} />
                          <span className="text-sm">Joining the church</span>
                        </label>
                        <label htmlFor="volunteering" className="flex items-center">
                          <Checkbox id="volunteering" className="mr-2" checked={formData.interests.volunteering} onCheckedChange={(checked) => handleCheckboxChange({ target: { id: 'volunteering', checked: checked as boolean } } as React.ChangeEvent<HTMLInputElement>)} />
                          <span className="text-sm">Volunteering opportunities</span>
                        </label>
                        <label htmlFor="ukrainianMinistry" className="flex items-center">
                          <Checkbox id="ukrainianMinistry" className="mr-2" checked={formData.interests.ukrainianMinistry} onCheckedChange={(checked) => handleCheckboxChange({ target: { id: 'ukrainianMinistry', checked: checked as boolean } } as React.ChangeEvent<HTMLInputElement>)} />
                          <span className="text-sm">Ukrainian children ministry</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</Label>
                      <Textarea id="message" placeholder="Tell us how we can help you connect..." rows={4} value={formData.message} onChange={handleInputChange} />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                      {isSubmitting ? '전송 중...' : 'Send Message'}
                    </Button>
                    {submitMessage && (
                      <div className={`mt-4 p-3 rounded text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {submitMessage}
                      </div>
                    )}
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
            <EditableText page="join" section="ministry_highlight" contentKey="highlight_title" initialValue={initialContent?.ministry_highlight?.highlight_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold mb-8" placeholder="사역 하이라이트 제목" /> {/* ✅ 추가 */}
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="text-6xl mb-6">🇺🇦</div>
            <h3 className="text-2xl font-bold mb-4">
              <EditableText page="join" section="ministry_highlight" contentKey="highlight_subtitle" initialValue={initialContent?.ministry_highlight?.highlight_subtitle} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-2xl font-bold mb-4" placeholder="사역 하이라이트 부제목" /> {/* ✅ 추가 */}
            </h3>
            <div className="text-xl mb-8 opacity-90">
              <EditableText page="join" section="ministry_highlight" contentKey="highlight_description" initialValue={initialContent?.ministry_highlight?.highlight_description} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-xl mb-8 opacity-90" placeholder="사역 하이라이트 설명" /> {/* ✅ 추가 */}
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-3xl font-bold">
                  <EditableText page="join" section="ministry_highlight" contentKey="stat1_number" initialValue={initialContent?.ministry_highlight?.stat1_number} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold" placeholder="통계 1 숫자" /> {/* ✅ 추가 */}
                </div>
                <div className="opacity-90">
                  <EditableText page="join" section="ministry_highlight" contentKey="stat1_label" initialValue={initialContent?.ministry_highlight?.stat1_label} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="opacity-90" placeholder="통계 1 라벨" /> {/* ✅ 추가 */}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  <EditableText page="join" section="ministry_highlight" contentKey="stat2_number" initialValue={initialContent?.ministry_highlight?.stat2_number} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold" placeholder="통계 2 숫자" /> {/* ✅ 추가 */}
                </div>
                <div className="opacity-90">
                  <EditableText page="join" section="ministry_highlight" contentKey="stat2_label" initialValue={initialContent?.ministry_highlight?.stat2_label} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="opacity-90" placeholder="통계 2 라벨" /> {/* ✅ 추가 */}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  <EditableText page="join" section="ministry_highlight" contentKey="stat3_number" initialValue={initialContent?.ministry_highlight?.stat3_number} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold" placeholder="통계 3 숫자" /> {/* ✅ 추가 */}
                </div>
                <div className="opacity-90">
                  <EditableText page="join" section="ministry_highlight" contentKey="stat3_label" initialValue={initialContent?.ministry_highlight?.stat3_label} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="opacity-90" placeholder="통계 3 라벨" /> {/* ✅ 추가 */}
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
            <EditableText page="join" section="cta" contentKey="cta_title" initialValue={initialContent?.cta?.cta_title} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-3xl font-bold text-gray-900 mb-6" placeholder="CTA 제목" /> {/* ✅ 추가 */}
          </h2>
          <div className="text-xl text-gray-600 mb-8">
            <EditableText page="join" section="cta" contentKey="cta_description" initialValue={initialContent?.cta?.cta_description} isEditingPage={isPageEditing} onContentChange={handleContentChange} tag="span" className="text-xl text-gray-600 mb-8" placeholder="CTA 설명" /> {/* ✅ 추가 */}
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
