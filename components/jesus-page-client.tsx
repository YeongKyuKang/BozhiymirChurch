import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Cross, Star, Users, BookOpen, Lightbulb } from "lucide-react";
import Link from "next/link";

interface JesusPageClientProps {
  initialContent: Record<string, any>;
}

export default function JesusPageClient({ initialContent }: JesusPageClientProps) {
  const content = initialContent;

  const teachings = [
    {
      icon: <Heart className="h-6 w-6 text-blue-900" />,
      title: content?.teachings?.teaching1_title || "Love God and Others",
      description: content?.teachings?.teaching1_description || "Jesus taught us to love God...",
      verse: content?.teachings?.teaching1_verse || "Matthew 22:37-39",
    },
    {
      icon: <Cross className="h-6 w-6 text-blue-900" />,
      title: content?.teachings?.teaching2_title || "Forgiveness",
      description: content?.teachings?.teaching2_description || "Through Jesus, we learn...",
      verse: content?.teachings?.teaching2_verse || "Matthew 6:14-15",
    },
    {
      icon: <Star className="h-6 w-6 text-blue-900" />,
      title: content?.teachings?.teaching3_title || "Compassion",
      description: content?.teachings?.teaching3_description || "Jesus showed special care...",
      verse: content?.teachings?.teaching3_verse || "Matthew 19:14",
    },
    {
      icon: <Users className="h-6 w-6 text-blue-900" />,
      title: content?.teachings?.teaching4_title || "Eternal Life",
      description: content?.teachings?.teaching4_description || "Jesus offers the gift...",
      verse: content?.teachings?.teaching4_verse || "John 3:16",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-blue-900" />,
      title: content?.teachings?.teaching5_title || "Peace and Hope",
      description: content?.teachings?.teaching5_description || "In a troubled world...",
      verse: content?.teachings?.teaching5_verse || "John 14:27",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-blue-900" />,
      title: content?.teachings?.teaching6_title || "Service to Others",
      description: content?.teachings?.teaching6_description || "True greatness comes...",
      verse: content?.teachings?.teaching6_verse || "Mark 10:43-44",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white h-[25vh] flex items-center justify-center border-b-4 border-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2">
            <span className="text-3xl md:text-4xl">✝️</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold mb-3">
            {content?.hero?.title || "Meet Jesus Christ"}
          </h1>
          <p className="text-sm md:text-base text-blue-200 max-w-4xl mx-auto leading-relaxed">
            {content?.hero?.subtitle || "Discover the love, grace, and salvation found in Jesus Christ."}
          </p>
        </div>
      </div>

      {/* Main Scripture */}
      <section className="py-8 bg-blue-50 border-b border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="text-base italic mb-3 max-w-4xl mx-auto leading-relaxed text-gray-700">
            "{content?.main_scripture?.quote || "For God so loved the world..."}"
          </blockquote>
          <p className="text-sm font-semibold text-gray-700">
            {content?.main_scripture?.reference || "John 3:16"}
          </p>
        </div>
      </section>

      {/* Who is Jesus */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-center text-blue-900 mb-6">
            {content?.who_is_jesus?.title || "Who is Jesus?"}
          </h2>
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-2xl border border-gray-200 bg-gradient-to-br from-white to-blue-50">
              <CardContent className="p-5">
                <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                  <p>{content?.who_is_jesus?.description1}</p>
                  <p>{content?.who_is_jesus?.description2}</p>
                  <p>{content?.who_is_jesus?.description3}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Jesus' Teachings */}
      <section className="py-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-y border-white/20">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-center mb-6">
            {content?.teachings?.title || "The Teachings of Jesus"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachings.map((teaching, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-600 bg-white/10 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="bg-yellow-400 rounded-full p-2">{teaching.icon}</div>
                  </div>
                  <h3 className="text-base font-bold mb-2 text-white">{teaching.title}</h3>
                  <p className="text-sm text-blue-200 mb-4 leading-relaxed">{teaching.description}</p>
                  <div className="bg-gray-100 p-3 rounded-xl border-l-4 border-blue-500">
                    <p className="text-xs text-gray-700 italic font-medium">{teaching.verse}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-6 bg-gradient-to-br from-blue-50 via-white to-yellow-50 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-blue-900 mb-3">
            {content?.cta?.title || "Ready to Accept Jesus?"}
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-4 max-w-4xl mx-auto leading-relaxed">
            {content?.cta?.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-700 to-blue-800 text-white font-bold px-6 py-2 rounded-full shadow-xl">
              <Link href="/join">Accept Jesus Today</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-yellow-700 text-yellow-700 font-bold px-6 py-2 rounded-full">
              <Link href="/prayer">Request Prayer</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}