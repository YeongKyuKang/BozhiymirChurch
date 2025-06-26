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
    try {
      let query = supabase.from("content").select("*").eq("page", page)

      if (section) {
        query = query.eq("section", section)
      }

      const { data, error } = await query

      if (error) throw error

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

      if (error) throw error

      setContent((prev) => ({ ...prev, [key]: value }))
    } catch (error) {
      console.error("Error updating content:", error)
    }
  }

  return { content, loading, updateContent, refetch: fetchContent }
}
