"use client";

import { 
  Link, 
  Copy, 
  ExternalLink, 
  Plus, 
  BarChart3, 
  Eye, 
  MousePointer,
  TrendingUp,
  Settings,
  Trash2,
  Edit
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";

export default function LinksPage() {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Mock affiliate links data
  const affiliateLinks = [
    {
      id: "1",
      name: "Main Landing Page",
      url: "https://wishconsult.com/ref/aff123",
      shortCode: "aff123",
      clicks: 1247,
      conversions: 89,
      earnings: 445.50,
      conversionRate: 7.1,
      status: "active",
      createdAt: "2024-01-01",
      lastUsed: "2024-01-15"
    },
    {
      id: "2",
      name: "Course Promotion",
      url: "https://wishconsult.com/courses/ref/aff123",
      shortCode: "aff123-courses",
      clicks: 892,
      conversions: 67,
      earnings: 335.00,
      conversionRate: 7.5,
      status: "active",
      createdAt: "2024-01-05",
      lastUsed: "2024-01-14"
    },
    {
      id: "3",
      name: "Consultation Booking",
      url: "https://wishconsult.com/book/ref/aff123",
      shortCode: "aff123-book",
      clicks: 456,
      conversions: 23,
      earnings: 115.00,
      conversionRate: 5.0,
      status: "active",
      createdAt: "2024-01-10",
      lastUsed: "2024-01-13"
    },
    {
      id: "4",
      name: "Free Trial",
      url: "https://wishconsult.com/trial/ref/aff123",
      shortCode: "aff123-trial",
      clicks: 234,
      conversions: 12,
      earnings: 60.00,
      conversionRate: 5.1,
      status: "paused",
      createdAt: "2024-01-12",
      lastUsed: "2024-01-11"
    }
  ];

  const totalStats = {
    totalClicks: affiliateLinks.reduce((sum, link) => sum + link.clicks, 0),
    totalConversions: affiliateLinks.reduce((sum, link) => sum + link.conversions, 0),
    totalEarnings: affiliateLinks.reduce((sum, link) => sum + link.earnings, 0),
    averageConversionRate: affiliateLinks.reduce((sum, link) => sum + link.conversionRate, 0) / affiliateLinks.length
  };

  const copyToClipboard = async (text: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(linkId);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'paused': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'inactive': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">My Links</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage and track your affiliate links</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Create New Link
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <GlassCard className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Total Clicks</p>
              <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">{totalStats.totalClicks.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                +12% this month
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <MousePointer className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Conversions</p>
              <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">{totalStats.totalConversions.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                +8% this month
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Total Earnings</p>
              <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">${totalStats.totalEarnings.toFixed(2)}</p>
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                +15% this month
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Link className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Avg. Conversion</p>
              <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">{totalStats.averageConversionRate.toFixed(1)}%</p>
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                +1.2% this month
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Eye className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Links Table */}
      <GlassCard className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-4 sm:mb-6">Your Affiliate Links</h2>
        <div className="space-y-3">
          {affiliateLinks.map((link) => (
            <div key={link.id} className="p-3 sm:p-4 bg-white/30 dark:bg-slate-800/30 rounded-lg border border-white/20 dark:border-slate-700/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Link className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{link.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Code: {link.shortCode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(link.status)}`}>
                    {link.status}
                  </span>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                      <Settings className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1.5 text-red-600 hover:text-red-700 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3">
                <div className="text-center">
                  <p className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white">{link.clicks.toLocaleString()}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Clicks</p>
                </div>
                <div className="text-center">
                  <p className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white">{link.conversions}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Conversions</p>
                </div>
                <div className="text-center">
                  <p className="text-sm sm:text-lg font-bold text-green-600 dark:text-green-400">${link.earnings.toFixed(2)}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Earnings</p>
                </div>
                <div className="text-center">
                  <p className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white">{link.conversionRate}%</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Conv. Rate</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400">Created:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{link.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400">Last used:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{link.lastUsed}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(link.url, link.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-xs sm:text-sm"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copiedLink === link.id ? 'Copied!' : 'Copy'}
                  </button>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-md hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 text-xs sm:text-sm"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Visit
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <GlassCard className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4">Create Custom Link</h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
            Generate a new affiliate link for specific campaigns or products.
          </p>
          <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300">
            Create New Link
          </button>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4">Link Analytics</h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
            View detailed analytics and performance metrics for all your links.
          </p>
          <button className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
            View Analytics
          </button>
        </GlassCard>
      </div>
    </div>
  );
} 