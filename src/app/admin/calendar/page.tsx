"use client";

import { useRef, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { GlassCard } from "@/components/ui/glass-card";
import { Calendar } from "lucide-react";

const events = [
  { title: "Team Meeting", start: new Date().toISOString().slice(0, 10) },
  { title: "Course Launch", start: new Date(Date.now() + 86400000).toISOString().slice(0, 10) },
  { title: "Affiliate Webinar", start: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10) },
];

function getCurrentTimeWithZone() {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long" as const,
    year: "numeric" as const,
    month: "long" as const,
    day: "numeric" as const,
    hour: "2-digit" as const,
    minute: "2-digit" as const,
    second: "2-digit" as const,
    timeZoneName: "short" as const
  };
  return now.toLocaleString(undefined, options);
}

export default function AdminCalendarPage() {
  const calendarRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(getCurrentTimeWithZone());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeWithZone());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Calendar</h1>
        </div>
        <div className="mb-6 text-slate-700 dark:text-slate-200 text-lg font-medium flex items-center gap-2">
          <span>Today is</span>
          <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 font-semibold">
            {currentTime}
          </span>
        </div>
        <GlassCard className="p-4">
          <style>{`
            .fc .fc-button {
              background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
              color: #fff;
              border: none;
              border-radius: 0.5rem;
              font-weight: 500;
              box-shadow: 0 2px 8px 0 rgba(59,130,246,0.08);
              transition: background 0.2s, color 0.2s;
            }
            .fc .fc-button:hover, .fc .fc-button:focus {
              background: linear-gradient(90deg, #2563eb 0%, #0891b2 100%);
              color: #fff;
            }
            .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active {
              background: linear-gradient(90deg, #2563eb 0%, #0891b2 100%);
              color: #fff;
            }
            .dark .fc .fc-button {
              background: linear-gradient(90deg, #0ea5e9 0%, #06b6d4 100%);
              color: #fff;
            }
            .dark .fc .fc-button:hover, .dark .fc .fc-button:focus {
              background: linear-gradient(90deg, #0369a1 0%, #0891b2 100%);
              color: #fff;
            }
            .dark .fc .fc-button-primary:not(:disabled).fc-button-active, .dark .fc .fc-button-primary:not(:disabled):active {
              background: linear-gradient(90deg, #0369a1 0%, #0891b2 100%);
              color: #fff;
            }
          `}</style>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            height="auto"
            events={events}
            eventColor="#06b6d4"
            selectable={true}
            editable={false}
            dayMaxEvents={3}
            aspectRatio={1.7}
          />
        </GlassCard>
      </div>
    </div>
  );
} 