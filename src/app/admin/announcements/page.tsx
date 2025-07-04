import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/auth/session'
import { getAnnouncementStats } from '@/app/admin/actions'
import { AnnouncementsClient } from './AnnouncementsClient'
import { GlassCard } from '@/components/ui/glass-card'
import { 
  Megaphone, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  TrendingUp,
} from 'lucide-react'

export default async function AnnouncementsPage() {
  // Server-side authentication and authorization
  const profile = await getProfile()
  if (!profile || profile.role !== 'admin') {
    redirect('/admin/login')
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <Megaphone className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Announcements</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Manage platform announcements and communications</p>
        </div>
      </div>

      {/* Stats Cards - Server-side loaded */}
      <Suspense fallback={<StatsLoadingSkeleton />}>
        <StatsCards />
      </Suspense>

      {/* Client Component */}
      <AnnouncementsClient />
    </div>
  )
}

// Server Component for Stats - Professional Glass Design
async function StatsCards() {
  try {
    const stats = await getAnnouncementStats()
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg`}>
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-semibold text-green-600`}>
              <TrendingUp className="h-4 w-4" />
              <span>+15%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Published
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats.publishedCount}
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg`}>
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-semibold text-blue-600`}>
              <TrendingUp className="h-4 w-4" />
              <span>+8%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Scheduled
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats.scheduledCount}
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg`}>
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-semibold text-yellow-600`}>
              <TrendingUp className="h-4 w-4" />
              <span>+3%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Drafts
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats.draftCount}
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg`}>
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-semibold text-purple-600`}>
              <TrendingUp className="h-4 w-4" />
              <span>+22%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Total Views
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats.totalViews}
            </p>
          </div>
        </GlassCard>
      </div>
    )
  } catch (error) {
    console.error('Error loading stats:', error)
    return <StatsCardsError />
  }
}

// Simplified Loading Skeletons
function StatsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-16 h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
              <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Error Components
function StatsCardsError() {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-8">
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
        <AlertCircle className="h-5 w-5" />
        <p className="text-sm font-medium">Error loading statistics</p>
      </div>
    </div>
  )
} 