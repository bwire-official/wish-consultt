"use client";

import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Link as LinkIcon, 
  TrendingUp,
  FileText,
  CreditCard,
  Eye,
  MousePointer,
  Target,
  Plus,
  ArrowUpRight
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function AffiliateDashboardPage() {
  // Mock data for the dashboard
  const stats = {
    totalInvites: 1234,
    totalEarnings: 2450,
    conversionRate: 12.5,
    activeLinks: 8,
    monthlyGrowth: {
      invites: 12,
      earnings: 8,
      conversion: 2.1,
      visits: 18
    }
  };

  const recentActivity = [
    {
      id: "1",
      type: "commission",
      title: "New commission earned",
      description: "$45.00 from invite #1234",
      time: "2 hours ago",
      icon: DollarSign,
      color: "green"
    },
    {
      id: "2",
      type: "invite",
      title: "New invite signed up",
      description: "John Doe from your blog link",
      time: "5 hours ago",
      icon: Users,
      color: "blue"
    },
    {
      id: "3",
      type: "traffic",
      title: "High traffic on link",
      description: "Your Instagram link got 234 visits",
      time: "1 day ago",
      icon: Eye,
      color: "purple"
    }
  ];

  const quickActions = [
    {
      name: "Create New Link",
      description: "Generate a new affiliate link",
      icon: Plus,
      href: "/affiliate/dashboard/links",
      color: "purple"
    },
    {
      name: "Download Materials",
      description: "Get promotional materials",
      icon: FileText,
      href: "/affiliate/dashboard/materials",
      color: "green"
    },
    {
      name: "View Analytics",
      description: "Check your performance",
      icon: BarChart3,
      href: "/affiliate/dashboard/analytics",
      color: "blue"
    },
    {
      name: "Request Payout",
      description: "Withdraw your earnings",
      icon: CreditCard,
      href: "/affiliate/dashboard/payouts",
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'from-green-500 to-emerald-500';
      case 'blue': return 'from-blue-500 to-indigo-500';
      case 'purple': return 'from-purple-500 to-pink-500';
      case 'orange': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getActivityColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-500';
      case 'blue': return 'bg-blue-500';
      case 'purple': return 'bg-purple-500';
      case 'orange': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Welcome back, <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">John!</span> 👋
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Here&apos;s what&apos;s happening with your affiliate business today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Invites</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalInvites.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4" />
                +{stats.monthlyGrowth.invites}% this month
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Earnings</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">${stats.totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4" />
                +{stats.monthlyGrowth.earnings}% this month
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Conversion Rate</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.conversionRate}%</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <Target className="h-4 w-4" />
                +{stats.monthlyGrowth.conversion}% this month
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Links</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.activeLinks}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1">
                <MousePointer className="h-4 w-4" />
                +{stats.monthlyGrowth.visits}% visits today
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <LinkIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.name}
                className={`flex items-center gap-3 p-4 bg-gradient-to-r ${getColorClasses(action.color)} text-white rounded-xl hover:shadow-lg transition-all duration-300 group`}
              >
                <Icon className="h-5 w-5" />
                <div className="text-left">
                  <span className="font-semibold block">{action.name}</span>
                  <span className="text-xs opacity-90">{action.description}</span>
                </div>
                <ArrowUpRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Recent Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                  <div className={`w-10 h-10 ${getActivityColorClasses(activity.color)} rounded-full flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">{activity.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{activity.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">This Month&apos;s Performance</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">New Invites</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900 dark:text-white">156</p>
                <p className="text-sm text-green-600 dark:text-green-400">+23% vs last month</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">Earnings</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900 dark:text-white">$890</p>
                <p className="text-sm text-green-600 dark:text-green-400">+15% vs last month</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">Conversion Rate</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900 dark:text-white">12.5%</p>
                <p className="text-sm text-green-600 dark:text-green-400">+2.1% vs last month</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
} 