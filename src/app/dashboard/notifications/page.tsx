'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  Bell, CheckCircle, Trash2, CheckCheck, Crown, Megaphone, DollarSign, 
  Award, Users, Shield, TrendingUp, BookOpen, Clock, X,
  UserPlus, Settings, FileText,
  Search, Star, Eye, RefreshCw, ChevronLeft, ChevronRight, Info
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase'
import { GlassCard } from '@/components/ui/glass-card'
import NotificationDetailModal from '@/components/shared/NotificationDetailModal'

type Notification = Tables<'notifications'>

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([])
  const [highlightedNotification, setHighlightedNotification] = useState<number | null>(null)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const supabase = createClient()
  const searchParams = useSearchParams()
  const itemsPerPage = 15

  // Get user ID from session
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
    
    // Check for highlighted notification in URL
    const notificationId = searchParams.get('highlight')
    if (notificationId) {
      setHighlightedNotification(parseInt(notificationId))
      // Clear highlight after 10 seconds
      setTimeout(() => setHighlightedNotification(null), 10000)
    }
  }, [searchParams, supabase.auth])

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification)
    setIsModalOpen(true)
    if (!notification.read_at) {
      markAsRead(notification.id)
    }
  }

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) return
    
    if (!isRefreshing) {
      setLoading(true)
    }
    
    try {
      setLoading(true)
      const from = (currentPage - 1) * itemsPerPage
      const to = from + itemsPerPage - 1

      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to)

      // Apply read/unread filter
      if (filter === 'unread') {
        query = query.is('read_at', null)
      } else if (filter === 'read') {
        query = query.not('read_at', 'is', null)
      }

      // Apply type filter
      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter)
      }

      // Apply search
      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,message.ilike.%${searchQuery}%`)
      }

      const { data, error, count } = await query

      if (error) throw error
      
      setNotifications(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [userId, isRefreshing, currentPage, itemsPerPage, filter, typeFilter, searchQuery, supabase])

  useEffect(() => {
    if (userId) fetchNotifications()
  }, [userId, fetchNotifications])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchNotifications()
  }

  // Mark as read
  const markAsRead = async (notificationId: number) => {
    if (!userId) return
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', userId)

      if (error) throw error
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      )
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  // Delete notification
  const deleteNotification = async (notificationId: number) => {
    if (!userId) return
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId)

      if (error) throw error
      
      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      setTotalCount(prev => prev - 1)
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    if (!userId) return
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .is('read_at', null)

      if (error) throw error
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
      )
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  // Bulk delete selected notifications
  const deleteSelectedNotifications = async () => {
    if (!userId || selectedNotifications.length === 0) return
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .in('id', selectedNotifications)

      if (error) throw error
      
      // Remove from local state
      setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)))
      setTotalCount(prev => prev - selectedNotifications.length)
      setSelectedNotifications([])
    } catch (error) {
      console.error('Error deleting notifications:', error)
    }
  }

  // Toggle notification selection
  const toggleSelection = (notificationId: number) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  // Select all visible notifications
  const selectAll = () => {
    const allIds = notifications.map(n => n.id)
    setSelectedNotifications(allIds)
  }

  // Get proper icon component
  const getNotificationIcon = (type: string) => {
    const iconMap: Record<string, React.ElementType> = {
      course_completed: BookOpen,
      course_completion: BookOpen,
      certificate_ready: Award,
      commission_earned: DollarSign,
      payout_processed: DollarSign,
      milestone_reached: TrendingUp,
      new_invite: UserPlus,
      announcement: Megaphone,
      admin_invitation: Crown,
      role_promotion: Crown,
      security_alert: Shield,
      system_maintenance: Settings,
      revenue_milestone: TrendingUp,
      new_user_signup: Users,
      course_submitted: FileText
    }
    return iconMap[type] || Bell
  }

  // Get notification category colors
  const getCategoryStyle = (type: string, priority: string) => {
    const baseStyle = "w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
    
    if (priority === 'high') {
      return `${baseStyle} bg-gradient-to-r from-red-500 to-red-600 text-white`
    } else if (priority === 'medium') {
      return `${baseStyle} bg-gradient-to-r from-blue-500 to-blue-600 text-white`
    } else {
      return `${baseStyle} bg-gradient-to-r from-slate-400 to-slate-500 text-white`
    }
  }

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    const baseStyle = "px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider"
    
    switch (priority) {
      case 'high':
        return `${baseStyle} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`
      case 'medium':
        return `${baseStyle} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`
      default:
        return `${baseStyle} bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300`
    }
  }

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const unreadCount = notifications.filter(n => !n.read_at).length

  // Get unique notification types for filter
  const notificationTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'announcement', label: 'Announcements' },
    { value: 'course_completed', label: 'Course Completions' },
    { value: 'certificate_ready', label: 'Certificates' },
    { value: 'admin_invitation', label: 'Admin Invitations' },
    { value: 'role_promotion', label: 'Promotions' },
    { value: 'security_alert', label: 'Security' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NotificationDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notification={selectedNotification}
        userRole="student"
      />

      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
            <Bell className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Notifications</h1>
        </div>
        <p className="text-lg text-slate-700 dark:text-slate-300">Stay updated with your latest activities and announcements</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <GlassCard className="p-4 md:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400">Total</p>
              <p className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white">{totalCount}</p>
            </div>
            <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Bell className="h-4 w-4 md:h-6 md:w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 md:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400">Unread</p>
              <p className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white">{unreadCount}</p>
            </div>
            <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 md:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400">Read</p>
              <p className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white">{totalCount - unreadCount}</p>
            </div>
            <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="h-4 w-4 md:h-6 md:w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 md:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400">This Page</p>
              <p className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white">{notifications.length}</p>
            </div>
            <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="h-4 w-4 md:h-6 md:w-6 text-white" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Highlighted Notification Banner */}
      {highlightedNotification && (
        <div className="mb-8">
          <GlassCard className="p-6 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 border-yellow-300/30 dark:border-yellow-600/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Highlighted Notification
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Showing notification #{highlightedNotification} from your click
                </p>
              </div>
              <button
                onClick={() => setHighlightedNotification(null)}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Enhanced Filters & Search */}
      <div className="mb-8">
        <GlassCard className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications by title, message, or type..."
              className="w-full pl-12 pr-4 py-4 bg-transparent border-b-2 border-slate-200/60 dark:border-slate-600/60 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 text-sm md:text-base"
            />
          </div>
          
          {/* Enhanced Filters */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value as 'all' | 'unread' | 'read')
                  setCurrentPage(1)
                }}
                className="flex-1 px-3 md:px-4 py-3 bg-transparent border-b-2 border-slate-200/60 dark:border-slate-600/60 text-slate-900 dark:text-white focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 text-sm md:text-base"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="flex-1 px-3 md:px-4 py-3 bg-transparent border-b-2 border-slate-200/60 dark:border-slate-600/60 text-slate-900 dark:text-white focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 text-sm md:text-base"
              >
                {notificationTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full sm:w-auto px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 shadow-sm flex items-center justify-center gap-2 text-sm md:text-base"
              title="Refresh notifications"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Enhanced Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/60 to-cyan-50/60 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl border border-blue-200/60 dark:border-blue-700/60 backdrop-blur-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                    {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
                  </span>
                  <p className="text-xs text-blue-600 dark:text-blue-300">Choose an action below</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  onClick={deleteSelectedNotifications}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedNotifications([])}
                  className="flex-1 px-4 py-2 bg-slate-500 text-white text-sm font-medium rounded-xl hover:bg-slate-600 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Quick Actions */}
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {notifications.length > 0 && (
              <button
                onClick={selectAll}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-2 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded-lg w-fit"
              >
                <CheckCheck className="w-4 h-4" />
                Select All
              </button>
            )}
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Showing {notifications.length} of {totalCount} notifications
            </div>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>
      </GlassCard>
      </div>

      {/* Enhanced Notifications List */}
      <div className="mb-8">
        <GlassCard className="overflow-hidden">
          {loading ? (
            <div className="p-6 md:p-8 space-y-4 md:space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 md:gap-4 animate-pulse">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full"></div>
                  <div className="flex-1 space-y-2 md:space-y-3">
                    <div className="h-4 md:h-5 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-3/4"></div>
                    <div className="h-3 md:h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-1/2"></div>
                    <div className="h-2 md:h-3 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 md:p-16 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 dark:from-slate-800 dark:via-blue-900/20 dark:to-cyan-900/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                <Bell className="w-8 h-8 md:w-10 md:h-10 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">
                No notifications found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base">
                {filter === 'unread' ? 'You\'re all caught up! No unread notifications.' : 
                 filter === 'read' ? 'No read notifications to show.' : 
                 searchQuery ? 'No notifications match your search criteria.' :
                 'You\'re all set! No notifications at the moment.'}
              </p>
              {(filter !== 'all' || searchQuery || typeFilter !== 'all') && (
                <button
                  onClick={() => {
                    setFilter('all')
                    setTypeFilter('all')
                    setSearchQuery('')
                    setCurrentPage(1)
                  }}
                  className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-lg text-sm md:text-base"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            notifications.map((notification, index) => {
              const IconComponent = getNotificationIcon(notification.type)
              const isSelected = selectedNotifications.includes(notification.id)
              const isHighlighted = highlightedNotification === notification.id
              
              return (
                <div
                  key={notification.id}
                  ref={isHighlighted ? (el) => {
                    if (el) {
                      setTimeout(() => {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      }, 100)
                    }
                  } : undefined}
                  className={`p-4 md:p-6 ${index !== notifications.length - 1 ? 'border-b border-slate-200/50 dark:border-slate-700/50' : ''} hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300 ${
                    !notification.read_at ? 'bg-gradient-to-r from-blue-50/40 to-cyan-50/40 dark:from-blue-900/20 dark:to-cyan-900/20 border-l-4 border-l-blue-500' : ''
                  } ${isSelected ? 'bg-gradient-to-r from-blue-100/50 to-cyan-100/50 dark:from-blue-900/30 dark:to-cyan-900/30' : ''} ${
                    isHighlighted ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 border-2 border-blue-500/50 dark:border-blue-400/50 ring-4 ring-blue-300/30 transform scale-[1.02] animate-pulse shadow-2xl' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    {/* Selection Checkbox */}
                    <div className="pt-1 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(notification.id)}
                        className="w-4 h-4 md:w-5 md:h-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all"
                      />
                    </div>

                    {/* Enhanced Icon */}
                    <div className={`${getCategoryStyle(notification.type, notification.priority || 'low')} p-1.5 md:p-2 rounded-xl shadow-sm flex-shrink-0`}>
                      <IconComponent className="w-4 h-4 md:w-6 md:h-6" />
                    </div>
                    
                    {/* Enhanced Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-3 md:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-2">
                            <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                              {notification.title}
                            </h3>
                            <span className={`${getPriorityBadge(notification.priority || 'low')} px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-semibold`}>
                              {notification.priority?.toUpperCase() || 'LOW'}
                            </span>
                            {!notification.read_at && (
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-pulse shadow-lg"></div>
                            )}
                            {isHighlighted && (
                              <div className="px-2 md:px-3 py-0.5 md:py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full uppercase tracking-wider animate-pulse shadow-lg flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                HIGHLIGHTED
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2 md:mb-3 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-slate-400 dark:text-slate-500">
                            <div className="flex items-center gap-1 md:gap-1.5 bg-slate-100 dark:bg-slate-800 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg">
                              <Clock className="w-3 h-3" />
                              {formatTime(notification.created_at!)}
                            </div>
                            <div className="flex items-center gap-1 md:gap-1.5 bg-slate-100 dark:bg-slate-800 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg">
                              <Star className="w-3 h-3" />
                              {notification.type.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced Actions */}
                        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleViewDetails(notification)}
                            className="p-1.5 md:p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 shadow-sm"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!notification.read_at && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1.5 md:p-2 text-slate-400 dark:text-slate-500 hover:text-green-600 dark:hover:text-green-400 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 shadow-sm"
                              title="Mark as read"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1.5 md:p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 shadow-sm"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </GlassCard>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="mb-8">
          <GlassCard className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto px-3 md:px-4 py-2 bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-600/60 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-1 md:gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-xl font-medium transition-all duration-200 text-sm ${
                          pageNum === currentPage
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                            : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-600/60'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto px-3 md:px-4 py-2 bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-600/60 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm font-medium flex items-center justify-center gap-2 text-sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Enhanced Stats Footer */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <Info className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} notifications
          </p>
        </div>
      </div>
    </div>
  )
} 