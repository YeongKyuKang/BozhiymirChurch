"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Switch } from "@/components/ui/switch"
import { Trash2 } from "lucide-react"

interface ContentItem {
  id: string
  page: string
  section: string
  key: string
  value: string
}

interface UserProfile {
  id: string
  email: string
  role: "admin" | "user" | "child"
  nickname: string | null
  gender: "male" | "female"| null
  profile_picture_url: string | null
  created_at: string
  updated_at: string
  can_comment: boolean
}

export default function AdminPage() {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()
  const [content, setContent] = useState<ContentItem[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [selectedPage, setSelectedPage] = useState("home")
  const [newContent, setNewContent] = useState({
    page: "home",
    section: "hero",
    key: "",
    value: "",
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!loading && (!user || userRole !== "admin")) {
      router.push("/")
    }
  }, [user, userRole, loading, router])

  useEffect(() => {
    if (user && userRole === "admin") {
      fetchContent()
      fetchUsers()
    }
  }, [user, userRole])

  const fetchContent = async () => {
    const { data, error } = await supabase.from("content").select("*").order("page", { ascending: true })

    if (error) {
      console.error("Error fetching content:", error)
    } else {
      setContent(data || [])
    }
  }

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
    } else {
      setUsers(data || [])
    }
  }

  const handleUpdateContent = async (id: string, value: string) => {
    const { error } = await supabase
      .from("content")
      .update({ value, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      setMessage("Error updating content")
    } else {
      setMessage("Content updated successfully")
      fetchContent()
    }
  }

  const handleAddContent = async () => {
    if (!newContent.key || !newContent.value) {
      setMessage("Please fill in all fields")
      return
    }

    const { error } = await supabase.from("content").insert([newContent])

    if (error) {
      setMessage("Error adding content")
    } else {
      setMessage("Content added successfully")
      setNewContent({ page: "home", section: "hero", key: "", value: "" })
      fetchContent()
    }
  }

  const handleDeleteContent = async (id: string) => {
    const { error } = await supabase.from("content").delete().eq("id", id)

    if (error) {
      setMessage("Error deleting content")
    } else {
      setMessage("Content deleted successfully")
      fetchContent()
    }
  }
  
  const handleToggleCommentPermission = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
        .from('users')
        .update({ can_comment: !currentStatus })
        .eq('id', userId);

    if (error) {
        console.error("Error updating comment permission:", error);
        setMessage("Failed to update comment permission.");
    } else {
        setMessage("Comment permission updated successfully!");
        fetchUsers(); // Refresh the user list
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (user?.id === userId) {
      alert("You cannot delete your own account.");
      return;
    }

    // Prompt for password before deletion
    const adminPassword = prompt("Please enter the admin password to confirm user deletion:");
    if (!adminPassword) {
        setMessage("User deletion cancelled.");
        return;
    }

    if (!confirm("Are you sure you want to delete this user? This action is irreversible.")) {
      setMessage("User deletion cancelled.");
      return;
    }

    // Call the API route to delete the user
    const response = await fetch('/api/admin/delete-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, adminPassword }), // Pass password to the API
    });

    const result = await response.json();
    if (response.ok) {
      setMessage(`User ${userId} deleted successfully!`);
      fetchUsers(); // Refresh the user list
    } else {
      setMessage(`Failed to delete user: ${result.error}`);
      console.error('API Error:', result.error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user || userRole !== "admin") {
    return null
  }

  const pages = ["home", "beliefs", "leadership", "story", "ukrainian-ministry", "events", "ministries", "join"]
  const filteredContent = content.filter((item) => item.page === selectedPage)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
              <p className="text-gray-600">Manage website content and settings</p>
            </div>

            {message && (
              <Alert className="mb-6">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="content" className="space-y-6">
              <TabsList>
                <TabsTrigger value="content">Content Management</TabsTrigger>
                <TabsTrigger value="add">Add New Content</TabsTrigger>
                <TabsTrigger value="users">User Management</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Content</CardTitle>
                    <CardDescription>Edit content for different pages and sections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Label htmlFor="page-select">Select Page</Label>
                      <select
                        id="page-select"
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      >
                        {pages.map((page) => (
                          <option key={page} value={page}>
                            {page.charAt(0).toUpperCase() + page.slice(1).replace("-", " ")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-4">
                      {filteredContent.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <Label>Section</Label>
                              <Input value={item.section} disabled />
                            </div>
                            <div>
                              <Label>Key</Label>
                              <Input value={item.key} disabled />
                            </div>
                            <div className="flex items-end">
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteContent(item.id)}>
                                Delete
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label>Content</Label>
                            <Textarea
                              value={item.value}
                              onChange={(e) => {
                                const updatedContent = content.map((c) =>
                                  c.id === item.id ? { ...c, value: e.target.value } : c,
                                )
                                setContent(updatedContent)
                              }}
                              rows={3}
                            />
                            <Button className="mt-2" onClick={() => handleUpdateContent(item.id, item.value)}>
                              Update
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="add">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Content</CardTitle>
                    <CardDescription>Create new content entries for pages and sections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="new-page">Page</Label>
                        <select
                          id="new-page"
                          value={newContent.page}
                          onChange={(e) => setNewContent({ ...newContent, page: e.target.value })}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                          {pages.map((page) => (
                            <option key={page} value={page}>
                              {page.charAt(0).toUpperCase() + page.slice(1).replace("-", " ")}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="new-section">Section</Label>
                        <Input
                          id="new-section"
                          value={newContent.section}
                          onChange={(e) => setNewContent({ ...newContent, section: e.target.value })}
                          placeholder="e.g., hero, about, services"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="new-key">Key</Label>
                      <Input
                        id="new-key"
                        value={newContent.key}
                        onChange={(e) => setNewContent({ ...newContent, key: e.target.value })}
                        placeholder="e.g., title, description, button_text"
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="new-value">Content</Label>
                      <Textarea
                        id="new-value"
                        value={newContent.value}
                        onChange={(e) => setNewContent({ ...newContent, value: e.target.value })}
                        placeholder="Enter the content..."
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleAddContent}>Add Content</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* User Management Tab */}
              <TabsContent value="users">
                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>Manage user roles and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {users.map((userItem) => (
                                <div key={userItem.id} className="flex items-center justify-between border rounded-lg p-4">
                                    <div className="flex-1">
                                        <p className="font-semibold">{userItem.nickname || userItem.email}</p>
                                        <p className="text-sm text-gray-500">Role: {userItem.role}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <Label htmlFor={`can-comment-${userItem.id}`}>Can Comment</Label>
                                            <Switch
                                                id={`can-comment-${userItem.id}`}
                                                checked={userItem.can_comment}
                                                onCheckedChange={() => handleToggleCommentPermission(userItem.id, userItem.can_comment)}
                                                disabled={userItem.role === 'admin'} // Admins are always true
                                            />
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteUser(userItem.id)}
                                            disabled={userItem.role === 'admin'} // Cannot delete another admin
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}