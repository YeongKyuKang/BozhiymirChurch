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

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-yellow-500" />,
      titleKey: "value1_title",
      descriptionKey: "value1_description",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-yellow-500" />,
      titleKey: "value2_title",
      descriptionKey: "value2_description",
    },
    {
      icon: <Globe className="h-8 w-8 text-yellow-500" />,
      titleKey: "value3_title",
      descriptionKey: "value3_description",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-20 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <span className="text-5xl">👥</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            <EditableText
              page="leadership"
              section="hero"
              contentKey="title_part1"
              initialValue={content?.hero?.title_part1 || "Meet Our "}
              tag="span"
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
            />
            <span className="text-yellow-300">
              <EditableText
                page="leadership"
                section="hero"
                contentKey="title_part2"
                initialValue={content?.hero?.title_part2 || "Leadership Team"}
                tag="span"
                className="text-yellow-300"
              />
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="leadership"
              section="hero"
              contentKey="description"
              initialValue={
                content?.hero?.description || "Dedicated servants called to lead with wisdom, compassion, and faith."
              }
              tag="span"
              className="text-xl md:text-2xl text-blue-200"
              isTextArea={true}
            />
          </p>
        </div>
      </div>

      {/* Leadership Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {leaders.map((leader, index) => (
              <Card
                key={index}
                className="hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-blue-50"
              >
                <CardContent className="p-0">
                  <div className="relative h-64 md:h-72 bg-gradient-to-br from-blue-100 to-yellow-100">
                    <Image
                      src={content?.[leader.sectionKey]?.[leader.imageKey] || "/placeholder.svg"}
                      alt={content?.[leader.sectionKey]?.[leader.nameKey] || "Leader Image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-transparent p-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        <EditableText
                          page="leadership"
                          section={leader.sectionKey}
                          contentKey={leader.nameKey}
                          initialValue={content?.[leader.sectionKey]?.[leader.nameKey] || "Leader Name"}
                          tag="span"
                          className="text-2xl md:text-3xl font-bold text-white"
                        />
                      </h3>
                      <p className="text-yellow-300 text-lg font-semibold">
                        <EditableText
                          page="leadership"
                          section={leader.sectionKey}
                          contentKey={leader.roleKey}
                          initialValue={content?.[leader.sectionKey]?.[leader.roleKey] || "Role"}
                          tag="span"
                          className="text-yellow-300"
                        />
                      </p>
                    </div>
                  </div>

                  <div className="p-8">
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                      <EditableText
                        page="leadership"
                        section={leader.sectionKey}
                        contentKey={leader.bioKey}
                        initialValue={content?.[leader.sectionKey]?.[leader.bioKey] || "Bio information"}
                        tag="span"
                        className="text-lg text-gray-700 leading-relaxed"
                        isTextArea={true}
                      />
                    </p>

                    <div className="mb-8">
                      <h4 className="font-bold text-blue-900 mb-4 text-lg">Specialties:</h4>
                      <div className="flex flex-wrap gap-3">
                        {(
                          content?.[leader.sectionKey]?.[leader.specialtiesKey]
                            ?.split(",")
                            .map((s: string) => s.trim()) || []
                        ).map((specialty: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900 rounded-full text-sm font-semibold shadow-md"
                          >
                            <EditableText
                              page="leadership"
                              section={leader.sectionKey}
                              contentKey={`${leader.specialtiesKey}_${idx}`}
                              initialValue={specialty}
                              tag="span"
                              className="text-sm"
                            />
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700 text-lg">
                        <div className="bg-blue-700 rounded-full p-2 mr-4">
                          <Mail className="h-5 w-5 text-white" />
                        </div>
                        <a
                          href={`mailto:${content?.[leader.sectionKey]?.[leader.emailKey]}`}
                          className="hover:text-blue-700 transition-colors font-medium"
                        >
                          <EditableText
                            page="leadership"
                            section={leader.sectionKey}
                            contentKey={leader.emailKey}
                            initialValue={content?.[leader.sectionKey]?.[leader.emailKey] || "email@example.com"}
                            tag="span"
                            className="hover:text-blue-700 transition-colors"
                          />
                        </a>
                      </div>
                      <div className="flex items-center text-gray-700 text-lg">
                        <div className="bg-yellow-500 rounded-full p-2 mr-4">
                          <Phone className="h-5 w-5 text-white" />
                        </div>
                        <a
                          href={`tel:${content?.[leader.sectionKey]?.[leader.phoneKey]}`}
                          className="hover:text-blue-700 transition-colors font-medium"
                        >
                          <EditableText
                            page="leadership"
                            section={leader.sectionKey}
                            contentKey={leader.phoneKey}
                            initialValue={content?.[leader.sectionKey]?.[leader.phoneKey] || "(555) 123-4567"}
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
      <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <EditableText
              page="leadership"
              section="leadership_values"
              contentKey="title"
              initialValue={content?.leadership_values?.title || "Our Leadership Values"}
              tag="span"
              className="text-3xl md:text-4xl font-bold text-center"
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex justify-center mb-8">
                  <div className="bg-yellow-500 rounded-full p-4">{value.icon}</div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6">
                  <EditableText
                    page="leadership"
                    section="leadership_values"
                    contentKey={value.titleKey}
                    initialValue={content?.leadership_values?.[value.titleKey] || `Value ${index + 1}`}
                    tag="span"
                    className="text-2xl md:text-3xl font-bold"
                  />
                </h3>
                <p className="text-blue-200 text-lg leading-relaxed">
                  <EditableText
                    page="leadership"
                    section="leadership_values"
                    contentKey={value.descriptionKey}
                    initialValue={content?.leadership_values?.[value.descriptionKey] || "Description of this value"}
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
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8">
            <EditableText
              page="leadership"
              section="contact_leadership"
              contentKey="title"
              initialValue={content?.contact_leadership?.title || "Connect with Our Leaders"}
              tag="span"
              className="text-3xl md:text-4xl font-bold text-blue-900"
            />
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed">
            <EditableText
              page="leadership"
              section="contact_leadership"
              contentKey="description"
              initialValue={
                content?.contact_leadership?.description ||
                "We're here to serve and support you on your spiritual journey."
              }
              tag="span"
              className="text-xl md:text-2xl text-gray-700"
              isTextArea={true}
            />
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 font-bold px-10 py-4 text-xl rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/join">
                <EditableText
                  page="leadership"
                  section="contact_leadership"
                  contentKey="button1_text"
                  initialValue={content?.contact_leadership?.button1_text || "Join Our Community"}
                  tag="span"
                  className="inline"
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white font-bold px-10 py-4 text-xl rounded-full bg-transparent shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/">
                <EditableText
                  page="leadership"
                  section="contact_leadership"
                  contentKey="button2_text"
                  initialValue={content?.contact_leadership?.button2_text || "Back to Home"}
                  tag="span"
                  className="inline"
                />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
