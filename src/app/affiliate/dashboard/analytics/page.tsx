"use client";

import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Users, 
  DollarSign, 
  MousePointer,
  Download,
  Filter,
  Eye,
  Target
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function AnalyticsPage() {
  // Mock analytics data
  const analyticsData = {
    overview: {
      totalClicks: 2847,
      totalConversions: 189,
      totalEarnings: 945.50,
      conversionRate: 6.6,
      averageOrderValue: 5.00,
      totalInvites: 45
    },
    trends: {
      clicksGrowth: 12.5,
      conversionsGrowth: 8.2,
      earningsGrowth: 15.7,
      conversionRateGrowth: 2.1
    },
    topPerformingLinks: [
      {
        name: "Main Landing Page",
        clicks: 1247,
        conversions: 89,
        earnings: 445.50,
        conversionRate: 7.1
      },
      {
        name: "Course Promotion",
        clicks: 892,
        conversions: 67,
        earnings: 335.00,
        conversionRate: 7.5
      },
      {
        name: "Consultation Booking",
        clicks: 456,
        conversions: 23,
        earnings: 115.00,
        conversionRate: 5.0
      }
    ],
    recentActivity: [
      {
        type: "conversion",
        description: "New conversion from Main Landing Page",
        amount: 5.00,
        time: "2 hours ago"
      },
      {
        type: "click",
        description: "Click on Course Promotion link",
        amount: null,
        time: "3 hours ago"
      },
      {
        type: "conversion",
        description: "New conversion from Consultation Booking",
        amount: 5.00,
        time: "5 hours ago"
      },
      {
        type: "invite",
        description: "New affiliate invite registered",
        amount: null,
        time: "1 day ago"
      }
    ]
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'conversion': return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'click': return <MousePointer className="h-4 w-4 text-blue-500" />;
      case 'invite': return <Users className="h-4 w-4 text-purple-500" />;
      default: return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400">Track your affiliate performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300">
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Clicks</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{analyticsData.overview.totalClicks.toLocaleString()}</p>
              <p className={`text-sm flex items-center gap-1 mt-1 ${getGrowthColor(analyticsData.trends.clicksGrowth)}`}>
                {getGrowthIcon(analyticsData.trends.clicksGrowth)}
                {analyticsData.trends.clicksGrowth > 0 ? '+' : ''}{analyticsData.trends.clicksGrowth}% this month
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <MousePointer className="h-6 w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Conversions</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{analyticsData.overview.totalConversions.toLocaleString()}</p>
              <p className={`text-sm flex items-center gap-1 mt-1 ${getGrowthColor(analyticsData.trends.conversionsGrowth)}`}>
                {getGrowthIcon(analyticsData.trends.conversionsGrowth)}
                {analyticsData.trends.conversionsGrowth > 0 ? '+' : ''}{analyticsData.trends.conversionsGrowth}% this month
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Earnings</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">${analyticsData.overview.totalEarnings.toFixed(2)}</p>
              <p className={`text-sm flex items-center gap-1 mt-1 ${getGrowthColor(analyticsData.trends.earningsGrowth)}`}>
                {getGrowthIcon(analyticsData.trends.earningsGrowth)}
                {analyticsData.trends.earningsGrowth > 0 ? '+' : ''}{analyticsData.trends.earningsGrowth}% this month
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Conversion Rate</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{analyticsData.overview.conversionRate}%</p>
              <p className={`text-sm flex items-center gap-1 mt-1 ${getGrowthColor(analyticsData.trends.conversionRateGrowth)}`}>
                {getGrowthIcon(analyticsData.trends.conversionRateGrowth)}
                {analyticsData.trends.conversionRateGrowth > 0 ? '+' : ''}{analyticsData.trends.conversionRateGrowth}% this month
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Links */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Top Performing Links</h2>
          <div className="space-y-4">
            {analyticsData.topPerformingLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/30 dark:bg-slate-800/30 rounded-lg border border-white/20 dark:border-slate-700/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{link.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{link.clicks} clicks • {link.conversions} conversions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 dark:text-green-400">${link.earnings.toFixed(2)}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{link.conversionRate}% conv.</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {analyticsData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/30 dark:bg-slate-800/30 rounded-lg border border-white/20 dark:border-slate-700/20">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.description}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{activity.time}</p>
                </div>
                {activity.amount && (
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">+${activity.amount.toFixed(2)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Average Order Value</h3>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">${analyticsData.overview.averageOrderValue.toFixed(2)}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Per conversion</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Total Invites</h3>
          <div className="text-center">
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">{analyticsData.overview.totalInvites}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Affiliate invites sent</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance Score</h3>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">8.5/10</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Based on conversions & earnings</p>
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Generate Report</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Create a detailed performance report for any date range.
          </p>
          <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300">
            Generate Report
          </button>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Performance Insights</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Get AI-powered insights to improve your affiliate performance.
          </p>
          <button className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
            View Insights
          </button>
        </GlassCard>
      </div>
    </div>
  );
} 