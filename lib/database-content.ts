"use client"

import { useEffect } from "react"

import { useState } from "react"

// Database schema and types for content management
export interface ContentItem {
  id: string
  key: string
  value: string
  type: "text" | "textarea" | "json"
  category: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface ContentCategory {
  id: string
  name: string
  description: string
  order: number
}

// Mock database functions (replace with your actual database)
export class ContentDatabase {
  private static instance: ContentDatabase
  private content: Map<string, ContentItem> = new Map()

  static getInstance(): ContentDatabase {
    if (!ContentDatabase.instance) {
      ContentDatabase.instance = new ContentDatabase()
    }
    return ContentDatabase.instance
  }

  async getContent(key: string): Promise<ContentItem | null> {
    // In a real app, this would query your database
    const stored = localStorage.getItem(`content_${key}`)
    if (stored) {
      return JSON.parse(stored)
    }
    return this.content.get(key) || null
  }

  async setContent(
    key: string,
    value: string,
    type: ContentItem["type"] = "text",
    category = "general",
  ): Promise<void> {
    const item: ContentItem = {
      id: key,
      key,
      value,
      type,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.content.set(key, item)
    localStorage.setItem(`content_${key}`, JSON.stringify(item))
  }

  async getAllContent(): Promise<ContentItem[]> {
    const items: ContentItem[] = []

    // Get from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("content_")) {
        const item = localStorage.getItem(key)
        if (item) {
          items.push(JSON.parse(item))
        }
      }
    }

    return items
  }

  async getContentByCategory(category: string): Promise<ContentItem[]> {
    const allContent = await this.getAllContent()
    return allContent.filter((item) => item.category === category)
  }

  async deleteContent(key: string): Promise<void> {
    this.content.delete(key)
    localStorage.removeItem(`content_${key}`)
  }

  async bulkUpdate(items: Partial<ContentItem>[]): Promise<void> {
    for (const item of items) {
      if (item.key && item.value) {
        await this.setContent(item.key, item.value, item.type, item.category)
      }
    }
  }
}

// Content hook for easy access
export function useContent(key: string, defaultValue = "") {
  const [content, setContent] = useState(defaultValue)
  const [loading, setLoading] = useState(true)
  const db = ContentDatabase.getInstance()

  useEffect(() => {
    const loadContent = async () => {
      try {
        const item = await db.getContent(key)
        if (item) {
          setContent(item.value)
        }
      } catch (error) {
        console.error("Error loading content:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [key])

  const updateContent = async (newValue: string) => {
    try {
      await db.setContent(key, newValue)
      setContent(newValue)
    } catch (error) {
      console.error("Error updating content:", error)
    }
  }

  return { content, updateContent, loading }
}
