// components/editable-text.tsx (Modified file)
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

// 'export' 키워드를 추가하여 이 타입을 다른 파일에서 import 할 수 있도록 합니다.
export interface EditableTextProps {
  page: string;
  section: string;
  contentKey: string;
  initialValue?: string;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  isTextArea?: boolean;
  placeholder?: string;
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

  const displayValue = isEditingPage ? editedValue : t(initialValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setEditedValue(newValue);
    if (onContentChange) {
      onContentChange(section, contentKey, newValue);
    }
  };

  return (
    <div className={cn("relative", className, isEditingPage && userRole === "admin" ? "p-2 border-2 border-dashed border-blue-400" : "")}>
      {isEditingPage && userRole === "admin" ? (
        isTextArea ? (
          <Textarea value={editedValue} onChange={handleInputChange} className="w-full text-gray-900" rows={5} placeholder={placeholder} />
        ) : (
          <Input value={editedValue} onChange={handleInputChange} className="w-full text-gray-900" placeholder={placeholder} />
        )
      ) : (
        <Tag dangerouslySetInnerHTML={{ __html: displayValue.replace(/\n/g, '<br />') }} />
      )}
    </div>
  );
};

export default EditableText;