'use client'

import { 
  X, Bell, CheckCircle, Trash2, CheckCheck, Crown, Megaphone, DollarSign, 
  Award, Users, Shield, TrendingUp, BookOpen, Clock, Check, UserPlus, Settings, FileText
} from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { Tables } from '@/types/supabase'

type Notification = Tables<'notifications'>

interface MobileNotificationModalProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  onMarkAllRead: () => void
  onMarkAsRead: (id: number) => void
  onDeleteNotification: (id: number) => void
  onLoadMore: () => void
  userRole?: string
}

export default function MobileNotificationModal({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  loading,
  loadingMore,
  hasMore,
  onMarkAllRead,
  onMarkAsRead,
  onDeleteNotification,
  onLoadMore,
  userRole
}: MobileNotificationModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null

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

  // Handle notification click to navigate to full view
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if unread
    if (!notification.read_at) {
      onMarkAsRead(notification.id)
    }
    
    // Navigate to appropriate notifications page based on user role
    const notificationPages = {
      admin: '/admin/notifications',
      student: '/dashboard/notifications', 
      affiliate: '/affiliate/dashboard/notifications'
    }
    
    const basePage = notificationPages[userRole as keyof typeof notificationPages] || '/dashboard/notifications'
    window.location.href = `${basePage}?highlight=${notification.id}`
    onClose()
  }

  // Handle contextual actions
  const handleNotificationAction = (notification: Notification, action: string) => {
    // Mark as read first
    if (!notification.read_at) {
      onMarkAsRead(notification.id)
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
    
    onClose()
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

    return null
  }

  return createPortal(
    <>
      {/* Backdrop - Dark and solid */}
      <div 
        className="fixed inset-0 bg-black/60 z-30"
        onClick={onClose}
      />
      
      {/* Modal - Solid background, proper height */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl border-t border-slate-200 dark:border-slate-700 animate-slide-up max-h-[60vh] mt-16 flex flex-col">
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between flex-shrink-0 bg-gradient-to-r from-white/5 to-transparent dark:from-slate-800/20">
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
                onClick={onMarkAllRead}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {loading ? (
            <div className="p-4 space-y-4">
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
            <div>
              {notifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type)
                
                return (
                  <div
                    key={notification.id} onClick={() => handleNotificationClick(notification)}
                    className={`p-4 cursor-pointer border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 ${
                      !notification.read_at ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl ${getCategoryStyle(notification.type).bg} flex items-center justify-center shadow-sm ring-1 ring-white/20 dark:ring-slate-700/50`}>
                        <IconComponent className={`w-6 h-6 ${getCategoryStyle(notification.type).icon}`} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
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
                          <div className="flex items-center gap-1 justify-end">
                            {!notification.read_at && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onMarkAsRead(notification.id)
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
                                onDeleteNotification(notification.id)
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
              })}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {hasMore && notifications.length >= 15 && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
            <button
              onClick={onLoadMore}
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
          <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0">
            <button 
              className="w-full text-sm text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              onClick={() => {
                onClose()
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
    </>,
    document.body
  )
} 

