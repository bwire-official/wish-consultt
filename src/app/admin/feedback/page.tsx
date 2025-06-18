"use client";

import { useState } from "react";
import {
  Star,
  Filter,
  Download,
  MessageSquare,
  Flag,
  XCircle,
  CheckCircle2,
  X,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import Image from "next/image";

interface Feedback {
  id: string;
  created_at: string;
  course_id: string;
  course_name: string;
  segment_id: string;
  segment_name: string;
  student_id: string;
  student_name: string;
  student_avatar: string | null;
  rating: number;
  comment: string;
  sentiment: "positive" | "neutral" | "negative";
  date: string;
  status: "new" | "reviewed" | "addressed";
  tags: string[];
}

// Mock data for feedback
const mockFeedback: Feedback[] = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    course_id: "1",
    course_name: "Introduction to Medical Ethics",
    segment_id: "1",
    segment_name: "Basic Principles",
    student_id: "101",
    student_name: "John Doe",
    student_avatar: "https://i.pravatar.cc/40?img=1",
    rating: 5,
    comment: "Excellent explanation of the core principles. The examples were very helpful.",
    sentiment: "positive",
    date: "2024-03-15T10:30:00",
    status: "new",
    tags: ["clear", "engaging", "practical"],
  },
  {
    id: "2",
    created_at: new Date().toISOString(),
    course_id: "1",
    course_name: "Introduction to Medical Ethics",
    segment_id: "2",
    segment_name: "Case Studies",
    student_id: "102",
    student_name: "Jane Smith",
    student_avatar: "https://i.pravatar.cc/40?img=2",
    rating: 4,
    comment: "Good case studies, but could use more real-world examples.",
    sentiment: "neutral",
    date: "2024-03-15T09:15:00",
    status: "reviewed",
    tags: ["case studies", "needs improvement"],
  },
  // Add more mock feedback as needed
];

const stats = {
  total: 124,
  positive: 80,
  neutral: 30,
  negative: 14,
  new: 20,
  reviewed: 90,
  addressed: 14,
};

export default function FeedbackPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const filteredFeedback = mockFeedback.filter((feedback) => {
    const matchesSearch =
      feedback.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || feedback.status === selectedStatus;
    const matchesSentiment = !selectedSentiment || feedback.sentiment === selectedSentiment;
    return matchesSearch && matchesStatus && matchesSentiment;
  });

  // Bulk select logic
  const toggleRow = (id: string) => {
    setSelectedRows((rows) =>
      rows.includes(id) ? rows.filter((row) => row !== id) : [...rows, id]
    );
  };
  const toggleAll = () => {
    if (selectedRows.length === filteredFeedback.length) setSelectedRows([]);
    else setSelectedRows(filteredFeedback.map((f) => f.id));
  };

  // Sentiment icon
  const sentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return (
          <span className="inline-flex" aria-label="Positive">
            <Smile className="h-5 w-5 text-green-500" />
          </span>
        );
      case "neutral":
        return <Meh className="h-5 w-5 text-yellow-500" />;
      case "negative":
        return <Frown className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats/Analytics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-teal-500" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Feedback</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex items-center gap-3">
          <Smile className="h-6 w-6 text-green-500" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Positive</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{stats.positive}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex items-center gap-3">
          <Meh className="h-6 w-6 text-yellow-500" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Neutral</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{stats.neutral}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex items-center gap-3">
          <Frown className="h-6 w-6 text-red-500" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Negative</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{stats.negative}</div>
          </div>
        </div>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="addressed">Addressed</option>
          </select>
          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Sentiment</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
          <button className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center gap-2" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
            Advanced
          </button>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center gap-2" disabled={selectedRows.length === 0}>
            <CheckCircle2 className="h-4 w-4" />
            Mark Reviewed
          </button>
          <button className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center gap-2" disabled={selectedRows.length === 0}>
            <Flag className="h-4 w-4" />
            Flag
          </button>
          <button className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="px-4 py-3">
                <input type="checkbox" checked={selectedRows.length === filteredFeedback.length && filteredFeedback.length > 0} onChange={toggleAll} />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Course</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Segment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rating</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sentiment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Comment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tags</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredFeedback.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  No feedback found.
                </td>
              </tr>
            ) : (
              filteredFeedback.map((fb) => (
                <tr key={fb.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-4">
                    <input type="checkbox" checked={selectedRows.includes(fb.id)} onChange={() => toggleRow(fb.id)} />
                  </td>
                  <td className="px-4 py-4 flex items-center gap-2">
                    <Image src={fb.student_avatar as string} alt={fb.student_name} className="h-8 w-8 rounded-full" width={32} height={32} />
                    <span className="font-medium text-slate-900 dark:text-white">{fb.student_name}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{fb.course_name}</td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{fb.segment_name}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1">
                      {[...Array(fb.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400" />
                      ))}
                    </span>
                  </td>
                  <td className="px-4 py-4">{sentimentIcon(fb.sentiment)}</td>
                  <td className="px-4 py-4 text-slate-900 dark:text-white truncate max-w-xs" title={fb.comment}>{fb.comment}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {fb.tags.map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-700 dark:text-slate-300">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      fb.status === "new"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                        : fb.status === "reviewed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    }`}>
                      {fb.status.charAt(0).toUpperCase() + fb.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      title="View Details"
                      onClick={() => setSelectedFeedback(fb)}
                    >
                      <MessageSquare className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-lg p-8 relative">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" onClick={() => setSelectedFeedback(null)}>
              <XCircle className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-4 mb-4">
              <Image src={selectedFeedback.student_avatar as string} alt={selectedFeedback.student_name} className="h-12 w-12 rounded-full" width={48} height={48} />
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">{selectedFeedback.student_name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{selectedFeedback.course_name} &mdash; {selectedFeedback.segment_name}</div>
                <div className="text-xs text-slate-400 mt-1">{new Date(selectedFeedback.date).toLocaleString()}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Rating</div>
              <span className="inline-flex items-center gap-1">
                {[...Array(selectedFeedback.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400" />
                ))}
              </span>
            </div>
            <div className="mb-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Comment</div>
              <div className="text-base text-slate-900 dark:text-white">{selectedFeedback.comment}</div>
            </div>
            <div className="mb-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tags</div>
              <div className="flex flex-wrap gap-1">
                {selectedFeedback.tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-700 dark:text-slate-300">{tag}</span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Status</div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedFeedback.status === "new"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                  : selectedFeedback.status === "reviewed"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
              }`}>
                {selectedFeedback.status.charAt(0).toUpperCase() + selectedFeedback.status.slice(1)}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />Mark Reviewed</button>
              <button className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-semibold flex items-center gap-2"><Flag className="h-4 w-4" />Flag</button>
              <button className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold flex items-center gap-2" onClick={() => setSelectedFeedback(null)}><X className="h-4 w-4" />Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 