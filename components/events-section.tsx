"use client";

import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  location: string | null;
  image_url: string | null;
  slug: string | null;
}

export default function EventsSection({ events }: { events: Event[] }) {
  if (!events || events.length === 0) return null;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-end mb-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Upcoming Events</h2>
            <p className="text-muted-foreground">Join us in worship and fellowship</p>
          </div>
          <Link href="/events" className="hidden md:block">
            <Button variant="ghost" className="gap-2">
              View All Events <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full bg-muted">
                {event.image_url ? (
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <CalendarDays className="w-10 h-10 opacity-20" />
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="text-sm font-medium text-primary mb-2">
                  {format(new Date(event.event_date), 'MMMM d, yyyy')} 
                  {event.start_time && ` • ${event.start_time}`}
                </div>
                <CardTitle className="line-clamp-1">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {event.description}
                </p>
                {event.location && (
                  <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Link href={`/events/${event.slug || '#'}`} className="w-full">
                  <Button variant="outline" className="w-full">Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/events">
            <Button variant="outline" className="w-full">View All Events</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}