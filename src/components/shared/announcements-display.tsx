"use client"

import { useState, useEffect } from 'react'
import { X, Megaphone, Clock, AlertCircle, CheckCircle, TrendingUp, Eye } from 'lucide-react'
import { useTheme } from 'next-themes'
import { getAnnouncementsForUser } from '@/lib/auth/session'

interface Announcement {
  id: number
  title: string
  content: string
  status: string
  priority: string
  target_audience: string
  created_at: string | null
  scheduled_for: string | null
  views: number
  engagement_rate: number
  tags: string[]
}

export default function AnnouncementsDisplay() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncementsForUser()
        if (
          Array.isArray(data) &&
          data.length > 0 &&
          data.every(
            a =>
              a &&
              typeof a === 'object' &&
              'priority' in a &&
              'target_audience' in a &&
              'scheduled_for' in a &&
              'views' in a &&
              'engagement_rate' in a &&
              'tags' in a &&
              'id' in a
          )
        ) {
          setAnnouncements(
            data.map(a => ({
              ...a,
              id: typeof a.id === 'string' ? parseInt(a.id, 10) : a.id,
              content: a.content || '',
              priority: String(a.priority),
              target_audience: String(a.target_audience),
              created_at: a.created_at || null,
              scheduled_for:
                typeof a.scheduled_for === 'string'
                  ? a.scheduled_for
                  : a.scheduled_for == null
                  ? null
                  : String(a.scheduled_for),
              views: Number(a.views),
              engagement_rate: Number(a.engagement_rate),
              tags: Array.isArray(a.tags) ? a.tags : []
            }))
          )
        } else {
          setAnnouncements([])
        }
      } catch (error) {
        console.error('Error fetching announcements:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  if (!isVisible || isLoading || announcements.length === 0) return null

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-700";
      case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-700";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return <AlertCircle className="h-4 w-4" />;
      case "high": return <AlertCircle className="h-4 w-4" />;
      case "medium": return <Clock className="h-4 w-4" />;
      case "low": return <CheckCircle className="h-4 w-4" />;
      default: return <Megaphone className="h-4 w-4" />;
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-3 mb-6">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className={`relative rounded-lg border p-4 ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-white/50 border-slate-200/50'
          } backdrop-blur-sm shadow-sm`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1 rounded-full ${getPriorityColor(announcement.priority)}`}>
                  {getPriorityIcon(announcement.priority)}
                </div>
                <h3 className={`font-semibold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {announcement.title}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(announcement.priority)}`}>
                  {announcement.priority}
                </span>
              </div>
              
              <p className={`text-sm mb-3 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {announcement.content}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(announcement.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {announcement.views} views
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {announcement.engagement_rate}% engagement
                </span>
              </div>

              {announcement.tags && announcement.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {announcement.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className={`flex p-1 rounded-md ml-2 ${
                isDark 
                  ? 'hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-white' 
                  : 'hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900'
              }`}
              onClick={() => {
                // Remove this specific announcement from the list
                setAnnouncements(prev => prev.filter(a => a.id !== announcement.id))
              }}
            >
              <span className="sr-only">Dismiss</span>
              <X className={`h-4 w-4 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
} 