'use client'

import { X, Bell, Clock, Calendar, Hash, User, Shield, BarChart3, Info } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { Tables } from '@/types/supabase'

type Notification = Tables<'notifications'>

interface NotificationDetailModalProps {
  notification: Notification | null
  isOpen: boolean
  onClose: () => void
  userRole?: string
}

export default function NotificationDetailModal({ notification, isOpen, onClose, userRole = 'student' }: NotificationDetailModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted || !notification) return null

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isAdmin = userRole === 'admin'

  const detailItems = [
    ...(isAdmin ? [
      { icon: Hash, label: 'Notification ID', value: notification.id },
      { icon: User, label: 'User ID', value: notification.user_id },
    ] : []),
    { icon: Shield, label: 'Priority', value: notification.priority || 'N/A' },
    { icon: BarChart3, label: 'Category', value: notification.category || 'N/A' },
    { icon: Info, label: 'Type', value: notification.type },
    { icon: Clock, label: 'Created At', value: formatTimestamp(notification.created_at) },
    ...(isAdmin ? [
      { icon: Clock, label: 'Updated At', value: formatTimestamp(notification.updated_at) },
      { icon: Calendar, label: 'Expires At', value: formatTimestamp(notification.expires_at) },
      { icon: Clock, label: 'Read At', value: formatTimestamp(notification.read_at) },
    ] : []),
  ]

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl m-4 max-h-[90vh] flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{notification.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Notification Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-6">
            {/* Main Message */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                {notification.type === 'announcement' ? 'Announcement Content' : 'Message'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg whitespace-pre-wrap">
                {notification.message}
              </p>
            </div>

            {/* Details Grid */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detailItems.map((item, index) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg flex items-start gap-3">
                    <item.icon className="w-5 h-5 text-slate-500 dark:text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
                      <p className="text-base font-semibold text-slate-800 dark:text-slate-200 break-all">{String(item.value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata (JSON) - Admin only */}
            {isAdmin && notification.metadata && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Metadata</h3>
                <pre className="bg-slate-900 text-slate-200 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{JSON.stringify(notification.metadata, null, 2)}</code>
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
} 