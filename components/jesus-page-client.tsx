// yeongkyukang/bozhiymirchurch/BozhiymirChurch-3007c4235d54890bd3db6acc74558b701965297b/components/about-jesus-page-client.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Settings, Save, X } from "lucide-react";
import EditableText from "@/components/editable-text";
import Link from "next/link"; // Link import 추가

interface AboutJesusPageClientProps {
  initialContent: Record<string, any>;
}

export default function AboutJesusPageClient({ initialContent }: AboutJesusPageClientProps) {
  const { userRole } = useAuth();
  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, Record<string, string>>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);

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
          page: 'jesus', // 페이지 이름 지정
          section: section,
          key: key,
          value: value,
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.error(`Error updating content for jesus.${section}.${key}:`, error);
        } else {
          updateCount++;
        }
      }
    }

    if (updateCount > 0) {
      try {
        const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/jesus`); // 경로를 '/jesus'로 변경
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json();
          console.error("Revalidation failed:", errorData.message);
        } else {
          revalidated = true;
          console.log("Jesus page revalidated successfully!");
        }
      } catch (err) {
        console.error("Failed to call revalidate API:", err);
      }
    }

    setIsSavingAll(false);
    setIsPageEditing(false);
    setChangedContent({});

    if (updateCount > 0 && revalidated) {
      alert("모든 변경 사항이 저장되고 예수님 페이지가 업데이트되었습니다. 새로고침하면 반영됩니다.");
    } else if (updateCount > 0 && !revalidated) {
        alert("일부 변경 사항은 저장되었지만, 예수님 페이지 재검증에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.");
    } else {
        alert("변경된 내용이 없거나 저장에 실패했습니다.");
    }
  };

  const handleCancelAll = () => {
    if (confirm("모든 변경 사항을 취소하시겠습니까?")) {
      setChangedContent({});
      setIsPageEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {userRole === 'admin' && (
        <div className="fixed top-24 right-8 z-50 flex flex-col space-y-2">
          {!isPageEditing ? (
            <Button variant="outline" size="icon" onClick={() => setIsPageEditing(true)}>
              <Settings className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button variant="outline" size="icon" onClick={handleSaveAll} disabled={isSavingAll}>
                {isSavingAll ? <span className="animate-spin text-purple-500">🔄</span> : <Save className="h-5 w-5 text-green-600" />}
              </Button>
              <Button variant="outline" size="icon" onClick={handleCancelAll} disabled={isSavingAll}>
                <X className="h-5 w-5 text-red-600" />
              </Button>
            </>
          )}
        </div>
      )}

      <section className="py-16 px-4 pt-32 text-center">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <EditableText
              page="jesus"
              section="main"
              contentKey="title"
              initialValue={initialContent?.main?.title || "About Jesus"}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-5xl font-bold text-gray-900"
            />
          </h1>
          <div className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            <EditableText
              page="jesus"
              section="main"
              contentKey="description"
              initialValue={initialContent?.main?.description || "Discover the life, teachings, and significance of Jesus Christ."}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-xl text-gray-600"
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            <EditableText
              page="jesus"
              section="life"
              contentKey="heading"
              initialValue={initialContent?.life?.heading || "His Life and Ministry"}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-3xl font-bold text-gray-900"
            />
          </h2>
          <div className="text-lg text-gray-700 leading-relaxed">
            <EditableText
              page="jesus"
              section="life"
              contentKey="body"
              initialValue={initialContent?.life?.body || "Jesus Christ, the central figure of Christianity, lived a life of profound impact. Born in Bethlehem, He began His public ministry around the age of 30, traveling throughout Galilee and Judea, teaching, healing, and performing miracles. His teachings, found primarily in the Gospels, emphasize love, compassion, forgiveness, and the Kingdom of God. He gathered disciples, challenging societal norms and religious traditions with His message of radical grace and truth."}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-lg text-gray-700 leading-relaxed"
              isTextArea={true}
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">
            <EditableText
              page="jesus"
              section="significance"
              contentKey="heading"
              initialValue={initialContent?.significance?.heading || "The Significance of Jesus"}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-3xl font-bold text-white"
            />
          </h2>
          <div className="text-lg leading-relaxed opacity-90">
            <EditableText
              page="jesus"
              section="significance"
              contentKey="body"
              initialValue={initialContent?.significance?.body || "For Christians, Jesus is believed to be the Son of God, the Messiah prophesied in the Old Testament. His death on the cross is understood as a sacrifice for the sins of humanity, and His resurrection as the victory over death and the promise of eternal life for believers. He is revered as Lord and Savior, the Way, the Truth, and the Life, offering hope and redemption to all who follow Him. His teachings continue to inspire billions worldwide, shaping moral values, ethical conduct, and spiritual understanding."}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-lg leading-relaxed opacity-90"
              isTextArea={true}
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-center bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            <EditableText
              page="jesus"
              section="cta"
              contentKey="title"
              initialValue={initialContent?.cta?.title || "Want to learn more about Jesus?"}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-3xl font-bold text-gray-900 mb-6"
            />
          </h2>
          <div className="text-xl text-gray-600 mb-8">
            <EditableText
              page="jesus"
              section="cta"
              contentKey="description"
              initialValue={initialContent?.cta?.description || "Join us for a deeper exploration of His word and impact on our lives."}
              isEditingPage={isPageEditing}
              onContentChange={handleContentChange}
              tag="span"
              className="text-xl text-gray-600 mb-8"
            />
          </div>
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link href="/join">Connect With Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}