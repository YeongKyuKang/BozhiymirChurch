'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Save } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createClient } from '@/lib/supabase/client';
import EditableText from '@/components/editable-text';
import { toast } from 'sonner';

export default function ContentEditPageClient() {
  const { user, userRole, loading } = useAuth();
  const { t } = useLanguage();

  const supabase = createClient();

  const [content, setContent] = useState<
    { id: number; page: string; section: string; key: string; value: string }[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userRole !== 'admin' && !loading) {
      setError('You do not have permission to access this page.');
    }
  }, [userRole, loading]);

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase.from('content').select('*');
      if (error) {
        setError(error.message);
      } else {
        setContent(data);
      }
    };

    fetchContent();
  }, [supabase]);

  const handleContentChange = (
    id: number,
    newValue: string,
    key: string,
    page: string,
    section: string
  ) => {
    setContent((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, value: newValue } : item
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Group content by id for upsert
      const updates = content.map(({ id, page, section, key, value }) => ({
        id,
        page,
        section,
        key,
        value,
      }));

      const { error } = await supabase.from('content').upsert(updates);

      if (error) {
        throw error;
      }

      const revalidateResponse = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/' }),
      });

      if (!revalidateResponse.ok) {
        throw new Error('Failed to revalidate cache.');
      }

      toast.success('Content saved successfully!');
    } catch (err) {
      console.error('Failed to save content:', err);
      setError('Failed to save content. Please try again.');
      toast.error('Failed to save content.');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (userRole !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive" className="w-fit">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive" className="w-fit">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const groupedContent = content.reduce((acc, curr) => {
    if (!acc[curr.page]) {
      acc[curr.page] = {};
    }
    if (!acc[curr.page][curr.section]) {
      acc[curr.page][curr.section] = [];
    }
    acc[curr.page][curr.section].push(curr);
    return acc;
  }, {});

  return (
    <>
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('CONTENT_EDIT')}
            </h1>
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel Edit' : 'Start Edit'}
              </Button>
              {isEditing && (
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save All'}
                </Button>
              )}
            </div>
          </div>

          <Separator className="mb-6" />

          <ScrollArea className="h-[calc(100vh-200px)]">
            {Object.entries(groupedContent).map(([page, sections]) => (
              <Card key={page} className="mb-6 bg-gray-50 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="text-2xl capitalize">
                    {page} Page
                  </CardTitle>
                  <CardDescription>
                    Edit content for the {page} page.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.entries(sections).map(([section, items]) => (
                    <div key={section} className="mb-6">
                      <h3 className="text-xl font-semibold mb-2 capitalize text-gray-800 dark:text-gray-200">
                        {section} Section
                      </h3>
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="mb-4 p-4 border rounded-lg bg-white dark:bg-gray-900"
                        >
                          <p className="font-medium text-gray-600 dark:text-gray-400">
                            Key: {item.key}
                          </p>
                          <div className="mt-2">
                            <EditableText
                              initialValue={item.value}
                              isEditing={isEditing}
                              onContentChange={(newValue) =>
                                handleContentChange(
                                  item.id,
                                  newValue,
                                  item.key,
                                  item.page,
                                  item.section
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}