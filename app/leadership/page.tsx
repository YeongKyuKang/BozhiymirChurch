// app/leadership/page.tsx
// "use client" 지시문 제거
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Heart, Globe, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EditableText from "@/components/editable-text";
import { supabase } from "@/lib/supabase" // 서버 컴포넌트에서 DB 패칭을 위해 추가

async function fetchLeadershipContent() {
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

  const leaders = [
    {
      name: "Pastor Michael Johnson",
      role: "Senior Pastor",
      image: "/placeholder.svg?height=300&width=300",
      bio_key: "michael_bio",
      specialties: ["Biblical Teaching", "Community Outreach", "Ukrainian Ministry"],
      email: "pastor.michael@bozhiymirchurch.com",
      phone: "(503) 555-0123",
    },
    {
      name: "Pastor Sarah Williams",
      role: "Associate Pastor & Children's Ministry",
      image: "/placeholder.svg?height=300&width=300",
      bio_key: "sarah_bio",
      specialties: ["Children's Ministry", "Ukrainian Language", "Family Counseling"],
      email: "pastor.sarah@bozhiymirchurch.com",
      phone: "(503) 555-0124",
    },
    {
      name: "Deacon James Thompson",
      role: "Board Chairman",
      image: "/placeholder.svg?height=300&width=300",
      bio_key: "james_bio",
      specialties: ["Church Administration", "Community Relations", "Volunteer Coordination"],
      email: "james.thompson@bozhiymirchurch.com",
      phone: "(503) 555-0125",
    },
    {
      name: "Maria Kovalenko",
      role: "Ukrainian Ministry Coordinator",
      image: "/placeholder.svg?height=300&width=300",
      bio_key: "maria_bio",
      specialties: ["Ukrainian Culture", "Translation Services", "Child Care"],
      email: "maria.kovalenko@bozhiymirchurch.com",
      phone: "(503) 555-0126",
    },
  ]

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
                  section="main"
                  contentKey="title"
                  initialValue={content?.main?.title}
                  tag="span"
                  className="text-5xl font-bold text-gray-900"
              />
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              <EditableText
                  page="leadership"
                  section="main"
                  contentKey="description"
                  initialValue={content?.main?.description}
                  tag="span"
                  className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
              />
            </p>
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
                      <Image src={leader.image || "/placeholder.svg"} alt={leader.name} fill className="object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-xl font-bold text-white">{leader.name}</h3>
                        <p className="text-blue-200">{leader.role}</p>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        <EditableText
                          page="leadership"
                          section="bios"
                          contentKey={leader.bio_key}
                          initialValue={content?.bios?.[leader.bio_key]}
                          tag="span"
                          className="text-gray-600 mb-4 leading-relaxed"
                          isTextArea={true}
                        />
                      </p>
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Specialties:</h4>
                        <div className="flex flex-wrap gap-2">
                          {leader.specialties.map((specialty, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <a href={`mailto:${leader.email}`} className="hover:text-blue-600 transition-colors">
                            {leader.email}
                          </a>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <a href={`tel:${leader.phone}`} className="hover:text-blue-600 transition-colors">
                            {leader.phone}
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
                  section="values"
                  contentKey="title"
                  initialValue={content?.values?.title}
                  tag="span"
                  className="text-white"
              />
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-xl font-bold mb-2">
                  <EditableText page="leadership" section="values" contentKey="value1_title" initialValue={content?.values?.value1_title} tag="span" className="text-white" />
                </h3>
                <p className="opacity-90">
                  <EditableText page="leadership" section="values" contentKey="value1_description" initialValue={content?.values?.value1_description} tag="span" className="opacity-90" />
                </p>
              </div>
              <div className="text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-xl font-bold mb-2">
                  <EditableText page="leadership" section="values" contentKey="value2_title" initialValue={content?.values?.value2_title} tag="span" className="text-white" />
                </h3>
                <p className="opacity-90">
                  <EditableText page="leadership" section="values" contentKey="value2_description" initialValue={content?.values?.value2_description} tag="span" className="opacity-90" />
                </p>
              </div>
              <div className="text-center">
                <Globe className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-xl font-bold mb-2">
                  <EditableText page="leadership" section="values" contentKey="value3_title" initialValue={content?.values?.value3_title} tag="span" className="text-white" />
                </h3>
                <p className="opacity-90">
                  <EditableText page="leadership" section="values" contentKey="value3_description" initialValue={content?.values?.value3_description} tag="span" className="opacity-90" />
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Leadership */}
        <section className="py-16 px-4 text-center">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              <EditableText page="leadership" section="contact" contentKey="title" initialValue={content?.contact?.title} tag="span" className="text-gray-900" />
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              <EditableText page="leadership" section="contact" contentKey="description" initialValue={content?.contact?.description} tag="span" className="text-gray-600" />
            </p>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/join">Visit Our Church</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}