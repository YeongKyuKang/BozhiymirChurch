"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContentDatabase, type ContentItem } from "@/lib/database-content"
import { Plus, Save, Trash2, Search, Filter } from "lucide-react"

export default function DatabaseContentManager() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const [newItem, setNewItem] = useState({
    key: "",
    value: "",
    type: "text" as ContentItem["type"],
    category: "general",
    description: "",
  })

  const db = ContentDatabase.getInstance()

  const categories = [
    { value: "hero", label: "Hero Section" },
    { value: "beliefs", label: "Beliefs" },
    { value: "leadership", label: "Leadership" },
    { value: "ukrainian", label: "Ukrainian Ministry" },
    { value: "footer", label: "Footer" },
    { value: "navigation", label: "Navigation" },
    { value: "general", label: "General" },
  ]

  useEffect(() => {
    loadContent()
  }, [])

  useEffect(() => {
    filterContent()
  }, [content, searchTerm, selectedCategory])

  const loadContent = async () => {
    try {
      const items = await db.getAllContent()
      setContent(items)
    } catch (error) {
      console.error("Error loading content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterContent = () => {
    let filtered = content

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.value.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    setFilteredContent(filtered)
  }

  const handleSave = async (item: ContentItem) => {
    try {
      await db.setContent(item.key, item.value, item.type, item.category)
      await loadContent()
      setEditingItem(null)
      alert("Content saved successfully!")
    } catch (error) {
      console.error("Error saving content:", error)
      alert("Error saving content")
    }
  }

  const handleDelete = async (key: string) => {
    if (confirm("Are you sure you want to delete this content item?")) {
      try {
        await db.deleteContent(key)
        await loadContent()
        alert("Content deleted successfully!")
      } catch (error) {
        console.error("Error deleting content:", error)
        alert("Error deleting content")
      }
    }
  }

  const handleAddNew = async () => {
    if (!newItem.key || !newItem.value) {
      alert("Please fill in both key and value")
      return
    }

    try {
      await db.setContent(newItem.key, newItem.value, newItem.type, newItem.category)
      await loadContent()
      setNewItem({
        key: "",
        value: "",
        type: "text",
        category: "general",
        description: "",
      })
      alert("Content added successfully!")
    } catch (error) {
      console.error("Error adding content:", error)
      alert("Error adding content")
    }
  }

  const initializeDefaultContent = async () => {
    const defaultItems = [
      { key: "hero.title", value: "Welcome to", category: "hero", type: "text" as const },
      { key: "hero.subtitle", value: "Bozhiymir Church", category: "hero", type: "text" as const },
      {
        key: "hero.serviceTimes",
        value: "9:00AM (TRADITIONAL), 10:30AM, OR 12:00PM",
        category: "hero",
        type: "text" as const,
      },
      {
        key: "hero.description",
        value: "🇺🇦 A loving community in Portland where Ukrainian children find hope and healing",
        category: "hero",
        type: "textarea" as const,
      },
      {
        key: "hero.descriptionUkrainian",
        value: "Любляча спільнота в Портленді, де українські діти знаходять надію",
        category: "hero",
        type: "textarea" as const,
      },
      { key: "beliefs.title", value: "Our Beliefs", category: "beliefs", type: "text" as const },
      {
        key: "beliefs.subtitle",
        value: "At Bozhiymir Church, our faith is built on the solid foundation of God's Word.",
        category: "beliefs",
        type: "textarea" as const,
      },
      { key: "footer.churchName", value: "Bozhiymir Church", category: "footer", type: "text" as const },
      { key: "footer.phone", value: "(503) 555-0123", category: "footer", type: "text" as const },
      { key: "footer.email", value: "info@bozhiymirchurch.com", category: "footer", type: "text" as const },
    ]

    try {
      await db.bulkUpdate(defaultItems)
      await loadContent()
      alert("Default content initialized!")
    } catch (error) {
      console.error("Error initializing content:", error)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Database Content Manager</h1>
            <p className="text-gray-600">Manage website content with database storage</p>
          </div>

          <div className="flex space-x-4">
            <Button onClick={initializeDefaultContent} variant="outline">
              Initialize Default Content
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Add New Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="Content Key (e.g., hero.title)"
                value={newItem.key}
                onChange={(e) => setNewItem((prev) => ({ ...prev, key: e.target.value }))}
              />

              <Select
                value={newItem.type}
                onValueChange={(value: ContentItem["type"]) => setNewItem((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={newItem.category}
                onValueChange={(value) => setNewItem((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {newItem.type === "textarea" ? (
              <Textarea
                placeholder="Content Value"
                value={newItem.value}
                onChange={(e) => setNewItem((prev) => ({ ...prev, value: e.target.value }))}
                rows={3}
              />
            ) : (
              <Input
                placeholder="Content Value"
                value={newItem.value}
                onChange={(e) => setNewItem((prev) => ({ ...prev, value: e.target.value }))}
              />
            )}
          </CardContent>
        </Card>

        {/* Content List */}
        <div className="space-y-4">
          {filteredContent.map((item) => (
            <Card key={item.key}>
              <CardContent className="p-4">
                {editingItem?.key === item.key ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Key</label>
                        <Input
                          value={editingItem.key}
                          onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, key: e.target.value } : null))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <Select
                          value={editingItem.type}
                          onValueChange={(value: ContentItem["type"]) =>
                            setEditingItem((prev) => (prev ? { ...prev, type: value } : null))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <Select
                          value={editingItem.category}
                          onValueChange={(value) =>
                            setEditingItem((prev) => (prev ? { ...prev, category: value } : null))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Value</label>
                      {editingItem.type === "textarea" ? (
                        <Textarea
                          value={editingItem.value}
                          onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, value: e.target.value } : null))}
                          rows={4}
                        />
                      ) : (
                        <Input
                          value={editingItem.value}
                          onChange={(e) => setEditingItem((prev) => (prev ? { ...prev, value: e.target.value } : null))}
                        />
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={() => handleSave(editingItem)}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditingItem(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{item.key}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{item.type}</span>
                      </div>
                      <p className="text-gray-700 break-words">{item.value}</p>
                      {item.updatedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Updated: {new Date(item.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(item.key)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No content found. Try adjusting your search or filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
