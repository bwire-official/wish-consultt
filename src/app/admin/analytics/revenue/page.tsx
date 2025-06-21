"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  BarChart3,
  CreditCard,
  Wallet,
  Target,
  Users
} from "lucide-react";

export default function RevenueReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const revenueStats = [
    {
      name: "Total Revenue",
      value: "$124,580",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Monthly Recurring",
      value: "$45,230",
      change: "+8.3%",
      trend: "up",
      icon: CreditCard,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Average Order",
      value: "$299",
      change: "+5.2%",
      trend: "up",
      icon: Wallet,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Conversion Rate",
      value: "3.8%",
      change: "+1.2%",
      trend: "up",
      icon: Target,
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const revenueByMonth = [
    { month: "Jan", revenue: 12500, growth: 12 },
    { month: "Feb", revenue: 15800, growth: 26 },
    { month: "Mar", revenue: 14200, growth: -10 },
    { month: "Apr", revenue: 18900, growth: 33 },
    { month: "May", revenue: 22100, growth: 17 },
    { month: "Jun", revenue: 19800, growth: -10 },
    { month: "Jul", revenue: 24500, growth: 24 },
    { month: "Aug", revenue: 26700, growth: 9 },
    { month: "Sep", revenue: 28900, growth: 8 },
    { month: "Oct", revenue: 31200, growth: 8 },
    { month: "Nov", revenue: 29800, growth: -4 },
    { month: "Dec", revenue: 34500, growth: 16 }
  ];

  const topRevenueSources = [
    {
      source: "Course Sales",
      revenue: "$89,400",
      percentage: 71.8,
      growth: "+15.2%"
    },
    {
      source: "Subscriptions",
      revenue: "$23,800",
      percentage: 19.1,
      growth: "+8.7%"
    },
    {
      source: "Certifications",
      revenue: "$8,900",
      percentage: 7.1,
      growth: "+12.3%"
    },
    {
      source: "Consulting",
      revenue: "$2,480",
      percentage: 2.0,
      growth: "+5.1%"
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
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Revenue Reports</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">Financial performance and revenue analytics</p>
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

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {revenueStats.map((stat, index) => (
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

        {/* Revenue Chart and Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Chart */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Revenue</h2>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm font-medium">
                View Details
              </button>
            </div>
            <div className="space-y-4">
              {revenueByMonth.slice(-6).map((month, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {month.month}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        ${month.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    month.growth >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}>
                    {month.growth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    <span>{Math.abs(month.growth)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Revenue Sources */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue Sources</h2>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {topRevenueSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {source.source}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {source.percentage}% of total
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {source.revenue}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {source.growth}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Generate Report</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Create custom report</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Customer Analysis</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Customer insights</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Set Targets</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Revenue goals</p>
              </div>
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
} 