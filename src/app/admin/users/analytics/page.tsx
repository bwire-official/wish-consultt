"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Users,
  BarChart3,
  Activity,
  Download,
  RefreshCw,
  Crown,
  Target,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  payingUsers: number;
  userGrowth: number;
  retentionRate: number;
  averageSessionTime: string;
  topCountries: Array<{ country: string; users: number; percentage: number }>;
  deviceUsage: Array<{ device: string; users: number; percentage: number }>;
  userEngagement: Array<{ metric: string; value: number; change: number; trend: "up" | "down" }>;
  monthlyGrowth: Array<{ month: string; users: number; growth: number }>;
  userSegments: Array<{ segment: string; users: number; percentage: number; color: string }>;
  topCourses: Array<{ course: string; enrollments: number; completion: number; revenue: number }>;
}

// Mock analytics data
const analyticsData: UserAnalytics = {
  totalUsers: 15420,
  activeUsers: 8920,
  newUsers: 1240,
  payingUsers: 3420,
  userGrowth: 15.8,
  retentionRate: 78.5,
  averageSessionTime: "24m 32s",
  topCountries: [
    { country: "United States", users: 5420, percentage: 35.2 },
    { country: "United Kingdom", users: 2340, percentage: 15.2 },
    { country: "Canada", users: 1890, percentage: 12.3 },
    { country: "Australia", users: 1560, percentage: 10.1 },
    { country: "Germany", users: 1230, percentage: 8.0 },
  ],
  deviceUsage: [
    { device: "Desktop", users: 8920, percentage: 57.8 },
    { device: "Mobile", users: 5420, percentage: 35.2 },
    { device: "Tablet", users: 1080, percentage: 7.0 },
  ],
  userEngagement: [
    { metric: "Course Completion", value: 78.5, change: 12.3, trend: "up" },
    { metric: "Video Watch Time", value: 24.5, change: 8.7, trend: "up" },
    { metric: "Quiz Participation", value: 65.2, change: -2.1, trend: "down" },
    { metric: "AI Chat Usage", value: 89.1, change: 15.4, trend: "up" },
  ],
  monthlyGrowth: [
    { month: "Jan", users: 12000, growth: 8.5 },
    { month: "Feb", users: 13200, growth: 10.0 },
    { month: "Mar", users: 14100, growth: 6.8 },
    { month: "Apr", users: 14800, growth: 5.0 },
    { month: "May", users: 15200, growth: 2.7 },
    { month: "Jun", users: 15420, growth: 1.4 },
  ],
  userSegments: [
    { segment: "Students", users: 10800, percentage: 70.0, color: "from-blue-500 to-cyan-500" },
    { segment: "Professionals", users: 3240, percentage: 21.0, color: "from-purple-500 to-pink-500" },
    { segment: "Instructors", users: 1080, percentage: 7.0, color: "from-green-500 to-emerald-500" },
    { segment: "Admins", users: 300, percentage: 2.0, color: "from-orange-500 to-red-500" },
  ],
  topCourses: [
    { course: "Introduction to Healthcare", enrollments: 2340, completion: 1872, revenue: 46800 },
    { course: "Medical AI Fundamentals", enrollments: 1890, completion: 1512, revenue: 37800 },
    { course: "Advanced Healthcare Analytics", enrollments: 1560, completion: 1248, revenue: 31200 },
    { course: "Healthcare Data Science", enrollments: 1230, completion: 984, revenue: 24600 },
    { course: "AI in Medical Imaging", enrollments: 980, completion: 784, revenue: 19600 },
  ],
};

export default function UserAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  const stats = [
    {
      name: "Total Users",
      value: analyticsData.totalUsers.toLocaleString(),
      change: `+${analyticsData.userGrowth}%`,
      trend: "up",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Active Users",
      value: analyticsData.activeUsers.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: Activity,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Paying Users",
      value: analyticsData.payingUsers.toLocaleString(),
      change: "+15.3%",
      trend: "up",
      icon: Crown,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      name: "Retention Rate",
      value: `${analyticsData.retentionRate}%`,
      change: "+5.1%",
      trend: "up",
      icon: Target,
      gradient: "from-purple-500 to-pink-500"
    },
  ];

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "desktop": return <Monitor className="h-4 w-4" />;
      case "mobile": return <Smartphone className="h-4 w-4" />;
      case "tablet": return <Tablet className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Glowing Lights Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Analytics</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400">Comprehensive insights into user behavior and platform performance</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
              <Download className="h-5 w-5 mr-2" />
              Export Report
            </button>
            <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg">
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <GlassCard key={stat.name} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="lg:col-span-2">
            <GlassCard className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">User Growth Trend</h2>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Users</span>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {analyticsData.monthlyGrowth.map((month) => (
                  <div key={month.month} className="flex-1 flex flex-col items-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      {month.growth > 0 ? '+' : ''}{month.growth}%
                    </div>
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all duration-300 hover:opacity-80"
                      style={{ height: `${(month.users / 16000) * 200}px` }}
                    ></div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                      {month.month}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* User Segments */}
          <div>
            <GlassCard className="h-full">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">User Segments</h2>
              <div className="space-y-4">
                {analyticsData.userSegments.map((segment) => (
                  <div key={segment.segment} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 bg-gradient-to-r ${segment.color} rounded-full`}></div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {segment.segment}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {segment.users.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {segment.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analyticsData.userEngagement.map((metric) => (
            <GlassCard key={metric.metric} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span>{metric.change > 0 ? '+' : ''}{metric.change}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {metric.metric}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {metric.value}%
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Countries */}
          <GlassCard>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Top Countries</h2>
            <div className="space-y-4">
              {analyticsData.topCountries.map((country) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {country.country.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {country.country}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {country.users.toLocaleString()} users
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {country.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Device Usage */}
          <GlassCard>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Device Usage</h2>
            <div className="space-y-4">
              {analyticsData.deviceUsage.map((device) => (
                <div key={device.device} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white">
                      {getDeviceIcon(device.device)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {device.device}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {device.users.toLocaleString()} users
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {device.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Top Courses */}
        <GlassCard>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Top Performing Courses</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/30 dark:bg-slate-700/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Enrollments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Completion Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 dark:divide-slate-700/30">
                {analyticsData.topCourses.map((course) => (
                  <tr key={course.course} className="hover:bg-white/30 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {course.course}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-white">
                        {course.enrollments.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-white">
                        {Math.round((course.completion / course.enrollments) * 100)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        ${course.revenue.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
} 