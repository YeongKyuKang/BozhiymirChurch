'use client'

import { useState, useEffect, useRef } from 'react'
import { Database } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Upload, Trash2 } from 'lucide-react'
import Image from 'next/image'
import imageCompression from 'browser-image-compression'

type WordPost = Database['public']['Tables']['word_posts']['Row']

interface WordPostsClientProps {}

export default function WordPostsClient({}: WordPostsClientProps) {
  const { user, userProfile } = useAuth()
  const { t } = useLanguage() // t 함수 가져오기
  const [wordPosts, setWordPosts] = useState<WordPost[]>([])
  const [loading, setLoading] = useState(true)

  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [currentPost, setCurrentPost] = useState<Partial<WordPost>>({})
  const [wordDate, setWordDate] = useState<Date | undefined>(undefined)
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null)
  const [backgroundPreview, setBackgroundPreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [postToDelete, setPostToDelete] = useState<WordPost | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchWordPosts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('word_posts')
        .select('*')
        .order('word_date', { ascending: false })

      if (error) {
        console.error('Error fetching word posts:', error)
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.error(t('Error fetching word posts.')) 
      } else {
        setWordPosts(data || [])
      }
      setLoading(false)
    }
    fetchWordPosts()
  }, [t])

  const handleEdit = (post: WordPost) => {
    setIsEditing(post.id)
    setCurrentPost({ ...post })
    setWordDate(post.word_date ? new Date(post.word_date) : undefined)
    setBackgroundPreview(post.image_url || '')
    setBackgroundImage(null)
  }

  const handleNew = () => {
    setIsEditing('new')
    setCurrentPost({})
    setWordDate(undefined)
    setBackgroundPreview('')
    setBackgroundImage(null)
  }

  const handleCancel = () => {
    setIsEditing(null)
    setCurrentPost({})
    setWordDate(undefined)
    setBackgroundPreview('')
    setBackgroundImage(null)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setCurrentPost((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.error(t('Image must be less than 5MB.')) 
        return
      }
      if (!file.type.startsWith('image/')) {
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.error(t('Please select a valid image file.')) 
        return
      }

      setIsUploading(true)
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920 }
        const compressedFile = await imageCompression(file, options)

        setBackgroundImage(compressedFile)
        const reader = new FileReader()
        reader.onloadend = () => {
          setBackgroundPreview(reader.result as string)
        }
        reader.readAsDataURL(compressedFile)
      } catch (error) {
        console.error('Error compressing image:', error)
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.error(t('Failed to compress image.')) 
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleRemoveImage = async () => {
    if (isEditing && isEditing !== 'new' && currentPost.image_url) {
        const fileName = currentPost.image_url.split('/').pop()
        if (fileName) {
            setBackgroundPreview('')
            setCurrentPost(prev => ({ ...prev, image_url: null }))
            setBackgroundImage(null)

            const { error: deleteError } = await supabase.storage
                .from('word-backgrounds')
                .remove([fileName])

            if (deleteError) {
                console.error("Error deleting image from storage:", deleteError)
                 // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
                toast.error(t('Error deleting image from storage.')) 
                handleEdit(wordPosts.find(p => p.id === isEditing)!)
            } else {
                 const { error: dbUpdateError } = await supabase
                    .from('word_posts')
                    .update({ image_url: null })
                    .eq('id', isEditing)

                 if (dbUpdateError) {
                    console.error("Error updating image_url in DB:", dbUpdateError)
                 } else {
                     // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
                    toast.success(t('Image removed successfully.')) 
                 }
            }
        }
    } else {
        setBackgroundPreview('')
        setBackgroundImage(null)
        setCurrentPost(prev => ({ ...prev, image_url: null }))
    }
}

  const handleSave = async () => {
    if (!currentPost.title || !currentPost.content || !wordDate || !user || !userProfile) {
       // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
      toast.error(t('Title, content, and date are required.')) 
      return
    }

    setLoading(true)
    let imageUrl = currentPost.image_url

    if (backgroundImage) {
      setIsUploading(true)
      const fileExt = backgroundImage.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('word-backgrounds')
        .upload(fileName, backgroundImage, { upsert: true })

      setIsUploading(false)
      if (uploadError) {
        console.error('Error uploading image:', uploadError)
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.error(t('Error uploading image.')) 
        setLoading(false)
        return
      }
      const { data: urlData } = supabase.storage
        .from('word-backgrounds')
        .getPublicUrl(fileName)
      imageUrl = urlData.publicUrl
    } else if (backgroundPreview === '' && currentPost.image_url) {
        imageUrl = null;
    }

    const postDataToSave = {
      ...currentPost,
      word_date: format(wordDate, 'yyyy-MM-dd'),
      image_url: imageUrl,
      author_id: user.id,
      author_nickname: userProfile.nickname || userProfile.email || 'Admin',
    }
    if (isEditing === 'new') {
        delete postDataToSave.id;
    }


    try {
      let savedPost: WordPost | null = null;
      if (isEditing === 'new') {
        const { data, error } = await supabase
          .from('word_posts')
          .insert(postDataToSave)
          .select()
          .single()
        if (error) throw error
        savedPost = data
        setWordPosts((prev) => [savedPost!, ...prev])
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.success(t('Word post created successfully.')) 
      } else {
        const { data, error } = await supabase
          .from('word_posts')
          .update(postDataToSave)
          .eq('id', isEditing!)
          .select()
          .single()
        if (error) throw error
        savedPost = data
        setWordPosts((prev) =>
          prev.map((p) => (p.id === isEditing ? savedPost! : p)),
        )
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.success(t('Word post updated successfully.')) 
      }

      await fetch('/api/revalidate?path=/word')

      handleCancel()
    } catch (error: any) {
      console.error('Error saving word post:', error)
       // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
      toast.error(`${t('Error saving word post')}: ${error.message}`) 
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!postToDelete) return

    setLoading(true)
    try {
        if (postToDelete.image_url) {
            const fileName = postToDelete.image_url.split('/').pop()
            if (fileName) {
                const { error: deleteImageError } = await supabase.storage
                    .from('word-backgrounds')
                    .remove([fileName])
                if (deleteImageError) {
                    console.error("Error deleting image from storage:", deleteImageError)
                    // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
                    toast.info(t('Failed to delete image from storage, but the post will be deleted.')) 
                }
            }
        }

        const { error: deleteDbError } = await supabase
            .from('word_posts')
            .delete()
            .eq('id', postToDelete.id)

        if (deleteDbError) {
            throw deleteDbError
        }

        setWordPosts((prev) => prev.filter((p) => p.id !== postToDelete.id))
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.success(t('Word post deleted successfully.')) 
        setPostToDelete(null)

        await fetch('/api/revalidate?path=/word')

    } catch (error: any) {
        console.error('Error deleting word post:', error)
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.error(`${t('Error deleting word post')}: ${error.message}`) 
    } finally {
        setLoading(false)
        setPostToDelete(null)
    }
}

  if (loading && wordPosts.length === 0) {
    // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
    return <div>{t('Loading...')}</div> 
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
        <h1 className="text-3xl font-bold">{t('Word for Today Management')}</h1>
        <Button onClick={handleNew}>{t('New Post')}</Button>
      </div>

      {isEditing !== null && (
        <div className="p-6 border rounded-lg space-y-4 bg-gray-50">
           {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
          <h2 className="text-2xl font-semibold">
            {isEditing === 'new' ? t('Create New Word Post') : t('Edit Word Post')}
          </h2>
          <div>
             {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">{t('Title (e.g., Verse)')}</label>
            <Input
              id="title"
              name="title"
              value={currentPost.title || ''}
              onChange={handleChange}
               // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
              placeholder={t('e.g., John 3:16')}
              required
            />
          </div>
          <div>
             {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">{t('Content (Scripture Text)')}</label>
            <Textarea
              id="content"
              name="content"
              value={currentPost.content || ''}
              onChange={handleChange}
               // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
              placeholder={t('Enter the scripture text...')}
              rows={5}
              required
            />
          </div>
          <div>
             {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('Word Date')}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className="w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                   {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                  {wordDate ? format(wordDate, 'PPP') : <span>{t('Pick a date')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={wordDate}
                  onSelect={setWordDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
             {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
            <label className="block text-sm font-medium text-gray-700">{t('Background Image')}</label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="flex-shrink-0 h-20 w-32 relative bg-gray-100 rounded overflow-hidden">
                {backgroundPreview ? (
                  <Image
                    src={backgroundPreview}
                     // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
                    alt={t('Background Preview')}
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                     {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                    {t('No Image')}
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                 {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                {isUploading ? t('Uploading...') : t('Upload Image')}
              </Button>
               {(backgroundPreview || backgroundImage) && (
                 <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                 >
                    <Trash2 className="mr-2 h-4 w-4" />
                     {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                    {t('Remove Image')}
                 </Button>
               )}
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
             {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
            <Button onClick={handleSave} disabled={loading || isUploading}>
              {loading ? t('Saving...') : t('Save')}
            </Button>
            {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
            <Button variant="outline" onClick={handleCancel} disabled={loading || isUploading}>
              {t('Cancel')}
            </Button>
          </div>
        </div>
      )}

      {/* Word Posts List */}
      <div className="space-y-4">
        {wordPosts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg flex justify-between items-start bg-white shadow-sm">
            <div className="flex space-x-4 items-start">
               <div className="flex-shrink-0 h-16 w-16 relative bg-gray-100 rounded overflow-hidden">
                   {post.image_url ? (
                       <Image
                           src={post.image_url}
                           alt={post.title}
                           layout="fill"
                           objectFit="cover"
                       />
                   ) : (
                       <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                          {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                         {t('No Image')}
                       </div>
                   )}
               </div>
               <div>
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                   {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                  <p className="text-sm text-gray-600">{t('Date')}: {format(new Date(post.word_date), 'PPP')}</p>
                   {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                  <p className="text-sm text-gray-500">{t('Author')}: {post.author_nickname}</p>
               </div>
            </div>

            <div className="flex space-x-2 flex-shrink-0">
               {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
              <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                {t('Edit')}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                   {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                  <Button variant="destructive" size="sm" onClick={() => setPostToDelete(post)}>{t('Delete')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                     {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                    <AlertDialogTitle>{t('Are you sure?')}</AlertDialogTitle>
                    <AlertDialogDescription>
                       {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 (주의: 변수 삽입 필요) ★ */}
                      {t('Post')} "{post.title}" ({format(new Date(post.word_date), 'yyyy-MM-dd')}) {t('will be permanently deleted. This action cannot be undone.')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                     {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                    <AlertDialogCancel onClick={() => setPostToDelete(null)}>{t('Cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={loading}>
                       {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                      {loading ? t('Deleting...') : t('Confirm Delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}