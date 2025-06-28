"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Eye, MessageCircle, Send, Trash2, Edit, Save, X, Smile, ThumbsUp, Laugh, Frown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
}

interface Comment {
  id: string
  comment: string
  created_at: string
  author_id: string
  users: {
    nickname: string | null
    profile_picture_url: string | null
  }
  // Add likes_count to the Comment interface
  likes_count: number;
}

export default function PostDetailPage() {
  const { id } = useParams()
  const postId = Array.isArray(id) ? id[0] : id
  const router = useRouter()
  const { user, userProfile, userRole } = useAuth()
  
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [editMediaUrl, setEditMediaUrl] = useState("")
  const [updating, setUpdating] = useState(false)
  
  // Ref to track if the view count has been incremented for this page load
  const viewIncrementedRef = useRef(false);

  const reactions = [
    { type: 'heart', icon: <Heart className="h-5 w-5 text-red-500" /> },
    { type: 'thumbsup', icon: <ThumbsUp className="h-5 w-5 text-blue-500" /> },
    { type: 'laugh', icon: <Laugh className="h-5 w-5 text-yellow-500" /> },
    { type: 'smile', icon: <Smile className="h-5 w-5 text-green-500" /> },
    { type: 'frown', icon: <Frown className="h-5 w-5 text-purple-500" /> },
  ];
  
  const [postReactions, setPostReactions] = useState<{ [key: string]: number }>({});
  const [userReaction, setUserReaction] = useState<string | null>(null);
  
  const getInitials = (name: string) => {
    return name?.split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 2) || ""
  }

  useEffect(() => {
    if (postId) {
      fetchPost()
      fetchComments()
      fetchPostReactions();
      // Call incrementViewCount only once per component mount (in dev mode, it will run twice, but this logic handles it)
      if (!viewIncrementedRef.current) {
        incrementViewCount();
        viewIncrementedRef.current = true;
      }
    }
  }, [postId])

  useEffect(() => {
    if (user && post) {
      checkIfLiked()
    }
  }, [user, post])

  const fetchPost = async () => {
    setLoading(true)
    // Use the foreign key name to specify the relationship and avoid ambiguity
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        users:users!posts_author_id_fkey (
          nickname,
          profile_picture_url
        )
      `)
      .eq("id", postId)
      .single()

    if (error || !data) {
      console.error("Error fetching post:", error)
      router.push("/communityboard") // Redirect if post not found
    } else {
      setPost(data as Post)
      setEditTitle(data.title)
      setEditContent(data.content)
      setEditMediaUrl(data.media_url || "")
    }
    setLoading(false)
  }
  
  const incrementViewCount = async () => {
    await supabase.rpc('increment_view_count', { post_id_input: postId });
  }

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        users:users!comments_author_id_fkey (
          nickname,
          profile_picture_url
        ),
        comment_likes(count)
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
    
    if (error) {
      console.error("Error fetching comments:", error)
    } else {
      // Map the data to include the comment like count
      const commentsWithLikes = data.map(comment => ({
        ...comment,
        likes_count: comment.comment_likes[0]?.count || 0,
      }));
      setComments(commentsWithLikes as Comment[]);
    }
  }

  const fetchPostReactions = async () => {
    if (!postId) return;
    const { data, error } = await supabase
      .from("post_reactions")
      .select("reaction_type, count")
      .eq("post_id", postId)
      .returns<{ reaction_type: string, count: number }[]>();

    if (error) {
      console.error("Error fetching reactions:", error);
    } else {
      const counts: { [key: string]: number } = {};
      data.forEach(item => {
        counts[item.reaction_type] = item.count;
      });
      setPostReactions(counts);

      // Check if the current user has reacted
      if (user) {
        const { data: userReactionData } = await supabase
          .from("post_reactions")
          .select("reaction_type")
          .eq("post_id", postId)
          .eq("user_id", user.id)
          .single();
        
        setUserReaction(userReactionData?.reaction_type || null);
      }
    }
  };
  
  const handlePostReaction = async (reactionType: string) => {
    if (!user || !post) return;
    
    // Check if user already reacted with this type
    const hasReacted = userReaction === reactionType;

    if (hasReacted) {
      // Remove reaction
      await supabase
        .from("post_reactions")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", user.id)
        .eq("reaction_type", reactionType);
      
      setUserReaction(null);
      setPostReactions(prev => ({
        ...prev,
        [reactionType]: Math.max(0, (prev[reactionType] || 0) - 1),
      }));
    } else {
      // Add or change reaction
      // First, remove old reaction if it exists
      if (userReaction) {
        await supabase
          .from("post_reactions")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user.id);
        
        setPostReactions(prev => ({
          ...prev,
          [userReaction]: Math.max(0, (prev[userReaction] || 0) - 1),
        }));
      }

      // Add new reaction
      await supabase
        .from("post_reactions")
        .insert({
          post_id: post.id,
          user_id: user.id,
          reaction_type: reactionType,
        });

      setUserReaction(reactionType);
      setPostReactions(prev => ({
        ...prev,
        [reactionType]: (prev[reactionType] || 0) + 1,
      }));
    }
  };

  const handleCommentLike = async (commentId: string) => {
    if (!user) {
      alert("Please log in to like comments.");
      return;
    }

    // Check if the user has already liked this comment
    const { data: likeData } = await supabase
      .from("comment_likes")
      .select("user_id")
      .eq("comment_id", commentId)
      .eq("user_id", user.id);

    const isLikedByUser = likeData && likeData.length > 0;

    if (isLikedByUser) {
      // Unlike
      await supabase
        .from("comment_likes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", user.id);
    } else {
      // Like
      await supabase
        .from("comment_likes")
        .insert({
          comment_id: commentId,
          user_id: user.id,
        });
    }
    // Refresh comments to update like count
    fetchComments();
  };
  
  const checkIfLiked = async () => {
    if (!user || !post) return
    const { data } = await supabase
      .from("likes")
      .select("user_id")
      .eq("user_id", user.id)
      .eq("post_id", post.id)
      .single()

    if (data) {
      setIsLiked(true)
    } else {
      setIsLiked(false)
    }
  }

  const handleLike = async () => {
    if (!user || !post) {
      alert("Please log in to like a post.")
      return
    }

    if (isLiked) {
      // Unlike
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", post.id)
      
      if (!error) {
        setIsLiked(false)
        setPost(prev => prev ? { ...prev, likes_count: prev.likes_count - 1 } : null)
      }
    } else {
      // Like
      const { error } = await supabase
        .from("likes")
        .insert({ user_id: user.id, post_id: post.id })
      
      if (!error) {
        setIsLiked(true)
        setPost(prev => prev ? { ...prev, likes_count: prev.likes_count + 1 } : null)
      }
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("Please log in to comment.")
      return
    }
    if (!newComment.trim()) {
      alert("Comment cannot be empty.")
      return;
    }

    const { error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        author_id: user.id,
        comment: newComment,
      })

    if (error) {
      console.error("Error adding comment:", error)
      alert("Failed to submit comment. Please ensure your profile is set up.") // Added user-facing alert
    } else {
      setNewComment("")
      // After a successful submission, explicitly refetch the comments to update the UI
      fetchComments()
    }
  }

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return
    if (!post) return

    const { error } = await supabase.from("posts").delete().eq("id", post.id)
    if (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post.")
    } else {
      router.push("/communityboard")
    }
  }

  const handleUpdatePost = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("Title and content cannot be empty.")
      return
    }
    setUpdating(true)
    const { error } = await supabase
      .from("posts")
      .update({
        title: editTitle,
        content: editContent,
        media_url: editMediaUrl || null,
      })
      .eq("id", postId)
      
    if (error) {
      console.error("Error updating post:", error)
      alert("Failed to update post.")
    } else {
      setEditMode(false)
      fetchPost()
    }
    setUpdating(false)
  }

  if (loading || !post) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl font-medium">Loading post...</div>
        </div>
        <Footer />
      </>
    )
  }
  
  const isAuthor = user?.id === post.author_id;
  const canEdit = isAuthor || userRole === 'admin';
  const canDelete = isAuthor || userRole === 'admin';

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button asChild variant="outline" className="mb-6">
            <Link href="/communityboard">← Back to Community Board</Link>
          </Button>

          <Card className="shadow-lg mb-8">
            <CardHeader className="bg-white p-6 border-b border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.users?.profile_picture_url || ""} />
                    <AvatarFallback>{getInitials(post.users?.nickname || user?.email || '')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">{post.users?.nickname || 'Anonymous'}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                {canEdit && (
                  <div className="space-x-2">
                    {editMode ? (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => setEditMode(false)} disabled={updating}>
                          <X className="h-5 w-5" />
                        </Button>
                        <Button size="icon" onClick={handleUpdatePost} disabled={updating}>
                          <Save className="h-5 w-5" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => setEditMode(true)}>
                        <Edit className="h-5 w-5" />
                      </Button>
                    )}
                    {canDelete && (
                      <Button variant="destructive" size="icon" onClick={handleDeletePost}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
              {editMode ? (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-2xl font-bold mb-4"
                />
              ) : (
                <CardTitle className="text-3xl font-bold text-gray-900 leading-tight">
                  {post.title}
                </CardTitle>
              )}
            </CardHeader>
            <CardContent className="p-6">
              {post.media_url && (
                <div className="relative w-full mb-6 rounded-lg overflow-hidden border border-gray-200 aspect-video">
                  <iframe
                    src={post.media_url.includes('drive.google.com') ? post.media_url.replace('/view', '/preview') : post.media_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              {editMode ? (
                <>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={10}
                    className="mb-4"
                  />
                  <Label htmlFor="media-url">Photo/Video Embed URL (Google Drive, YouTube, etc.)</Label>
                  <Input
                    id="media-url"
                    value={editMediaUrl}
                    onChange={(e) => setEditMediaUrl(e.target.value)}
                    placeholder="e.g., https://drive.google.com/file/d/.../view"
                  />
                </>
              ) : (
                <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
              )}
            </CardContent>
            <div className="p-6 pt-0 flex items-center justify-between border-t border-gray-200">
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center text-sm">
                  <Eye className="h-4 w-4 mr-1" /> {post.view_count}
                </div>
                {/* Reactions Popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1 p-1">
                      {userReaction ? (
                        reactions.find(r => r.type === userReaction)?.icon
                      ) : (
                        <Smile className="h-4 w-4" />
                      )}
                      <span className="ml-1 text-sm font-medium">{Object.values(postReactions).reduce((sum, count) => sum + count, 0)}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2 flex gap-2">
                    {reactions.map((reaction) => (
                      <Button
                        key={reaction.type}
                        variant="ghost"
                        size="icon"
                        className={`p-2 rounded-full ${userReaction === reaction.type ? 'bg-gray-200' : ''}`}
                        onClick={() => handlePostReaction(reaction.type)}
                      >
                        {reaction.icon}
                        <span className="ml-1 text-xs">{postReactions[reaction.type] || 0}</span>
                      </Button>
                    ))}
                  </PopoverContent>
                </Popover>
                <div className="flex items-center text-sm">
                  <MessageCircle className="h-4 w-4 mr-1" /> {comments.length}
                </div>
              </div>
            </div>
          </Card>

          {/* Comments Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h2>
            <div className="space-y-6">
              {/* Comment Input */}
              {user ? (
                <Card className="p-6">
                  <form onSubmit={handleCommentSubmit} className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={userProfile?.profile_picture_url || ""} />
                      <AvatarFallback>{getInitials(userProfile?.nickname || user.email || '')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        rows={3}
                        className="w-full"
                      />
                      <Button type="submit" size="sm" className="ml-auto flex items-center">
                        <Send className="h-4 w-4 mr-2" /> Submit Comment
                      </Button>
                    </div>
                  </form>
                </Card>
              ) : (
                <Card className="p-6 text-center border-dashed border-gray-300">
                  <p className="text-gray-600">
                    <Link href="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link> to leave a comment.
                  </p>
                </Card>
              )}
              
              {/* Comment List */}
              {comments.map((comment) => (
                <Card key={comment.id} className="p-6 bg-white shadow-sm">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={comment.users?.profile_picture_url || ""} />
                      <AvatarFallback>{getInitials(comment.users?.nickname || comment.users?.profile_picture_url || 'N/A')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-gray-900">{comment.users?.nickname || 'Anonymous'}</div>
                        <div className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</div>
                      </div>
                      <p className="text-gray-800 leading-relaxed">{comment.comment}</p>
                      <div className="flex items-center text-gray-500 mt-2">
                        {/* Comment Like Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-1 p-1"
                          onClick={() => handleCommentLike(comment.id)}
                        >
                          <Heart className={`h-4 w-4 ${comment.likes_count > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                          <span className="text-xs">{comment.likes_count}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}