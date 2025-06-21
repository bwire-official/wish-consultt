"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  BarChart3,
  Users,
  DollarSign,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Award,
  Download
} from "lucide-react";

export default function AnalyticsOverviewPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const stats = [
    {
      name: "Total Revenue",
      value: "$124,580",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Active Users",
      value: "2,847",
      change: "+8.3%",
      trend: "up",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Course Enrollments",
      value: "1,234",
      change: "+15.2%",
      trend: "up",
      icon: BookOpen,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Completion Rate",
      value: "78.5%",
      change: "+2.1%",
      trend: "up",
      icon: Target,
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "enrollment",
      user: "Dr. Sarah Johnson",
      course: "Advanced Cardiology",
      time: "2 minutes ago",
      value: "+$299"
    },
    {
      id: 2,
      type: "completion",
      user: "Prof. Michael Chen",
      course: "Medical AI Applications",
      time: "15 minutes ago",
      value: "Certificate"
    },
    {
      id: 3,
      type: "payment",
      user: "Dr. Emily Rodriguez",
      course: "Healthcare Data Science",
      time: "1 hour ago",
      value: "+$199"
    },
    {
      id: 4,
      type: "enrollment",
      user: "James Wilson",
      course: "Medical Ethics",
      time: "2 hours ago",
      value: "+$149"
    }
  ];

  const topCourses = [
    {
      name: "Advanced Cardiology",
      enrollments: 342,
      revenue: "$102,600",
      completion: "85%"
    },
    {
      name: "Medical AI Applications",
      enrollments: 298,
      revenue: "$89,400",
      completion: "78%"
    },
    {
      name: "Healthcare Data Science",
      enrollments: 256,
      revenue: "$76,800",
      completion: "72%"
    },
    {
      name: "Medical Ethics",
      enrollments: 234,
      revenue: "$35,100",
      completion: "91%"
    }
  ];

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
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics Overview</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">Comprehensive insights into platform performance</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <GlassCard key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}>
                  {stat.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {activity.user}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activity.course} • {activity.time}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {activity.value}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Top Performing Courses */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Top Performing Courses</h2>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {topCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {course.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {course.enrollments} enrollments
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {course.revenue}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {course.completion} completion
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Revenue Reports</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Financial insights</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">User Reports</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">User analytics</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Course Reports</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Course performance</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Affiliate Reports</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Affiliate performance</p>
              </div>
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
} 