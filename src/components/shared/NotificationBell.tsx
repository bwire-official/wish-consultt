'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Bell, X, CheckCircle, Trash2, CheckCheck, Crown, Megaphone, DollarSign, 
  Award, Users, Shield, TrendingUp, BookOpen, Clock, Check,
  UserPlus, Settings, FileText
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase'

type Notification = Tables<'notifications'>

interface NotificationBellProps {
  userId: string
  userRole?: string
}

export default function NotificationBell({ userId, userRole }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentLimit, setCurrentLimit] = useState(15)
  
  const supabase = createClient()

  // Fetch notifications with optional silent mode
  const fetchNotifications = useCallback(async (limit: number = 15, append: boolean = false, silent: boolean = false) => {
    try {
      // Only show loading state if not silent and not appending
      if (!silent && !append) setLoading(true)
      else if (!silent && append) setLoadingMore(true)

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      
      if (append) {
        setNotifications(prev => [...prev, ...(data || [])])
      } else {
        setNotifications(data || [])
      }
      
      // Check if there are more notifications
      setHasMore((data || []).length === limit)
      
      // Count unread
      const unread = (data || []).filter((n: Notification) => !n.read_at).length
      if (!append) setUnreadCount(unread)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      if (!silent) {
        if (!append) setLoading(false)
        else setLoadingMore(false)
      }
    }
  }, [userId, supabase])

  // Load more notifications
  const loadMoreNotifications = async () => {
    const newLimit = currentLimit + 15
    setCurrentLimit(newLimit)
    await fetchNotifications(newLimit, false, false) // Not silent for user-initiated action
  }

  // Mark as read
  const markAsRead = async (notificationId: number) => {
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
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
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
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  // Delete notification
  const deleteNotification = async (notificationId: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId)

      if (error) throw error
      
      // Update local state
      const deletedNotification = notifications.find(n => n.id === notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      
      if (deletedNotification && !deletedNotification.read_at) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // Get proper icon component for notification type
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

  // Get notification category styling
  const getCategoryStyle = (type: string, priority: string) => {
    const baseStyle = "w-10 h-10 rounded-full flex items-center justify-center"
    
    if (priority === 'high') {
      return `${baseStyle} bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg`
    } else if (priority === 'medium') {
      return `${baseStyle} bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg`
    } else {
      return `${baseStyle} bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-lg`
    }
  }

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    const baseStyle = "px-2 py-1 rounded-full text-xs font-medium"
    
    switch (priority) {
      case 'high':
        return `${baseStyle} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`
      case 'medium':
        return `${baseStyle} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`
      default:
        return `${baseStyle} bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300`
    }
  }

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
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

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if unread
    if (!notification.read_at) {
      markAsRead(notification.id)
    }
    
    // Navigate to appropriate notifications page based on user role
    const notificationPages = {
      admin: '/admin/notifications',
      student: '/dashboard/notifications', 
      affiliate: '/affiliate/dashboard/notifications'
    }
    
    const basePage = notificationPages[userRole as keyof typeof notificationPages] || '/dashboard/notifications'
    window.location.href = `${basePage}?highlight=${notification.id}`
    setIsOpen(false)
  }

  // Handle contextual actions
  const handleNotificationAction = (notification: Notification, action: string) => {
    // Mark as read first
    if (!notification.read_at) {
      markAsRead(notification.id)
    }

    switch (action) {
      case 'navigate':
        if (notification.action_url) {
          window.location.href = notification.action_url
        }
        break
      case 'accept_invitation':
        // Handle admin invitation acceptance
        console.log('Accepting invitation:', notification.id)
        // TODO: Implement invitation acceptance
        break
      case 'decline_invitation':
        // Handle admin invitation decline
        console.log('Declining invitation:', notification.id)
        // TODO: Implement invitation decline
        break
      default:
        break
    }
    
    setIsOpen(false)
  }

  // Get contextual action buttons
  const getActionButtons = (notification: Notification) => {
    if (notification.type === 'admin_invitation' && !notification.read_at) {
      return (
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNotificationAction(notification, 'accept_invitation')
            }}
            className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            Accept
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNotificationAction(notification, 'decline_invitation')
            }}
            className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Decline
          </button>
        </div>
      )
    }

    // Removed View Details button since notifications are now clickable
    return null
  }

  // Subscribe to real-time updates
  useEffect(() => {
    fetchNotifications()

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        () => {
          // Use silent updates when dropdown is open to avoid disrupting user experience
          fetchNotifications(15, false, isOpen)
        }
      )
      .subscribe()

    // Smart polling - only poll when dropdown is closed, and always silent
    const pollInterval = setInterval(() => {
      // Only poll when dropdown is closed to avoid disrupting user experience
      if (!isOpen) {
        fetchNotifications(15, false, true) // Always silent for polling
      }
    }, 5000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(pollInterval)
    }
  }, [userId, isOpen, fetchNotifications, supabase]) // Add isOpen to dependencies so polling respects dropdown state

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 group"
      >
        <Bell className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Panel */}
          <div className="absolute right-0 mt-3 w-[420px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 z-50 max-h-[480px] overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {loading ? (
                // Loading skeleton
                <div className="p-5 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 animate-pulse">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                  </div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">No notifications yet</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">When you receive notifications, they&apos;ll appear here</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type)
                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer ${
                        !notification.read_at ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={getCategoryStyle(notification.type, notification.priority || 'low')}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                                  {notification.title}
                                </h4>
                                <span className={getPriorityBadge(notification.priority || 'low')}>
                                  {notification.priority?.toUpperCase() || 'LOW'}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                  <Clock className="w-3 h-3" />
                                  {formatRelativeTime(notification.created_at!)}
                                </div>
                                {!notification.read_at && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                )}
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              {!notification.read_at && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    markAsRead(notification.id)
                                  }}
                                  className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-green-600 dark:hover:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                                  title="Mark as read"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                                className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Contextual Action Buttons */}
                          {getActionButtons(notification)}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Load More Button */}
            {hasMore && notifications.length >= 15 && (
              <div className="p-3 border-t border-slate-200/50 dark:border-slate-700/50">
                <button
                  onClick={loadMoreNotifications}
                  disabled={loadingMore}
                  className="w-full px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600 dark:border-slate-400"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      Load older notifications
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Footer - Only show if we have notifications */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                <button 
                  className="w-full text-sm text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                  onClick={() => {
                    setIsOpen(false)
                    // Navigate to proper notifications page based on user role
                    const notificationPages = {
                      admin: '/admin/notifications',
                      student: '/dashboard/notifications', 
                      affiliate: '/affiliate/dashboard/notifications'
                    }
                    window.location.href = notificationPages[userRole as keyof typeof notificationPages] || '/dashboard/notifications'
                  }}
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
} 