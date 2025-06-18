"use client";

import Link from "next/link";
import { BookOpen, Award, Clock, ChevronRight } from "lucide-react";

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      {/* Top Bar */}
      <header className="w-full px-4 py-4 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg text-teal-600 dark:text-teal-400">
            <BookOpen className="h-6 w-6" /> Wish Consult
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/user" className="font-semibold text-teal-600 dark:text-teal-400">Dashboard</Link>
            <Link href="/courses" className="text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400">Courses</Link>
            <Link href="/certificates" className="text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400">Certificates</Link>
            <Link href="/settings" className="text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400">Settings</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, Student!</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Here&apos;s a quick overview of your learning journey.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-xl bg-white dark:bg-slate-800 p-6 shadow flex items-center gap-4">
            <BookOpen className="h-8 w-8 text-teal-500" />
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Courses Enrolled</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">3</div>
            </div>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-800 p-6 shadow flex items-center gap-4">
            <Clock className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Progress</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">65%</div>
            </div>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-800 p-6 shadow flex items-center gap-4">
            <Award className="h-8 w-8 text-yellow-500" />
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Certificates</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">1</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow divide-y divide-slate-100 dark:divide-slate-700">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Completed: Introduction to Healthcare</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">2 days ago</div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Enrolled: Basic Anatomy</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">5 days ago</div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <div className="font-medium text-slate-900 dark:text-white">Certificate Earned: Introduction to Healthcare</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">2 days ago</div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 