"use client";

import { GlassCard } from "@/components/ui/glass-card";
import {
  TrendingUp,
  DollarSign,
  Users2,
  BarChart3,
  Download,
  Edit,
  CheckCircle,
  ArrowUpRight,
  Target,
  Award
} from "lucide-react";

export default function AffiliatePerformancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Affiliate Performance</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">Track and analyze affiliate performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
              <Download className="h-5 w-5 mr-2" />
              Export Report
            </button>
            <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg">
              <BarChart3 className="h-5 w-5 mr-2" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Basic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
                <ArrowUpRight className="h-4 w-4" />
                <span>+12.8%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                $62,350
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Users2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
                <ArrowUpRight className="h-4 w-4" />
                <span>+8.2%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Active Affiliates
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                24
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
                <ArrowUpRight className="h-4 w-4" />
                <span>+2.1%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Avg Conversion Rate
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                16.8%
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
                <ArrowUpRight className="h-4 w-4" />
                <span>+5.3%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Performance Score
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                87
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Commission Performance */}
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Commission Performance</h2>
              <p className="text-slate-600 dark:text-slate-300">Track commission earnings and performance metrics</p>
            </div>
            <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg">
              <Edit className="h-4 w-4 mr-2" />
              View Details
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Commission</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">$12,850</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Avg Commission Rate</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">17.5%</p>
                </div>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Top Performer</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">$2,840</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-800 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-r from-slate-500 to-gray-500 rounded-lg text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Platinum</span>
                <span className="text-2xl font-bold">$5,100</span>
              </div>
              <p className="text-xs opacity-90">25% commission rate</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Gold</span>
                <span className="text-2xl font-bold">$3,900</span>
              </div>
              <p className="text-xs opacity-90">20% commission rate</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-gray-400 to-slate-500 rounded-lg text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Silver</span>
                <span className="text-2xl font-bold">$2,700</span>
              </div>
              <p className="text-xs opacity-90">15% commission rate</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Bronze</span>
                <span className="text-2xl font-bold">$1,150</span>
              </div>
              <p className="text-xs opacity-90">10% commission rate</p>
            </div>
          </div>
        </GlassCard>

        {/* Basic Content */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Performance Overview
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Performance data will be displayed here...
          </p>
        </GlassCard>
      </div>
    </div>
  );
} 