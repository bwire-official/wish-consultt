"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  TrendingUp,
  Download,
  Target,
  Crown,
  CheckCircle,
  Edit,
  MoreHorizontal,
  Grid,
  RefreshCw,
  Eye,
  DollarSign,
  Gift,
  Search,
  BarChart2,
  MapPin
} from "lucide-react";
import Image from "next/image";
import { Profile } from '@/types';

interface PremiumUser extends Profile {
  avatar_url: string;
  phone_number: string | null;
  location: string | null;
  status: "active" | "inactive" | "suspended" | "warned";
  last_active: string | null;
  joined_date: string;
  premium_since: string;
  subscription_plan: "monthly" | "yearly" | "lifetime";
  subscription_status: "active" | "cancelled" | "expired" | "pending";
  next_billing_date: string | null;
  total_spent: number;
  courses: {
    enrolled: number;
    completed: number;
    in_progress: number;
    certificates: number;
  };
  progress: {
    current_course: string | null;
    completion_rate: number | null;
    average_score: number | null;
    last_activity: string | null;
  };
  preferences: {
    language: string;
    notifications: boolean;
    theme: string;
  };
  warnings: number;
  last_warning: string | null;
  is_premium: boolean;
  onboarding_completed: boolean;
}

// Mock data for premium users
const premiumUsers: PremiumUser[] = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    invited_by: null,
    username: "johndoe",
    full_name: "John Doe",
    email: "john@example.com",
    avatar_url: "https://i.pravatar.cc/40?img=1",
    role: "student",
    is_premium: true,
    onboarding_completed: true,
    onboarding_data: {},
    phone_number: "+1 (555) 123-4567",
    location: "New York, USA",
    status: "active",
    last_active: "2024-02-15T10:30:00",
    joined_date: "2024-01-15",
    premium_since: "2024-01-20",
    subscription_plan: "yearly",
    subscription_status: "active",
    next_billing_date: "2025-01-20",
    total_spent: 299.99,
    courses: {
      enrolled: 8,
      completed: 5,
      in_progress: 3,
      certificates: 5,
    },
    progress: {
      current_course: "Advanced Healthcare Analytics",
      completion_rate: 85,
      average_score: 92,
      last_activity: "2 hours ago",
    },
    preferences: {
      language: "English",
      notifications: true,
      theme: "dark",
    },
    warnings: 0,
    last_warning: null,
  },
  {
    id: "2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    invited_by: null,
    username: "mikechen",
    full_name: "Michael Chen",
    email: "mike@example.com",
    avatar_url: "https://i.pravatar.cc/40?img=3",
    role: "student",
    is_premium: true,
    onboarding_completed: true,
    onboarding_data: {},
    phone_number: "+1 (555) 345-6789",
    location: "San Francisco, USA",
    status: "active",
    last_active: "2024-02-15T11:45:00",
    joined_date: "2024-01-25",
    premium_since: "2024-02-01",
    subscription_plan: "lifetime",
    subscription_status: "active",
    next_billing_date: null,
    total_spent: 999.99,
    courses: {
      enrolled: 12,
      completed: 8,
      in_progress: 4,
      certificates: 8,
    },
    progress: {
      current_course: "AI in Medical Imaging",
      completion_rate: 90,
      average_score: 95,
      last_activity: "30 minutes ago",
    },
    preferences: {
      language: "English",
      notifications: true,
      theme: "dark",
    },
    warnings: 0,
    last_warning: null,
  },
  {
    id: "3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    invited_by: null,
    username: "davidkim",
    full_name: "David Kim",
    email: "david@example.com",
    avatar_url: "https://i.pravatar.cc/40?img=5",
    role: "student",
    is_premium: true,
    onboarding_completed: true,
    onboarding_data: {},
    phone_number: "+1 (555) 567-8901",
    location: "Boston, USA",
    status: "active",
    last_active: "2024-02-15T12:00:00",
    joined_date: "2024-02-01",
    premium_since: "2024-02-05",
    subscription_plan: "monthly",
    subscription_status: "active",
    next_billing_date: "2024-03-05",
    total_spent: 49.99,
    courses: {
      enrolled: 6,
      completed: 3,
      in_progress: 3,
      certificates: 3,
    },
    progress: {
      current_course: "Healthcare Data Science",
      completion_rate: 75,
      average_score: 88,
      last_activity: "15 minutes ago",
    },
    preferences: {
      language: "English",
      notifications: true,
      theme: "dark",
    },
    warnings: 0,
    last_warning: null,
  },
  {
    id: "4",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    invited_by: null,
    username: "emilybrown",
    full_name: "Emily Brown",
    email: "emily@example.com",
    avatar_url: "https://i.pravatar.cc/40?img=6",
    role: "student",
    is_premium: true,
    onboarding_completed: true,
    onboarding_data: {},
    phone_number: "+1 (555) 678-9012",
    location: "Seattle, USA",
    status: "active",
    last_active: "2024-02-15T08:30:00",
    joined_date: "2024-01-10",
    premium_since: "2024-01-15",
    subscription_plan: "yearly",
    subscription_status: "active",
    next_billing_date: "2025-01-15",
    total_spent: 299.99,
    courses: {
      enrolled: 10,
      completed: 7,
      in_progress: 3,
      certificates: 7,
    },
    progress: {
      current_course: "Medical AI Fundamentals",
      completion_rate: 88,
      average_score: 91,
      last_activity: "4 hours ago",
    },
    preferences: {
      language: "English",
      notifications: true,
      theme: "light",
    },
    warnings: 0,
    last_warning: null,
  },
];

export default function PremiumUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [selectedSubscription, setSelectedSubscription] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy] = useState("name");
  const [sortOrder] = useState<"asc" | "desc">("asc");

  const filteredUsers = premiumUsers.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    const matchesPlan = selectedPlan === "all" || user.subscription_plan === selectedPlan;
    const matchesSubscription = selectedSubscription === "all" || user.subscription_status === selectedSubscription;
    return matchesSearch && matchesStatus && matchesPlan && matchesSubscription;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue: string | number | Date, bValue: string | number | Date;
    
    switch (sortBy) {
      case "name":
        aValue = a.full_name || a.username || '';
        bValue = b.full_name || b.username || '';
        break;
      case "email":
        aValue = a.email || '';
        bValue = b.email || '';
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "joined":
        aValue = new Date(a.joined_date);
        bValue = new Date(b.joined_date);
        break;
      case "premiumSince":
        aValue = new Date(a.premium_since);
        bValue = new Date(b.premium_since);
        break;
      case "totalSpent":
        aValue = a.total_spent;
        bValue = b.total_spent;
        break;
      default:
        aValue = a.full_name || a.username || '';
        bValue = b.full_name || b.username || '';
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const stats = [
    {
      name: "Total Premium Users",
      value: premiumUsers.length.toString(),
      change: "+15.2%",
      trend: "up",
      icon: Crown,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      name: "Monthly Revenue",
      value: `$${premiumUsers.reduce((sum, u) => sum + u.total_spent, 0).toFixed(0)}`,
      change: "+22.8%",
      trend: "up",
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Active Subscriptions",
      value: premiumUsers.filter(u => u.subscription_status === "active").length.toString(),
      change: "+8.5%",
      trend: "up",
      icon: CheckCircle,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Avg. Course Completion",
      value: `${Math.round(premiumUsers.reduce((sum, u) => sum + (u.progress.completion_rate || 0), 0) / premiumUsers.length)}%`,
      change: "+12.3%",
      trend: "up",
      icon: Target,
      gradient: "from-purple-500 to-pink-500"
    },
  ];

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "lifetime": return "text-purple-600 bg-purple-100 dark:bg-purple-900/30";
      case "yearly": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "monthly": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Glowing Lights Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Paying Users</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400">Manage and monitor users who have purchased courses</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
              <BarChart2 className="h-5 w-5 mr-2" />
              Analytics
            </button>
            <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
            <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg">
              <Gift className="h-5 w-5 mr-2" />
              Send Gift
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Search paying users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-yellow-500 dark:focus:border-yellow-400 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 dark:focus:border-yellow-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="warned">Warned</option>
              </select>

              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 dark:focus:border-yellow-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
              >
                <option value="all">All Plans</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="lifetime">Lifetime</option>
              </select>

              <select
                value={selectedSubscription}
                onChange={(e) => setSelectedSubscription(e.target.value)}
                className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 dark:focus:border-yellow-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
              >
                <option value="all">All Subscriptions</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
              </select>

              <button className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 backdrop-blur-sm">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Paying Users Table */}
        <GlassCard className="overflow-hidden">
          <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Paying Users ({sortedUsers.length})
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <BarChart2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {viewMode === "list" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/30 dark:bg-slate-700/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Subscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Courses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Premium Since
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 dark:divide-slate-700/30">
                  {sortedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/30 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <Image
                              src={user.avatar_url}
                              alt={user.full_name || user.username || 'User'}
                              className="h-10 w-10 rounded-full"
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-slate-900 dark:text-white">
                                {user.full_name || user.username}
                              </div>
                              <Crown className="h-4 w-4 text-yellow-500" />
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {user.email}
                            </div>
                            <div className="text-xs text-slate-400 dark:text-slate-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(user.subscription_plan)}`}>
                            <span className="capitalize">{user.subscription_plan}</span>
                          </span>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {user.next_billing_date ? `Next: ${new Date(user.next_billing_date).toLocaleDateString()}` : "Lifetime"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          ${user.total_spent}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Total spent
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 dark:text-white">
                          {user.courses.enrolled} enrolled
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {user.courses.completed} completed
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500">
                          {user.courses.certificates} certificates
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 dark:text-white">
                          {new Date(user.premium_since).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {user.progress.last_activity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300">
                            <Crown className="h-4 w-4" />
                          </button>
                          <button className="text-teal-600 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedUsers.map((user) => (
                  <GlassCard key={user.id} className="p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <Image
                        src={user.avatar_url}
                        alt={user.full_name || user.username || 'User'}
                        className="h-12 w-12 rounded-full"
                        width={48}
                        height={48}
                      />
                      <div className="flex items-center gap-1">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(user.subscription_plan)}`}>
                          {user.subscription_plan}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        {user.full_name || user.username}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="h-3 w-3" />
                        <span>{user.location || "Location not set"}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          ${user.total_spent}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Total Spent
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          {user.courses.certificates}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Certificates
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Since {new Date(user.premium_since).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400">
                          <Crown className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
} 