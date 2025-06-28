"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { Label } from "@/components/ui/label"

export default function CreatePostPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [mediaUrl, setMediaUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.")
      setLoading(false)
      return
    }

    if (!user) {
      setError("You must be logged in to create a post.")
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title,
        content,
        media_url: mediaUrl || null,
        author_id: user.id,
      })
      .select()

    if (error) {
      setError("Failed to create post: " + error.message)
      console.error(error)
    } else {
      setSuccess("Post created successfully!")
      setTitle("")
      setContent("")
      setMediaUrl("")
      router.push(`/communityboard/${data[0].id}`)
    }

    setLoading(false)
  }

  if (authLoading || !user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl font-medium">Redirecting to login...</div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Button asChild variant="outline" className="mb-6">
            <Link href="/communityboard">← Back to Community Board</Link>
          </Button>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-900">Create a New Post</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    placeholder="Share your ministry story or activity details here..."
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="media-url">Photo/Video Embed URL</Label>
                  <Input
                    id="media-url"
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="e.g., https://drive.google.com/file/d/..../view"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste a shared Google Drive link or YouTube embed link.
                  </p>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Post"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  )
}