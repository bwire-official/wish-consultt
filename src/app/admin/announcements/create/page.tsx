'use client'

import { useState } from 'react'
import { Send, Users, User, Crown, BookOpen, AlertCircle, Calendar, Star, Search, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { GlassCard } from '@/components/ui/glass-card'
import { InlineLoader, ButtonLoader } from '@/components/ui/loaders'
import { createAdminAnnouncement, searchUsersForAnnouncements } from '@/app/admin/actions/announcements'
import { TablesInsert } from '@/types/supabase'

interface SearchedUser {
  id: string;
  full_name: string | null;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string;
}

export default function CreateAnnouncementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [draftLoading, setDraftLoading] = useState(false)
  const [publishLoading, setPublishLoading] = useState(false)
  const [scheduleLoading, setScheduleLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
    target_audience: 'all',
    target_user_id: '',
    scheduled_for: '',
    tags: [] as string[],
    status: 'draft'
  })

  const [newTag, setNewTag] = useState('')
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  
  // User search state
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedUser, setSelectedUser] = useState<SearchedUser | null>(null)
  const [showResults, setShowResults] = useState(false)
  
  // Scheduling state
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [scheduledDateTime, setScheduledDateTime] = useState('')

  // Separate handlers for each button to prevent cross-triggering
  const handleDraftSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (loading || draftLoading || publishLoading || scheduleLoading) {
      return
    }
    
    setDraftLoading(true)
    setLoading(true)
    await handleSubmit(e as unknown as React.FormEvent, 'draft')
  }

  const handlePublishSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (loading || draftLoading || publishLoading || scheduleLoading) {
      return
    }
    
    setPublishLoading(true)
    setLoading(true)
    await handleSubmit(e as unknown as React.FormEvent, 'publish')
  }

  const handleScheduleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (loading || draftLoading || publishLoading || scheduleLoading) {
      return
    }
    
    setScheduleLoading(true)
    setLoading(true)
    await handleSubmit(e as unknown as React.FormEvent, 'schedule')
  }

  const handleSubmit = async (e: React.FormEvent, submitType: 'draft' | 'publish' | 'schedule') => {
    e.preventDefault()
    e.stopPropagation()
    
    // Enhanced protection against multiple submissions
    if (loading) {
      return
    }
    
    // Input validation
    if (!formData.title.trim() || !formData.content.trim()) {
      setNotification({ type: 'error', message: 'Title and content are required' })
      return
    }

    // Validate scheduling
    if (submitType === 'schedule') {
      if (!scheduledDateTime) {
        setNotification({ type: 'error', message: 'Please select a date and time for scheduling' })
        return
      }
      
      const scheduledTime = new Date(scheduledDateTime)
      const now = new Date()
      const minScheduleTime = new Date(now.getTime() + 60000) // 1 minute from now
      
      if (scheduledTime <= minScheduleTime) {
        setNotification({ 
          type: 'error', 
          message: 'Scheduled time must be at least 1 minute in the future' 
        })
        return
      }
    }

    setLoading(true)
    
    try {
      // Handle timezone for scheduled datetime
      let scheduledTimeForDB = null
      if (submitType === 'schedule') {
        const localDate = new Date(scheduledDateTime)
        scheduledTimeForDB = localDate.toISOString()
      }
      
      const submissionData = {
        ...formData,
        status: submitType === 'draft' ? 'draft' : submitType === 'schedule' ? 'scheduled' : 'published',
        scheduled_for: scheduledTimeForDB,
        target_user_id: formData.target_audience === 'user' ? formData.target_user_id || null : null,
        tags: formData.tags.filter(tag => tag.trim() !== '')
      } as TablesInsert<'announcements'>

      const result = await createAdminAnnouncement(submissionData)
      
      if (result.success) {
        const successMessage = submitType === 'draft' 
          ? 'Announcement saved as draft successfully!' 
          : submitType === 'schedule' 
            ? `Announcement scheduled for ${new Date(scheduledDateTime).toLocaleString()} successfully!`
            : 'Announcement published successfully!'
            
        setNotification({ 
          type: 'success', 
          message: successMessage
        })
        
        // Reset form if successful
        if (submitType === 'schedule') {
          setShowScheduleForm(false)
          setScheduledDateTime('')
        }
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/admin/announcements')
        }, 2000)
      }
    } catch (error: unknown) {
      console.error('Submission error:', error)
      const message = error instanceof Error ? error.message : 'Failed to create announcement'
      setNotification({ type: 'error', message })
    } finally {
      setLoading(false)
      setDraftLoading(false)
      setPublishLoading(false)
      setScheduleLoading(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // User search functionality
  const searchUsers = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    try {
      const result = await searchUsersForAnnouncements(query)
      setSearchResults(result.users || [])
      setShowResults(true)
    } catch {
      setSearchResults([])
      setShowResults(true) // Show empty state
    } finally {
      setIsSearching(false)
    }
  }

  const handleUserSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setUserSearchQuery(query)
    
    // Clear existing timeout and search immediately for better UX
    if (query.trim().length >= 2) {
      searchUsers(query)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  const selectUser = (user: SearchedUser) => {
    setSelectedUser(user)
    setFormData(prev => ({ ...prev, target_user_id: user.id }))
    setUserSearchQuery(user.full_name || user.email || user.username || user.id)
    setShowResults(false)
  }

  const clearUserSelection = () => {
    setSelectedUser(null)
    setFormData(prev => ({ ...prev, target_user_id: '' }))
    setUserSearchQuery('')
    setShowResults(false)
  }

  const audienceOptions = [
    { value: 'all', label: 'Everyone', icon: Users, description: 'Send to all users' },
    { value: 'students', label: 'Students', icon: BookOpen, description: 'Send to students only' },
    { value: 'affiliates', label: 'Affiliates', icon: Star, description: 'Send to affiliates only' },
    { value: 'admins', label: 'Admins', icon: Crown, description: 'Send to admins only' },
    { value: 'user', label: 'Specific User', icon: User, description: 'Send to one specific user' }
  ]

  const priorityOptions = [
    { 
      value: 'low', 
      label: 'Low', 
      selectedClass: 'border-slate-500 bg-slate-500 text-white shadow-lg',
      defaultClass: 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
    },
    { 
      value: 'medium', 
      label: 'Medium', 
      selectedClass: 'border-blue-500 bg-blue-500 text-white shadow-lg',
      defaultClass: 'border-blue-200 dark:border-blue-600 hover:border-blue-300 dark:hover:border-blue-500 bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300'
    },
    { 
      value: 'high', 
      label: 'High', 
      selectedClass: 'border-red-500 bg-red-500 text-white shadow-lg',
      defaultClass: 'border-red-200 dark:border-red-600 hover:border-red-300 dark:hover:border-red-500 bg-white dark:bg-slate-800 text-red-700 dark:text-red-300'
    }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <Send className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create Announcement</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Send important updates and messages to your users</p>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-6 p-4 rounded-xl border ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300'
            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300'
        }`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {notification.message}
          </div>
        </div>
      )}

      <form 
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {/* Basic Information */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Basic Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter announcement title..."
                className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your announcement content here..."
                rows={6}
                className="w-full px-0 py-2 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-3">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: option.value }))}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      formData.priority === option.value
                        ? option.selectedClass
                        : option.defaultClass
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tags
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag..."
                    className="flex-1 px-0 py-2 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-all duration-200"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Target Audience */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Target Audience</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {audienceOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, target_audience: option.value }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    formData.target_audience === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-slate-900 dark:text-white">
                      {option.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {option.description}
                  </p>
                </button>
              )
            })}
          </div>

          {formData.target_audience === 'user' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Search for User
              </label>
              <div className="relative">
                {selectedUser ? (
                  // Display selected user
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl">
                    <div className="flex items-center gap-3">
                      {selectedUser.avatar_url ? (
                        <Image 
                          src={selectedUser.avatar_url} 
                          alt={selectedUser.full_name || selectedUser.email || 'User avatar'} 
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {selectedUser.full_name || selectedUser.username || 'Unknown User'}
                          {selectedUser.username && selectedUser.full_name && (
                            <span className="text-slate-500 dark:text-slate-400 font-normal ml-1">
                              (@{selectedUser.username})
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedUser.email} • {selectedUser.role}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearUserSelection}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  // Search input
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400 ml-1" />
                      </div>
                      <input
                        type="text"
                        value={userSearchQuery}
                        onChange={handleUserSearchChange}
                        placeholder="Type to search users by name or email..."
                        className="w-full pl-8 pr-4 py-2 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                      />
                      {isSearching && (
                        <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-2">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Searching users...</span>
                          <InlineLoader width={16} />
                        </div>
                      )}
                    </div>

                    {/* Search Results */}
                    {showResults && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.length === 0 ? (
                          <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                            {userSearchQuery.length < 2 ? 'Type at least 2 characters to search' : 'No users found'}
                          </div>
                        ) : (
                          searchResults.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => selectUser(user)}
                              className="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-b-0 transition-all duration-200"
                            >
                              <div className="flex items-center gap-3">
                                {user.avatar_url ? (
                                  <Image 
                                    src={user.avatar_url} 
                                    alt={user.full_name || user.email || 'User avatar'}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-slate-900 dark:text-white truncate">
                                    {user.full_name || user.username || 'Unknown User'}
                                    {user.username && user.full_name && (
                                      <span className="text-slate-500 dark:text-slate-400 font-normal ml-1">
                                        (@{user.username})
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                    {user.email} • {user.role}
                                  </p>
                                </div>
                                <Check className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100" />
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </GlassCard>

        {/* Scheduling Section */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Scheduling</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="enableScheduling" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Schedule this announcement for later
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Automatically publish at a specific date and time
                </p>
              </div>
              
              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => setShowScheduleForm(!showScheduleForm)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  showScheduleForm 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                    : 'bg-slate-200 dark:bg-slate-600'
                }`}
                aria-pressed={showScheduleForm}
                aria-labelledby="enableScheduling"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-lg ${
                    showScheduleForm ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {showScheduleForm && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Publication Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={scheduledDateTime}
                  onChange={(e) => setScheduledDateTime(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  required={showScheduleForm}
                />
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  The announcement will be automatically published at the specified time
                </p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          {!showScheduleForm && (
            <>
              <button
                type="button"
                onClick={handleDraftSubmit}
                disabled={loading}
                className="px-6 py-3 bg-slate-500 text-white font-medium rounded-xl hover:bg-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
              >
                {draftLoading ? (
                  <>
                    <ButtonLoader width={16} />
                    Saving...
                  </>
                ) : (
                  'Save as Draft'
                )}
              </button>
              
              <button
                type="button"
                onClick={handlePublishSubmit}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg justify-center"
              >
                {publishLoading ? (
                  <>
                    <ButtonLoader width={16} />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Publish Now
                  </>
                )}
              </button>
            </>
          )}
          
          {showScheduleForm && (
            <button
              type="button"
              onClick={handleScheduleSubmit}
              disabled={loading || !scheduledDateTime}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center shadow-lg"
            >
              {scheduleLoading ? (
                <>
                  <ButtonLoader width={16} />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  Schedule Announcement
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
} 