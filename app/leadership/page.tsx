import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Heart, Globe, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EditableText from "@/components/editable-text"
import { createClient } from "@supabase/supabase-js"

async function fetchLeadershipContent() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const { data, error } = await supabase.from("content").select("page, section, key, value").eq("page", "leadership")

  if (error) {
    console.error("Failed to fetch leadership content on the server:", error)
    return {}
  }

  const contentMap: Record<string, any> = {}
  data.forEach((item) => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {}
    }
    contentMap[item.section][item.key] = item.value
  })

  return contentMap
}

export default async function LeadershipPage() {
  const content = await fetchLeadershipContent()

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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header Space */}
        <div className="h-16 md:h-20"></div>

        {/* Hero Section */}
        <section className="py-8 md:py-12 lg:py-16 px-4 pt-20 md:pt-24 lg:pt-32">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              <EditableText
                page="leadership"
                section="hero"
                contentKey="title_part1"
                initialValue={content?.hero?.title_part1}
                tag="span"
                className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900"
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
            <div className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8">
              <EditableText
                page="leadership"
                section="hero"
                contentKey="description"
                initialValue={content?.hero?.description}
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

        {/* Leadership Team */}
        <section className="py-8 md:py-12 lg:py-16 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {leaders.map((leader, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-48 md:h-64 bg-gradient-to-br from-blue-100 to-yellow-100">
                      <Image
                        src={content?.[leader.sectionKey]?.[leader.imageKey] || "/placeholder.svg"}
                        alt={content?.[leader.sectionKey]?.[leader.nameKey] || "Leader Image"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 md:p-4">
                        <h3 className="text-lg md:text-xl font-bold text-white">
                          <EditableText
                            page="leadership"
                            section={leader.sectionKey}
                            contentKey={leader.nameKey}
                            initialValue={content?.[leader.sectionKey]?.[leader.nameKey]}
                            tag="span"
                            className="text-lg md:text-xl font-bold text-white"
                          />
                        </h3>
                        <div className="text-blue-200 text-sm md:text-base">
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

                    <div className="p-4 md:p-6">
                      <div className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 leading-relaxed">
                        <EditableText
                          page="leadership"
                          section={leader.sectionKey}
                          contentKey={leader.bioKey}
                          initialValue={content?.[leader.sectionKey]?.[leader.bioKey]}
                          tag="span"
                          className="text-sm md:text-base text-gray-600 leading-relaxed"
                          isTextArea={true}
                        />
                      </div>

                      <div className="mb-3 md:mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Specialties:</h4>
                        <div className="flex flex-wrap gap-2">
                          {(
                            content?.[leader.sectionKey]?.[leader.specialtiesKey]
                              ?.split(",")
                              .map((s: string) => s.trim()) || []
                          ).map((specialty: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 md:px-3 md:py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm"
                            >
                              <EditableText
                                page="leadership"
                                section={leader.sectionKey}
                                contentKey={`${leader.specialtiesKey}_${idx}`}
                                initialValue={specialty}
                                tag="span"
                                className="text-xs md:text-sm"
                              />
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600 text-sm md:text-base">
                          <Mail className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                          <a
                            href={`mailto:${content?.[leader.sectionKey]?.[leader.emailKey]}`}
                            className="hover:text-blue-600 transition-colors"
                          >
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
                        <div className="flex items-center text-gray-600 text-sm md:text-base">
                          <Phone className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                          <a
                            href={`tel:${content?.[leader.sectionKey]?.[leader.phoneKey]}`}
                            className="hover:text-blue-600 transition-colors"
                          >
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
        <section className="py-8 md:py-12 lg:py-16 px-4 bg-blue-600 text-white">
          <div className="container mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-8 md:mb-12">
              <EditableText
                page="leadership"
                section="leadership_values"
                contentKey="title"
                initialValue={content?.leadership_values?.title}
                tag="span"
                className="text-xl md:text-2xl lg:text-3xl font-bold text-center"
              />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center">
                <Heart className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-yellow-400" />
                <h3 className="text-lg md:text-xl font-bold mb-2">
                  <EditableText
                    page="leadership"
                    section="leadership_values"
                    contentKey="value1_title"
                    initialValue={content?.leadership_values?.value1_title}
                    tag="span"
                    className="text-lg md:text-xl font-bold"
                  />
                </h3>
                <div className="opacity-90 text-sm md:text-base">
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
                <BookOpen className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-yellow-400" />
                <h3 className="text-lg md:text-xl font-bold mb-2">
                  <EditableText
                    page="leadership"
                    section="leadership_values"
                    contentKey="value2_title"
                    initialValue={content?.leadership_values?.value2_title}
                    tag="span"
                    className="text-lg md:text-xl font-bold"
                  />
                </h3>
                <div className="opacity-90 text-sm md:text-base">
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
                <Globe className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-yellow-400" />
                <h3 className="text-lg md:text-xl font-bold mb-2">
                  <EditableText
                    page="leadership"
                    section="leadership_values"
                    contentKey="value3_title"
                    initialValue={content?.leadership_values?.value3_title}
                    tag="span"
                    className="text-lg md:text-xl font-bold"
                  />
                </h3>
                <div className="opacity-90 text-sm md:text-base">
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
        <section className="py-8 md:py-12 lg:py-16 px-4 text-center">
          <div className="container mx-auto">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              <EditableText
                page="leadership"
                section="contact_leadership"
                contentKey="title"
                initialValue={content?.contact_leadership?.title}
                tag="span"
                className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900"
              />
            </h2>
            <div className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8">
              <EditableText
                page="leadership"
                section="contact_leadership"
                contentKey="description"
                initialValue={content?.contact_leadership?.description}
                tag="span"
                className="text-base md:text-lg lg:text-xl text-gray-600"
                isTextArea={true}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Link href="/join">
                  <EditableText
                    page="leadership"
                    section="contact_leadership"
                    contentKey="button1_text"
                    initialValue={content?.contact_leadership?.button1_text}
                    tag="span"
                    className="inline"
                  />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <Link href="/">
                  <EditableText
                    page="leadership"
                    section="contact_leadership"
                    contentKey="button2_text"
                    initialValue={content?.contact_leadership?.button2_text}
                    tag="span"
                    className="inline"
                  />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
