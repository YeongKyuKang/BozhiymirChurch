import { getPageContent } from "@/lib/data";
import JesusPageClient from "@/components/jesus-page-client";

export default async function JesusPage() {
  const content = await getPageContent("jesus");

  return <JesusPageClient initialContent={content} />;
}