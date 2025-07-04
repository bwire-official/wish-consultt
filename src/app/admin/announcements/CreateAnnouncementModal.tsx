'use client'

import { useState } from 'react'
import { X, User, Calendar, Tag, MessageSquare, AlertTriangle, Users, Target, Clock, Flag, Send, Save } from 'lucide-react'
import Image from 'next/image'
import { createAdminAnnouncement, searchUsersForAnnouncements, AdminAnnouncement } from '@/app/admin/actions'
import { ButtonLoader } from '@/components/ui/loaders'

interface CreateAnnouncementModalProps {
  onClose: () => void
  onSuccess: () => void
  editingAnnouncement?: AdminAnnouncement | null
}

interface SearchedUser {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  avatar_url: string | null;
}

export function CreateAnnouncementModal({ onClose, onSuccess, editingAnnouncement }: CreateAnnouncementModalProps) {
  const [formData, setFormData] = useState({
    title: editingAnnouncement?.title || '',
    content: editingAnnouncement?.content || '',
    status: (editingAnnouncement?.status || 'draft') as 'published' | 'scheduled' | 'draft',
    priority: (editingAnnouncement?.priority || 'medium') as 'low' | 'medium' | 'high' | 'urgent',
    target_audience: (editingAnnouncement?.target_audience || 'all') as 'all' | 'students' | 'affiliates' | 'admins' | 'user',
    target_user_id: editingAnnouncement?.target_user_id || null,
    scheduled_for: editingAnnouncement?.scheduled_for || '',
    tags: (editingAnnouncement?.tags || []) as string[],
    newTag: ''
  })
  const [selectedUser, setSelectedUser] = useState<{id: string, full_name: string | null, email: string | null, avatar_url?: string | null} | null>(null)
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [userSearchResults, setUserSearchResults] = useState<SearchedUser[]>([])
  const [isSearchingUsers, setIsSearchingUsers] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  const handleUserSearch = async (query: string) => {
    setUserSearchQuery(query)
    if (query.length < 2) {
      setUserSearchResults([])
      return
    }

    setIsSearchingUsers(true)
    try {
      const { users } = await searchUsersForAnnouncements(query)
      setUserSearchResults(users)
    } catch (error) {
      console.error('Error searching users:', error)
    } finally {
      setIsSearchingUsers(false)
    }
  }

  const handleUserSelect = (user: SearchedUser) => {
    setSelectedUser(user)
    setFormData(prev => ({ ...prev, target_user_id: user.id }))
    setUserSearchResults([])
    setUserSearchQuery('')
  }

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }))
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsCreating(true)

    try {
      const result = await createAdminAnnouncement({
        title: formData.title,
        content: formData.content,
        status: formData.status,
        priority: formData.priority,
        target_audience: formData.target_audience,
        target_user_id: formData.target_user_id,
        scheduled_for: formData.scheduled_for || null,
        tags: formData.tags.length > 0 ? formData.tags : null
      })

      // Display debug information if announcement was published
      if (result.debug && formData.status === 'published') {
        console.log('🔍 NOTIFICATION DEBUG INFO:')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(`📢 Title: ${result.debug.title}`)
        console.log(`🎯 Target Audience: ${result.debug.target_audience}`)
        console.log(`✅ Notifications Created: ${result.debug.notificationsCreated}`)
        console.log('📋 Debug Details:')
        result.debug.errors.forEach(msg => console.log(`   ${msg}`))
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      }
      
      onSuccess()
    } catch (error) {
      console.error('Error creating announcement:', error)
      setError('Failed to create announcement. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'high': return <Flag className="h-4 w-4 text-orange-500" />
      case 'medium': return <Flag className="h-4 w-4 text-yellow-500" />
      case 'low': return <Flag className="h-4 w-4 text-green-500" />
      default: return <Flag className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <Send className="h-4 w-4 text-green-500" />
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-500" />
      case 'draft': return <Save className="h-4 w-4 text-gray-500" />
      default: return <Save className="h-4 w-4 text-gray-500" />
    }
  }

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'all': return <Users className="h-4 w-4 text-purple-500" />
      case 'students': return <Users className="h-4 w-4 text-blue-500" />
      case 'affiliates': return <Users className="h-4 w-4 text-cyan-500" />
      case 'admins': return <Users className="h-4 w-4 text-gray-500" />
      case 'user': return <User className="h-4 w-4 text-pink-500" />
      default: return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Compact Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Title - Underline Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <MessageSquare className="h-4 w-4" />
              <span>Title</span>
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none py-2 transition-colors"
              placeholder="Enter announcement title..."
              required
            />
          </div>

          {/* Content - Underline Textarea */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <MessageSquare className="h-4 w-4" />
              <span>Content</span>
            </div>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={3}
              className="w-full bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none py-2 resize-none transition-colors"
              placeholder="Write your announcement content..."
              required
            />
          </div>

          {/* Compact Row: Status and Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                {getStatusIcon(formData.status)}
                <span>Status</span>
              </div>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' | 'scheduled' }))}
                className="w-full bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Publish</option>
                <option value="scheduled">Schedule</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                {getPriorityIcon(formData.priority)}
                <span>Priority</span>
              </div>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' }))}
                className="w-full bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Schedule Date (if scheduled) */}
          {formData.status === 'scheduled' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Calendar className="h-4 w-4" />
                <span>Schedule For</span>
              </div>
              <input
                type="datetime-local"
                value={formData.scheduled_for}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduled_for: e.target.value }))}
                className="w-full bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none py-2 text-sm"
                required
              />
            </div>
          )}

          {/* Target Audience */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              {getAudienceIcon(formData.target_audience)}
              <span>Audience</span>
            </div>
            <select
              name="target_audience"
              value={formData.target_audience}
              onChange={(e) => {
                const value = e.target.value as 'all' | 'students' | 'affiliates' | 'admins' | 'user'
                setFormData(prev => ({ 
                  ...prev, 
                  target_audience: value,
                  target_user_id: value === 'user' ? prev.target_user_id : null
                }))
                if (value !== 'user') {
                  setSelectedUser(null)
                }
              }}
              className="w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-blue-500 bg-transparent text-gray-700 focus:outline-none transition-colors"
              required
            >
              <option value="">Select audience</option>
              <option value="all">All Users</option>
              <option value="students">Students</option>
              <option value="affiliates">Affiliates</option>
              <option value="admins">Admins</option>
              <option value="user">Specific User</option>
            </select>
          </div>

          {/* User Search (if specific user) */}
          {formData.target_audience === 'user' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Target className="h-4 w-4" />
                <span>Select User</span>
              </div>
              
              {selectedUser ? (
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {selectedUser.avatar_url ? (
                        <Image 
                          src={selectedUser.avatar_url} 
                          alt={selectedUser.full_name || 'User avatar'} 
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">
                        {selectedUser.full_name || 'Unnamed User'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(null)
                      setFormData(prev => ({ ...prev, target_user_id: null }))
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => handleUserSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none py-2 text-sm"
                  />
                  
                  {(userSearchResults.length > 0 || isSearchingUsers || userSearchQuery.length >= 2) && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {isSearchingUsers ? (
                        <div className="p-3 text-center text-slate-500 dark:text-slate-400">
                          <ButtonLoader width={16} className="mr-2" />
                          Searching users...
                        </div>
                      ) : userSearchResults.length > 0 ? (
                        userSearchResults.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => handleUserSelect(user)}
                            className="w-full px-3 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-b-0 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {/* User Avatar in Search Results */}
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {user.avatar_url ? (
                                  <Image 
                                    src={user.avatar_url} 
                                    alt={user.full_name || 'User avatar'} 
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="h-4 w-4 text-white" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-slate-900 dark:text-white text-sm truncate">
                                  {user.full_name || 'Unnamed User'}
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                  {user.email} • {user.role}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))
                      ) : userSearchQuery.length >= 2 ? (
                        <div className="p-3 text-center text-slate-500 dark:text-slate-400">
                          <User className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-sm">No users found</p>
                          <p className="text-xs">Try a different search term</p>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Tag className="h-4 w-4" />
              <span>Tags (Optional)</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.newTag}
                onChange={(e) => setFormData(prev => ({ ...prev, newTag: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add tag..."
                className="flex-1 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                Add
              </button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Compact Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !formData.title.trim() || !formData.content.trim()}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {isCreating ? (
                <>
                  <ButtonLoader width={16} />
                  Creating...
                </>
              ) : (
                <>
                  {getStatusIcon(formData.status)}
                  {formData.status === 'published' ? 'Create & Publish' : 
                   formData.status === 'scheduled' ? 'Create & Schedule' : 'Save Draft'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 