"use client";

import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import EditableText from "@/components/editable-text";
import { Button } from "@/components/ui/button";
import { Save, X, Settings } from "lucide-react";

interface UkrainianMinistryPageClientProps {
  initialContent: Record<string, any>;
  initialPosts: any[];
}

export default function UkrainianMinistryPageClient({ 
  initialContent, 
  initialPosts 
}: UkrainianMinistryPageClientProps) {
  const { userRole } = useAuth();
  const [isPageEditing, setIsPageEditing] = useState(false);
  const [changedContent, setChangedContent] = useState<Record<string, any>>({});
  
  const isAdmin = userRole === 'admin';

  // 기존에 쓰시던 핸들러 로직들...
  const handleContentChange = (section: string, key: string, value: string) => {
    setChangedContent(prev => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [key]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="fixed top-24 right-8 z-50 flex gap-2">
          <Button variant="outline" onClick={() => setIsPageEditing(!isPageEditing)}>
            <Settings className="h-4 w-4 mr-2" />
            {isPageEditing ? "Cancel" : "Edit Page"}
          </Button>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">
          <EditableText
            page="ukrainian"
            section="hero"
            contentKey="title"
            initialValue={initialContent?.hero?.title || "Ukrainian Ministry"}
            onContentChange={handleContentChange}
            isEditingPage={isPageEditing}
            tag="span"
          />
        </h1>
        <p className="text-blue-100 max-w-2xl mx-auto">
          <EditableText
            page="ukrainian"
            section="hero"
            contentKey="description"
            initialValue={initialContent?.hero?.description || "사역 설명을 입력하세요."}
            onContentChange={handleContentChange}
            isEditingPage={isPageEditing}
            tag="span"
            isTextArea={true}
          />
        </p>
      </div>

      {/* Posts List */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8">
          {initialPosts.map((post) => (
            <div key={post.id} className="border p-6 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
              <p className="text-gray-600">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}