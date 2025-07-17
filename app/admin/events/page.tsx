import EventsClient from "./events-client";
import { Suspense } from "react";

export default function AdminEventsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventsClient />
    </Suspense>
  );
}