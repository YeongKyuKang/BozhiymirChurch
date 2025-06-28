import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Users, Heart, Home, Globe } from "lucide-react"

export default function CommunitySection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* 이미지 컨테이너 - 통계 오버레이 삭제 */}
          <div className="relative w-full aspect-[4/5] md:aspect-[5/6] lg:aspect-[4/5] rounded-xl shadow-2xl overflow-hidden mx-auto"> {/* mx-auto로 중앙 정렬 */}
            <Image
              src="/images/bozhiymir.png"
              alt="Bozhiymir Church Community"
              fill // 부모 컨테이너에 맞춰 이미지 확장
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw" // 반응형 사이즈 힌트 제공
              style={{ objectFit: "cover" }} // 이미지가 컨테이너를 꽉 채우도록 설정
              className="transition-transform duration-500 hover:scale-105"
            />
            {/* Ukrainian flag accent */}
            <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-b from-blue-500 to-yellow-400 rounded-full shadow-lg border-2 border-white z-10"></div>
          </div>
          
          <div className="space-y-8 mt-16 lg:mt-0"> {/* 모바일/태블릿에서 상단 여백 추가, 데스크톱에서 제거 */}
            <div>
              <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                About Our Community
              </h2>
              <h3 className="text-3xl font-bold text-blue-700 mb-8">
                A Family United by Faith and Love
              </h3>
            </div>

            <div className="space-y-6 text-xl text-gray-700 leading-relaxed">
              <p>
                Bozhiymir Church is more than a place of worship—we're a diverse, loving family that spans cultures, languages, and backgrounds. Our community has grown stronger through welcoming Ukrainian families and children who have found refuge in Portland.
              </p>
              <p>
                From our traditional Sunday services to our vibrant children's programs, every person who walks through our doors becomes part of something beautiful. We believe that God's love knows no borders, and our community reflects that truth every day.
              </p>
              <p className="text-blue-700 font-bold italic border-l-4 border-blue-300 pl-4">
                "There is neither Jew nor Gentile, neither slave nor free, nor is there male and female, for you are all one in Christ Jesus." - Galatians 3:28
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-yellow-100 rounded-2xl p-8 border-2 border-blue-300 shadow-md">
              <h4 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center">
                <span className="mr-2 text-3xl">🇺🇦</span> Our Ukrainian Ministry
              </h4>
              <p className="text-gray-800 text-base leading-relaxed">
                We've opened our hearts and homes to Ukrainian orphan children, providing them with not just shelter, but a loving church family. Through host families, educational support, and community care, we're helping these brave children heal and build new lives filled with hope.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mt-8">
              <Button className="bg-blue-600 hover:bg-blue-800 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transform hover:scale-105 transition-transform">
                Join Our Family Today
              </Button>
              <Button
                variant="outline"
                className="border-4 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
              >
                Visit This Sunday
              </Button>
            </div>
          </div>
        </div>

        {/* Community Highlights */}
        <div className="mt-20 grid md:grid-cols-3 gap-10">
          <div className="text-center p-8 bg-blue-50 rounded-2xl border-2 border-blue-100 shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
            <div className="text-5xl mb-4">🤝</div>
            <h4 className="text-2xl font-bold text-gray-900 mb-3">Welcoming Spirit</h4>
            <p className="text-gray-700 text-base">
              Every person is welcomed with open arms, regardless of background, language, or life circumstances.
            </p>
          </div>

          <div className="text-center p-8 bg-yellow-50 rounded-2xl border-2 border-yellow-100 shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
            <div className="text-5xl mb-4">🌍</div>
            <h4 className="text-2xl font-bold text-gray-900 mb-3">Global Family</h4>
            <p className="text-gray-700 text-base">
              Our community represents multiple countries and cultures, creating a rich tapestry of faith and fellowship.
            </p>
          </div>

          <div className="text-center p-8 bg-green-50 rounded-2xl border-2 border-green-100 shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
            <div className="text-5xl mb-4">❤️‍🩹</div>
            <h4 className="text-2xl font-bold text-gray-900 mb-3">Caring Support</h4>
            <p className="text-gray-700 text-base">
              From practical needs to emotional support, our community rallies around each member with Christ's love.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}