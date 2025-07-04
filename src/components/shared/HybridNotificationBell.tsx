'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Bell, X, Eye, Trash2, CheckCheck, Crown, Megaphone, DollarSign, 
  Award, Users, Shield, BookOpen, Clock,     
  Settings,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase'
import MobileNotificationModal from './MobileNotificationModal'

type Notification = Tables<'notifications'>

interface HybridNotificationBellProps {
  userId: string
  userRole?: string
}

export default function HybridNotificationBell({ userId, userRole }: HybridNotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentLimit, setCurrentLimit] = useState(15)
  const [isMobile, setIsMobile] = useState(false)
  
  const supabase = createClient()

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fetch notifications with load more support
  const fetchNotifications = useCallback(async (limit: number = 15, append: boolean = false, silent: boolean = false) => {
    try {
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
    await fetchNotifications(newLimit, false, false)
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
      
      const deletedNotification = notifications.find(n => n.id === notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      
      if (deletedNotification && !deletedNotification.read_at) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    const iconMap: Record<string, React.ElementType> = {
      course_completed: BookOpen,
      certificate_ready: Award,
      commission_earned: DollarSign,
      announcement: Megaphone,
      admin_invitation: Crown,
      security_alert: Shield,
      system_maintenance: Settings,
      new_user_signup: Users
    }
    return iconMap[type] || Bell
  }

  // Get category styling for notifications
  const getCategoryStyle = (type: string) => {
    const styleMap: Record<string, { bg: string, icon: string, border: string }> = {
      security_alert: { 
        bg: 'bg-gradient-to-br from-red-500/10 to-red-600/10', 
        icon: 'text-red-600 dark:text-red-400',
        border: 'border-l-red-500'
      },
      admin_invitation: { 
        bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/10', 
        icon: 'text-purple-600 dark:text-purple-400',
        border: 'border-l-purple-500'
      },
      commission_earned: { 
        bg: 'bg-gradient-to-br from-green-500/10 to-green-600/10', 
        icon: 'text-green-600 dark:text-green-400',
        border: 'border-l-green-500'
      },
      course_completed: { 
        bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/10', 
        icon: 'text-blue-600 dark:text-blue-400',
        border: 'border-l-blue-500'
      },
      certificate_ready: { 
        bg: 'bg-gradient-to-br from-amber-500/10 to-amber-600/10', 
        icon: 'text-amber-600 dark:text-amber-400',
        border: 'border-l-amber-500'
      },
      announcement: { 
        bg: 'bg-gradient-to-br from-indigo-500/10 to-indigo-600/10', 
        icon: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-l-indigo-500'
      },
      system_maintenance: { 
        bg: 'bg-gradient-to-br from-orange-500/10 to-orange-600/10', 
        icon: 'text-orange-600 dark:text-orange-400',
        border: 'border-l-orange-500'
      }
    }
    
    return styleMap[type] || { 
      bg: 'bg-gradient-to-br from-slate-500/10 to-slate-600/10', 
      icon: 'text-slate-600 dark:text-slate-400',
      border: 'border-l-slate-500'
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

  // Handle notification click to navigate to full view
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

  // Subscribe to real-time updates and fetch notifications on mount
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
        // Always silent for polling
        fetchNotifications(15, false, true) // Always silent for polling
      }
    }, 5000)
      supabase.removeChannel(channel)
    return () => {
      clearInterval(pollInterval)
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

      {/* Desktop Dropdown */}
      {isOpen && !isMobile && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-3 w-[420px] bg-white dark:bg-slate-900 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 max-h-[520px] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl">
                  <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{unreadCount} unread</p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-full shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="p-5 space-y-5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 animate-pulse">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-xl"></div>
                      <div className="flex-1 space-y-3">
                        <div className="space-y-2">
                          <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-lg w-3/4 animate-shimmer"></div>
                          <div className="h-3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded w-full animate-shimmer"></div>
                          <div className="h-3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded w-2/3 animate-shimmer"></div>
                        </div>
                        <div className="h-3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded w-1/3 animate-shimmer"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">No notifications yet</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">When you receive notifications, they&apos;ll appear here</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type)
                  const categoryStyle = getCategoryStyle(notification.type)
                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-5 border-b border-slate-100/50 dark:border-slate-800/50 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all duration-300 group cursor-pointer ${
                        !notification.read_at ? `bg-gradient-to-r from-white/60 to-transparent dark:from-slate-800/30 ${categoryStyle.border} border-l-4` : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${categoryStyle.bg} flex items-center justify-center shadow-sm ring-1 ring-white/20 dark:ring-slate-700/50`}>
                          <IconComponent className={`w-6 h-6 ${categoryStyle.icon}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                                  {notification.title}
                                </h4>
                                {!notification.read_at && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                <Clock className="w-3 h-3" />
                                {formatRelativeTime(notification.created_at!)}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {!notification.read_at && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    markAsRead(notification.id)
                                  }}
                                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                                  title="Mark as read"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                                className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
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
            </div>
          </div>
        </>
      )}

      {/* Mobile Modal */}
      <MobileNotificationModal
        isOpen={isOpen && isMobile}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onMarkAllRead={markAllAsRead}
        onMarkAsRead={markAsRead}
        onDeleteNotification={deleteNotification}
        onLoadMore={loadMoreNotifications}
        userRole={userRole}
      />
    </div>
  )
} 
