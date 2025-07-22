// components/editable-text.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context"; // useLanguage 훅 임포트 확인

export interface EditableTextProps {
  page: string;
  section: string;
  contentKey: string;
  initialValue?: string; // 이 값은 데이터베이스에서 불러온 사용자 지정 내용 (영어 원문)을 가집니다.
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  isTextArea?: boolean;
  placeholder?: string; // placeholder는 이제 직접 영어 문자열을 받습니다.
  isEditingPage?: boolean;
  onContentChange?: (section: string, key: string, value: string) => void;
}

const EditableText: React.FC<EditableTextProps> = ({
  initialValue = "",
  tag: Tag = "span",
  className,
  isTextArea = false,
  placeholder,
  isEditingPage = false,
  onContentChange,
  section,
  contentKey,
}) => {
  const { userRole } = useAuth();
  const { t } = useLanguage();
  const [editedValue, setEditedValue] = useState(initialValue);

  useEffect(() => {
    setEditedValue(initialValue);
  }, [initialValue]);

  // 편집 모드일 때는 editedValue (원본 영어)를 보여주고,
  // 아닐 때는 editedValue (원본 영어)를 t() 함수로 번역하여 보여줍니다.
  const displayValue = isEditingPage ? editedValue : t(editedValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { // ✅ HTMLTextAreaElement로 수정됨
    const newValue = e.target.value;
    setEditedValue(newValue);
    if (onContentChange) {
      onContentChange(section, contentKey, newValue);
    }
  };

  return (
    <div className={cn("relative", className, isEditingPage && userRole === "admin" ? "p-2 border-2 border-dashed border-blue-400 rounded-md" : "")}>
      {isEditingPage && userRole === "admin" ? (
        isTextArea ? (
          <Textarea
            value={editedValue}
            onChange={handleInputChange}
            className="w-full text-gray-900"
            rows={5}
            placeholder={placeholder ? t(placeholder) : ""} // 플레이스홀더도 번역 적용
          />
        ) : (
          <Input
            value={editedValue}
            onChange={handleInputChange}
            className="w-full text-gray-900"
            placeholder={placeholder ? t(placeholder) : ""} // 플레이스홀더도 번역 적용
          />
        )
      ) : (
        <Tag dangerouslySetInnerHTML={{ __html: displayValue.replace(/\n/g, '<br />') }} />
      )}
    </div>
  );
};

export default EditableText;