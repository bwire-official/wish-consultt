"use client";

import React, { useState, useEffect } from "react";
import { ButtonLoader } from "@/components/ui/loaders";
import { GlassCard } from "@/components/ui/glass-card";
import UserSearch from "@/components/admin/UserSearch";
import {
  Users,
  Eye,
  Edit,
  Trash2,
  Mail,
  BookOpen,
  Clock,
  UserPlus,
  Ban,
  BarChart2,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Crown,
  Download,
  RefreshCw,
  Activity,
  TrendingUp,
  Grid,
  List,
  User,
  X
} from "lucide-react";
import Image from "next/image";
// Removed Profile import - using local User interface instead
import { createClient } from "@/lib/supabase/client";

async function getUsers(query: string) {
  const supabase = createClient();
  let userQuery = supabase.from("profiles").select(`
    id,
    created_at,
    updated_at,
    username,
    email,
    full_name,
    phone_number,
    role,
    status,
    onboarding_data,
    invited_by,
    avatar_url,
    is_premium,
    onboarding_completed,
    country,
    date_of_birth,
    education_level,
    availability,
    experience_level,
    languages,
    medical_specialties,
    timezone,
    social_links,
    bio
  `, { count: 'exact' });

  if (query) {
    userQuery = userQuery.or(`full_name.ilike.%${query}%,email.ilike.%${query}%,username.ilike.%${query}%`);
  }

  const { data: users, error, count } = await userQuery.order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return { users: [], count: 0 };
  }
  
  // Ensure all users have required Profile properties with defaults
  const normalizedUsers = (users || []).map(user => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const u = user as any; // Safe type assertion for database result
    return {
      // Core Profile properties
      id: u.id,
      created_at: u.created_at,
      updated_at: u.updated_at || u.created_at,
      username: u.username || null,
      email: u.email || null,
      full_name: u.full_name || null,
      phone_number: u.phone_number || null,
      role: u.role || 'student',
      status: u.status || 'inactive',
      onboarding_data: u.onboarding_data || null,
      invited_by: u.invited_by || null,
      avatar_url: u.avatar_url || null,
      is_premium: u.is_premium ?? false,
      onboarding_completed: u.onboarding_completed ?? false,
      
      // Additional database properties
      country: u.country || null,
      date_of_birth: u.date_of_birth || null,
      education_level: u.education_level || null,
      availability: u.availability || null,
      experience_level: u.experience_level || null,
      languages: u.languages || null,
      medical_specialties: u.medical_specialties || null,
      timezone: u.timezone || null,
      social_links: u.social_links || null,
      bio: u.bio || null,
    } as User;
  });
  
  return { users: normalizedUsers, count: count ?? 0 };
}

// User type that matches database structure exactly
interface User {
  // Core Profile properties
  id: string;
  created_at: string;
  updated_at: string;
  username: string | null;
  email: string | null;
  full_name: string | null;
  phone_number: string | null;
  role: string;
  status: string;
  onboarding_data: Record<string, unknown> | null;
  invited_by: string | null;
  avatar_url: string | null;
  is_premium: boolean;
  onboarding_completed: boolean;
  
  // Additional database properties
  country: string | null;
  date_of_birth: string | null;
  education_level: string | null;
  availability: string | null;
  experience_level: string | null;
  languages: string[] | null;
  medical_specialties: string[] | null;
  timezone: string | null;
  social_links: Record<string, unknown> | null;
  bio: string | null;
  
  // Optional properties for UI compatibility
  location?: string | null;
  last_active?: string | null;
  joined_date?: string;
  courses?: {
    enrolled: number;
    completed: number;
    in_progress: number;
    certificates: number;
  };
  progress?: {
    current_course: string | null;
    completion_rate: number | null;
    average_score: number | null;
    last_activity: string | null;
  };
  preferences?: {
    language: string;
    notifications: boolean;
    theme: string;
  };
  warnings?: number;
  last_warning?: string | null;
}

export default function UsersPage({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedPremium, setSelectedPremium] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

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

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const result = await getUsers(searchQuery);
      setUsers(result.users || []);
      setCount(result.count);
      setLoading(false);
    }
    fetchUsers();
  }, [searchQuery]);

  // Live search and filtering
  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch = !searchQuery || 
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const userStatus = user.status || "inactive";
      const matchesStatus = selectedStatus === "all" || userStatus === selectedStatus;
      const matchesRole = selectedRole === "all" || user.role === selectedRole;
      const matchesPremium = selectedPremium === "all" || 
        (selectedPremium === "premium" && user.is_premium) ||
        (selectedPremium === "free" && !user.is_premium);
      
      return matchesSearch && matchesStatus && matchesRole && matchesPremium;
    });
    setFilteredUsers(filtered);
  }, [users, searchQuery, selectedStatus, selectedRole, selectedPremium]);

  // Debounced search loading effect
  useEffect(() => {
    if (searchQuery) {
      setSearchLoading(true);
      const timer = setTimeout(() => {
        setSearchLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchLoading(false);
    }
  }, [searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = async () => {
    setLoading(true);
    const result = await getUsers(searchQuery);
    setUsers(result.users || []);
    setCount(result.count);
    setLoading(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleMoreActions = (user: User) => {
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
      // Create CSV content
      const headers = ['Name', 'Email', 'Username', 'Role', 'Status', 'Premium', 'Joined Date', 'Courses Enrolled', 'Phone', 'Location'];
      const csvContent = [
        headers.join(','),
        ...filteredUsers.map(user => [
          user.full_name || user.username,
          user.email,
          user.username,
          user.role,
          user.status || "inactive",
          user.is_premium ? 'Yes' : 'No',
          new Date(user.created_at).toLocaleDateString(),
          user.courses?.enrolled || 0,
          user.phone_number || '',
          user.location || user.country || ''
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
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

  const stats = [
    {
      name: "Total Users",
      value: count.toString(),
      change: "+12.5%",
      trend: "up",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Premium Users",
      value: users.filter(u => u.is_premium).length.toString(),
      change: "+8.2%",
      trend: "up",
      icon: Crown,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      name: "Active Today",
      value: users.filter(u => (u.status || "inactive") === "active").length.toString(),
      change: "+5.1%",
      trend: "up",
      icon: Activity,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Course Enrollments",
      value: users.reduce((sum, u) => sum + (u.courses?.enrolled || 0), 0).toString(),
      change: "+15.3%",
      trend: "up",
      icon: BookOpen,
      gradient: "from-purple-500 to-pink-500"
    },
  ];

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
            >
              {exportLoading ? (
                <ButtonLoader className="mr-2" />
              ) : (
                <Download className="h-5 w-5 mr-2" />
              )}
              {exportLoading ? "Exporting..." : "Export"}
            </button>
            <button
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
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
                        <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Courses</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Joined</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user) => (
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
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 capitalize">
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
                            <span className="text-sm text-slate-900 dark:text-white font-medium">
                              {user.courses?.enrolled || 0}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {new Date(user.created_at).toLocaleDateString()}
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
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                              currentPage === page
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
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </GlassCard>
            )}
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
                currentUsers.map((user) => (
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
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
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
                          {new Date(user.created_at).toLocaleDateString()}
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
            
            {/* Pagination Controls for Grid View */}
            {totalPages > 1 && (
              <div className="mt-6">
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                                currentPage === page
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
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit User</h2>
                <button
                  onClick={handleCloseModals}
                  className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-12 w-12">
                    {selectedUser.avatar_url ? (
                      <Image
                        src={selectedUser.avatar_url}
                        alt={selectedUser.full_name || selectedUser.username || "User"}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      {selectedUser.full_name || selectedUser.username}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedUser.email}</p>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedUser.full_name || ""}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-200 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={selectedUser.email || ""}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-200 text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Role
                      </label>
                      <select
                        defaultValue={selectedUser.role}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-200 text-sm"
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                        <option value="affiliate">Affiliate</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Status
                      </label>
                      <select
                        defaultValue={selectedUser.status}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-200 text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                        <option value="warned">Warned</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={selectedUser.is_premium}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                      />
                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Premium User</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end space-x-3">
              <button
                onClick={handleCloseModals}
                className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">User Details</h2>
                <button
                  onClick={handleCloseModals}
                  className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-6">
                {/* User Info Header */}
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-16 w-16">
                    {selectedUser.avatar_url ? (
                      <Image
                        src={selectedUser.avatar_url}
                        alt={selectedUser.full_name || selectedUser.username || "User"}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {selectedUser.full_name || "No name provided"}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">@{selectedUser.username}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                        {getStatusIcon(selectedUser.status)}
                        <span className="ml-1 capitalize">{selectedUser.status}</span>
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

                {/* Basic Information */}
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Full Name</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                        {selectedUser.full_name || "Not provided"}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Username</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                        @{selectedUser.username}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Email</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                        {selectedUser.email}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Phone</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                        {selectedUser.phone_number || "Not provided"}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Location</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                        {selectedUser.location || "Not provided"}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Language</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1 capitalize">
                        {selectedUser.preferences?.language || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">Account Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Role</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1 capitalize">
                        {selectedUser.role}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Status</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1 capitalize">
                        {selectedUser.status}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Joined Date</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                        {new Date(selectedUser.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Last Active</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                        {selectedUser.last_active ? new Date(selectedUser.last_active).toLocaleDateString() : "Never"}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Warnings</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                        {selectedUser.warnings || 0}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Onboarding</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                        {selectedUser.onboarding_completed ? "Completed" : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Course Progress */}
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">Course Progress</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {selectedUser.courses?.enrolled || 0}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Enrolled</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {selectedUser.courses?.completed || 0}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium">Completed</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                      <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                        {selectedUser.courses?.in_progress || 0}
                      </div>
                      <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">In Progress</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {selectedUser.courses?.certificates || 0}
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Certificates</div>
                    </div>
                  </div>
                </div>

                {/* Learning Progress */}
                {selectedUser.progress && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">Learning Progress</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Current Course</span>
                        <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                          {selectedUser.progress.current_course || "None"}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Completion Rate</span>
                        <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                          {selectedUser.progress.completion_rate ? `${selectedUser.progress.completion_rate}%` : "N/A"}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Average Score</span>
                        <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                          {selectedUser.progress.average_score ? `${selectedUser.progress.average_score}%` : "N/A"}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Last Activity</span>
                        <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                          {selectedUser.progress.last_activity ? new Date(selectedUser.progress.last_activity).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences */}
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">Preferences</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Theme</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1 capitalize">
                        {selectedUser.preferences?.theme || "Default"}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Notifications</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                        {selectedUser.preferences?.notifications ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Premium Status</span>
                      <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                        {selectedUser.is_premium ? "Premium Member" : "Free User"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end space-x-3">
              <button
                onClick={() => handleEditUser(selectedUser)}
                className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Edit User
              </button>
              <button
                onClick={handleCloseModals}
                className="px-4 py-2 text-sm bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* More Actions Modal */}
      {showMoreModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">More Actions</h2>
                <button
                  onClick={handleCloseModals}
                  className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {selectedUser.full_name || selectedUser.username}
              </p>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                <button className="w-full flex items-center px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
                  <Mail className="h-4 w-4 mr-3" />
                  Send Message
                </button>
                <button className="w-full flex items-center px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
                  <AlertCircle className="h-4 w-4 mr-3" />
                  Send Warning
                </button>
                <button className="w-full flex items-center px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm">
                  <Ban className="h-4 w-4 mr-3" />
                  Suspend Account
                </button>
                <button className="w-full flex items-center px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm">
                  <Trash2 className="h-4 w-4 mr-3" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 