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
  initialValue?: string; // New prop for the initial server-rendered value
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  isTextArea?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({
  page,
  section,
  contentKey,
  initialValue,
  tag: Tag = "span",
  className,
  isTextArea = false,
}) => {
  const { userRole, loading: authLoading } = useAuth();
  // Fetch content on the client side only for updates, not initial load
  // `useContent`는 관리자 편집 후 DB 업데이트를 위해 유지합니다.
  const { content, updateContent } = useContent(page, section);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(initialValue || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // 이펙트를 통해 editedValue를 업데이트된 content로 동기화합니다 (저장 후 UI 갱신).
    if (content[contentKey] !== undefined && content[contentKey] !== editedValue) {
      setEditedValue(content[contentKey]);
    }
  }, [content, contentKey]);
  
  // Use the initialValue from the prop for the first render
  const displayValue = editedValue ?? initialValue ?? "콘텐츠를 찾을 수 없습니다.";

  // 로딩 상태 처리: initialValue가 아직 서버에서 전달되지 않았을 때만 스켈레톤을 보여줍니다.
  if (!isMounted && initialValue === undefined) {
    return <Skeleton className={cn(className, "h-6 w-full max-w-lg")} />;
  }

  const handleSave = async () => {
    setIsUpdating(true);
    await updateContent(contentKey, editedValue, section);
    setIsEditing(false);
    setIsUpdating(false);
  };

  const handleCancel = () => {
    setEditedValue(initialValue || "");
    setIsEditing(false);
  };

  // Admin editing mode
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
          <Button size="sm" onClick={handleSave} disabled={isUpdating} className="bg-green-600 hover:bg-green-700">
            {isUpdating ? '저장 중...' : '저장'}
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} disabled={isUpdating}>
            취소
          </Button>
        </div>
      </div>
    );
  }

  // View mode (consistent structure for server & client)
  const isEditable = userRole === "admin";
  return (
    <div
      className={cn(
        "relative",
        isEditable ? "group/edit" : ""
      )}
    >
      <Tag
        className={cn(className, isEditable ? "group-hover/edit:bg-yellow-100 transition-colors cursor-pointer p-1 rounded-md" : "")}
        onDoubleClick={isEditable ? () => setIsEditing(true) : undefined}
      >
        {displayValue}
      </Tag>
      {isEditable && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 opacity-0 group-hover/edit:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default EditableText;