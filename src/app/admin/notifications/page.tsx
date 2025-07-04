'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  Bell, Eye, Trash2, CheckCheck, Crown, Megaphone, DollarSign, 
  Award, Users, Shield, TrendingUp, BookOpen, Clock, X,
  AlertCircle, UserPlus, Settings, FileText, CheckCircle,
  Search, Star, Target, Zap, Database, Activity, RefreshCw
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase'
import { GlassCard } from '@/components/ui/glass-card'
import NotificationDetailModal from '@/components/shared/NotificationDetailModal'

type Notification = Tables<'notifications'>

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([])
  const [highlightedNotification, setHighlightedNotification] = useState<number | null>(null)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    high_priority: 0,
    system_alerts: 0
  })
  
  const supabase = createClient()
  const searchParams = useSearchParams()
  const itemsPerPage = 20

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

  // Fetch notifications with admin-specific logic
  const fetchNotifications = useCallback(async () => {
    if (!userId) return
    
    // Don't set loading for manual refresh to avoid skeleton flashing
    if (!isRefreshing) {
      setLoading(true)
    }

    try {
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

      // Apply priority filter
      if (priorityFilter !== 'all') {
        query = query.eq('priority', priorityFilter)
      }

      // Apply search
      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,message.ilike.%${searchQuery}%`)
      }

      const { data, error, count } = await query

      if (error) throw error
      
      setNotifications(data || [])
      setTotalCount(count || 0)

      // Calculate stats
      const allNotifications = data || []
      setStats({
        total: count || 0,
        unread: allNotifications.filter(n => !n.read_at).length,
        high_priority: allNotifications.filter(n => n.priority === 'high').length,
        system_alerts: allNotifications.filter(n => n.category === 'system').length
      })

    } catch (error) {
      console.error('Error fetching admin notifications:', error)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [userId, currentPage, filter, typeFilter, priorityFilter, searchQuery, isRefreshing, itemsPerPage, supabase])

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
      setStats(prev => ({ ...prev, unread: prev.unread - 1 }))
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
      const deletedNotification = notifications.find(n => n.id === notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      setTotalCount(prev => prev - 1)
      
      if (deletedNotification && !deletedNotification.read_at) {
        setStats(prev => ({ ...prev, unread: prev.unread - 1, total: prev.total - 1 }))
      } else {
        setStats(prev => ({ ...prev, total: prev.total - 1 }))
      }
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
      setStats(prev => ({ ...prev, unread: 0 }))
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
      
      // Calculate how many unread we're deleting
      const deletedUnread = notifications.filter(n => 
        selectedNotifications.includes(n.id) && !n.read_at
      ).length
      
      // Remove from local state
      setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)))
      setTotalCount(prev => prev - selectedNotifications.length)
      setStats(prev => ({ 
        ...prev, 
        total: prev.total - selectedNotifications.length,
        unread: prev.unread - deletedUnread
      }))
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

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification)
    setIsModalOpen(true)
    if (!notification.read_at) {
      markAsRead(notification.id)
    }
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
      course_submitted: FileText,
      admin_alert: AlertCircle,
      system_update: Database,
      performance_alert: Activity
    }
    return iconMap[type] || Bell
  }

  // Get notification category colors
  const getCategoryStyle = (type: string, priority: string) => {
    const baseStyle = "w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
    
    if (priority === 'high') {
      return `${baseStyle} bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse`
    } else if (priority === 'medium') {
      return `${baseStyle} bg-gradient-to-r from-orange-500 to-orange-600 text-white`
    } else {
      return `${baseStyle} bg-gradient-to-r from-slate-400 to-slate-500 text-white`
    }
  }

  // Get priority badge with enhanced styling
  const getPriorityBadge = (priority: string) => {
    const baseStyle = "px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider"
    
    switch (priority) {
      case 'high':
        return `${baseStyle} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`
      case 'medium':
        return `${baseStyle} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300`
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
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  // Admin-specific notification types
  const adminNotificationTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'admin_alert', label: 'Admin Alerts' },
    { value: 'system_maintenance', label: 'System Maintenance' },
    { value: 'security_alert', label: 'Security Alerts' },
    { value: 'revenue_milestone', label: 'Revenue Milestones' },
    { value: 'new_user_signup', label: 'New Signups' },
    { value: 'payout_processed', label: 'Payouts' },
    { value: 'performance_alert', label: 'Performance' },
    { value: 'announcement', label: 'Announcements' }
  ]

  return (
    <div>
        <NotificationDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          notification={selectedNotification}
          userRole="admin"
        />

        {/* Highlighted Notification Banner */}
        {highlightedNotification && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-300/50 dark:border-blue-600/50 rounded-xl">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                Showing highlighted notification #{highlightedNotification} from your click
              </span>
              <button
                onClick={() => setHighlightedNotification(null)}
                className="ml-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Admin Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Notifications</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Unread</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.unread}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">High Priority</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.high_priority}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">System Alerts</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.system_alerts}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Enhanced Filters & Search */}
        <GlassCard className="p-6 mb-8">
          <div className="flex flex-col xl:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search admin notifications..."
                  className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 dark:focus:border-red-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>
            
            {/* Enhanced Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value as 'all' | 'unread' | 'read')
                  setCurrentPage(1)
                }}
                className="px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/50 focus:border-red-500 dark:focus:border-red-400 focus:outline-none transition-all duration-300 backdrop-blur-sm min-w-[140px]"
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
                className="px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/50 focus:border-red-500 dark:focus:border-red-400 focus:outline-none transition-all duration-300 backdrop-blur-sm min-w-[160px]"
              >
                {adminNotificationTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/50 focus:border-red-500 dark:focus:border-red-400 focus:outline-none transition-all duration-300 backdrop-blur-sm min-w-[140px]"
              >
                <option value="all">All Priority</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all duration-200 disabled:opacity-50"
                title="Refresh notifications"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Enhanced Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="mt-4 p-4 bg-red-50/50 dark:bg-red-900/20 rounded-xl border border-red-200/50 dark:border-red-700/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-800 dark:text-red-200 font-medium">
                  {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={deleteSelectedNotifications}
                    className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected
                  </button>
                  <button
                    onClick={() => setSelectedNotifications([])}
                    className="px-4 py-2 bg-slate-500 text-white text-sm font-medium rounded-lg hover:bg-slate-600 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Quick Actions */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {notifications.length > 0 && (
                <button
                  onClick={selectAll}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  Select All ({notifications.length})
                </button>
              )}
              <span className="text-slate-400">•</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}
              </span>
            </div>
            
            {stats.unread > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read ({stats.unread})
              </button>
            )}
          </div>
        </GlassCard>

        {/* Enhanced Notifications List */}
        <GlassCard className="overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4 animate-pulse">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                No admin notifications found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {filter === 'unread' ? 'No unread admin notifications' : 
                 filter === 'read' ? 'No read admin notifications' : 
                 searchQuery ? 'No notifications match your search criteria' :
                 'No administrative notifications yet'}
              </p>
              {(filter !== 'all' || searchQuery || typeFilter !== 'all' || priorityFilter !== 'all') && (
                <button
                  onClick={() => {
                    setFilter('all')
                    setTypeFilter('all')
                    setPriorityFilter('all')
                    setSearchQuery('')
                    setCurrentPage(1)
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
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
                      // Auto-scroll to highlighted notification with delay
                      setTimeout(() => {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      }, 200)
                    }
                  } : undefined}
                  className={`p-4 ${index !== notifications.length - 1 ? 'border-b border-slate-200/50 dark:border-slate-700/50' : ''} hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-500 ${
                    !notification.read_at ? 'bg-red-50/30 dark:bg-red-900/10' : ''
                  } ${isSelected ? 'bg-red-100/50 dark:bg-red-900/20' : ''} ${
                    isHighlighted ? 'bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/40 dark:to-purple-900/40 border-2 border-blue-500/60 dark:border-blue-400/60 shadow-2xl scale-[1.02] ring-4 ring-blue-300/30 dark:ring-blue-500/30 animate-pulse rounded-lg' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Selection Checkbox */}
                    <div className="pt-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(notification.id)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-red-600 focus:ring-red-500 focus:ring-2"
                      />
                    </div>

                    {/* Enhanced Icon */}
                    <div className={getCategoryStyle(notification.type, notification.priority || 'low')}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    {/* Enhanced Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
                              {notification.title}
                            </h3>
                            <span className={getPriorityBadge(notification.priority || 'low')}>
                              {notification.priority?.toUpperCase() || 'LOW'}
                            </span>
                            {!notification.read_at && (
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(notification.created_at!)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {notification.category || 'general'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              {notification.type.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                              onClick={() => handleViewDetails(notification)}
                              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                          </button>
                          {!notification.read_at && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-green-600 dark:hover:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                              title="Mark as read"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                            title="Delete notification"
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

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm font-medium"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 7) {
                  pageNum = i + 1
                } else {
                  if (currentPage <= 4) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i
                  } else {
                    pageNum = currentPage - 3 + i
                  }
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-12 h-12 rounded-xl font-medium transition-all duration-200 ${
                      pageNum === currentPage
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                        : 'bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
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
              className="px-6 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm font-medium"
            >
              Next
            </button>
          </div>
        )}
      </div>
  )
} 
