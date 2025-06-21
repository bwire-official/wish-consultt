"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  BookOpen,
  Users,
  Star,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  BarChart3,
  Activity,
  Download,
  RefreshCw
} from "lucide-react";

interface AnalyticsData {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  completionRate: number;
  activeCourses: number;
  draftCourses: number;
  archivedCourses: number;
  topPerformingCourses: Array<{
    id: string;
    title: string;
    students: number;
    revenue: number;
    rating: number;
    completionRate: number;
  }>;
  monthlyEnrollments: Array<{
    month: string;
    enrollments: number;
    revenue: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    courses: number;
    students: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    time: string;
    value: string;
  }>;
}

const analyticsData: AnalyticsData = {
  totalCourses: 24,
  totalStudents: 15420,
  totalRevenue: 284500,
  averageRating: 4.7,
  completionRate: 78,
  activeCourses: 18,
  draftCourses: 4,
  archivedCourses: 2,
  topPerformingCourses: [
    {
      id: "1",
      title: "Advanced Healthcare Analytics",
      students: 1245,
      revenue: 124500,
      rating: 4.8,
      completionRate: 85
    },
    {
      id: "2",
      title: "Medical AI Applications",
      students: 892,
      revenue: 133800,
      rating: 4.9,
      completionRate: 78
    },
    {
      id: "3",
      title: "Healthcare Data Science",
      students: 1567,
      revenue: 125360,
      rating: 4.7,
      completionRate: 82
    }
  ],
  monthlyEnrollments: [
    { month: "Jan", enrollments: 1200, revenue: 45000 },
    { month: "Feb", enrollments: 1350, revenue: 52000 },
    { month: "Mar", enrollments: 1100, revenue: 42000 },
    { month: "Apr", enrollments: 1600, revenue: 61000 },
    { month: "May", enrollments: 1800, revenue: 68000 },
    { month: "Jun", enrollments: 2000, revenue: 75000 }
  ],
  categoryDistribution: [
    { category: "Healthcare", courses: 8, students: 5200, revenue: 98000 },
    { category: "AI & ML", courses: 6, students: 3800, revenue: 72000 },
    { category: "Data Science", courses: 5, students: 2900, revenue: 55000 },
    { category: "Ethics", courses: 3, students: 1800, revenue: 34000 },
    { category: "Other", courses: 2, students: 1720, revenue: 26500 }
  ],
  recentActivity: [
    {
      id: "1",
      type: "enrollment",
      description: "New student enrolled in Advanced Healthcare Analytics",
      time: "2 minutes ago",
      value: "+1 student"
    },
    {
      id: "2",
      type: "completion",
      description: "Student completed Medical AI Applications course",
      time: "15 minutes ago",
      value: "Certificate issued"
    },
    {
      id: "3",
      type: "review",
      description: "New 5-star review for Healthcare Data Science",
      time: "1 hour ago",
      value: "Rating: 5.0"
    },
    {
      id: "4",
      type: "revenue",
      description: "Course purchase completed",
      time: "2 hours ago",
      value: "$149.99"
    }
  ]
};

export default function CourseAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedMetric, setSelectedMetric] = useState("enrollments");

  const stats = [
    {
      name: "Total Courses",
      value: analyticsData.totalCourses.toString(),
      change: "+12.5%",
      trend: "up",
      icon: BookOpen,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Total Students",
      value: analyticsData.totalStudents.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: Users,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Total Revenue",
      value: `$${analyticsData.totalRevenue.toLocaleString()}`,
      change: "+18.7%",
      trend: "up",
      icon: DollarSign,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Average Rating",
      value: analyticsData.averageRating.toString(),
      change: "+0.3",
      trend: "up",
      icon: Star,
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment": return Users;
      case "completion": return CheckCircle;
      case "review": return Star;
      case "revenue": return DollarSign;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "enrollment": return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
      case "completion": return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      case "review": return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
      case "revenue": return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30";
      default: return "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Course Analytics</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">Comprehensive insights into course performance and student engagement</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
            <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <GlassCard key={stat.name} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <GlassCard className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Trends</h2>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
              >
                <option value="enrollments">Enrollments</option>
                <option value="revenue">Revenue</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-center space-x-2">
              {analyticsData.monthlyEnrollments.map((month) => (
                <div key={month.month} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all duration-300 hover:scale-110"
                    style={{ 
                      height: `${(selectedMetric === "enrollments" ? month.enrollments : month.revenue) / (selectedMetric === "enrollments" ? 2000 : 75000) * 200}px` 
                    }}
                  ></div>
                  <span className="text-xs text-slate-600 dark:text-slate-300 mt-2">{month.month}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Course Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Active</span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{analyticsData.activeCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Draft</span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{analyticsData.draftCourses}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Archived</span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{analyticsData.archivedCourses}</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Completion Rate</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{analyticsData.completionRate}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analyticsData.completionRate}%` }}
                ></div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Top Performing Courses</h2>
            <div className="space-y-4">
              {analyticsData.topPerformingCourses.map((course, index) => (
                <div key={course.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-white/20 dark:border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span>{course.students} students</span>
                        <span>${course.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-semibold text-slate-900 dark:text-white">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {course.rating}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {course.completionRate}% completion
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Category Performance</h2>
            <div className="space-y-4">
              {analyticsData.categoryDistribution.map((category) => (
                <div key={category.category} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-white/20 dark:border-slate-700/50">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {category.category}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span>{category.courses} courses</span>
                      <span>{category.students} students</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      ${category.revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Revenue
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {analyticsData.recentActivity.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-white/20 dark:border-slate-700/50">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    <ActivityIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activity.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {activity.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
} 