"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  BarChart2,
  Star,
  MessageSquare,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Smile,
  Meh,
  Frown,
  CheckCircle,
  Clock,
  Activity,
  PieChart,
  LineChart,
  BarChart3
} from "lucide-react";

interface FeedbackData {
  id: string;
  rating: number;
  sentiment: "positive" | "neutral" | "negative";
  category: string;
  date: string;
  response_time: number;
  resolved: boolean;
}

const feedbackData: FeedbackData[] = [
  { id: "1", rating: 5, sentiment: "positive", category: "Course Content", date: "2024-03-15", response_time: 2, resolved: true },
  { id: "2", rating: 4, sentiment: "positive", category: "Instructor", date: "2024-03-14", response_time: 1, resolved: true },
  { id: "3", rating: 3, sentiment: "neutral", category: "Platform", date: "2024-03-13", response_time: 4, resolved: false },
  { id: "4", rating: 2, sentiment: "negative", category: "Technical", date: "2024-03-12", response_time: 6, resolved: true },
  { id: "5", rating: 5, sentiment: "positive", category: "Course Content", date: "2024-03-11", response_time: 1, resolved: true },
  { id: "6", rating: 1, sentiment: "negative", category: "Support", date: "2024-03-10", response_time: 8, resolved: false },
  { id: "7", rating: 4, sentiment: "positive", category: "Instructor", date: "2024-03-09", response_time: 2, resolved: true },
  { id: "8", rating: 3, sentiment: "neutral", category: "Platform", date: "2024-03-08", response_time: 3, resolved: true },
];

export default function FeedbackAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const stats = [
    {
      name: "Total Feedback",
      value: "1,247",
      change: "+12.5%",
      trend: "up",
      icon: MessageSquare,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Average Rating",
      value: "4.7",
      change: "+0.3",
      trend: "up",
      icon: Star,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      name: "Response Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Avg Response Time",
      value: "2.4h",
      change: "-0.8h",
      trend: "down",
      icon: Clock,
      gradient: "from-purple-500 to-pink-500"
    },
  ];

  const sentimentData = [
    { label: "Positive", value: 65, color: "bg-green-500", icon: Smile },
    { label: "Neutral", value: 25, color: "bg-yellow-500", icon: Meh },
    { label: "Negative", value: 10, color: "bg-red-500", icon: Frown },
  ];

  const categoryData = [
    { name: "Course Content", count: 45, percentage: 35 },
    { name: "Instructor", count: 32, percentage: 25 },
    { name: "Platform", count: 28, percentage: 22 },
    { name: "Technical", count: 15, percentage: 12 },
    { name: "Support", count: 8, percentage: 6 },
  ];

  const monthlyData = [
    { month: "Jan", positive: 65, neutral: 25, negative: 10 },
    { month: "Feb", positive: 70, neutral: 20, negative: 10 },
    { month: "Mar", positive: 75, neutral: 18, negative: 7 },
    { month: "Apr", positive: 68, neutral: 22, negative: 10 },
    { month: "May", positive: 72, neutral: 20, negative: 8 },
    { month: "Jun", positive: 78, neutral: 16, negative: 6 },
  ];

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />;
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
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <BarChart2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Feedback Analytics</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">Comprehensive insights into user feedback and satisfaction</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
              <Download className="h-5 w-5 mr-2" />
              Export
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
                <div className={`flex items-center gap-1 text-sm font-semibold ${getTrendColor(stat.trend)}`}>
                  {getTrendIcon(stat.trend)}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sentiment Distribution */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Sentiment Distribution</h3>
              <PieChart className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="space-y-4">
              {sentimentData.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 ${item.color} rounded-full`}></div>
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {item.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white w-8">
                      {item.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Category Performance */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Category Performance</h3>
              <BarChart3 className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {category.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white w-8">
                      {category.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Monthly Trends */}
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Sentiment Trends</h3>
            <LineChart className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="grid grid-cols-6 gap-4">
            {monthlyData.map((data) => (
              <div key={data.month} className="text-center">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {data.month}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600 dark:text-green-400">+{data.positive}%</span>
                    <span className="text-slate-500 dark:text-slate-400">Positive</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-yellow-600 dark:text-yellow-400">{data.neutral}%</span>
                    <span className="text-slate-500 dark:text-slate-400">Neutral</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-red-600 dark:text-red-400">-{data.negative}%</span>
                    <span className="text-slate-500 dark:text-slate-400">Negative</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Feedback Activity</h3>
            <Activity className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="space-y-4">
            {feedbackData.slice(0, 5).map((feedback) => (
              <div key={feedback.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-white/30 dark:border-slate-700/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {feedback.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {feedback.sentiment === "positive" && <Smile className="h-4 w-4 text-green-500" />}
                    {feedback.sentiment === "neutral" && <Meh className="h-4 w-4 text-yellow-500" />}
                    {feedback.sentiment === "negative" && <Frown className="h-4 w-4 text-red-500" />}
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {feedback.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {feedback.response_time}h response
                  </div>
                  <div className="flex items-center gap-1">
                    {feedback.resolved ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {feedback.resolved ? "Resolved" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
} 