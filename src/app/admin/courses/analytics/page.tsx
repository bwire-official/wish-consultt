"use client";

import { useState } from "react";
import {
  Download,
  Users,
  Star,
  Award,
  TrendingUp,
  DollarSign,
  BookOpen,
} from "lucide-react";

// Mock data - replace with actual data from your backend
const analyticsData = {
  overview: {
    totalCourses: 24,
    totalStudents: 1234,
    totalRevenue: 45678,
    averageRating: 4.7,
    completionRate: 85,
    activeStudents: 789,
    totalEnrollments: 2345,
    totalCertificates: 1234,
  },
  topCourses: [
    {
      id: 1,
      title: "Introduction to Healthcare",
      enrolledStudents: 156,
      revenue: 15600,
      rating: 4.8,
      completionRate: 85,
      activeStudents: 89,
    },
    // Add more courses
  ],
  recentActivity: [
    {
      id: 1,
      type: "enrollment",
      course: "Introduction to Healthcare",
      student: "John Doe",
      timestamp: "2024-03-15T10:30:00",
    },
    // Add more activities
  ],
  metrics: {
    enrollments: {
      daily: [65, 78, 90, 85, 95, 88, 92],
      weekly: [450, 520, 580, 620, 590, 650, 700],
      monthly: [1800, 2100, 2400, 2700, 3000, 3300, 3600],
    },
    revenue: {
      daily: [650, 780, 900, 850, 950, 880, 920],
      weekly: [4500, 5200, 5800, 6200, 5900, 6500, 7000],
      monthly: [18000, 21000, 24000, 27000, 30000, 33000, 36000],
    },
    completion: {
      daily: [85, 82, 88, 90, 87, 89, 91],
      weekly: [86, 84, 88, 90, 89, 91, 93],
      monthly: [82, 84, 86, 88, 90, 92, 94],
    },
  },
};

export default function CourseAnalyticsPage() {
  const [timeframe, setTimeframe] = useState("weekly");
  const [selectedCourse, setSelectedCourse] = useState("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Course Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track course performance and student engagement
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
            <Download className="h-5 w-5 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Revenue
              </p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                ${analyticsData.overview.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+12.5%</span>
            <span className="text-slate-500 dark:text-slate-400 ml-1">vs last {timeframe}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Active Students
              </p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {analyticsData.overview.activeStudents}
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+8.2%</span>
            <span className="text-slate-500 dark:text-slate-400 ml-1">vs last {timeframe}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Completion Rate
              </p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {analyticsData.overview.completionRate}%
              </p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+3.1%</span>
            <span className="text-slate-500 dark:text-slate-400 ml-1">vs last {timeframe}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Average Rating
              </p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {analyticsData.overview.averageRating}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">+0.2</span>
            <span className="text-slate-500 dark:text-slate-400 ml-1">vs last {timeframe}</span>
          </div>
        </div>
      </div>

      {/* Top Courses */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white">
            Top Performing Courses
          </h2>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Courses</option>
            {analyticsData.topCourses.map((course) => (
              <option key={course.id} value={course.id.toString()}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Completion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Active
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {analyticsData.topCourses.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {course.title.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {course.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 dark:text-white">
                      {course.enrolledStudents}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 dark:text-white">
                      ${course.revenue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-slate-900 dark:text-white">
                        {course.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 dark:text-white">
                      {course.completionRate}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 dark:text-white">
                      {course.activeStudents}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {analyticsData.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {activity.student} enrolled in {activity.course}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Enrollment Trends */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
            Enrollment Trends
          </h2>
          <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
            Chart placeholder
          </div>
        </div>

        {/* Revenue Trends */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
            Revenue Trends
          </h2>
          <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
            Chart placeholder
          </div>
        </div>

        {/* Completion Rates */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
            Completion Rates
          </h2>
          <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
            Chart placeholder
          </div>
        </div>

        {/* Student Engagement */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
            Student Engagement
          </h2>
          <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
            Chart placeholder
          </div>
        </div>
      </div>
    </div>
  );
} 