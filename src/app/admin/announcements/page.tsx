"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { ButtonLoader } from "@/components/ui/loaders";
import UserSelect from "@/components/admin/UserSelect";
import { 
  Megaphone, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  AlertCircle,
  Archive,
  X,
  User,
  RefreshCw
} from "lucide-react";
import { createAnnouncement } from './actions';
import { GradientLoader } from "@/components/ui/loaders";

interface Announcement {
  id: number;
  title: string;
  body: string;
  status: "published" | "scheduled" | "draft" | "archived";
  priority: "low" | "medium" | "high" | "urgent";
  target_audience: "all" | "students" | "affiliates" | "admins" | "user";
  created_at: string;
  scheduled_for: string | null;
  author: string;
  views: number;
  engagement_rate: number;
  tags: string[];
}

export default function AllAnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showScheduledModal, setShowScheduledModal] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  
  // Create announcement form state
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    status: "draft" as "published" | "scheduled" | "draft",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    target_audience: "all" as "all" | "students" | "affiliates" | "admins" | "user",
    target_user_id: null as string | null,
    scheduled_for: "",
    tags: [] as string[],
    newTag: ""
  });
  const [selectedUserDetails, setSelectedUserDetails] = useState<{id: string, full_name: string | null, username: string | null} | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch announcements from database
  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/announcements');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched data:', data);
      setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch announcements');
    } finally {
      setIsLoading(false);
    }
  };

  // Load announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Function to publish a draft or scheduled announcement
  const handlePublishAnnouncement = async (announcementId: number) => {
    try {
      setIsPublishing(true);
      const response = await fetch(`/api/admin/announcements/${announcementId}/publish`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to publish announcement');
      }
      
      // Refresh the announcements list
      await fetchAnnouncements();
      
      // Show success message
      setSuccessMessage('Announcement published successfully!');
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error publishing announcement:', error);
      setErrorMessage('Failed to publish announcement. Please try again.');
      setShowErrorPopup(true);
    } finally {
      setIsPublishing(false);
    }
  };

  // Function to edit an announcement
  const handleEditAnnouncement = (announcement: Announcement) => {
    // TODO: Implement edit functionality
    console.log('Edit announcement:', announcement);
  };

  // Function to delete an announcement
  const handleDeleteAnnouncement = async (announcementId: number) => {
    setConfirmMessage('Are you sure you want to delete this announcement? This action cannot be undone.');
    setConfirmAction(() => async () => {
      try {
        const response = await fetch(`/api/admin/announcements/${announcementId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete announcement');
        }
        
        // Refresh the announcements list
        await fetchAnnouncements();
        
        // Show success message
        setSuccessMessage('Announcement deleted successfully!');
        setShowSuccessPopup(true);
      } catch (error) {
        console.error('Error deleting announcement:', error);
        setErrorMessage('Failed to delete announcement. Please try again.');
        setShowErrorPopup(true);
      }
    });
    setShowConfirmModal(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-700";
      case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-700";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case "all": return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-700";
      case "students": return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700";
      case "affiliates": return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700";
      case "admins": return "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
      case "user": return "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-700";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || announcement.status === selectedStatus;
    const matchesPriority = selectedPriority === "all" || announcement.priority === selectedPriority;
    const matchesAudience = selectedAudience === "all" || announcement.target_audience === selectedAudience;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAudience;
  });

  const publishedCount = announcements.filter(a => a.status === "published").length;
  const scheduledCount = announcements.filter(a => a.status === "scheduled").length;
  const draftCount = announcements.filter(a => a.status === "draft").length;
  const totalViews = announcements.reduce((sum, a) => sum + a.views, 0);

  const handleCreateAnnouncement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('content', formData.body);
    formDataObj.append('status', formData.status);
    formDataObj.append('priority', formData.priority);
    formDataObj.append('targetAudience', formData.target_audience);
    formDataObj.append('target_user_id', formData.target_user_id || '');
    formDataObj.append('scheduledFor', formData.scheduled_for);
    formDataObj.append('tags', JSON.stringify(formData.tags));

    try {
      const result = await createAnnouncement(formDataObj);
      if (result.success) {
        setShowCreateModal(false);
        setFormData({
          title: "",
          body: "",
          status: "draft",
          priority: "medium",
          target_audience: "all",
          target_user_id: null,
          scheduled_for: "",
          tags: [],
          newTag: ""
        });
        setSelectedUserDetails(null);
        
        // Refresh the announcements list
        await fetchAnnouncements();
        
        // Create dynamic success message
        let message = "";
        if (formData.status === "published") {
          if (formData.target_audience === "user" && selectedUserDetails) {
            message = `Announcement published and sent to ${selectedUserDetails.full_name} (@${selectedUserDetails.username})`;
          } else {
            message = `Announcement published and sent to ${formData.target_audience === "all" ? "all users" : formData.target_audience}`;
          }
        } else if (formData.status === "scheduled") {
          if (formData.target_audience === "user" && selectedUserDetails) {
            message = `Announcement scheduled and will be sent to ${selectedUserDetails.full_name} (@${selectedUserDetails.username})`;
          } else {
            message = `Announcement scheduled and will be sent to ${formData.target_audience === "all" ? "all users" : formData.target_audience}`;
          }
        } else {
          message = "Announcement saved as draft";
        }
        
        setSuccessMessage(message);
        setShowSuccessPopup(true);
      } else {
        setErrorMessage(result.message);
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      setErrorMessage('Failed to create announcement. Please try again.');
      setShowErrorPopup(true);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <Megaphone className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Announcements</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">Manage platform announcements and communications</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchAnnouncements}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={() => setShowArchiveModal(true)}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm"
            >
              <Archive className="h-5 w-5 mr-2" />
              View Archive
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Announcement
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+0%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Published
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {publishedCount}
              </p>
            </div>
          </GlassCard>

          <div 
            className="cursor-pointer"
            onClick={() => setShowScheduledModal(true)}
          >
            <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-blue-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+0%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Scheduled
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {scheduledCount}
                </p>
              </div>
            </GlassCard>
          </div>

          <div 
            className="cursor-pointer"
            onClick={() => setShowDraftModal(true)}
          >
            <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-yellow-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+0%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Drafts
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {draftCount}
                </p>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-purple-600">
                <TrendingUp className="h-4 w-4" />
                <span>+0%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                Total Views
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {totalViews}
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search announcements by title or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as "low" | "medium" | "high" | "urgent")}
                className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={selectedAudience}
                onChange={(e) => setSelectedAudience(e.target.value)}
                className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
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
        </GlassCard>

        {/* Announcements List */}
        <div className="space-y-6">
          {isLoading ? (
            <GlassCard className="p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <GradientLoader width={48} className="mb-6" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Loading announcements...
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Please wait while we fetch your announcements
                </p>
              </div>
            </GlassCard>
          ) : error ? (
            <GlassCard className="p-12 text-center">
              <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Error loading announcements
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {error}
              </p>
              <button
                onClick={fetchAnnouncements}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Try Again
              </button>
            </GlassCard>
          ) : (
            <>
              {/* Published Announcements */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Published Announcements</h2>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                      {publishedCount}
                    </span>
                  </div>
                </div>
                
                {filteredAnnouncements.filter(a => a.status === "published").length === 0 ? (
                  <GlassCard className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      No published announcements
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      Published announcements will appear here
                    </p>
                  </GlassCard>
                ) : (
                  <div className="space-y-4">
                    {filteredAnnouncements
                      .filter(a => a.status === "published")
                      .map((announcement) => (
                        <GlassCard key={announcement.id} className="p-6 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                  {announcement.title}
                                </h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(announcement.priority)}`}>
                                  {announcement.priority}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getAudienceColor(announcement.target_audience)}`}>
                                  {announcement.target_audience}
                                </span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                {announcement.body}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <span>By {announcement.author}</span>
                                <span>•</span>
                                <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleEditAnnouncement(announcement)}
                                className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                                className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-white/20 dark:border-slate-700/50">
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {announcement.views} views
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                {announcement.engagement_rate}% engagement
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {announcement.tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </GlassCard>
                      ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 max-w-lg w-full animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Create Announcement</h2>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedUserDetails(null);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <form className="space-y-4" onSubmit={handleCreateAnnouncement}>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="flex-1 px-0 py-2 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                    placeholder="Enter announcement title..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="body" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Content *
                  </label>
                  <textarea
                    id="body"
                    value={formData.body}
                    onChange={(e) => setFormData({...formData, body: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 bg-white/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm resize-none"
                    placeholder="Enter announcement content..."
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="status" className="block text-xs font-medium text-slate-900 dark:text-white mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as "published" | "scheduled" | "draft"})}
                      className="w-full px-2 py-1.5 text-sm bg-white/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-xs font-medium text-slate-900 dark:text-white mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as "low" | "medium" | "high" | "urgent"})}
                      className="w-full px-2 py-1.5 text-sm bg-white/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="audience" className="block text-xs font-medium text-slate-900 dark:text-white mb-1">
                      Audience
                    </label>
                    <select
                      id="audience"
                      value={formData.target_audience}
                      onChange={(e) => setFormData({...formData, target_audience: e.target.value as "all" | "students" | "affiliates" | "admins" | "user"})}
                      className="w-full px-2 py-1.5 text-sm bg-white/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    >
                      <option value="all">All Users</option>
                      <option value="students">Students</option>
                      <option value="affiliates">Affiliates</option>
                      <option value="admins">Admins</option>
                      <option value="user">Specific User</option>
                    </select>
                  </div>
                </div>

                {formData.target_audience === "user" && (
                  <div>
                    <label htmlFor="target_user" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Select User
                    </label>
                    <UserSelect
                      placeholder="Search for a user..."
                      value=""
                      onChange={(userId, user) => {
                        console.log('User selected in form:', userId, user);
                        setFormData({
                          ...formData,
                          target_user_id: userId
                        });
                        // Store user details for display
                        if (user) {
                          setSelectedUserDetails({
                            id: user.id,
                            full_name: user.full_name,
                            username: user.username
                          });
                        }
                      }}
                      onClear={() => {
                        setFormData({
                          ...formData,
                          target_user_id: null
                        });
                        setSelectedUserDetails(null);
                      }}
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Search and select a specific user to target this announcement
                    </p>
                    {formData.target_user_id && (
                      <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <User className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                              ✓ Announcement will be sent to: {selectedUserDetails?.full_name || 'Unknown User'} (@{selectedUserDetails?.username || 'unknown'})
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-300">
                              User ID: {formData.target_user_id}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {formData.status === "scheduled" && (
                  <div>
                    <label htmlFor="scheduled_for" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      Schedule Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      id="scheduled_for"
                      value={formData.scheduled_for}
                      onChange={(e) => setFormData({...formData, scheduled_for: e.target.value})}
                      className="flex-1 px-0 py-2 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-xs flex items-center gap-1">
                        #{tag}
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, tags: formData.tags.filter((_, i) => i !== index)})}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.newTag}
                      onChange={(e) => setFormData({...formData, newTag: e.target.value})}
                      className="flex-1 px-0 py-2 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                      placeholder="Add a tag..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.newTag.trim()) {
                          setFormData({
                            ...formData, 
                            tags: [...formData.tags, formData.newTag.trim()],
                            newTag: ""
                          });
                        }
                      }}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/20 dark:border-slate-700/50">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setSelectedUserDetails(null);
                    }}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <ButtonLoader width={16} />
                        Creating...
                      </>
                    ) : (
                      'Create'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 max-w-4xl w-full max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Archive className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Announcement Archive</h2>
                </div>
                <button
                  onClick={() => setShowArchiveModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-slate-900 dark:text-white">Archived Announcements</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search archived..."
                      className="px-0 py-1.5 text-sm bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-orange-500 dark:focus:border-orange-400 focus:outline-none transition-all duration-300"
                    />
                    <select className="px-3 py-1.5 text-sm bg-white/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 dark:focus:border-orange-400 focus:outline-none transition-all duration-300 backdrop-blur-sm">
                      <option value="all">All Archived</option>
                      <option value="old">Older than 30 days</option>
                      <option value="drafts">Draft announcements</option>
                      <option value="low-engagement">Low engagement</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Archive Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2">
                    <Archive className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Total Archived</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">0</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-medium text-red-800 dark:text-red-200">Old (&gt;30 days)</span>
                  </div>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">0</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Drafts</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">0</p>
                </div>
              </div>

              {/* Archived Announcements List */}
              <div className="space-y-3">
                <div className="text-center py-12">
                  <Archive className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Archive is empty
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    No announcements have been archived yet. Archived announcements will appear here.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/20 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Archived announcements are stored here and can be restored if needed.
                </p>
                <button
                  onClick={() => setShowArchiveModal(false)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Success!
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {successMessage}
              </p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Error
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {errorMessage}
              </p>
              <button
                onClick={() => setShowErrorPopup(false)}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Confirm Action
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {confirmMessage}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (confirmAction) {
                      setIsConfirming(true);
                      confirmAction();
                    }
                    setShowConfirmModal(false);
                  }}
                  disabled={isConfirming}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isConfirming ? (
                    <>
                      <ButtonLoader width={16} />
                      Deleting...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Announcements Modal */}
      {showScheduledModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 max-w-4xl w-full max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Scheduled Announcements</h2>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                    {scheduledCount}
                  </span>
                </div>
                <button
                  onClick={() => setShowScheduledModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {announcements.filter(a => a.status === "scheduled").length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    No scheduled announcements
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Scheduled announcements will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements
                    .filter(a => a.status === "scheduled")
                    .map((announcement) => (
                      <GlassCard key={announcement.id} className="p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {announcement.title}
                              </h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(announcement.priority)}`}>
                                {announcement.priority}
                              </span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getAudienceColor(announcement.target_audience)}`}>
                                {announcement.target_audience}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                              {announcement.body}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                              <span>By {announcement.author}</span>
                              <span>•</span>
                              <span>Created: {new Date(announcement.created_at).toLocaleDateString()}</span>
                              <span>•</span>
                              <span className="text-blue-600 dark:text-blue-400 font-medium">
                                Scheduled: {announcement.scheduled_for ? new Date(announcement.scheduled_for).toLocaleString() : 'TBD'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handlePublishAnnouncement(announcement.id)}
                              disabled={isPublishing}
                              className="p-2 text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                              title="Publish Now"
                            >
                              {isPublishing ? (
                                <ButtonLoader width={16} />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </button>
                            <button 
                              onClick={() => handleEditAnnouncement(announcement)}
                              className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                              className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/20 dark:border-slate-700/50">
                          <div className="flex items-center gap-2">
                            {announcement.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Will be published automatically
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Draft Announcements Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 max-w-4xl w-full max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Draft Announcements</h2>
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-medium">
                    {draftCount}
                  </span>
                </div>
                <button
                  onClick={() => setShowDraftModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {announcements.filter(a => a.status === "draft").length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    No draft announcements
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Draft announcements will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements
                    .filter(a => a.status === "draft")
                    .map((announcement) => (
                      <GlassCard key={announcement.id} className="p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {announcement.title}
                              </h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(announcement.priority)}`}>
                                {announcement.priority}
                              </span>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getAudienceColor(announcement.target_audience)}`}>
                                {announcement.target_audience}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                              {announcement.body}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                              <span>By {announcement.author}</span>
                              <span>•</span>
                              <span>Created: {new Date(announcement.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handlePublishAnnouncement(announcement.id)}
                              className="p-2 text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200" 
                              title="Publish Now"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEditAnnouncement(announcement)}
                              className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                              className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/20 dark:border-slate-700/50">
                          <div className="flex items-center gap-2">
                            {announcement.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Ready to publish
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 