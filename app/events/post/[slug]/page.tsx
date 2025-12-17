import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const dynamicParams = true; 
export const revalidate = false;

export async function generateStaticParams() {
  const { data: events } = await supabase.from("events").select("id");
  return events?.map((event) => ({
    slug: event.id.toString(),
  })) || [];
}

async function getEventDetail(slug: string) {
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", slug)
    .single();
  return event;
}

export default async function EventDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const event = await getEventDetail(slug);

  if (!event) notFound();

  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-black mb-8 italic text-slate-900">{event.title}</h1>
        
        {event.image_url && (
          <div className="rounded-[40px] overflow-hidden mb-12 shadow-2xl border-8 border-white">
            <img src={event.image_url} alt={event.title} className="w-full h-auto object-cover" />
          </div>
        )}

        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
            {event.description}
          </p>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-100 text-slate-400 text-sm font-bold flex flex-col gap-2">
          <p>📍 Location: {event.location}</p>
          <p>⏰ Date: {new Date(event.event_date).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}