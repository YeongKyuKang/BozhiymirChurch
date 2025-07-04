// app/leadership/page.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Heart, Globe, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import EditableText from "@/components/editable-text";
// 수정: createClient로 변경하고, createServerClient 및 cookies 관련 import 제거
import { createClient } from "@supabase/supabase-js";

// 이 페이지는 정적으로 생성되므로, revalidate 설정을 명시적으로 하지 않거나 0으로 설정합니다.
// revalidate를 설정하지 않으면 기본적으로 SSG로 동작합니다.
// export const revalidate = 0; // 필요시 명시적으로 설정

async function fetchLeadershipContent() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('content')
    .select('page, section, key, value')
    .eq('page', 'leadership');

  if (error) {
    console.error('Failed to fetch leadership content on the server:', error);
    return {};
  }

  const contentMap: Record<string, any> = {};
  data.forEach(item => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value;
  });

  return contentMap;
}

export default async function LeadershipPage() {
  const content = await fetchLeadershipContent();

  // Supabase에서 가져온 데이터를 기반으로 리더 정보 구성
  // 각 리더는 contentMap의 별도 섹션으로 관리됩니다.
  const leaders = [
    {
      sectionKey: "leader_michael", // Supabase section key
      nameKey: "name",
      roleKey: "role",
      imageKey: "image",
      bioKey: "bio",
      specialtiesKey: "specialties", // 쉼표로 구분된 문자열
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
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header Space */}
        <div className="h-20"></div>

        {/* Hero Section */}
        <section className="py-16 px-4 pt-32">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <EditableText
                page="leadership"
                section="hero"
                contentKey="title_part1"
                initialValue={content?.hero?.title_part1}
                tag="span"
                className="text-5xl font-bold text-gray-900"
              />
              <span className="text-blue-600">
                <EditableText
                  page="leadership"
                  section="hero"
                  contentKey="title_part2"
                  initialValue={content?.hero?.title_part2}
                  tag="span"
                  className="text-blue-600"
                />
              </span>
            </h1>
            {/* p 태그를 div 태그로 변경 */}
            <div className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              <EditableText
                page="leadership"
                section="hero"
                contentKey="description"
                initialValue={content?.hero?.description}
                tag="span"
                className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
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

        {/* Leadership Team */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {leaders.map((leader, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-64 bg-gradient-to-br from-blue-100 to-yellow-100">
                      <Image
                        src={content?.[leader.sectionKey]?.[leader.imageKey] || "/placeholder.svg"}
                        alt={content?.[leader.sectionKey]?.[leader.nameKey] || "Leader Image"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Image 컴포넌트 경고 방지
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-xl font-bold text-white">
                          <EditableText
                            page="leadership"
                            section={leader.sectionKey}
                            contentKey={leader.nameKey}
                            initialValue={content?.[leader.sectionKey]?.[leader.nameKey]}
                            tag="span"
                            className="text-xl font-bold text-white"
                          />
                        </h3>
                        {/* 수정: p 태그를 div 태그로 변경 */}
                        <div className="text-blue-200">
                          <EditableText
                            page="leadership"
                            section={leader.sectionKey}
                            contentKey={leader.roleKey}
                            initialValue={content?.[leader.sectionKey]?.[leader.roleKey]}
                            tag="span"
                            className="text-blue-200"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* p 태그를 div 태그로 변경 */}
                      <div className="text-gray-600 mb-4 leading-relaxed">
                        <EditableText
                          page="leadership"
                          section={leader.sectionKey}
                          contentKey={leader.bioKey}
                          initialValue={content?.[leader.sectionKey]?.[leader.bioKey]}
                          tag="span"
                          className="text-gray-600 mb-4 leading-relaxed"
                          isTextArea={true}
                        />
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Specialties:</h4>
                        <div className="flex flex-wrap gap-2">
                          {/* specialties는 쉼표로 구분된 문자열을 배열로 분리하여 렌더링 */}
                          {(content?.[leader.sectionKey]?.[leader.specialtiesKey]?.split(',').map((s: string) => s.trim()) || []).map((specialty: string, idx: number) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              <EditableText
                                page="leadership"
                                section={leader.sectionKey}
                                contentKey={`${leader.specialtiesKey}_${idx}`} // 각 전문 분야별로 고유한 키 부여 (편집 시 필요)
                                initialValue={specialty}
                                tag="span"
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                              />
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <a href={`mailto:${content?.[leader.sectionKey]?.[leader.emailKey]}`} className="hover:text-blue-600 transition-colors">
                            <EditableText
                              page="leadership"
                              section={leader.sectionKey}
                              contentKey={leader.emailKey}
                              initialValue={content?.[leader.sectionKey]?.[leader.emailKey]}
                              tag="span"
                              className="hover:text-blue-600 transition-colors"
                            />
                          </a>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <a href={`tel:${content?.[leader.sectionKey]?.[leader.phoneKey]}`} className="hover:text-blue-600 transition-colors">
                            <EditableText
                              page="leadership"
                              section={leader.sectionKey}
                              contentKey={leader.phoneKey}
                              initialValue={content?.[leader.sectionKey]?.[leader.phoneKey]}
                              tag="span"
                              className="hover:text-blue-600 transition-colors"
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
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              <EditableText
                page="leadership"
                section="leadership_values"
                contentKey="title"
                initialValue={content?.leadership_values?.title}
                tag="span"
                className="text-3xl font-bold text-center mb-12"
              />
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-xl font-bold mb-2">
                  <EditableText
                    page="leadership"
                    section="leadership_values"
                    contentKey="value1_title"
                    initialValue={content?.leadership_values?.value1_title}
                    tag="span"
                    className="text-xl font-bold mb-2"
                  />
                </h3>
                {/* p 태그를 div 태그로 변경 */}
                <div className="opacity-90">
                  <EditableText
                    page="leadership"
                    section="leadership_values"
                    contentKey="value1_description"
                    initialValue={content?.leadership_values?.value1_description}
                    tag="span"
                    className="opacity-90"
                  />
                </div>
              </div>
              <div className="text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-xl font-bold mb-2">
                  <EditableText
                    page="leadership"
                    section="leadership_values"
                    contentKey="value2_title"
                    initialValue={content?.leadership_values?.value2_title}
                    tag="span"
                    className="text-xl font-bold mb-2"
                  />
                </h3>
                {/* p 태그를 div 태그로 변경 */}
                <div className="opacity-90">
                  <EditableText
                    page="leadership"
                    section="leadership_values"
                    contentKey="value2_description"
                    initialValue={content?.leadership_values?.value2_description}
                    tag="span"
                    className="opacity-90"
                  />
                </div>
              </div>
              <div className="text-center">
                <Globe className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-xl font-bold mb-2">
                  <EditableText
                    page="leadership"
                    section="leadership_values"
                    contentKey="value3_title"
                    initialValue={content?.leadership_values?.value3_title}
                    tag="span"
                    className="text-xl font-bold mb-2"
                  />
                </h3>
                {/* p 태그를 div 태그로 변경 */}
                <div className="opacity-90">
                  <EditableText
                    page="leadership"
                    section="leadership_values"
                    contentKey="value3_description"
                    initialValue={content?.leadership_values?.value3_description}
                    tag="span"
                    className="opacity-90"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Leadership */}
        <section className="py-16 px-4 text-center">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              <EditableText
                page="leadership"
                section="contact_leadership"
                contentKey="title"
                initialValue={content?.contact_leadership?.title}
                tag="span"
                className="text-3xl font-bold text-gray-900 mb-6"
              />
            </h2>
            {/* p 태그를 div 태그로 변경 */}
            <div className="text-xl text-gray-600 mb-8">
              <EditableText
                page="leadership"
                section="contact_leadership"
                contentKey="description"
                initialValue={content?.contact_leadership?.description}
                tag="span"
                className="text-xl text-gray-600 mb-8"
                isTextArea={true}
              />
            </div>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/join">
                  <EditableText
                    page="leadership"
                    section="contact_leadership"
                    contentKey="button1_text"
                    initialValue={content?.contact_leadership?.button1_text}
                    tag="span"
                    className="inline" // Link 내부에 EditableText가 있으므로 inline으로 유지
                  />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">
                  <EditableText
                    page="leadership"
                    section="contact_leadership"
                    contentKey="button2_text"
                    initialValue={content?.contact_leadership?.button2_text}
                    tag="span"
                    className="inline" // Link 내부에 EditableText가 있으므로 inline으로 유지
                  />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}