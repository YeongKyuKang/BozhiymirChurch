import { Button } from "@/components/ui/button";
import { Heart, Users, Globe, Star, Church } from "lucide-react";
import Link from "next/link";

interface StoryPageClientProps {
  initialContent: Record<string, any>;
}

export default function StoryPageClient({ initialContent }: StoryPageClientProps) {
  const content = initialContent;

  const timeline = [
    { year: "2010", title: content?.timeline?.timeline_2010_title, description: content?.timeline?.timeline_2010_description, icon: <Church className="h-4 w-4" /> },
    { year: "2015", title: content?.timeline?.timeline_2015_title, description: content?.timeline?.timeline_2015_description, icon: <Users className="h-4 w-4" /> },
    { year: "2018", title: content?.timeline?.timeline_2018_title, description: content?.timeline?.timeline_2018_description, icon: <Star className="h-4 w-4" /> },
    { year: "2022", title: content?.timeline?.timeline_2022_title, description: content?.timeline?.timeline_2022_description, icon: <Heart className="h-4 w-4" /> },
    { year: "2024", title: content?.timeline?.timeline_2024_title, description: content?.timeline?.timeline_2024_description, icon: <Globe className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16">
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white h-[25vh] flex items-center justify-center border-b-4 border-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2"><span className="text-3xl md:text-4xl">🇺🇦</span></div>
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold mb-3">
            {content?.main?.title || "Our Story"}
          </h1>
          <p className="text-sm md:text-base text-blue-200 max-w-4xl mx-auto">
            {content?.main?.description}
          </p>
        </div>
      </div>

      <section className="py-8 bg-blue-50">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold mb-3 text-gray-900">
              {content?.mission?.mission_title}
            </h2>
            <blockquote className="text-base italic mb-3 text-gray-700 leading-relaxed">
              "{content?.mission?.mission_quote}"
            </blockquote>
          </div>
          <div className="text-center">
            <div className="bg-blue-700 text-white p-4 rounded-2xl shadow-xl border border-blue-600">
              <h3 className="text-base font-bold mb-1">Our Foundation</h3>
              <p className="text-sm opacity-90">Built on faith, strengthened by community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-blue-900 mb-4">
            {content?.timeline?.timeline_title}
          </h2>
          <div className="space-y-3">
            {timeline.map((event, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-700 to-blue-800 rounded-full flex items-center justify-center text-white mr-2 shadow-lg">
                  {event.icon}
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center mb-0.5">
                    <span className="bg-yellow-400 text-gray-900 px-1.5 py-0.5 rounded-full text-xxs font-bold mb-0.5 md:mb-0 md:mr-1.5 inline-block w-fit">
                      {event.year}
                    </span>
                    <h3 className="text-base font-bold text-blue-900">{event.title}</h3>
                  </div>
                  <p className="text-sm text-gray-700">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}