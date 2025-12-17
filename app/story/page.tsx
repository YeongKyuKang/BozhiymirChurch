import { getPageContent } from "@/lib/data";
import StoryPageClient from "@/components/story-page-client";

export default async function StoryPage() {
  const content = await getPageContent("story");

  return <StoryPageClient initialContent={content} />;
}