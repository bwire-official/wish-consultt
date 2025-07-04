"use client";

import React, { useState, useEffect } from "react";
import { ButtonLoader } from "@/components/ui/loaders";
import { GlassCard } from "@/components/ui/glass-card";
import UserSearch from "@/components/admin/UserSearch";
import {
  Activity,
  AlertCircle,
  Ban,
  BarChart2,
  BookOpen,
  CheckCircle,
  Clock,
  Crown,
  Download,
  Edit,
  Eye,
  GraduationCap,
  Grid,
  List,
  Mail,
  MoreHorizontal,
  RefreshCw,
  Trash2,
  TrendingUp,
  User,
  Users,
  X,
  Zap
} from "lucide-react";
import Image from "next/image";
import { getAdminUsers, getUserStats, exportAllUsersData, type AdminUser as BaseAdminUser } from "@/app/admin/actions/users";
import { promoteUserToAdmin } from "@/app/admin/actions/promote-user";

// Extend AdminUser to include affiliate_stats for local use
type AffiliateStats = {
  total_invites?: number;
  successful_invites?: number;
  conversion_rate?: number;
  total_earnings?: number;
  invite_code?: string;
};

type InvitedByDetails = {
  full_name?: string;
};

type AdminUser = BaseAdminUser & {
  affiliate_stats?: AffiliateStats;
  invited_by_details?: InvitedByDetails;
};

type User = AdminUser;

export default function UsersPage({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedPremium, setSelectedPremium] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50); // Reduced from 100 for better performance
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    limit: 50,
    hasNextPage: false,
    hasPrevPage: false,
    from: 0,
    to: 0
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [promotionLoading, setPromotionLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    activeUsers: 0,
    courseEnrollments: 0
  });

  // Handle searchParams Promise
  useEffect(() => {
    async function initializeSearchQuery() {
      if (searchParams) {
        const params = await searchParams;
        setSearchQuery(params.q || "");
      }
    }
    initializeSearchQuery();
  }, [searchParams]);

  // Fetch users with server-side pagination
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const result = await getAdminUsers(searchQuery, currentPage, itemsPerPage);
        setUsers(result.users || []);
        setCount(result.count);
        setPagination(result.pagination);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [searchQuery, currentPage, itemsPerPage]);

  // Fetch stats on component mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const statsData = await getUserStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }
    fetchStats();
  }, []);

  // Client-side filtering for status/role/premium (on current page only)
  const filteredUsers = users.filter((user) => {
    const userStatus = user.status || "inactive";
    const matchesStatus = selectedStatus === "all" || userStatus === selectedStatus;
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesPremium = selectedPremium === "all" || 
      (selectedPremium === "premium" && false) || // No premium users since column doesn't exist
      (selectedPremium === "free" && true); // All users are considered free
    
    return matchesStatus && matchesRole && matchesPremium;
  });

  // Debounced search loading effect
  useEffect(() => {
    if (searchQuery) {
      setSearchLoading(true);
      setCurrentPage(1); // Reset to first page on search
      const timer = setTimeout(() => {
        setSearchLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchLoading(false);
    }
  }, [searchQuery]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, selectedRole, selectedPremium]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Refresh both users and stats
      const [usersResult, statsData] = await Promise.all([
        getAdminUsers(searchQuery, currentPage, itemsPerPage),
        getUserStats()
      ]);
      
      setUsers(usersResult.users || []);
      setCount(usersResult.count);
      setPagination(usersResult.pagination);
      setStats(statsData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleMoreActions = (user: AdminUser) => {
    setSelectedUser(user);
    setShowMoreModal(true);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowViewModal(false);
    setShowMoreModal(false);
    setSelectedUser(null);
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      // Export ALL users with current search query
      const result = await exportAllUsersData(searchQuery);

      // Show user feedback about export
      if (result.searchApplied) {
        // You could add a toast notification here
        console.log(`Exporting ${result.totalExported} users matching search "${searchQuery}"`);
      } else {
        console.log(`Exporting all ${result.totalExported} users`);
      }

      // Create and download file
      const blob = new Blob([result.csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${searchQuery ? 'filtered-' : ''}${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "inactive": return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
      case "suspended": return "text-red-600 bg-red-100 dark:bg-red-900/30";
      case "warned": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "inactive": return <Clock className="h-4 w-4" />;
      case "suspended": return <Ban className="h-4 w-4" />;
      case "warned": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    });
  };

  // Handle promotion to admin
  const handlePromoteToAdmin = async (userId: string, userName: string) => {
    setPromotionLoading(true);
    try {
      const result = await promoteUserToAdmin(userId, `Promoted via admin panel by current user`);
      
      if (result.success) {
        // Update the user in the local state
        setUsers(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, role: 'admin' }
            : user
        ));
        
        // Show success message (you could add a toast here)
        console.log(`✅ Successfully promoted ${userName} to admin`);
        
        // Close modals
        handleCloseModals();
        
        // Refresh data
        handleRefresh();
      } else {
        console.error('❌ Promotion failed:', result.message);
        // You could add a toast error here
      }
    } catch (error) {
      console.error('❌ Promotion error:', error);
      // You could add a toast error here
    } finally {
      setPromotionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Glowing Lights Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">User Management</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage and monitor all user accounts on the platform</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
              <BarChart2 className="h-5 w-5 mr-2" />
              Analytics
            </button>
            <button 
              onClick={handleExport}
              disabled={exportLoading}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title={`Export ${searchQuery ? `filtered users (${count})` : `all users (${count})`} to CSV`}
            >
              {exportLoading ? (
                <ButtonLoader className="mr-2" />
              ) : (
                <Download className="h-5 w-5 mr-2" />
              )}
              {exportLoading ? "Exporting..." : `Export ${searchQuery ? 'Filtered' : 'All'} (${count})`}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              name: "Total Users",
              value: stats.totalUsers.toString(),
              change: "+12.5%",
              trend: "up",
              icon: Users,
              gradient: "from-blue-500 to-cyan-500"
            },
            {
              name: "Premium Users",
              value: stats.premiumUsers.toString(),
              change: "+8.2%",
              trend: "up",
              icon: Crown,
              gradient: "from-yellow-500 to-orange-500"
            },
            {
              name: "Active Today",
              value: stats.activeUsers.toString(),
              change: "+5.1%",
              trend: "up",
              icon: Activity,
              gradient: "from-green-500 to-emerald-500"
            },
            {
              name: "Course Enrollments",
              value: stats.courseEnrollments.toString(),
              change: "+15.3%",
              trend: "up",
              icon: BookOpen,
              gradient: "from-purple-500 to-pink-500"
            },
          ].map((stat) => (
            <GlassCard key={stat.name} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  <TrendingUp className="h-4 w-4" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Filters and Search */}
        <GlassCard className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <UserSearch 
                  placeholder="Search users by name, email, or username..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-500"></div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="warned">Warned</option>
              </select>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
              >
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="affiliate">Affiliate</option>
              </select>

              <select
                value={selectedPremium}
                onChange={(e) => setSelectedPremium(e.target.value)}
                className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
              >
                <option value="all">All Users</option>
                <option value="premium">Premium Only</option>
                <option value="free">Free Only</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg p-1 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-teal-500 text-white shadow-lg" 
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-teal-500 text-white shadow-lg" 
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>

              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Users Display */}
        {viewMode === "list" ? (
          /* List View - Table Format */
          <div className="space-y-4">
            {loading ? (
              // Loading skeleton
              <GlassCard className="p-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 py-3">
                        <div className="h-10 w-10 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-24"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            ) : filteredUsers.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No users found
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Try adjusting your search or filters
                </p>
              </GlassCard>
            ) : (
              <GlassCard className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Username</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Role</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Joined</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 h-10 w-10">
                                {user.avatar_url ? (
                                  <Image
                                    src={user.avatar_url}
                                    alt={user.full_name || user.username || "User"}
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <User className="h-5 w-5 text-white" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-slate-900 dark:text-white">
                                    {user.full_name || "No name"}
                                  </h3>
                                  {user.is_premium && (
                                    <Crown className="h-4 w-4 text-yellow-500" />
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-slate-900 dark:text-white font-medium">
                              @{user.username}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                              user.role === 'affiliate' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                              'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {user.role === 'admin' && <Crown className="h-3 w-3 mr-1" />}
                              {user.role === 'affiliate' && <Users className="h-3 w-3 mr-1" />}
                              {user.role === 'student' && <GraduationCap className="h-3 w-3 mr-1" />}
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {(() => {
                              const userStatus = user.status || "inactive";
                              return (
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(userStatus)}`}>
                                  {getStatusIcon(userStatus)}
                                  <span className="ml-1 capitalize">{userStatus}</span>
                                </span>
                              );
                            })()}
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {formatDate(user.created_at)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleViewUser(user)}
                                className="p-2 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                                title="View User"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleEditUser(user)}
                                className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                                title="Edit User"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleMoreActions(user)}
                                className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                                title="More Actions"
                              >
                                <MoreHorizontal className="h-4 w-4" />
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
            
            {/* Pagination Controls - Always show for user count info */}
            <GlassCard className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>Showing {pagination.from} to {pagination.to} of {count} users</span>
                    <span className="text-slate-400 dark:text-slate-500">•</span>
                    <span className="font-medium">Page {pagination.currentPage} of {pagination.totalPages}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs mt-1 text-slate-500 dark:text-slate-500">
                    <Zap className="h-3 w-3" />
                    <span>Users loaded in pages of {pagination.limit} for optimal performance</span>
                  </div>
                </div>
                {pagination.totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
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
                                ? "bg-teal-500 text-white shadow-lg"
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
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="px-3 py-2 text-sm bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        ) : (
          /* Grid View */
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <GlassCard key={i} className="p-6 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-1/2"></div>
                      </div>
                    </div>
                  </GlassCard>
                ))
              ) : filteredUsers.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    No users found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <GlassCard key={user.id} className="p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-12 w-12">
                          {user.avatar_url ? (
                            <Image
                              src={user.avatar_url}
                              alt={user.full_name || user.username || "User"}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center border-2 border-slate-200 dark:border-slate-600">
                              <User className="h-6 w-6 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {user.full_name || "No name"}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            @{user.username}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {user.is_premium && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {getStatusIcon(user.status)}
                          <span className="ml-1 capitalize">{user.status}</span>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Role:</span>
                        <span className="font-medium text-slate-900 dark:text-white capitalize">{user.role}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Courses:</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {user.courses?.enrolled || 0} enrolled
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Joined:</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {formatDate(user.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/20 dark:border-slate-700/50">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewUser(user)}
                          className="p-2 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                          title="View User"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleMoreActions(user)}
                          className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                          title="More Actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))
              )}
            </div>
            
            {/* Pagination Controls for Grid View - Always show for user count info */}
            <div className="mt-6">
              <GlassCard className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>Showing {pagination.from} to {pagination.to} of {count} users</span>
                      <span className="text-slate-400 dark:text-slate-500">•</span>
                      <span className="font-medium">Page {pagination.currentPage} of {pagination.totalPages}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs mt-1 text-slate-500 dark:text-slate-500">
                      <Zap className="h-3 w-3" />
                      <span>Users loaded in pages of {pagination.limit} for optimal performance</span>
                    </div>
                  </div>
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
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
                                  ? "bg-teal-500 text-white shadow-lg"
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
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-3 py-2 text-sm bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal - REDESIGNED FOR ADMINS */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-12 w-12">
                    {selectedUser.avatar_url ? (
                      <Image
                        src={selectedUser.avatar_url}
                        alt={selectedUser.full_name || selectedUser.username || "User"}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center border-2 border-slate-200 dark:border-slate-600">
                        <User className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit User Profile</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {selectedUser.full_name || "No name"} • {selectedUser.email}
                      </p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                        {getStatusIcon(selectedUser.status)}
                        <span className="ml-1 capitalize">{selectedUser.status}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseModals}
                  className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Basic Information (Universal) */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-teal-500" />
                      Basic Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedUser.full_name || ""}
                          className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300 placeholder-slate-500 dark:placeholder-slate-400"
                          placeholder="Enter full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedUser.username || ""}
                          className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300 placeholder-slate-500 dark:placeholder-slate-400"
                          placeholder="@username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          defaultValue={selectedUser.phone_number || ""}
                          className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300 placeholder-slate-500 dark:placeholder-slate-400"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            defaultValue={selectedUser.country || ""}
                            className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300 placeholder-slate-500 dark:placeholder-slate-400"
                            placeholder="United States"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Timezone
                          </label>
                          <select
                            defaultValue={selectedUser.timezone || ""}
                            className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300"
                          >
                            <option value="">Select timezone</option>
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                            <option value="Europe/Paris">Central European Time (CET)</option>
                            <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Status (Universal) */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-teal-500" />
                      Account Management
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Account Status
                        </label>
                      <div className="relative"> //
                          <select
                            defaultValue={selectedUser.status}
                            className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300 appearance-none"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                            <option value="warned">Warned</option>
                          </select>
                          <div className="absolute left-0 top-3 flex items-center pointer-events-none">
                            {selectedUser.status === 'active' && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
                            {selectedUser.status === 'inactive' && <Clock className="h-4 w-4 text-gray-500 mr-2" />}
                            {selectedUser.status === 'suspended' && <Ban className="h-4 w-4 text-red-500 mr-2" />}
                            {selectedUser.status === 'warned' && <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Changes account access and login permissions
                        </p>
                      </div>

                      <div>
                        <label className="flex items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                          <input
                            type="checkbox"
                            defaultChecked={selectedUser.onboarding_completed}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                          />
                          <div className="ml-3">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Onboarding Completed</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              User has completed the initial setup process
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Role-Specific Content */}
                <div className="space-y-6">
                  {/* STUDENT-SPECIFIC EDIT FIELDS */}
                  {selectedUser.role === 'student' && (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                          <BookOpen className="h-5 w-5 mr-2 text-teal-500" />
                          Educational Profile
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Education Level
                            </label>
                            <select
                              defaultValue={selectedUser.education_level || ""}
                              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300"
                            >
                              <option value="">Select education level</option>
                              <option value="high_school">High School</option>
                              <option value="associate">Associate Degree</option>
                              <option value="bachelor">Bachelor&apos;s Degree</option>
                              <option value="master">Master&apos;s Degree</option>
                              <option value="phd">PhD/Doctorate</option>
                              <option value="professional">Professional Degree</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Experience Level
                            </label>
                            <select
                              defaultValue={selectedUser.experience_level || ""}
                              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300"
                            >
                              <option value="">Select experience level</option>
                              <option value="beginner">Beginner (0-2 years)</option>
                              <option value="intermediate">Intermediate (2-5 years)</option>
                              <option value="advanced">Advanced (5-10 years)</option>
                              <option value="expert">Expert (10+ years)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Preferred Language
                            </label>
                            <select
                              defaultValue={selectedUser.language || ""}
                              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300"
                            >
                              <option value="">Select language</option>
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                              <option value="it">Italian</option>
                              <option value="pt">Portuguese</option>
                              <option value="zh">Chinese</option>
                              <option value="ja">Japanese</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ADMIN-SPECIFIC EDIT FIELDS */}
                  {selectedUser.role === 'admin' && (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                          <Crown className="h-5 w-5 mr-2 text-teal-500" />
                          Admin Settings
                        </h3>
                        <div className="space-y-4">
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <Crown className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
                              <span className="text-sm font-medium text-red-800 dark:text-red-200">Admin Account</span>
                            </div>
                            <p className="text-xs text-red-700 dark:text-red-300 mb-3">
                              This account has full administrative privileges. Changes should be made carefully.
                            </p>
                            <div className="space-y-3">
                              <div className="flex justify-between py-2 border-b border-red-200 dark:border-red-700">
                                <span className="text-xs text-red-600 dark:text-red-400">Admin Since</span>
                                <span className="text-xs font-medium text-red-700 dark:text-red-300">
                                  {formatDate(selectedUser.created_at)}
                                </span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-red-200 dark:border-red-700">
                                <span className="text-xs text-red-600 dark:text-red-400">Security Level</span>
                                <span className="text-xs font-medium text-red-700 dark:text-red-300">
                                  Maximum Access
                                </span>
                              </div>
                              <div className="flex justify-between py-2">
                                <span className="text-xs text-red-600 dark:text-red-400">Promotion Method</span>
                                <span className="text-xs font-medium text-red-700 dark:text-red-300">
                                  System Auto-Promotion
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* AFFILIATE-SPECIFIC EDIT FIELDS */}
                  {selectedUser.role === 'affiliate' && (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                          <Users className="h-5 w-5 mr-2 text-teal-500" />
                          Affiliate Settings
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Commission Rate
                            </label>
                            <input
                              type="text"
                              defaultValue="15%"
                              readOnly
                              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Standard commission rate for all affiliates
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Payout Method
                            </label>
                            <select
                              defaultValue=""
                              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300"
                            >
                              <option value="">Not configured</option>
                              <option value="paypal">PayPal</option>
                              <option value="bank">Bank Transfer</option>
                              <option value="stripe">Stripe</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              Affiliate Status
                            </label>
                            <select
                              defaultValue="active"
                              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300"
                            >
                              <option value="active">Active</option>
                              <option value="paused">Paused</option>
                              <option value="suspended">Suspended</option>
                            </select>
                          </div>

                          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                              <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Performance Summary</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="text-center">
                                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">$0.00</div>
                                <div className="text-xs text-purple-600 dark:text-purple-400">Total Earnings</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
                                <div className="text-xs text-purple-600 dark:text-purple-400">Invites</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Email & Role (Universal - Read-only with actions) */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-teal-500" />
                      Security & Permissions
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email Address
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="email"
                            value={selectedUser.email || ""}
                            readOnly
                            className="flex-1 px-0 py-3 bg-transparent border-0 border-b-2 border-slate-300 dark:border-slate-500 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                          />
                          <button className="px-3 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium">
                            Request Change
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Email changes require security verification
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          User Role
                        </label>
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 px-0 py-3 border-0 border-b-2 border-slate-300 dark:border-slate-500">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-900 dark:text-white font-medium capitalize">{selectedUser.role}</span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                selectedUser.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                selectedUser.role === 'affiliate' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                {selectedUser.role === 'admin' && <Crown className="h-3 w-3 mr-1" />}
                                {selectedUser.role}
                              </span>
                            </div>
                          </div>
                          {selectedUser.role !== 'admin' && (
                            <button 
                              onClick={() => handlePromoteToAdmin(selectedUser.id, selectedUser.full_name || selectedUser.email || 'User')}
                              disabled={promotionLoading}
                              className="inline-flex items-center px-3 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-200 text-sm font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {promotionLoading ? (
                                <>
                                  <ButtonLoader className="mr-2" />
                                  Promoting...
                                </>
                              ) : (
                                <>
                                  <Crown className="h-4 w-4 mr-2" />
                                  Promote to Admin
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center">
                          <Crown className="h-3 w-3 mr-1" />
                          Role changes require admin approval and audit trail
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes (Universal) */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-teal-500" />
                      Admin Notes
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Internal Notes
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-0 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300 resize-none placeholder-slate-500 dark:placeholder-slate-400"
                          placeholder="Add internal notes about this user (visible only to admins)..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-6 flex items-center justify-between">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Last updated: {formatDate(selectedUser.updated_at)}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCloseModals}
                  className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-300 dark:border-slate-600"
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 text-sm bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-200 shadow-lg font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal - ROLE-SPECIFIC CONTENT */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-16 w-16">
                    {selectedUser.avatar_url ? (
                      <Image
                        src={selectedUser.avatar_url}
                        alt={selectedUser.full_name || selectedUser.username || "User"}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center border-2 border-slate-200 dark:border-slate-600">
                        <User className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedUser.full_name || "No name provided"}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">@{selectedUser.username} • {selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                        {getStatusIcon(selectedUser.status)}
                        <span className="ml-1 capitalize">{selectedUser.status}</span>
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedUser.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        selectedUser.role === 'affiliate' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {selectedUser.role === 'admin' && <Crown className="h-3 w-3 mr-1" />}
                        {selectedUser.role === 'affiliate' && <Users className="h-3 w-3 mr-1" />}
                        {selectedUser.role === 'student' && <GraduationCap className="h-3 w-3 mr-1" />}
                        {selectedUser.role}
                      </span>
                      {selectedUser.is_premium && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseModals}
                  className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Basic Information (Universal) */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-teal-500" />
                      Basic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Full Name</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {selectedUser.full_name || "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Email</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {selectedUser.email}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Phone</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {selectedUser.phone_number || "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Country</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {selectedUser.country || "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Timezone</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {selectedUser.timezone || "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Joined Date</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {formatDate(selectedUser.created_at)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Onboarding</span>
                        <span className={`text-sm font-medium ${selectedUser.onboarding_completed ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                          {selectedUser.onboarding_completed ? "Completed" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Role-Specific Content */}
                <div className="space-y-6">
                  {/* STUDENT-SPECIFIC CONTENT */}
                  {selectedUser.role === 'student' && (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                          <BookOpen className="h-5 w-5 mr-2 text-teal-500" />
                          Learning Progress
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {selectedUser.courses?.enrolled || 0}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Courses Enrolled</div>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {selectedUser.courses?.completed || 0}
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">Completed</div>
                          </div>
                          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                              {selectedUser.courses?.in_progress || 0}
                            </div>
                            <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">In Progress</div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {selectedUser.courses?.certificates || 0}
                            </div>
                            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Certificates</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Current Course</span>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {selectedUser.progress?.current_course || "None"}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Completion Rate</span>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {selectedUser.progress?.completion_rate ? `${selectedUser.progress.completion_rate}%` : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Education Level</span>
                            <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                              {selectedUser.education_level?.replace('_', ' ') || "Not specified"}
                            </span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Experience Level</span>
                            <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                              {selectedUser.experience_level || "Not specified"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ADMIN-SPECIFIC CONTENT */}
                  {selectedUser.role === 'admin' && (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                          <Crown className="h-5 w-5 mr-2 text-teal-500" />
                          Admin Permissions
                        </h3>
                        <div className="space-y-4">
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <Crown className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
                              <span className="text-sm font-medium text-red-800 dark:text-red-200">Full Admin Access</span>
                            </div>
                            <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                              <li>• User Management (View, Edit, Suspend)</li>
                              <li>• Course Management & Analytics</li>
                              <li>• System Settings & Configuration</li>
                              <li>• Financial Data & Reports</li>
                              <li>• Admin Promotion Authority</li>
                            </ul>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Admin Since</span>
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {formatDate(selectedUser.created_at)}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Last Login</span>
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {selectedUser.last_active ? formatDate(selectedUser.last_active) : "Never"}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Promoted By</span>
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                System Auto-Promotion
                              </span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Security Level</span>
                              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                Maximum Access
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* AFFILIATE-SPECIFIC CONTENT */}
                  {selectedUser.role === 'affiliate' && (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                          <Users className="h-5 w-5 mr-2 text-teal-500" />
                          Affiliate Performance
                        </h3>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {selectedUser.affiliate_stats?.total_invites || 0}
                              </div>
                              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Invites Sent</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {selectedUser.affiliate_stats?.successful_invites || 0}
                              </div>
                              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Conversions</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {selectedUser.affiliate_stats?.conversion_rate ? `${selectedUser.affiliate_stats.conversion_rate}%` : "0%"}
                              </div>
                              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Conversion Rate</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                ${selectedUser.affiliate_stats?.total_earnings?.toFixed(2) || "0.00"}
                              </div>
                              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Total Earnings</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3 mt-4">
                          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Affiliate Link</span>
                            <span className="text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">
                              /invite?code={selectedUser.affiliate_stats?.invite_code || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Invited By</span>
                            <span className="text-sm font-medium text-slate-900 dark:text-white">
                              {selectedUser.invited_by_details?.full_name || "None"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                    {/* Account Actions (for all roles) */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-teal-500" />
                      Account Actions
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors">
                        <span className="font-medium">Send Warning Message</span>
                        <p className="text-xs">Sends a pre-defined warning email to the user.</p>
                      </button>
                      <button className="w-full text-left p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                        <span className="font-medium">Suspend User&apos;s Account</span>
                        <p className="text-xs">Temporarily revokes login access and pauses all activity.</p>
                      </button>
                      <button className="w-full text-left p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                        <span className="font-medium">Delete User&apos;s Account</span>
                        <p className="text-xs">Permanently deletes user and associated data. This action is irreversible.</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end space-x-3">
              <button
                onClick={handleCloseModals}
                className="px-6 py-2 text-sm bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-200 shadow-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* More Actions Modal - ROLE-SPECIFIC ACTIONS */}
      {showMoreModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">More Actions</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {selectedUser.full_name || selectedUser.username} • 
                    <span className={`ml-1 capitalize ${
                      selectedUser.role === 'admin' ? 'text-red-600 dark:text-red-400' :
                      selectedUser.role === 'affiliate' ? 'text-purple-600 dark:text-purple-400' :
                      'text-blue-600 dark:text-blue-400'
                    }`}>
                      {selectedUser.role}
                    </span>
                  </p>
                </div>
                <button
                  onClick={handleCloseModals}
                  className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                {/* Universal Actions for All Users */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Communication
                  </h3>
                  <button className="w-full flex items-center px-3 py-2.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
                    <Mail className="h-4 w-4 mr-3 text-teal-500" />
                    <div>
                      <div className="font-medium">Send Message</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Direct admin notification</div>
                    </div>
                  </button>
                  <button className="w-full flex items-center px-3 py-2.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
                    <AlertCircle className="h-4 w-4 mr-3 text-yellow-500" />
                    <div>
                      <div className="font-medium">Send Warning</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Account violation notice</div>
                    </div>
                  </button>
                </div>

                {/* STUDENT-SPECIFIC ACTIONS */}
                {selectedUser.role === 'student' && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Student Management
                    </h3>
                    <button className="w-full flex items-center px-3 py-2.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
                      <BookOpen className="h-4 w-4 mr-3 text-blue-500" />
                      <div>
                        <div className="font-medium">View Learning Progress</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Course completion & certificates</div>
                      </div>
                    </button>
                    <button className="w-full flex items-center px-3 py-2.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
                      <Crown className="h-4 w-4 mr-3 text-purple-500" />
                      <div>
                        <div className="font-medium">Upgrade to Premium</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Grant premium access</div>
                      </div>
                    </button>
                    <button className="w-full flex items-center px-3 py-2.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
                      <Activity className="h-4 w-4 mr-3 text-green-500" />
                      <div>
                        <div className="font-medium">Reset Progress</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Clear course completion data</div>
                      </div>
                    </button>
                  </div>
                )}

                {/* AFFILIATE-SPECIFIC ACTIONS */}
                {selectedUser.role === 'affiliate' && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Affiliate Management
                    </h3>
                    <button className="w-full flex items-center px-3 py-2.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
                      <Users className="h-4 w-4 mr-3 text-purple-500" />
                      <div>
                        <div className="font-medium">View Invites Performance</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Conversion rates & earnings</div>
                      </div>
                    </button>
                    <button className="w-full flex items-center px-3 py-2.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
                      <Activity className="h-4 w-4 mr-3 text-green-500" />
                      <div>
                        <div className="font-medium">Manage Invite Codes</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Create, edit, or disable codes</div>
                      </div>
                    </button>
                    <button className="w-full flex items-center px-3 py-2.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
                      <Crown className="h-4 w-4 mr-3 text-yellow-500" />
                      <div>
                        <div className="font-medium">Process Payout</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Pay pending commissions</div>
                      </div>
                    </button>
                    <button className="w-full flex items-center px-3 py-2.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
                      <Ban className="h-4 w-4 mr-3 text-orange-500" />
                      <div>
                        <div className="font-medium">Pause Affiliate Status</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Temporarily disable earning</div>
                      </div>
                    </button>
                  </div>
                )}

                {/* ADMIN-SPECIFIC ACTIONS */}
                {selectedUser.role === 'admin' && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                      Admin Management
                    </h3>
                    <button className="w-full flex items-center px-3 py-2.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
                      <Crown className="h-4 w-4 mr-3 text-red-500" />
                      <div>
                        <div className="font-medium">View Admin History</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Promotion logs & audit trail</div>
                      </div>
                    </button>
                    <button className="w-full flex items-center px-3 py-2.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
                      <Activity className="h-4 w-4 mr-3 text-blue-500" />
                      <div>
                        <div className="font-medium">View Admin Activity</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Recent actions & login history</div>
                      </div>
                    </button>
                    <button className="w-full flex items-center px-3 py-2.5 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm">
                      <AlertCircle className="h-4 w-4 mr-3" />
                      <div>
                        <div className="font-medium">Revoke Admin Status</div>
                        <div className="text-xs text-red-500 dark:text-red-400">Remove admin privileges</div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Account Management (Universal) */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Account Management
                  </h3>
                  <button className="w-full flex items-center px-3 py-2.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
                    <Activity className="h-4 w-4 mr-3 text-slate-500" />
                    <div>
                      <div className="font-medium">Password Reset</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Force password change on next login</div>
                    </div>
                  </button>
                  <button className="w-full flex items-center px-3 py-2.5 text-left text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors text-sm">
                    <Ban className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Suspend Account</div>
                      <div className="text-xs text-orange-500 dark:text-orange-400">Temporarily disable access</div>
                    </div>
                  </button>
                  <button className="w-full flex items-center px-3 py-2.5 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm">
                    <Trash2 className="h-4 w-4 mr-3" />
                    <div>
                      <div className="font-medium">Delete Account</div>
                      <div className="text-xs text-red-500 dark:text-red-400">Permanently remove user</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 