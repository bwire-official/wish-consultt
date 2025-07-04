"use client";

import { 
  Link, 
  Copy, 
  ExternalLink, 
  Plus, 
  BarChart3, 
  Eye, 
  MousePointer,
  Settings,
  Trash2,
  Edit,
  X,
  Sparkles,
  Target,
  Globe
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useState, useEffect } from "react";
import { getMyInviteCodes } from "../../actions/affiliate-links";
import type { Tables } from '@/types/supabase';

type InviteCode = Tables<'invite_codes'>;

export default function LinksPage() {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCodeForm, setNewCodeForm] = useState({
    name: '',
    codeText: '',
    description: ''
  });

  const closeModal = () => {
    setShowCreateModal(false);
    // Reset form after a short delay for smooth animation
    setTimeout(() => {
      setNewCodeForm({ name: '', codeText: '', description: '' });
    }, 300);
  };

  // Load invite codes on component mount
  useEffect(() => {
    loadInviteCodes();
  }, []);

  const loadInviteCodes = async () => {
    try {
      setLoading(true);
      const result = await getMyInviteCodes();
      
      if (result.success) {
        setInviteCodes(result.data || []);
        setError(null);
      } else {
        setError(result.error || 'Failed to load invite codes');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading invite codes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Transform invite codes to display format (adding generated links and mock stats for now)
  const affiliateLinks = inviteCodes.map((code, index) => ({
    id: code.id,
    name: index === 0 ? 'Default Invite Code' : `Custom Code #${index}`,
    url: `https://www.wishconsult.app/invite?${code.code_text}`,
    shortCode: code.code_text,
    clicks: 0, // TODO: Get real analytics
    conversions: 0, // TODO: Get real analytics
    earnings: 0, // TODO: Get real analytics
    conversionRate: 0, // TODO: Get real analytics
    status: code.is_active ? 'active' : 'inactive',
    createdAt: new Date(code.created_at).toLocaleDateString(),
    lastUsed: 'N/A', // TODO: Track last usage
    uses: code.uses
  }));

  const totalStats = {
    totalClicks: affiliateLinks.reduce((sum, link) => sum + link.clicks, 0),
    totalConversions: affiliateLinks.reduce((sum, link) => sum + link.conversions, 0),
    totalEarnings: affiliateLinks.reduce((sum, link) => sum + link.earnings, 0),
    averageConversionRate: affiliateLinks.length > 0 
      ? affiliateLinks.reduce((sum, link) => sum + link.conversionRate, 0) / affiliateLinks.length 
      : 0
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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Your Affiliate Links & Codes</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage and track your invite codes and shareable links</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Create New Code
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <GlassCard className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Total Clicks</p>
              <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">{totalStats.totalClicks.toLocaleString()}</p>
                              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  {loading ? "Loading..." : "No data yet"}
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
                              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  {loading ? "Loading..." : "No data yet"}
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
                              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  {loading ? "Loading..." : "No data yet"}
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
                              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  {loading ? "Loading..." : "No data yet"}
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
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-4 sm:mb-6">Your Invite Codes & Shareable Links</h2>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading your invite codes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Error Loading Codes</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
              <button 
                onClick={loadInviteCodes}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : affiliateLinks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Link className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No affiliate codes found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">It looks like you don&apos;t have any invite codes yet. Your default code should have been created during onboarding.</p>
                              <button 
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
                >
                  <Plus className="h-4 w-4 inline mr-2" />
                  Create New Code
                </button>
            </div>
          ) : (
            affiliateLinks.map((link) => (
            <div key={link.id} className="p-3 sm:p-4 bg-white/30 dark:bg-slate-800/30 rounded-lg border border-white/20 dark:border-slate-700/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Link className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{link.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Code: <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">{link.shortCode}</span></p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 truncate">Link: {link.url}</p>
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
                    onClick={() => copyToClipboard(link.shortCode, `${link.id}-code`)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-xs sm:text-sm"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copiedLink === `${link.id}-code` ? 'Copied!' : 'Copy Code'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(link.url, `${link.id}-link`)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-xs sm:text-sm"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copiedLink === `${link.id}-link` ? 'Copied!' : 'Copy Link'}
                  </button>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-md hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 text-xs sm:text-sm"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Test Link
                  </a>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <GlassCard className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4">Create Custom Code</h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
            Generate a new invite code for specific campaigns or products.
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
          >
            Create New Code
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

      {/* Create New Code Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={closeModal}
          ></div>
          
          {/* Modal */}
          <div className="relative w-full max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-300">
            <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl p-6">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 group"
              >
                <X className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Create New Code</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">Generate a custom invite code for your campaigns</p>
              </div>

              {/* Form */}
              <form className="space-y-4">
                {/* Code Name */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <Target className="h-4 w-4 inline mr-2" />
                    Campaign Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newCodeForm.name}
                      onChange={(e) => setNewCodeForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-base"
                      placeholder="e.g., Summer Sale, Course Launch"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Give your code a memorable name for tracking</p>
                </div>

                {/* Custom Code */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <Globe className="h-4 w-4 inline mr-2" />
                    Custom Code (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newCodeForm.codeText}
                      onChange={(e) => setNewCodeForm(prev => ({ ...prev, codeText: e.target.value.toUpperCase() }))}
                      className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-base font-mono"
                      placeholder="e.g., SUMMER2024"
                      maxLength={20}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Leave blank to auto-generate a unique code</p>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Description (Optional)
                  </label>
                  <div className="relative">
                    <textarea
                      value={newCodeForm.description}
                      onChange={(e) => setNewCodeForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-base resize-none"
                      placeholder="What is this code for? Any special notes..."
                      rows={2}
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Preview Link:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-white dark:bg-slate-900 px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 flex-1 truncate">
                      https://www.wishconsult.app/invite?{newCodeForm.codeText || 'YOUR_CODE'}
                    </code>
                    <Copy className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm"
                  >
                    Create Code
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 