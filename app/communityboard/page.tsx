"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Eye, Heart, MessageCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import EditableText from "@/components/editable-text"

interface Post {
  id: string
  title: string
  content: string
  media_url: string | null
  author_id: string
  view_count: number
  likes_count: number
  created_at: string
  users: {
    nickname: string | null
    profile_picture_url: string | null
  }
  comments_count: number;
}

export default function CommunityBoardPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // TypeScript 오류 해결: useState에 명시적인 타입을 지정합니다.
  const [initialContent, setInitialContent] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    // Client-side fetch for posts list
    fetchPosts();
    // Client-side fetch for content, needed by EditableText component
    fetchCommunityContentClient();
  }, []);

  const fetchCommunityContentClient = async () => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('page', 'communityboard');
      if (error) {
          console.error("Error fetching client content:", error);
      } else {
          const contentMap: Record<string, any> = {};
          data.forEach(item => {
              if (!contentMap[item.section]) contentMap[item.section] = {};
              contentMap[item.section][item.key] = item.value;
          });
          setInitialContent(contentMap);
      }
  };


  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        content,
        media_url,
        author_id,
        view_count,
        likes_count,
        created_at,
        users:users!posts_author_id_fkey (
          nickname,
          profile_picture_url
        ),
        comments(count)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      setError("Failed to load posts: " + error.message)
      console.error(error)
    } else {
      const postsWithMappedData = data.map((rawPost: any) => {
        const userProfile = rawPost.users && rawPost.users.length > 0 ? rawPost.users[0] : { nickname: null, profile_picture_url: null };
        
        return {
          id: rawPost.id,
          title: rawPost.title,
          content: rawPost.content,
          media_url: rawPost.media_url,
          author_id: rawPost.author_id,
          view_count: rawPost.view_count,
          likes_count: rawPost.likes_count,
          created_at: rawPost.created_at,
          users: userProfile,
          comments_count: rawPost.comments[0]?.count || 0,
        };
      });
      setPosts(postsWithMappedData as Post[]);
    }
    setLoading(false)
  }

  const truncateContent = (content: string) => {
    return content.length > 150 ? content.substring(0, 150) + "..." : content
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl font-medium">Loading community board...</div>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-600 font-bold">{error}</div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <EditableText page="communityboard" section="main" contentKey="title" initialValue={initialContent?.main?.title} tag="span" className="text-5xl font-bold text-gray-900 mb-6" />
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              <EditableText page="communityboard" section="main" contentKey="description" initialValue={initialContent?.main?.description} tag="span" className="text-xl text-gray-600 max-w-3xl mx-auto mb-8" />
            </p>
          </div>

          <div className="flex justify-end mb-8">
            {user && (
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/communityboard/create">
                  <Plus className="h-5 w-5 mr-2" />
                  Create a Post
                </Link>
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/communityboard/${post.id}`}>
                <Card className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                  {post.media_url && (
                    <div className="relative h-48 w-full">
                       {/* Google Drive video/image embed */}
                      <iframe
                        src={post.media_url.replace('/view', '/preview')} // Use /preview for a better embed experience
                        className="w-full h-full object-cover rounded-t-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl font-bold line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      Posted by {post.users?.nickname || 'Anonymous'} on {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      {truncateContent(post.content)}
                    </p>
                    <div className="flex items-center space-x-4 text-gray-500 text-sm mt-auto">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{post.view_count}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        <span>{post.likes_count}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>{post.comments_count}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {posts.length === 0 && !loading && (
            <div className="text-center text-gray-500 mt-12">No posts found. Be the first to share!</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}