"use client";

import { useState } from "react";
import { Megaphone, Plus, Edit, Trash2, Eye, Search, CheckCircle, Clock } from "lucide-react";

const mockAnnouncements = [
  {
    id: 1,
    title: "Platform Update: New Features Released!",
    body: "We've added new AI-powered tools and improved the dashboard experience. Check them out!",
    status: "Published",
    createdAt: "2024-06-15T10:00:00Z",
    scheduledFor: null,
  },
  {
    id: 2,
    title: "Scheduled Maintenance",
    body: "The platform will be down for maintenance on June 20th from 2am to 4am UTC.",
    status: "Scheduled",
    createdAt: "2024-06-10T08:00:00Z",
    scheduledFor: "2024-06-20T02:00:00Z",
  },
  // Add more mock announcements as needed
];

export default function AllAnnouncementsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockAnnouncements.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-teal-500" /> Announcements
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">View and manage all platform announcements</p>
        </div>
        <a
          href="/admin/announcements/create"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600"
        >
          <Plus className="h-5 w-5" /> Create Announcement
        </a>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
        <input
          type="search"
          placeholder="Search announcements..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 py-2 pl-8 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Created</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Scheduled For</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">No announcements found.</td>
              </tr>
            )}
            {filtered.map(a => (
              <tr key={a.id}>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium text-slate-900 dark:text-white">{a.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{a.body}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {a.status === "Published" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <CheckCircle className="h-4 w-4" /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      <Clock className="h-4 w-4" /> Scheduled
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                  {new Date(a.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                  {a.scheduledFor ? new Date(a.scheduledFor).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm flex gap-2 justify-end">
                  <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="View">
                    <Eye className="h-5 w-5 text-slate-500 dark:text-slate-300" />
                  </button>
                  <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Edit">
                    <Edit className="h-5 w-5 text-blue-500" />
                  </button>
                  <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title="Delete">
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 