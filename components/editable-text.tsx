"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useContent } from "@/hooks/use-content";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface EditableTextProps {
  page: string;
  section: string;
  contentKey: string;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  isTextArea?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({
  page,
  section,
  contentKey,
  tag: Tag = "span",
  className,
  isTextArea = false,
}) => {
  const { userRole, loading: authLoading } = useAuth();
  const { content, loading: contentLoading, updateContent } = useContent(page, section);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState("");

  const isLoading = authLoading || contentLoading;

  useEffect(() => {
    // Update editedValue when the fetched content changes
    if (!contentLoading && content[contentKey] !== undefined) {
      setEditedValue(content[contentKey]);
    }
  }, [content, contentKey, contentLoading]);

  const handleSave = async () => {
    await updateContent(contentKey, editedValue, section);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedValue(content[contentKey]);
    setIsEditing(false);
  };
  
  if (isLoading) {
    return <Skeleton className={cn(className, "h-6 w-full max-w-lg")} />;
  }

  // 관리자 모드 (편집 중)
  if (isEditing && userRole === "admin") {
    const InputComponent = isTextArea ? Textarea : Input;
    return (
      <div className="relative flex flex-col gap-2 p-4 border-2 border-dashed border-blue-400 rounded-md bg-white/50">
        <InputComponent
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          className={cn(className, "w-full")}
          rows={isTextArea ? 5 : undefined}
        />
        <div className="flex gap-2 justify-end">
          <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-1" />
            저장
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-1" />
            취소
          </Button>
        </div>
      </div>
    );
  }

  // 일반 뷰 모드
  const displayValue = content[contentKey] || "콘텐츠를 찾을 수 없습니다.";
  
  const handleDoubleClick = () => {
    if (userRole === "admin") {
      setIsEditing(true);
    }
  };
  
  // 관리자가 로그인되어 있을 때만 수정 버튼을 표시
  if (userRole === "admin") {
    return (
      <div className="relative group/edit">
        <Tag className={cn(className, "group-hover/edit:bg-yellow-100 transition-colors cursor-pointer p-1 rounded-md")} onDoubleClick={handleDoubleClick}>
          {displayValue}
        </Tag>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 opacity-0 group-hover/edit:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // 일반 사용자 뷰
  return <Tag className={className}>{displayValue}</Tag>;
};

export default EditableText;