"use client"; // 이 파일은 클라이언트 컴포넌트임을 명시합니다.

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
  placeholder?: string; // Add placeholder prop
  // New props for global edit mode
  isEditingPage?: boolean; // Indicates if the parent page is in global edit mode
  onContentChange?: (section: string, key: string, value: string) => void; // Callback to report changes
}

const EditableText: React.FC<EditableTextProps> = ({
  page,
  section,
  contentKey,
  initialValue,
  tag: Tag = "span",
  className,
  isTextArea = false,
  placeholder,
  isEditingPage = false, // Default to false if not provided
  onContentChange, // Destructure the callback
}) => {
  const { userRole, loading: authLoading } = useAuth();
  // `useContent`는 이제 초기 패칭이 아닌, 업데이트 로직에만 사용됩니다.
  const { content, updateContent } = useContent(page, section);
  
  const [editedValue, setEditedValue] = useState(initialValue || ""); // Initialize with initialValue
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Sync editedValue with fetched content after client-side mount/update
    if (content[contentKey] !== undefined) {
      setEditedValue(content[contentKey]);
    } else {
      // Fallback to initialValue if fetched content is not available yet
      setEditedValue(initialValue || "");
    }
  }, [content, contentKey, initialValue]);
  
  // Use the currently stored editedValue or initialValue for display
  const displayValue = editedValue ?? initialValue ?? "콘텐츠를 찾을 수 없습니다.";

  // 로딩 상태 처리: initialValue가 아직 서버에서 전달되지 않았을 때만 스켈레톤을 보여줍니다.
  if (!isMounted && initialValue === undefined) {
    return <Skeleton className={cn(className, "h-6 w-full max-w-lg")} />;
  }

  const handleSave = async () => {
    setIsUpdating(true);
    await updateContent(contentKey, editedValue, section);
    // setIsEditing(false); // 개별 저장 버튼 로직은 삭제되었으므로 이 부분은 필요 없습니다.
    setIsUpdating(false);
  };

  const handleCancel = () => {
    setEditedValue(initialValue || ""); // Revert to original initialValue
    // setIsEditing(false); // 개별 취소 버튼 로직은 삭제되었으므로 이 부분은 필요 없습니다.
  };
  
  // Enter edit mode: ensure editedValue is the current display text
  const enterEditMode = () => {
    setEditedValue(editedValue); // Use the current state value
    // Since this is called when isEditingPage is true, it simply reports the change
    if (onContentChange) {
      onContentChange(section, contentKey, editedValue);
    }
  };

  // handleInputChange 정의: 입력 필드 값 변경을 처리하고 부모 컴포넌트로 전달합니다.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setEditedValue(newValue);
    if (onContentChange) {
      onContentChange(section, contentKey, newValue);
    }
  };


  // Admin editing mode (input field appears)
  if (isEditingPage && userRole === "admin") {
    const InputComponent = isTextArea ? Textarea : Input;
    return (
      <div className="relative flex flex-col gap-2 p-4 border-2 border-dashed border-blue-400 rounded-md bg-white/50">
        <InputComponent
          value={editedValue}
          onChange={handleInputChange} // 여기에서 handleInputChange를 사용합니다.
          className={cn(className, "w-full", "text-gray-900")}
          rows={isTextArea ? 5 : undefined}
          placeholder={placeholder || "내용을 입력하세요..."}
        />
        {/* Individual Save/Cancel buttons removed here as per batch save design */}
      </div>
    );
  }

  // View mode (consistent structure for server & client)
  const showIndividualEditIndicator = userRole === "admin" && isEditingPage;

  return (
    <div
      className={cn(
        "relative",
        showIndividualEditIndicator ? "group/edit" : ""
      )}
    >
      <Tag
        className={cn(className, showIndividualEditIndicator ? "group-hover/edit:bg-yellow-100 transition-colors cursor-pointer p-1 rounded-md" : "")}
        onDoubleClick={showIndividualEditIndicator ? enterEditMode : undefined}
      >
        {displayValue}
      </Tag>
      {showIndividualEditIndicator && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 opacity-0 group-hover/edit:opacity-100 transition-opacity"
          onClick={enterEditMode}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default EditableText;