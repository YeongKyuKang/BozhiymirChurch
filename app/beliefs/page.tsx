import { getPageContent } from "@/lib/data";
import BeliefsPageClient from "@/components/beliefs-page-client";

export default async function BeliefsPage() {
  const content = await getPageContent("beliefs");

  return <BeliefsPageClient initialContent={content} />;
}