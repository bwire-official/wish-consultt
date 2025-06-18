"use client";

import { useState } from "react";
import {
  Search,
  Clock,
  Activity,
  Eye,
  MessageSquare,
  AlertCircle,
  Video,
  FileText,
  BarChart2,
  Download,
  AlertTriangle,
  MoreVertical,
  Ban,
  XCircle,
} from "lucide-react";
import { Profile } from '@/types';

interface ActiveUser extends Profile {
  avatar_url: string | null;
  current_page: string;
  last_activity: string;
  session_duration: string;
  device: string;
  browser: string;
  course_progress: {
    course_name: string;
    current_module: string;
    completed_modules: number;
    total_modules: number;
    current_video: string;
    video_progress: number;
    last_interaction: string;
  };
  engagement: {
    video_watch_time: string;
    quiz_attempts: number;
    notes_taken: number;
    questions_asked: number;
  };
  warnings: number;
  last_warning: string | null;
  is_premium: boolean;
  onboarding_completed: boolean;
}

// Mock data - replace with actual data from your backend
const activeUsers: ActiveUser[] = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    username: "johndoe",
    full_name: "John Doe",
    email: "john@example.com",
    phone_number: "123-456-7890",
    status: "active",
    referred_by: null,
    avatar_url: null,
    role: "student",
    is_premium: true,
    onboarding_completed: true,
    onboarding_data: {},
    current_page: "Introduction to Healthcare",
    last_activity: "2 minutes ago",
    session_duration: "45 minutes",
    device: "Desktop",
    browser: "Chrome",
    course_progress: {
      course_name: "Introduction to Healthcare",
      current_module: "Module 2: Basic Anatomy",
      completed_modules: 3,
      total_modules: 10,
      current_video: "The Human Skeleton",
      video_progress: 65,
      last_interaction: "2 minutes ago",
    },
    engagement: {
      video_watch_time: "35 minutes",
      quiz_attempts: 2,
      notes_taken: 5,
      questions_asked: 3,
    },
    warnings: 0,
    last_warning: null,
  },
  // Add more mock users here
];

export default function ActiveUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState("all");
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ActiveUser | null>(null);

  const handleAction = (action: string, user: ActiveUser) => {
    setSelectedUser(user);
    switch (action) {
      case "warn":
        setShowWarningModal(true);
        break;
      case "message":
        // Handle message action
        break;
      case "suspend":
        // Handle suspend action
        break;
    }
    setShowActionMenu(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Active Users
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor real-time user activity and engagement
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
            <BarChart2 className="h-5 w-5 mr-2" />
            Analytics
          </button>
          <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
            <Download className="h-5 w-5 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search active users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="all">All Courses</option>
          <option value="healthcare">Introduction to Healthcare</option>
          <option value="anatomy">Basic Anatomy</option>
          <option value="physiology">Human Physiology</option>
        </select>

        <select
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value)}
          className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="all">All Activities</option>
          <option value="watching">Watching Video</option>
          <option value="quiz">Taking Quiz</option>
          <option value="notes">Taking Notes</option>
          <option value="chat">Using AI Chat</option>
        </select>
      </div>

      {/* Active Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-slate-800 rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                  {user.full_name?.charAt(0) || ''}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                    {user.full_name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                  className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                {showActionMenu === user.id && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => handleAction("view", user)}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </button>
                      <button
                        onClick={() => handleAction("message", user)}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 w-full"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </button>
                      <button
                        onClick={() => handleAction("warn", user)}
                        className="flex items-center px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-700 w-full"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Send Warning
                      </button>
                      <button
                        onClick={() => handleAction("suspend", user)}
                        className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 w-full"
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Suspend User
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/* Course Progress */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                    Course Progress
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {user.course_progress.completed_modules}/{user.course_progress.total_modules} modules
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full"
                    style={{
                      width: `${(user.course_progress.completed_modules / user.course_progress.total_modules) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Current Module: {user.course_progress.current_module}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Current Video: {user.course_progress.current_video}
                  </p>
                </div>
              </div>

              {/* Current Activity */}
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Current Activity
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <Video className="h-4 w-4 mr-2" />
                    Watching: {user.course_progress.current_video}
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${user.course_progress.video_progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{user.course_progress.video_progress}% complete</span>
                    <span>{user.course_progress.last_interaction}</span>
                  </div>
                </div>
              </div>

              {/* Engagement Metrics */}
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Engagement
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="h-4 w-4 mr-2" />
                    {user.engagement.video_watch_time}
                  </div>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <FileText className="h-4 w-4 mr-2" />
                    {user.engagement.notes_taken} notes
                  </div>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <Activity className="h-4 w-4 mr-2" />
                    {user.engagement.quiz_attempts} quizzes
                  </div>
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {user.engagement.questions_asked} questions
                  </div>
                </div>
              </div>

              {/* Session Info */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-slate-500 dark:text-slate-400">
                    <Clock className="h-4 w-4 mr-2" />
                    {user.session_duration}
                  </div>
                  <div className="flex items-center text-slate-500 dark:text-slate-400">
                    <Activity className="h-4 w-4 mr-2" />
                    {user.last_activity}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{user.device}</span>
                  <span>{user.browser}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Real-time Updates
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>
                Users are removed from this list after 5 minutes of inactivity.
                All activity is tracked in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      {showWarningModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                Send Warning
              </h3>
              <button
                onClick={() => setShowWarningModal(false)}
                className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Sending a warning to {selectedUser.full_name}
              </p>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                rows={4}
                placeholder="Enter warning message..."
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg">
                  Send Warning
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 