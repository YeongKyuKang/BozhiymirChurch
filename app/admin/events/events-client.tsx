'use client'

import { useState, useEffect, useRef } from 'react'
import { Database } from '@/lib/supabase'
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

type Event = Database['public']['Tables']['events']['Row']
// Content 타입은 현재 사용되지 않으므로 주석 처리 또는 제거 가능
// type Content = Database['public']['Tables']['content']['Row']

interface EventsClientProps {}

export default function EventsClient({}: EventsClientProps) {
  const { t } = useLanguage() // t 함수 가져오기
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [currentEvent, setCurrentEvent] = useState<Partial<Event>>({})
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined)
  const [bannerImage, setBannerImage] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false })

      if (error) {
        console.error('Error fetching events:', error)
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.error(t('Error fetching events.')) 
      } else {
        setEvents(data || [])
      }
      setLoading(false)
    }
    fetchEvents()
  }, [t])

  const handleEdit = (event: Event) => {
    setIsEditing(event.id)
    setCurrentEvent({ ...event })
    setEventDate(event.event_date ? new Date(event.event_date) : undefined)
    setBannerPreview(event.image_url || '')
    setBannerImage(null)
  }

  const handleNew = () => {
    setIsEditing('new')
    setCurrentEvent({})
    setEventDate(undefined)
    setBannerPreview('')
    setBannerImage(null)
  }

  const handleCancel = () => {
    setIsEditing(null)
    setCurrentEvent({})
    setEventDate(undefined)
    setBannerPreview('')
    setBannerImage(null)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setCurrentEvent((prev) => ({ ...prev, [name]: value }))
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

        setBannerImage(compressedFile)
        const reader = new FileReader()
        reader.onloadend = () => {
          setBannerPreview(reader.result as string)
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
    if (isEditing && isEditing !== 'new' && currentEvent.image_url) {
        const fileName = currentEvent.image_url.split('/').pop()
        if (fileName) {
            setBannerPreview('')
            setCurrentEvent(prev => ({ ...prev, image_url: null }))
            setBannerImage(null)

            const { error: deleteError } = await supabase.storage
                .from('event-banners')
                .remove([fileName])

            if (deleteError) {
                console.error("Error deleting image from storage:", deleteError)
                 // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
                toast.error(t('Error deleting image from storage.')) 
                handleEdit(events.find(e => e.id === isEditing)!)
            } else {
                 const { error: dbUpdateError } = await supabase
                    .from('events')
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
        setBannerPreview('')
        setBannerImage(null)
        setCurrentEvent(prev => ({ ...prev, image_url: null }))
    }
}


  const handleSave = async () => {
    if (!currentEvent.title || !eventDate) {
       // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
      toast.error(t('Title and date are required.')) 
      return
    }

    setLoading(true)
    let imageUrl = currentEvent.image_url

    if (bannerImage) {
      setIsUploading(true)
      const fileExt = bannerImage.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('event-banners')
        .upload(fileName, bannerImage, { upsert: true })

      setIsUploading(false)
      if (uploadError) {
        console.error('Error uploading image:', uploadError)
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.error(t('Error uploading image.')) 
        setLoading(false)
        return
      }
      const { data: urlData } = supabase.storage
        .from('event-banners')
        .getPublicUrl(fileName)
      imageUrl = urlData.publicUrl
    } else if (bannerPreview === '' && currentEvent.image_url) {
        imageUrl = null;
    }


    const eventDataToSave = {
      ...currentEvent,
      event_date: format(eventDate, 'yyyy-MM-dd'),
      image_url: imageUrl,
    }
    if (isEditing === 'new') {
        delete eventDataToSave.id;
    }


    try {
      let savedEvent: Event | null = null;
      if (isEditing === 'new') {
        const { data, error } = await supabase
          .from('events')
          .insert(eventDataToSave)
          .select()
          .single()
        if (error) throw error
        savedEvent = data
        setEvents((prev) => [savedEvent!, ...prev])
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.success(t('Event created successfully.')) 
      } else {
        const { data, error } = await supabase
          .from('events')
          .update(eventDataToSave)
          .eq('id', isEditing!)
          .select()
          .single()
        if (error) throw error
        savedEvent = data
        setEvents((prev) =>
          prev.map((e) => (e.id === isEditing ? savedEvent! : e)),
        )
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.success(t('Event updated successfully.')) 
      }

      await fetch('/api/revalidate?path=/events')
      if (savedEvent?.slug) {
        await fetch(`/api/revalidate?path=/events/${savedEvent.slug}`)
      }

      handleCancel()
    } catch (error: any) {
      console.error('Error saving event:', error)
       // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
      toast.error(`${t('Error saving event')}: ${error.message}`) 
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!eventToDelete) return

    setLoading(true)
    try {
        if (eventToDelete.image_url) {
            const fileName = eventToDelete.image_url.split('/').pop()
            if (fileName) {
                const { error: deleteImageError } = await supabase.storage
                    .from('event-banners')
                    .remove([fileName])
                if (deleteImageError) {
                    console.error("Error deleting event image from storage:", deleteImageError)
                    // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
                    toast.info(t('Failed to delete image from storage, but the event record will be deleted.')) 
                }
            }
        }

        const { error: deleteDbError } = await supabase
            .from('events')
            .delete()
            .eq('id', eventToDelete.id)

        if (deleteDbError) {
            throw deleteDbError
        }

        setEvents((prev) => prev.filter((e) => e.id !== eventToDelete.id))
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.success(t('Event deleted successfully.')) 
        setEventToDelete(null)

        await fetch('/api/revalidate?path=/events')
        if (eventToDelete.slug) {
          await fetch(`/api/revalidate?path=/events/${eventToDelete.slug}`)
        }

    } catch (error: any) {
        console.error('Error deleting event:', error)
         // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
        toast.error(`${t('Error deleting event')}: ${error.message}`) 
    } finally {
        setLoading(false)
        setEventToDelete(null)
    }
}


  if (loading && events.length === 0) {
     // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
    return <div>{t('Loading...')}</div> 
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
        <h1 className="text-3xl font-bold">{t('Event Management')}</h1>
        <Button onClick={handleNew}>{t('New Event')}</Button>
      </div>

      {isEditing !== null && (
        <div className="p-6 border rounded-lg space-y-4 bg-gray-50">
           {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
          <h2 className="text-2xl font-semibold">
            {isEditing === 'new' ? t('Create New Event') : t('Edit Event')}
          </h2>
          <div>
            {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">{t('Title')}</label>
            <Input
              id="title"
              name="title"
              value={currentEvent.title || ''}
              onChange={handleChange}
               // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
              placeholder={t('Enter event title')} 
              required
            />
          </div>
          <div>
            {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('Description')}</label>
            <Textarea
              id="description"
              name="description"
              value={currentEvent.description || ''}
              onChange={handleChange}
               // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
              placeholder={t('Enter event description')} 
            />
          </div>
          <div>
            {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('Event Date')}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className="w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                   {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                  {eventDate ? format(eventDate, 'PPP') : <span>{t('Pick a date')}</span>} 
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={setEventDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
              <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">{t('Start Time')}</label>
              <Input
                id="start_time"
                name="start_time"
                type="time"
                value={currentEvent.start_time || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
              <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">{t('End Time')}</label>
              <Input
                id="end_time"
                name="end_time"
                type="time"
                value={currentEvent.end_time || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">{t('Location')}</label>
            <Input
              id="location"
              name="location"
              value={currentEvent.location || ''}
              onChange={handleChange}
               // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
              placeholder={t('Enter location')} 
            />
          </div>
          <div>
            {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">{t('Category')}</label>
            <Input
              id="category"
              name="category"
              value={currentEvent.category || ''}
              onChange={handleChange}
               // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
              placeholder={t('e.g., Worship, Children')} 
            />
          </div>
          <div>
            {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
            <label className="block text-sm font-medium text-gray-700">{t('Banner Image')}</label>
            <div className="mt-1 flex items-center space-x-4">
              <div className="flex-shrink-0 h-20 w-32 relative bg-gray-100 rounded overflow-hidden">
                {bannerPreview ? (
                  <Image
                    src={bannerPreview}
                     // ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★
                    alt={t('Banner Preview')} 
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
               {(bannerPreview || bannerImage) && (
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

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="p-4 border rounded-lg flex justify-between items-start bg-white shadow-sm">
            <div className="flex space-x-4 items-start">
               <div className="flex-shrink-0 h-16 w-24 relative bg-gray-100 rounded overflow-hidden">
                   {event.image_url ? (
                       <Image
                           src={event.image_url}
                           alt={event.title}
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
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(event.event_date), 'PPP')} {event.start_time ? ` - ${event.start_time}` : ''}
                  </p>
                  <p className="text-sm text-gray-500">{event.location}</p>
               </div>
            </div>

            <div className="flex space-x-2 flex-shrink-0">
               {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
              <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                {t('Edit')} 
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                   {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                  <Button variant="destructive" size="sm" onClick={() => setEventToDelete(event)}>{t('Delete')}</Button> 
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                     {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                    <AlertDialogTitle>{t('Are you sure?')}</AlertDialogTitle> 
                    <AlertDialogDescription>
                       {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 (주의: 변수 삽입 필요) ★ */}
                      {t('Event')} "{event.title}" {t('will be permanently deleted. This action cannot be undone.')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                     {/* ★ 1. 번역 키를 실제 영어 텍스트로 변경 ★ */}
                    <AlertDialogCancel onClick={() => setEventToDelete(null)}>{t('Cancel')}</AlertDialogCancel> 
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