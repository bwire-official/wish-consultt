"use client";

import {
  Users,
  BookOpen,
  MessageSquare,
  Users2,
  DollarSign,
  Clock,
  Star,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const stats = [
  {
    name: "Total Users",
    value: "2,543",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    name: "Active Courses",
    value: "24",
    change: "+3.2%",
    trend: "up",
    icon: BookOpen,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    name: "Total Feedback",
    value: "1,234",
    change: "+8.1%",
    trend: "up",
    icon: MessageSquare,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    name: "Active Affiliates",
    value: "156",
    change: "-2.4%",
    trend: "down",
    icon: Users2,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

const recentActivity = [
  {
    user: "Sarah Johnson",
    action: "completed",
    course: "Advanced Healthcare Analytics",
    time: "2 hours ago",
    status: "success",
  },
  {
    user: "Michael Chen",
    action: "enrolled in",
    course: "Medical AI Fundamentals",
    time: "4 hours ago",
    status: "info",
  },
  {
    user: "Emma Wilson",
    action: "submitted feedback for",
    course: "Healthcare Data Science",
    time: "5 hours ago",
    status: "warning",
  },
  {
    user: "David Kim",
    action: "completed",
    course: "AI in Medical Imaging",
    time: "6 hours ago",
    status: "success",
  },
];

const quickStats = [
  {
    name: "Average Course Rating",
    value: "4.8",
    icon: Star,
    color: "text-yellow-500",
  },
  {
    name: "Completion Rate",
    value: "87%",
    icon: CheckCircle2,
    color: "text-green-500",
  },
  {
    name: "Active Sessions",
    value: "342",
    icon: Clock,
    color: "text-blue-500",
  },
];

const adminName = "Dr. Alex Admin";
const today = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

export default function AdminDashboard() {
  const [showTodo, setShowTodo] = useState(true);
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome, {adminName} 👋</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Today is {today}. Here&apos;s what&apos;s happening on your platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 text-xs font-medium">Admin</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quickStats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 p-6 shadow-sm group transition-transform hover:-translate-y-1 hover:shadow-lg"
            title={stat.name}
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-2 ${stat.color} bg-opacity-10 animate-pulse group-hover:animate-none`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 p-6 shadow-sm group transition-transform hover:-translate-y-1 hover:shadow-lg"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
              <p className={`ml-2 flex items-baseline text-sm font-semibold ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 flex-shrink-0 self-center" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 flex-shrink-0 self-center" />
                )}
                <span className="ml-1">{stat.change}</span>
              </p>
              <button className="ml-auto px-2 py-1 text-xs text-teal-600 dark:text-teal-400 hover:underline">View Details</button>
            </dd>
          </div>
        ))}
      </div>

      {/* Admin To-Do Panel */}
      {showTodo && (
        <div className="rounded-lg bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/30 dark:to-blue-900/20 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Admin To-Do</h2>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 text-sm space-y-1">
              <li>3 payout requests pending approval</li>
              <li>2 flagged feedbacks to review</li>
              <li>1 new course submission</li>
              <li>5 new affiliate signups</li>
            </ul>
          </div>
          <button className="mt-4 md:mt-0 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold" onClick={() => setShowTodo(false)}>Dismiss</button>
        </div>
      )}

      {/* Recent Activity */}
      <div className="rounded-lg bg-white dark:bg-slate-800 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white">Recent Activity</h2>
            <button className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">View all</button>
          </div>
          <div className="mt-6 flow-root">
            <ul role="list" className="-my-5 divide-y divide-slate-200 dark:divide-slate-700">
              {recentActivity.map((activity, index) => (
                <li key={index} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Image src={`https://i.pravatar.cc/40?img=${index+3}`} alt={activity.user} className="h-8 w-8 rounded-full" width={32} height={32} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {activity.user} <span className="text-xs text-slate-500 dark:text-slate-400">{activity.action}</span> <span className="font-semibold text-teal-600 dark:text-teal-400">{activity.course}</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                    </div>
                    <div>
                      {activity.status === "success" && <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">Success</span>}
                      {activity.status === "info" && <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">Info</span>}
                      {activity.status === "warning" && <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs">Warning</span>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Shortcuts (keep at bottom) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <button className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:from-teal-600 hover:to-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
          <BookOpen className="h-5 w-5" />
          Create New Course
        </button>
        <button className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:from-blue-600 hover:to-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          <Users2 className="h-5 w-5" />
          Manage Affiliates
        </button>
        <button className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:from-purple-600 hover:to-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600">
          <DollarSign className="h-5 w-5" />
          View Revenue
        </button>
      </div>
    </div>
  );
} 