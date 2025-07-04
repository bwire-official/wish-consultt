'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { ButtonLoader } from '@/components/ui/loaders'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Archive,
  RefreshCw,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Calendar,
  Tag,
  User,
  Flag,
  AlertTriangle,
  Check,
  MessageSquare,
  FileText,
  Send,
  Megaphone,
  CheckSquare
} from 'lucide-react'
import { AdminAnnouncement, getAdminAnnouncements } from '@/app/admin/actions'
import { 
  publishAdminAnnouncement, 
  deleteAdminAnnouncement,
  archiveAdminAnnouncement 
} from '@/app/admin/actions'
import { createPortal } from 'react-dom'
import { createClient } from '@/lib/supabase/client'

export function AnnouncementsClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get URL parameters
  const searchQuery = searchParams.get('search') || ''
  const statusFilter = searchParams.get('status') || 'all'
  const priorityFilter = searchParams.get('priority') || 'all'
  const audienceFilter = searchParams.get('audience') || 'all'
  const currentPage = parseInt(searchParams.get('page') || '1')
  
  // State management
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
    from: 1,
    to: 20
  })
  const [loading, setLoading] = useState(true)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showArchivedModal, setShowArchivedModal] = useState(false)
  const [showDraftsModal, setShowDraftsModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AdminAnnouncement | null>(null)
  const [archivedAnnouncements, setArchivedAnnouncements] = useState<AdminAnnouncement[]>([])
  const [draftAnnouncements, setDraftAnnouncements] = useState<AdminAnnouncement[]>([])
  const [archivedCount, setArchivedCount] = useState(0)
  const [draftsCount, setDraftsCount] = useState(0)
  const [actionLoading, setActionLoading] = useState<number | string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const [confirmMessage, setConfirmMessage] = useState('')
  const [archivedSearchQuery, setArchivedSearchQuery] = useState('')
  const [draftsSearchQuery, setDraftsSearchQuery] = useState('')
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)

  // Enhanced state for bulk actions
  const [selectedAnnouncements, setSelectedAnnouncements] = useState<Set<number>>(new Set())
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false)
  
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  // Load announcements function (extracted for reuse and wrapped in useCallback)
  const loadAnnouncements = useCallback(async () => {
    try {
      setLoading(true)
      const { announcements: fetchedAnnouncements, pagination: fetchedPagination } = await getAdminAnnouncements(
        searchQuery || undefined,
        currentPage,
        20,
        statusFilter !== 'all' ? statusFilter : undefined,
        priorityFilter !== 'all' ? priorityFilter : undefined,
        audienceFilter !== 'all' ? audienceFilter : undefined
      )
      setAnnouncements(fetchedAnnouncements)
      setPagination(fetchedPagination)
    } catch (error) {
      console.error('Error loading announcements:', error)
      showNotification('error', 'Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, currentPage, statusFilter, priorityFilter, audienceFilter]) // Dependencies for useCallback

  // Load announcements based on URL parameters
  useEffect(() => {
    loadAnnouncements()
  }, [loadAnnouncements]) // Now depends on the stable loadAnnouncements function

  // Real-time subscriptions for live updates (without excessive polling)
  useEffect(() => {
    // Load initial data
    loadAnnouncements()

    // Set up real-time subscription to announcements table for instant updates
    const supabase = createClient()
    const channel = supabase
      .channel('announcements-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements'
        },
        (payload) => {
          // Show notification for status changes
          if (payload.eventType === 'UPDATE' && payload.new && payload.old) {
            const oldStatus = payload.old.status
            const newStatus = payload.new.status
            const title = payload.new.title
            
            if (oldStatus !== newStatus) {
              if (newStatus === 'published' && oldStatus === 'scheduled') {
                showNotification('success', `📢 "${title}" was automatically published!`)
              }
            }
          }
          
          // Reload data to reflect changes instantly
          loadAnnouncements()
        }
      )
      .subscribe()

    // Cleanup function - only real-time subscription, no polling
    return () => {
      console.log('🧹 Cleaning up real-time subscriptions...')
      supabase.removeChannel(channel)
    }
  }, [loadAnnouncements]) // Dependency added here

  // Load archived count on component mount
  useEffect(() => {
    const loadArchivedCount = async () => {
      try {
        const { announcements: archived } = await getAdminAnnouncements(undefined, 1, 1000, 'archived')
        setArchivedCount(archived.length)
      } catch (error) {
        console.error('Error loading archived count:', error)
      }
    }

    const loadDraftsCount = async () => {
      try {
        const { announcements: drafts } = await getAdminAnnouncements(undefined, 1, 1000, 'draft')
        setDraftsCount(drafts.length)
      } catch (error) {
        console.error('Error loading drafts count:', error)
      }
    }

    loadArchivedCount()
    loadDraftsCount()
  }, []) // This effect doesn't need loadAnnouncements

  const handleViewArchived = async () => {
    try {
      const archived = announcements.filter(a => a.status === 'archived')
      setArchivedAnnouncements(archived)
      setShowArchivedModal(true)
    } catch (error) {
      console.error('Error loading archived announcements:', error)
      showNotification('error', 'Failed to load archived announcements')
    }
  }

  const handleViewDrafts = async () => {
    try {
      const drafts = announcements.filter(a => a.status === 'draft')
      setDraftAnnouncements(drafts)
      setShowDraftsModal(true)
    } catch (error) {
      console.error('Error loading draft announcements:', error)
      showNotification('error', 'Failed to load draft announcements')
    }
  }

  const handleRepublish = async (id: number) => {
    setActionLoading(id)
    try {
      await publishAdminAnnouncement(id)
      showNotification('success', 'Announcement republished successfully!')
      // Refresh data
      await loadAnnouncements()
      // Reload counts
      const { announcements: archived } = await getAdminAnnouncements(undefined, 1, 1000, 'archived')
      setArchivedCount(archived.length)
    } catch (error) {
      console.error('Error republishing announcement:', error)
      showNotification('error', 'Failed to republish announcement')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set('search', query)
    } else {
      params.delete('search')
    }
    params.delete('page')
    router.push(`/admin/announcements?${params.toString()}`)
  }

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`/admin/announcements?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/admin/announcements?${params.toString()}`)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Actually reload the data instead of just using router.refresh()
      await loadAnnouncements()
      
      // Also reload counts
      const { announcements: archived } = await getAdminAnnouncements(undefined, 1, 1000, 'archived')
      setArchivedCount(archived.length)
      const { announcements: drafts } = await getAdminAnnouncements(undefined, 1, 1000, 'draft')
      setDraftsCount(drafts.length)
      
      showNotification('success', 'Data refreshed successfully!')
    } catch (error) {
      console.error('Error refreshing data:', error)
      showNotification('error', 'Failed to refresh data')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handlePublish = async (id: number) => {
    setActionLoading(id)
    try {
      const result = await publishAdminAnnouncement(id)
      
      // Display debug information
      if (result.debug) {
        console.log('🔍 NOTIFICATION DEBUG INFO:')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(`📢 Title: ${result.debug.title}`)
        console.log(`🎯 Target Audience: ${result.debug.target_audience}`)
        console.log(`✅ Notifications Created: ${result.debug.notificationsCreated}`)
        console.log('📋 Debug Details:')
        result.debug.errors.forEach(msg => console.log(`   ${msg}`))
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      }
      
      showNotification('success', `Announcement published successfully! ${result.debug?.notificationsCreated || 0} notifications sent.`)
      await loadAnnouncements() // Reload data instead of router.refresh()
    } catch (error: unknown) {
      console.error('Error publishing announcement:', error)
      if (error instanceof Error) {
        if (error.message?.includes('Unauthorized') || error.message?.includes('access')) {
          showNotification('error', 'Session expired. Please log in again.')
          router.push('/admin/login')
        } else {
          showNotification('error', 'Failed to publish announcement. Please try again.')
        }
      } else {
        showNotification('error', 'An unknown error occurred while publishing.')
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = (id: number) => {
    setConfirmMessage('Are you sure you want to delete this announcement? This action cannot be undone.')
    setConfirmAction(() => async () => {
      setDeleteLoading(id)
      try {
        await deleteAdminAnnouncement(id)
        showNotification('success', 'Announcement deleted successfully!')
        await loadAnnouncements() // Reload data instead of router.refresh()
      } catch (error: unknown) {
        console.error('Error deleting announcement:', error)
        if (error instanceof Error) {
          if (error.message?.includes('Unauthorized') || error.message?.includes('access')) {
            showNotification('error', 'Session expired. Please log in again.')
            router.push('/admin/login')
          } else {
            showNotification('error', 'Failed to delete announcement. Please try again.')
          }
        } else {
          showNotification('error', 'An unknown error occurred while deleting.')
        }
      } finally {
        setDeleteLoading(null)
        setShowConfirmModal(false)
      }
    })
    setShowConfirmModal(true)
  }

  const handleArchive = (id: number) => {
    setConfirmMessage('Are you sure you want to archive this announcement?')
    setConfirmAction(() => async () => {
      setActionLoading(id)
      try {
        const result = await archiveAdminAnnouncement(id)
        console.log('Archive result:', result)
        showNotification('success', 'Announcement archived successfully!')
        await loadAnnouncements() // Reload data instead of router.refresh()
        
        // Update archived count
        const { announcements: archived } = await getAdminAnnouncements(undefined, 1, 1000, 'archived')
        setArchivedCount(archived.length)
      } catch (error: unknown) {
        console.error('Error archiving announcement:', error)
        if (error instanceof Error) {
          if (error.message?.includes('Unauthorized') || error.message?.includes('access')) {
            showNotification('error', 'Session expired. Please log in again.')
            router.push('/admin/login')
          } else {
            showNotification('error', 'Failed to archive announcement. Please try again.')
          }
        } else {
          showNotification('error', 'An unknown error occurred while archiving.')
        }
      } finally {
        setActionLoading(null)
        setShowConfirmModal(false)
      }
    })
    setShowConfirmModal(true)
  }

  const executeConfirmAction = () => {
    confirmAction?.()
  }

  const handleViewDetails = (announcement: AdminAnnouncement) => {
    setSelectedAnnouncement(announcement)
    setShowViewModal(true)
  }

  // Helper functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-700'
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700'
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700'
    }
  }

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'all': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-700'
      case 'students': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700'
      case 'affiliates': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700'
      case 'admins': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300 border-gray-200 dark:border-gray-700'
      case 'user': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-700'
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-500" />
      case 'draft': return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'archived': return <Archive className="h-4 w-4 text-gray-500" />
      default: return null
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="h-3 w-3" />
      case 'high': return <Flag className="h-3 w-3" />
      case 'medium': return <Flag className="h-3 w-3" />
      case 'low': return <Flag className="h-3 w-3" />
      default: return <Flag className="h-3 w-3" />
    }
  }

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date'
    
    // Create date object from the ISO string (which is in UTC)
    const date = new Date(dateString)
    
    // Convert to local time and format
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short' // This will show the timezone
    })
  }

  // Filter functions for search
  const filteredArchivedAnnouncements = archivedAnnouncements.filter(announcement =>
    archivedSearchQuery === '' || 
    announcement.title.toLowerCase().includes(archivedSearchQuery.toLowerCase()) ||
    announcement.content.toLowerCase().includes(archivedSearchQuery.toLowerCase())
  )

  const filteredDraftAnnouncements = draftAnnouncements.filter(announcement =>
    draftsSearchQuery === '' || 
    announcement.title.toLowerCase().includes(draftsSearchQuery.toLowerCase()) ||
    announcement.content.toLowerCase().includes(draftsSearchQuery.toLowerCase())
  )

  // Bulk selection functions
  const handleSelectAll = () => {
    if (isSelectAllChecked) {
      setSelectedAnnouncements(new Set())
    } else {
      const allIds = new Set(announcements.map(a => a.id))
      setSelectedAnnouncements(allIds)
    }
    setIsSelectAllChecked(!isSelectAllChecked)
  }

  const handleSelectAnnouncement = (id: number) => {
    const newSelected = new Set(selectedAnnouncements)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedAnnouncements(newSelected)
    setIsSelectAllChecked(newSelected.size === announcements.length)
  }

  const clearSelection = () => {
    setSelectedAnnouncements(new Set())
    setIsSelectAllChecked(false)
  }

  // Bulk action handlers - Updated to use same confirmation modal as individual actions
  const handleBulkAction = (action: string) => {
    const selectedCount = selectedAnnouncements.size
    
    if (selectedCount === 0) {
      showNotification('error', 'Please select at least one announcement')
      return
    }

    // Use the same confirmation modal as individual actions
    let message = ''
    switch (action) {
      case 'publish':
        message = `Are you sure you want to publish ${selectedCount} announcement${selectedCount !== 1 ? 's' : ''}?`
        break
      case 'archive':
        message = `Are you sure you want to archive ${selectedCount} announcement${selectedCount !== 1 ? 's' : ''}?`
        break
      case 'delete':
        message = `Are you sure you want to delete ${selectedCount} announcement${selectedCount !== 1 ? 's' : ''}? This action cannot be undone.`
        break
      default:
        return
    }
    
    setConfirmMessage(message)
    setConfirmAction(() => async () => {
      // Use actionLoading for bulk operations (set to 'bulk' to indicate bulk operation)
      setActionLoading('bulk')
      const selectedIds = Array.from(selectedAnnouncements)
      let successCount = 0
      let errorCount = 0

      try {
        for (const id of selectedIds) {
          try {
            switch (action) {
              case 'publish':
                await publishAdminAnnouncement(id)
                break
              case 'archive':
                await archiveAdminAnnouncement(id)
                break
              case 'delete':
                await deleteAdminAnnouncement(id)
                break
            }
            successCount++
          } catch (error) {
            console.error(`Error with bulk ${action} for announcement ${id}:`, error)
            errorCount++
          }
        }

        // Show results
        if (successCount > 0) {
          const actionPastTense = action === 'publish' ? 'published' : action + 'ed'
          showNotification('success', `Successfully ${actionPastTense} ${successCount} announcement${successCount !== 1 ? 's' : ''}`)
        }
        if (errorCount > 0) {
          showNotification('error', `Failed to ${action} ${errorCount} announcement${errorCount !== 1 ? 's' : ''}`)
        }

        // Refresh data and clear selection
        await loadAnnouncements()
        clearSelection()
        
        // Update counts
        const { announcements: archived } = await getAdminAnnouncements(undefined, 1, 1000, 'archived')
        setArchivedCount(archived.length)
        const { announcements: drafts } = await getAdminAnnouncements(undefined, 1, 1000, 'draft')
        setDraftsCount(drafts.length)

      } catch (error) {
        console.error('Bulk action error:', error)
        showNotification('error', `Failed to perform bulk ${action}`)
      } finally {
        setActionLoading(null)
        setShowConfirmModal(false)
      }
    })
    setShowConfirmModal(true)
  }



  return (
    <>
      {/* Enhanced Notification Banner with Fixed Positioning */}
      {notification && (
        <div className={`fixed top-20 right-4 z-[9999] max-w-md transition-all duration-500 ease-out transform ${
          notification ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
        }`}>
          <div className={`p-4 rounded-xl shadow-2xl border backdrop-blur-md ${
            notification.type === 'success' 
              ? 'bg-green-50/95 dark:bg-green-900/50 border-green-200 dark:border-green-700'
              : 'bg-red-50/95 dark:bg-red-900/50 border-red-200 dark:border-red-700'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                notification.type === 'success' 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`}>
                {notification.type === 'success' ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${
                  notification.type === 'success' 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {notification.type === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className={`text-xs ${
                  notification.type === 'success' 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className={`p-1 rounded-lg transition-colors ${
                  notification.type === 'success' 
                    ? 'hover:bg-green-200 dark:hover:bg-green-800' 
                    : 'hover:bg-red-200 dark:hover:bg-red-800'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Action Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
        
        {/* Archived Button with Professional Badge */}
        <button
          onClick={handleViewArchived}
          className="relative inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm"
        >
          <Archive className="h-5 w-5 mr-2" />
          Archived
          {archivedCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white bg-orange-500 rounded-full shadow-md">
              {archivedCount}
            </span>
          )}
        </button>
        
        {/* Drafts Button with Professional Badge */}
        <button
          onClick={handleViewDrafts}
          className="relative inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm"
        >
          <FileText className="h-5 w-5 mr-2" />
          Drafts
          {draftsCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white bg-yellow-500 rounded-full shadow-md">
              {draftsCount}
            </span>
          )}
        </button>
        
        <div className="flex-1"></div>
        
        <a
          href="/admin/announcements/create"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Announcement
        </a>
      </div>

      {/* Compact Professional Filters Section */}
      <GlassCard className="p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Search Announcements
            </label>
            <div className="relative">
              <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, content, or keywords..."
                defaultValue={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-6 pr-4 py-2 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-600/60 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-blue-500/50 outline-none backdrop-blur-sm font-medium min-w-[100px] cursor-pointer text-sm"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-600/60 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-blue-500/50 outline-none backdrop-blur-sm font-medium min-w-[100px] cursor-pointer text-sm"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Audience
              </label>
              <select
                value={audienceFilter}
                onChange={(e) => handleFilterChange('audience', e.target.value)}
                className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-600/60 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-blue-500/50 outline-none backdrop-blur-sm font-medium min-w-[110px] cursor-pointer text-sm"
              >
                <option value="all">All Audience</option>
                <option value="all">All Users</option>
                <option value="students">Students</option>
                <option value="affiliates">Affiliates</option>
                <option value="admins">Admins</option>
                <option value="user">Specific User</option>
              </select>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Bulk Actions Bar - Show when items are selected */}
      {selectedAnnouncements.size > 0 && (
        <GlassCard className="p-4 mb-4 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-slate-900 dark:text-white">
                  {selectedAnnouncements.size} announcement{selectedAnnouncements.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <button
                onClick={clearSelection}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Clear selection
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Bulk Publish */}
              <button
                onClick={() => handleBulkAction('publish')}
                disabled={actionLoading === 'bulk'}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'bulk' ? (
                  <>
                    <ButtonLoader className="w-4 h-4 mr-1" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Publish
                  </>
                )}
              </button>
              
              {/* Bulk Archive */}
              <button
                onClick={() => handleBulkAction('archive')}
                disabled={actionLoading === 'bulk'}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'bulk' ? (
                  <>
                    <ButtonLoader className="w-4 h-4 mr-1" />
                    Archiving...
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </>
                )}
              </button>
              
              {/* Bulk Delete */}
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={actionLoading === 'bulk'}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'bulk' ? (
                  <>
                    <ButtonLoader className="w-4 h-4 mr-1" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Announcements Table */}
      <div className="space-y-4">
        {loading ? (
          <GlassCard className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Loading announcements...
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Please wait while we fetch the latest announcements
            </p>
          </GlassCard>
        ) : announcements.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Megaphone className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No announcements found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || audienceFilter !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Create your first announcement to get started.'}
            </p>
            <a
              href="/admin/announcements/create"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First Announcement
            </a>
          </GlassCard>
        ) : (
          <GlassCard className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white w-12">
                      <input
                        type="checkbox"
                        checked={isSelectAllChecked}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-0"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Announcement</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Priority</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Audience</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Created</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map((announcement) => (
                    <tr key={announcement.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedAnnouncements.has(announcement.id)}
                          onChange={() => handleSelectAnnouncement(announcement.id)}
                          className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-0"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                            <Megaphone className="h-5 w-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white truncate leading-tight">
                              {announcement.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                              {truncateContent(announcement.content, 100)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {announcement.views !== null && (
                                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                  <Eye className="h-3 w-3" />
                                  <span>{announcement.views} views</span>
                                </div>
                              )}
                              {announcement.status === 'scheduled' && announcement.scheduled_for && (
                                <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                  <Clock className="h-3 w-3" />
                                  <span>Scheduled: {formatDate(announcement.scheduled_for)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          announcement.status === 'published' ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700/50' :
                          announcement.status === 'scheduled' ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700/50' :
                          announcement.status === 'draft' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700/50' :
                          'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700/50'
                        }`}>
                          {getStatusIcon(announcement.status || 'draft')}
                          <span className="capitalize">{announcement.status || 'draft'}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          announcement.priority === 'urgent' ? 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50' :
                          announcement.priority === 'high' ? 'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700/50' :
                          announcement.priority === 'medium' ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700/50' :
                          'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-700/50'
                        }`}>
                          {getPriorityIcon(announcement.priority || 'low')}
                          <span className="capitalize">{announcement.priority || 'low'}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          announcement.target_audience === 'all' ? 'bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700/50' :
                          announcement.target_audience === 'students' ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700/50' :
                          announcement.target_audience === 'affiliates' ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700/50' :
                          announcement.target_audience === 'admins' ? 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50' :
                          'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-700/50'
                        }`}>
                          <Users className="h-3 w-3" />
                          <span className="capitalize">
                            {announcement.target_audience === 'user' ? 'Specific User' : (announcement.target_audience || 'all')}
                          </span>
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          <div className="font-medium">{formatDate(announcement.created_at)}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>by {announcement.created_by_profile?.full_name || announcement.created_by_profile?.email || 'Unknown Admin'}</span>
                          </div>
                          {announcement.updated_at && announcement.updated_at !== announcement.created_at && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              Updated: {formatDate(announcement.updated_at)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(announcement)}
                            className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {announcement.status === 'draft' || announcement.status === 'scheduled' ? (
                            <button
                              onClick={() => handlePublish(announcement.id)}
                              disabled={actionLoading === announcement.id}
                              className="p-2 text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={actionLoading === announcement.id ? "Publishing..." : "Publish"}
                            >
                              {actionLoading === announcement.id ? (
                                <ButtonLoader className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </button>
                          ) : null}
                          
                          {announcement.status !== 'archived' && (
                            <button
                              onClick={() => handleArchive(announcement.id)}
                              disabled={actionLoading === announcement.id}
                              className="p-2 text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={actionLoading === announcement.id ? "Archiving..." : "Archive"}
                            >
                              {actionLoading === announcement.id ? (
                                <ButtonLoader className="w-4 h-4" />
                              ) : (
                                <Archive className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete(announcement.id)}
                            disabled={deleteLoading === announcement.id}
                            className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={deleteLoading === announcement.id ? "Deleting..." : "Delete"}
                          >
                            {deleteLoading === announcement.id ? (
                              <ButtonLoader className="w-4 h-4" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <GlassCard className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span>Showing {pagination.from} to {pagination.to} of {pagination.totalPages * pagination.limit} announcements</span>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <span className="font-medium">Page {pagination.currentPage} of {pagination.totalPages}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-2 text-sm bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = Math.max(1, Math.min(pagination.totalPages - 4, pagination.currentPage - 2)) + i;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                        pagination.currentPage === page
                          ? "bg-blue-500 text-white shadow-lg"
                          : "bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/70 backdrop-blur-sm"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 text-sm bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedAnnouncement && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Eye className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">View Details</h2>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Flag className="h-4 w-4" />
                  <span>Title</span>
                </div>
                <div className="bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white py-2">
                  <h3 className="text-lg font-semibold">{selectedAnnouncement.title}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {getStatusIcon(selectedAnnouncement.status || 'draft')}
                    <span>Status</span>
                  </div>
                  <div className="bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white py-2 text-sm">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${
                      selectedAnnouncement.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700' :
                      selectedAnnouncement.status === 'scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700' :
                      selectedAnnouncement.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                    }`}>
                      {selectedAnnouncement.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {getPriorityIcon(selectedAnnouncement.priority || 'low')}
                    <span>Priority</span>
                  </div>
                  <div className="bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white py-2 text-sm">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(selectedAnnouncement.priority || 'low')}`}>
                      {getPriorityIcon(selectedAnnouncement.priority || 'low')}
                      {selectedAnnouncement.priority || 'low'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <Users className="h-4 w-4" />
                  <span>Audience</span>
                </div>
                <div className="bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white py-2 text-sm">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getAudienceColor(selectedAnnouncement.target_audience || 'all')}`}>
                    {selectedAnnouncement.target_audience === 'user' ? 'Specific User' : (selectedAnnouncement.target_audience || 'all')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <MessageSquare className="h-4 w-4" />
                  <span>Content</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedAnnouncement.content}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <User className="h-4 w-4" />
                    <span>Created By</span>
                  </div>
                  <div className="bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white py-2 text-sm">
                    {selectedAnnouncement.created_by_profile?.full_name || 'Unknown'}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Calendar className="h-4 w-4" />
                    <span>Created Date</span>
                  </div>
                  <div className="bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white py-2 text-sm">
                    {formatDate(selectedAnnouncement.created_at)}
                  </div>
                </div>

                {selectedAnnouncement.scheduled_for && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <Clock className="h-4 w-4" />
                      <span>Scheduled For</span>
                    </div>
                    <div className="bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white py-2 text-sm">
                      {formatDate(selectedAnnouncement.scheduled_for)}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Eye className="h-4 w-4" />
                    <span>Views</span>
                  </div>
                  <div className="bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white py-2 text-sm">
                    {selectedAnnouncement.views || 0} views
                  </div>
                </div>
              </div>

              {selectedAnnouncement.tags && selectedAnnouncement.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Tag className="h-4 w-4" />
                    <span>Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedAnnouncement.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded text-xs"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 p-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Archived Announcements Modal */}
      {showArchivedModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Archive className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Archived Announcements</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {filteredArchivedAnnouncements.length} of {archivedAnnouncements.length} archived announcements
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowArchivedModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search archived announcements..."
                  value={archivedSearchQuery}
                  onChange={(e) => setArchivedSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="p-6">
              {filteredArchivedAnnouncements.length === 0 ? (
                <div className="text-center py-12">
                  <Archive className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {archivedSearchQuery ? 'No matching archived announcements' : 'No archived announcements'}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    {archivedSearchQuery ? 'Try adjusting your search terms.' : 'Archived announcements will appear here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredArchivedAnnouncements.map((announcement) => (
                    <GlassCard key={announcement.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <Archive className="h-4 w-4 text-gray-500" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                              {announcement.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(announcement.priority || 'low')}`}>
                                {getPriorityIcon(announcement.priority || 'low')}
                                {announcement.priority || 'low'}
                              </span>
                              <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getAudienceColor(announcement.target_audience || 'all')}`}>
                                {announcement.target_audience === 'user' ? 'Specific User' : (announcement.target_audience || 'all')}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                            {truncateContent(announcement.content)}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {announcement.created_by_profile?.full_name || 'Unknown'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(announcement.created_at)}
                            </span>
                            {announcement.archived_at && (
                              <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                                <Archive className="h-3 w-3" />
                                Archived: {formatDate(announcement.archived_at)}
                              </span>
                            )}
                            {announcement.views !== null && (
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {announcement.views} views
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {/* View Details Button */}
                          <button
                            onClick={() => handleViewDetails(announcement)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Edit Button */}
                          <a
                            href={`/admin/announcements/create?edit=${announcement.id}`}
                            className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </a>

                          {/* Republish Button */}
                          <button
                            onClick={() => handleRepublish(announcement.id)}
                            disabled={actionLoading === announcement.id}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 focus:ring-2 focus:outline-none focus:ring-blue-300 dark:bg-blue-800 dark:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            {actionLoading === announcement.id ? (
                              <ButtonLoader className="mr-1" />
                            ) : (
                              <Send className="h-3 w-3 mr-1" />
                            )}
                            Republish
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 p-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowArchivedModal(false)}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Drafts Modal */}
      {showDraftsModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Draft Announcements</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {filteredDraftAnnouncements.length} of {draftAnnouncements.length} draft announcements
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDraftsModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search draft announcements..."
                  value={draftsSearchQuery}
                  onChange={(e) => setDraftsSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="p-6">
              {filteredDraftAnnouncements.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {draftsSearchQuery ? 'No matching draft announcements' : 'No draft announcements'}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    {draftsSearchQuery ? 'Try adjusting your search terms.' : 'Draft announcements will appear here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDraftAnnouncements.map((announcement) => (
                    <GlassCard key={announcement.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <FileText className="h-4 w-4 text-yellow-500" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                              {announcement.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(announcement.priority || 'low')}`}>
                                {getPriorityIcon(announcement.priority || 'low')}
                                {announcement.priority || 'low'}
                              </span>
                              <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getAudienceColor(announcement.target_audience || 'all')}`}>
                                {announcement.target_audience === 'user' ? 'Specific User' : (announcement.target_audience || 'all')}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                            {truncateContent(announcement.content)}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {announcement.created_by_profile?.full_name || 'Unknown'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(announcement.created_at)}
                            </span>
                            <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                              <FileText className="h-3 w-3" />
                              Draft
                            </span>
                            {announcement.views !== null && (
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {announcement.views} views
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {/* View Details Button */}
                          <button
                            onClick={() => handleViewDetails(announcement)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Edit/Continue Button */}
                          <a
                            href={`/admin/announcements/create?edit=${announcement.id}`}
                            className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                            title="Continue Editing"
                          >
                            <Edit className="h-4 w-4" />
                          </a>

                          {/* Publish Button */}
                          <button
                            onClick={() => handlePublish(announcement.id)}
                            disabled={actionLoading === announcement.id}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-green-700 bg-green-100 border border-green-300 rounded-lg hover:bg-green-200 focus:ring-2 focus:outline-none focus:ring-green-300 dark:bg-green-800 dark:text-green-300 dark:border-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            {actionLoading === announcement.id ? (
                              <ButtonLoader className="mr-1" />
                            ) : (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            )}
                            Publish
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 p-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowDraftsModal(false)}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Confirm Modal */}
      {showConfirmModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Confirm Action
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                {confirmMessage}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={deleteLoading !== null || actionLoading !== null}
                  className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={executeConfirmAction}
                  disabled={deleteLoading !== null || actionLoading !== null}
                  className={`inline-flex items-center px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    confirmMessage.includes('delete') 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {deleteLoading !== null ? (
                    <>
                      <ButtonLoader className="mr-2" />
                      Deleting...
                    </>
                  ) : actionLoading !== null ? (
                    <>
                      <ButtonLoader className="mr-2" />
                      Archiving...
                    </>
                  ) : (
                    confirmMessage.includes('delete') ? 'Delete' : 'Archive'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
} 