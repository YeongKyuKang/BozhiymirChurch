// components/hero-section.tsx
 "use client";

 import * as React from "react";
 import { useState, useEffect } from "react";
 import Image from "next/image";
 import EditableText from "@/components/editable-text";
 import { Database } from "@/lib/supabase";

 interface HeroSectionProps {
   heroContent: Record<string, string>;
   isEditingPage: boolean;
   onContentChange: (section: string, key: string, value: string) => void;
 }

 export default function HeroSection({ heroContent, isEditingPage, onContentChange }: HeroSectionProps) {
   const [currentImageIndex, setCurrentImageIndex] = useState(0);

   const backgroundImages = [
     "/images/bozhiymir2.jpg",
     "/images/녕.png",
     "/images/하.png",
     "/images/세.png",
     "/images/요.png",
     "/images/!!.png",
   ];

   useEffect(() => {
     const interval = setInterval(() => {
       setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
     }, 5000);

     return () => clearInterval(interval);
   }, [backgroundImages.length]);

   return (
     <section className="relative h-[70vh] flex items-center justify-center overflow-hidden pt-16 md:pt-20 lg:pt-24">
       <div className="absolute inset-0">
         {backgroundImages.map((image, index) => (
           <div
             key={index}
             className={`absolute inset-0 transition-opacity duration-1000 ${
               index === currentImageIndex ? "opacity-100" : "opacity-0"
             } flex items-center justify-center`}
             // 이 div에 고정된 비율을 주는 것이 더 좋을 수 있습니다.
             // 예: style={{ aspectRatio: '16/9' }} 또는 특정 높이
           >
             <Image
               src={image || "/placeholder.svg"}
               alt={`Bozhiymir Church community photo ${index + 1}`}
               fill // 부모 요소를 채우도록 변경
               sizes="100vw" // 이미지 최적화를 위한 sizes prop 추가
               style={{ objectFit: "contain" }} // 컨테이너에 맞춰지되 비율 유지
               priority={index === 0}
               unoptimized={true} // 최적화를 끄는 옵션. 필요 없다면 제거 가능
             />
           </div>
         ))}
         <div className="absolute inset-0 bg-black/50"></div>
       </div>

       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
         {backgroundImages.map((_, index) => (
           <button
             key={index}
             onClick={() => setCurrentImageIndex(index)}
             className={`w-3 h-3 rounded-full transition-all duration-300 ${
               index === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
             }`}
           />
         ))}
       </div>

       {/* Floating Ukrainian Elements (이 부분은 변경 없음) */}
       <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-20 left-10 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
         <div className="absolute top-32 right-20 w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-1000"></div>
         <div className="absolute bottom-40 left-16 w-4 h-4 bg-blue-300 rounded-full animate-pulse delay-500"></div>
         <div className="absolute bottom-60 right-32 w-3 h-3 bg-yellow-300 rounded-full animate-pulse delay-700"></div>
       </div>
       <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
         <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
           <EditableText
             page="home"
             section="hero"
             contentKey="title"
             initialValue={heroContent?.title}
             tag="span"
             className="text-white"
             placeholder="환영 타이틀"
             isEditingPage={isEditingPage}
             onContentChange={onContentChange}
           />
           <br />
           <span className="text-blue-300">Bozhiymir Church</span>
         </h1>

         <div className="mb-8">
           <div className="text-lg md:text-xl font-medium mb-2">
             <EditableText
               page="home"
               section="hero"
               contentKey="subtitle"
               initialValue={heroContent?.subtitle}
               tag="span"
               className="text-white"
               placeholder="부제목"
               isEditingPage={isEditingPage}
               onContentChange={onContentChange}
             />
           </div>
           <div className="text-xl md:text-2xl font-bold tracking-wide">
             <EditableText
               page="home"
               section="hero"
               contentKey="sunday_service_times"
               initialValue={heroContent?.sunday_service_times}
               tag="span"
               className="text-white"
               placeholder="예배 시간"
               isEditingPage={isEditingPage}
               onContentChange={onContentChange}
             />
           </div>
           <div className="text-sm md:text-base text-blue-200 mt-4 font-medium">
             <EditableText
               page="home"
               section="hero"
               contentKey="description"
               initialValue={heroContent?.description}
               tag="span"
               className="text-blue-200"
               isTextArea={true}
               placeholder="설명 문구"
               isEditingPage={isEditingPage}
               onContentChange={onContentChange}
             />
             <br />
             <span className="text-yellow-200">
               <EditableText
                 page="home"
                 section="hero"
                 contentKey="ukrainian_translation"
                 initialValue={heroContent?.ukrainian_translation}
                 tag="span"
                 className="text-yellow-200"
                 placeholder="우크라이나어 번역"
                 isEditingPage={isEditingPage}
                 onContentChange={onContentChange}
               />
             </span>
           </div>
         </div>

         <div className="mt-8">
           <div className="text-lg text-white/90 mb-4">
             <EditableText
               page="home"
               section="hero"
               contentKey="cta_text"
               initialValue={heroContent?.cta_text}
               tag="span"
               className="text-white/90"
               placeholder="행동 유도 문구"
               isEditingPage={isEditingPage}
               onContentChange={onContentChange}
             />
           </div>
           <p className="text-sm text-blue-200">
             "He defends the cause of the fatherless and the widow, and loves the foreigner residing among you" -
             Deuteronomy 10:18
           </p>
         </div>
       </div>
     </section>
   );
 }