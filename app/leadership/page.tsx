import { getPageContent } from "@/lib/data";
import LeadershipPageClient from "@/components/leadership-page-client";

export default async function LeadershipPage() {
  const content = await getPageContent("leadership");

  return <LeadershipPageClient initialContent={content} />;
}