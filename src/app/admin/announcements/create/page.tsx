"use client";

import { useState } from "react";
import { Megaphone, Calendar, CheckCircle, Loader2 } from "lucide-react";

export default function CreateAnnouncementPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("Published");
  const [schedule, setSchedule] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!title.trim() || !body.trim()) {
      setError("Title and message are required.");
      return;
    }
    if (status === "Scheduled" && !schedule) {
      setError("Please select a schedule date and time.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTitle("");
      setBody("");
      setStatus("Published");
      setSchedule("");
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Megaphone className="h-6 w-6 text-teal-500" />
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Create Announcement</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sm:p-6 space-y-6">
        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
        {success && (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <CheckCircle className="h-5 w-5" /> Announcement created successfully!
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Announcement title"
            maxLength={100}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[100px]"
            placeholder="Type your announcement message here..."
            maxLength={1000}
            required
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="Published">Published (Send Now)</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>
          {status === "Scheduled" && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Schedule Date & Time</label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={schedule}
                  onChange={e => setSchedule(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required={status === "Scheduled"}
                />
                <Calendar className="absolute right-2.5 top-2.5 h-5 w-5 text-slate-400" />
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Megaphone className="h-5 w-5" />}
          {loading ? "Creating..." : "Create Announcement"}
        </button>
      </form>
    </div>
  );
} 