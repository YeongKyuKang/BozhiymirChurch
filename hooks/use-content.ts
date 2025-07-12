// hooks/use-content.ts
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface ContentItem {
  id: string
  page: string
  section: string
  key: string
  value: string
}

export function useContent(page: string, section?: string) {
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [page, section])

  const fetchContent = async () => {
    setLoading(true)
    try {
      let query = supabase.from("content").select("*").eq("page", page)

      if (section) {
        query = query.eq("section", section)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      const contentMap: Record<string, string> = {}
      data?.forEach((item: ContentItem) => {
        contentMap[item.key] = item.value
      })

      setContent(contentMap)
    } catch (error) {
      console.error("Error fetching content:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateContent = async (key: string, value: string, sectionName = section || "default") => {
    try {
      const { error } = await supabase.from("content").upsert({
        page,
        section: sectionName,
        key,
        value,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }

      // Optimistic UI update: Update state instantly
      setContent((prev) => ({ ...prev, [key]: value }));
      console.log(`Content for key "${key}" updated successfully in DB!`);

      // 페이지 재검증 요청 (On-Demand Revalidation)
      // 변경된 페이지의 경로를 재검증하도록 요청합니다.
      const revalidateResponse = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&path=/${page === 'home' ? '' : page}`);
      
      if (!revalidateResponse.ok) {
        const errorData = await revalidateResponse.json();
        console.error("Revalidation failed:", errorData.message);
      } else {
        console.log("Page revalidated successfully!");
      }

    } catch (error) {
      console.error("Error updating content:", error);
      // Revert state if update fails, or refetch
      fetchContent(); // Re-fetch to ensure data is in sync
    }
  }

  return { content, loading, updateContent, refetch: fetchContent }
}
