// yeongkyukang/bozhiymirchurch/BozhiymirChurch-3007c4235d54890bd3db6acc74558b701965297b/components/prayer-request-form.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase"; // make sure this is the browser client
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation"; // useRouter import
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function PrayerRequestForm() {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const [category, setCategory] = useState<"ukraine" | "bozhiymirchurch" | "members" | "children">("ukraine");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user || !userProfile?.id || !userProfile?.nickname) {
      setError("기도 요청을 제출하려면 로그인해야 합니다.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);

    const { error: insertError } = await supabase.from("prayer_requests").insert({
      category,
      title,
      content,
      author_id: user.id,
      author_nickname: userProfile.nickname,
    });

    if (insertError) {
      console.error("Error submitting prayer request:", insertError.message);
      setError(`기도 요청 제출 중 오류 발생: ${insertError.message}`);
    } else {
      alert("기도 요청이 성공적으로 제출되었습니다!");
      // 수정: 페이지 재검증 API 호출 제거
      // 재검증은 app/prayer/page.tsx의 export const revalidate 설정을 따릅니다.
      // router.push()는 서버 컴포넌트를 다시 렌더링하도록 트리거합니다.
      router.push("/prayer"); 
    }
    setIsLoading(false);
  };

  const prayerCategories = [
    { value: "ukraine", label: "우크라이나" },
    { value: "bozhiymirchurch", label: "보쥐미르교회" },
    { value: "members", label: "성도님들" },
    { value: "children", label: "아이들" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white rounded-lg shadow-md">
      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>오류!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="category" className="mb-2 block">카테고리</Label>
        <Select value={category} onValueChange={(value: "ukraine" | "bozhiymirchurch" | "members" | "children") => setCategory(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            {prayerCategories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="title" className="mb-2 block">기도 제목</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="간단한 기도 제목을 입력하세요 (예: 전쟁 종식)"
          required
        />
      </div>

      <div>
        <Label htmlFor="content" className="mb-2 block">기도 내용</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="구체적인 기도 내용을 3-6줄 정도로 작성해 주세요."
          rows={5}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "제출 중..." : "기도 요청 제출"}
      </Button>
    </form>
  );
}
