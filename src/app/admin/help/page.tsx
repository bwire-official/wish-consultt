"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { HelpCircle } from "lucide-react";

export default function AdminHelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
            <HelpCircle className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Help & Support</h1>
        </div>
        <GlassCard className="p-6">
          <p className="text-slate-700 dark:text-slate-200 mb-4">
            Need assistance? Browse our help topics or contact support for further guidance.
          </p>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <p className="text-slate-500 dark:text-slate-400 italic">Help topics and FAQs will appear here soon.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
} 