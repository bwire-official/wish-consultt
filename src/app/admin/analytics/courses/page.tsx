"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { BookOpen, BarChart3 } from "lucide-react";

export default function CourseReportsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Course Reports</h1>
        </div>
        <GlassCard className="p-8 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-purple-400 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Course Analytics Coming Soon</h2>
          <p className="text-slate-600 dark:text-slate-300">Detailed course analytics and reports will be available here.</p>
        </GlassCard>
      </div>
    </div>
  );
} 