// components/prayer-request-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function PrayerRequestForm() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prayerCategories = [
    { value: "ukraine", label: "우크라이나" },
    { value: "bozhiymirchurch", label: "보지미르 교회" },
    { value: "members", label: "교회 지체들" },
    { value: "children", label: "자녀들" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user || !userProfile?.id || !userProfile?.nickname) {
      setError("로그인해야 기도 요청을 제출할 수 있습니다.");
      return;
    }

    if (!category || !title || !content) {
      setError("모든 필드를 채워주세요.");
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
      // 기도 페이지 재검증
      try {
        const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/prayer`);
        if (!revalidateResponse.ok) {
          const errorData = await revalidateResponse.json();
          console.error("Revalidation failed:", errorData.message);
          alert("기도 요청은 제출되었으나, 페이지 업데이트에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.");
        } else {
          console.log("Prayer page revalidated successfully!");
        }
      } catch (err) {
        console.error("Failed to call revalidate API:", err);
        alert("기도 요청은 제출되었으나, 페이지 업데이트에 실패했습니다. 수동 새로고침이 필요할 수 있습니다.");
      }
      router.push("/prayer"); // 기도 페이지로 리다이렉트
    }

    setIsLoading(false);
  };

  return (
    <Card className="p-6 shadow-lg">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="category">카테고리</Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="카테고리를 선택하세요" />
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
            <Label htmlFor="title">기도 제목</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="기도 제목을 입력하세요 (예: 우크라이나의 평화)"
            />
          </div>

          <div>
            <Label htmlFor="content">기도 내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="기도 내용을 3~6줄로 자세히 작성해주세요."
              rows={6}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                제출 중...
              </>
            ) : (
              "기도 요청 제출"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}