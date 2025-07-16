// components/leadership-page-client.tsx
"use client" // 이 파일은 클라이언트 컴포넌트임을 명시합니다.

import * as React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase" // 클라이언트 컴포넌트에서 DB 업데이트를 위해 필요
import { Button } from "@/components/ui/button"
import { Settings, Save, X, Mail, Phone, Heart, Globe, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import EditableText from "@/components/editable-text" // EditableText는 클라이언트 컴포넌트입니다.

// Props 인터페이스 정의
interface LeadershipPageClientProps {
  initialContent: Record<string, any>;
}

export default function LeadershipPageClient({ initialContent }: LeadershipPageClientProps) {
  const { userRole } = useAuth();
  const [isPageEditing, setIsPageEditing] = useState(false); // 페이지 전체 편집 모드 상태
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({}); // 변경된 내용을 추적하는 상태
  const [isSavingAll, setIsSavingAll] = useState(false);

  // EditableText 컴포넌트로부터 변경사항을 받을 콜백 함수
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
          page: 'leadership',
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.error(`Error updating content for ${section}.${key}:`, error);
        } else {
          updateCount++;
        }
      }
    }

    if (updateCount > 0) {
      try {
        // NEXT_PUBLIC_MY_SECRET_TOKEN은 Vercel 환경 변수에 설정되어야 합니다.
        const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/leadership`); // 경로를 '/leadership'으로 변경
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json();
          console.error("Revalidation failed:", errorData.message);
        } else {
          revalidated = true;
          console.log("Page revalidated successfully!");
        }
      } catch (err) {
        console.error("Failed to call revalidate API:", err);
      }
    }

    setIsSavingAll(false);
    setIsPageEditing(false); // 저장 완료 후 편집 모드 종료
    setChangedContent({}); // 변경 사항 초기화

    if (updateCount > 0 && revalidated) {
      alert("모든 변경 사항이 저장되고 페이지가 업데이트되었습니다. 새로고침하면 반영됩니다.");
    } else if (updateCount > 0 && !revalidated) {
        alert("일부 변경 사항은 저장되었지만, 페이지 재검증에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.");
    } else {
        alert("변경된 내용이 없거나 저장에 실패했습니다.");
    }
  };

  const handleCancelAll = () => {
    if (confirm("모든 변경 사항을 취소하시겠습니까?")) {
      setChangedContent({}); // 변경 사항 초기화
      setIsPageEditing(false); // 편집 모드 종료
    }
  };

  const leaders = [
    {
      sectionKey: "leader_michael",
      nameKey: "name",
      roleKey: "role",
      imageKey: "image",
      bioKey: "bio",
      specialtiesKey: "specialties",
      emailKey: "email",
      phoneKey: "phone",
    },
    {
      sectionKey: "leader_sarah",
      nameKey: "name",
      roleKey: "role",
      imageKey: "image",
      bioKey: "bio",
      specialtiesKey: "specialties",
      emailKey: "email",
      phoneKey: "phone",
    },
    {
      sectionKey: "leader_james",
      nameKey: "name",
      roleKey: "role",
      imageKey: "image",
      bioKey: "bio",
      specialtiesKey: "specialties",
      emailKey: "email",
      phoneKey: "phone",
    },
    {
      sectionKey: "leader_maria",
      nameKey: "name",
      roleKey: "role",
      imageKey: "image",
      bioKey: "bio",
      specialtiesKey: "specialties",
      emailKey: "email",
      phoneKey: "phone",
    },
  ]

  const values = [
    {
      icon: <Heart className="h-6 w-6 text-blue-600" />, // h-8 w-8 -> h-6 w-6
      titleKey: "value1_title",
      descriptionKey: "value1_description",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-blue-600" />, // h-8 w-8 -> h-6 w-6
      titleKey: "value2_title",
      descriptionKey: "value2_description",
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-600" />, // h-8 w-8 -> h-6 w-6
      titleKey: "value3_title",
      descriptionKey: "value3_description",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16"> {/* Added pt-24 */}
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
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white h-[25vh] flex items-center justify-center border-b-4 border-yellow-500"> {/* h-[60vh] -> h-[25vh] */}
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2"> {/* mb-4 -> mb-2 */}
            <span className="text-3xl md:text-4xl">👥</span> {/* text-4xl md:text-5xl -> text-3xl md:text-4xl */}
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold mb-3"> {/* text-3xl md:text-4xl lg:text-4xl -> text-2xl md:text-3xl lg:text-3xl, mb-6 -> mb-3 */}
            <EditableText
              page="leadership"
              section="hero"
              contentKey="title_part1"
              initialValue={initialContent?.hero?.title_part1 || "Meet Our "}
              tag="span"
              className="text-white"
            />
            <span className="text-yellow-500">
              <EditableText
                page="leadership"
                section="hero"
                contentKey="title_part2"
                initialValue={initialContent?.hero?.title_part2 || "Leadership Team"}
                tag="span"
                className="text-yellow-500"
              />
            </span>
          </h1>
          <p className="text-sm md:text-base text-blue-200 max-w-4xl mx-auto leading-relaxed"> {/* text-lg md:text-xl -> text-sm md:text-base */}
            <EditableText
              page="leadership"
              section="hero"
              contentKey="description"
              initialValue={
                initialContent?.hero?.description || "Dedicated servants called to lead with wisdom, compassion, and faith."
              }
              tag="span"
              className="text-sm md:text-base text-blue-200"
              isTextArea={true}
            />
          </p>
        </div>
      </div>

      {/* Leadership Team */}
      <section className="py-8 bg-white"> {/* py-12 -> py-8, implicit bg-white */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* gap-8 -> gap-4 */}
            {leaders.map((leader, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-200 shadow-md bg-white"
              >
                <CardContent className="p-4"> {/* p-6 -> p-4 */}
                  <div className="relative h-48 md:h-56 bg-gray-50"> {/* h-64 md:h-72 -> h-48 md:h-56 */}
                    <Image
                      src={initialContent?.[leader.sectionKey]?.[leader.imageKey] || "/placeholder.svg"}
                      alt={initialContent?.[leader.sectionKey]?.[leader.nameKey] || "Leader Image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-transparent p-4"> {/* p-6 -> p-4 */}
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1"> {/* text-2xl md:text-3xl -> text-xl md:text-2xl, mb-2 -> mb-1 */}
                        <EditableText
                          page="leadership"
                          section={leader.sectionKey}
                          contentKey={leader.nameKey}
                          initialValue={initialContent?.[leader.sectionKey]?.[leader.nameKey] || "Leader Name"}
                          tag="span"
                          className="text-xl md:text-2xl font-bold text-white"
                        />
                      </h3>
                      <p className="text-base text-yellow-500 font-semibold"> {/* text-lg -> text-base */}
                        <EditableText
                          page="leadership"
                          section={leader.sectionKey}
                          contentKey={leader.roleKey}
                          initialValue={initialContent?.[leader.sectionKey]?.[leader.roleKey] || "Role"}
                          tag="span"
                          className="text-yellow-500"
                        />
                      </p>
                    </div>
                  </div>

                  <div className="p-4"> {/* p-6 -> p-4 */}
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed"> {/* text-base -> text-sm, mb-6 -> mb-4 */}
                      <EditableText
                        page="leadership"
                        section={leader.sectionKey}
                        contentKey={leader.bioKey}
                        initialValue={initialContent?.[leader.sectionKey]?.[leader.bioKey] || "Bio information"}
                        tag="span"
                        className="text-sm text-gray-700 leading-relaxed"
                        isTextArea={true}
                      />
                    </p>

                    <div className="mb-4"> {/* mb-6 -> mb-4 */}
                      <h4 className="font-bold text-blue-900 mb-2 text-sm">Specialties:</h4> {/* text-base -> text-sm, mb-3 -> mb-2 */}
                      <div className="flex flex-wrap gap-1"> {/* gap-2 -> gap-1 */}
                        {(
                          initialContent?.[leader.sectionKey]?.[leader.specialtiesKey]
                            ?.split(",")
                            .map((s: string) => s.trim()) || []
                        ).map((specialty: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-yellow-500 text-blue-900 rounded-full text-xs font-semibold shadow-md"
                          > {/* px-3 py-1.5 -> px-2 py-0.5, text-sm -> text-xs */}
                            <EditableText
                              page="leadership"
                              section={leader.sectionKey}
                              contentKey={`${leader.specialtiesKey}_${idx}`}
                              initialValue={initialContent?.[leader.sectionKey]?.[`${leader.specialtiesKey}_${idx}`] || specialty}
                              tag="span"
                              className="text-xs"
                            />
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1"> {/* space-y-2 -> space-y-1 */}
                      <div className="flex items-center text-gray-700 text-sm"> {/* text-base -> text-sm */}
                        <div className="bg-blue-700 rounded-full p-1 mr-2"> {/* p-1.5 mr-3 -> p-1 mr-2 */}
                          <Mail className="h-4 w-4 text-white" />
                        </div>
                        <a
                          href={`mailto:${initialContent?.[leader.sectionKey]?.[leader.emailKey]}`}
                          className="hover:text-blue-700 transition-colors font-medium"
                        >
                          <EditableText
                            page="leadership"
                            section={leader.sectionKey}
                            contentKey={leader.emailKey}
                            initialValue={initialContent?.[leader.sectionKey]?.[leader.emailKey] || "email@example.com"}
                            tag="span"
                            className="hover:text-blue-700 transition-colors"
                          />
                        </a>
                      </div>
                      <div className="flex items-center text-gray-700 text-sm"> {/* text-base -> text-sm */}
                        <div className="bg-yellow-500 rounded-full p-1 mr-2"> {/* p-1.5 mr-3 -> p-1 mr-2 */}
                          <Phone className="h-4 w-4 text-white" />
                        </div>
                        <a
                          href={`tel:${initialContent?.[leader.sectionKey]?.[leader.phoneKey]}`}
                          className="hover:text-blue-700 transition-colors font-medium"
                        >
                          <EditableText
                            page="leadership"
                            section={leader.sectionKey}
                            contentKey={leader.phoneKey}
                            initialValue={initialContent?.[leader.sectionKey]?.[leader.phoneKey] || "(555) 123-4567"}
                            tag="span"
                            className="hover:text-blue-700 transition-colors"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Values */}
      <section className="py-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-y border-white/20"> {/* py-12 -> py-8 */}
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-center mb-6"> {/* text-2xl md:text-2xl -> text-xl md:text-2xl, mb-8 -> mb-6 */}
            <EditableText
              page="leadership"
              section="leadership_values"
              contentKey="title"
              initialValue={initialContent?.leadership_values?.title || "Our Leadership Values"}
              tag="span"
              className="text-white"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* gap-6 -> gap-4 */}
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:bg-white/20 transition-all duration-300 border border-gray-600"
              >
                <div className="flex justify-center mb-4"> {/* mb-6 -> mb-4 */}
                  <div className="bg-yellow-400 rounded-full p-2">{value.icon}</div> {/* p-3 -> p-2 */}
                </div>
                <h3 className="text-base font-bold mb-3"> {/* text-lg -> text-base, mb-4 -> mb-3 */}
                  <EditableText
                    page="leadership"
                    section="leadership_values"
                    contentKey={value.titleKey}
                    initialValue={initialContent?.leadership_values?.[value.titleKey] || `Value ${index + 1}`}
                    tag="span"
                    className="text-white"
                  />
                </h3>
                <p className="text-sm text-blue-200 text-base leading-relaxed"> {/* text-base -> text-sm */}
                  <EditableText
                    page="leadership"
                    section="leadership_values"
                    contentKey={value.descriptionKey}
                    initialValue={initialContent?.leadership_values?.[value.descriptionKey] || "Description of this value"}
                    tag="span"
                    className="text-blue-200"
                  />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Leadership */}
      <section className="py-8 bg-blue-50"> {/* py-12 -> py-8, bg-white (implicit) -> bg-blue-50 */}
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-blue-900 mb-3"> {/* mb-5 -> mb-3 */}
            <EditableText
              page="leadership"
              section="contact_leadership"
              contentKey="title"
              initialValue={initialContent?.contact_leadership?.title || "Connect with Our Leaders"}
              tag="span"
              className="text-blue-900"
            />
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-4 max-w-4xl mx-auto leading-relaxed"> {/* text-lg md:text-xl -> text-base md:text-lg, mb-7 -> mb-4 */}
            <EditableText
              page="leadership"
              section="contact_leadership"
              contentKey="description"
              initialValue={
                initialContent?.contact_leadership?.description ||
                "We're here to serve and support you on your spiritual journey."
              }
              tag="span"
              className="text-base md:text-lg text-gray-700"
              isTextArea={true}
            />
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center"> {/* gap-4 -> gap-2 */}
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-bold px-6 py-2 text-base rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/join">
                <EditableText
                  page="leadership"
                  section="contact_leadership"
                  contentKey="button1_text"
                  initialValue={initialContent?.contact_leadership?.button1_text || "Join Our Community"}
                  tag="span"
                  className="inline"
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-yellow-700 text-yellow-700 hover:bg-yellow-700 hover:text-white font-bold px-6 py-2 text-base rounded-full bg-transparent shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/">
                <EditableText
                  page="leadership"
                  section="contact_leadership"
                  contentKey="button2_text"
                  initialValue={initialContent?.contact_leadership?.button2_text || "Back to Home"}
                  tag="span"
                  className="inline"
                />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
