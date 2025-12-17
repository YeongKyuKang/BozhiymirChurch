import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";

interface LeadershipPageClientProps {
  initialContent: Record<string, any>;
}

export default function LeadershipPageClient({ initialContent }: LeadershipPageClientProps) {
  const content = initialContent;

  const leaders = [
    { key: "leader_michael", name: content?.leader_michael?.name, role: content?.leader_michael?.role, img: content?.leader_michael?.image },
    { key: "leader_sarah", name: content?.leader_sarah?.name, role: content?.leader_sarah?.role, img: content?.leader_sarah?.image },
    { key: "leader_james", name: content?.leader_james?.name, role: content?.leader_james?.role, img: content?.leader_james?.image },
    { key: "leader_maria", name: content?.leader_maria?.name, role: content?.leader_maria?.role, img: content?.leader_maria?.image },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16">
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white h-[25vh] flex items-center justify-center border-b-4 border-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2"><span className="text-3xl md:text-4xl">👥</span></div>
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold mb-3">
            {content?.hero?.title_part1} <span className="text-yellow-500">{content?.hero?.title_part2}</span>
          </h1>
          <p className="text-sm md:text-base text-blue-200 max-w-4xl mx-auto">
            {content?.hero?.description}
          </p>
        </div>
      </div>

      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {leaders.map((leader, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-200 shadow-md">
              <CardContent className="p-4">
                <div className="relative h-48 md:h-56 bg-gray-50 mb-4">
                  <Image
                    src={leader.img || "/placeholder.svg"}
                    alt={leader.name || "Leader"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-transparent p-4">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{leader.name}</h3>
                    <p className="text-base text-yellow-500 font-semibold">{leader.role}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-gray-700 text-sm">
                    <Mail className="h-4 w-4 text-blue-700 mr-2" />
                    <span>{content?.[leader.key]?.email}</span>
                  </div>
                  <div className="flex items-center text-gray-700 text-sm">
                    <Phone className="h-4 w-4 text-blue-700 mr-2" />
                    <span>{content?.[leader.key]?.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}