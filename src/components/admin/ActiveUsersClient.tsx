'use client'

import Image from "next/image";
import { GlassCard } from "@/components/ui/glass-card";
import UserSearch from "@/components/admin/UserSearch";
import { useState } from 'react';
import { useActiveUsers } from '@/hooks/useActiveUsers';
import {
  Clock,
  Activity,
  Eye,
  MessageSquare,
  Video,
  BarChart2,
  Download,
  MoreVertical,
  TrendingUp,
  Target,
  RefreshCw,
  Globe
} from "lucide-react";

export default function ActiveUsersClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { onlineUsers, isLoading, formatDuration, refreshUsers } = useActiveUsers();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshUsers();
    // Add a small delay to show the refresh animation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const stats = [
    {
      name: "Currently Active",
      value: onlineUsers.length.toString(),
      change: "+12.5%",
      trend: "up",
      icon: Activity,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Avg. Session Time",
      value: onlineUsers.length > 0 
        ? formatDuration(onlineUsers.reduce((earliest, user) => 
            new Date(user.online_at) < new Date(earliest.online_at) ? user : earliest
          ).online_at)
        : "0s",
      change: "+8.2%",
      trend: "up",
      icon: Clock,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Course Engagement",
      value: onlineUsers.length > 0 ? "87%" : "0%",
      change: "+15.3%",
      trend: "up",
      icon: Target,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Video Watch Time",
      value: onlineUsers.length > 0 ? "2.4h" : "0h",
      change: "+22.8%",
      trend: "up",
      icon: Video,
      gradient: "from-orange-500 to-red-500"
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Active Users</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Monitor real-time user activity and engagement</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
            <BarChart2 className="h-5 w-5 mr-2" />
            Analytics
          </button>
          <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
            <Download className="h-5 w-5 mr-2" />
            Export Data
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

      {/* Filters */}
      <GlassCard className="p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <UserSearch
              placeholder="Search active users..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
            >
              <option value="all">All Courses</option>
              <option value="healthcare">Introduction to Healthcare</option>
              <option value="anatomy">Basic Anatomy</option>
              <option value="physiology">Human Physiology</option>
            </select>

            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
            >
              <option value="all">All Activities</option>
              <option value="watching">Watching Video</option>
              <option value="quiz">Taking Quiz</option>
              <option value="notes">Taking Notes</option>
              <option value="chat">Using AI Chat</option>
            </select>

            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Active Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full">
            <GlassCard className="p-12 text-center">
              <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Loading active users...
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Connecting to real-time data
              </p>
            </GlassCard>
          </div>
        ) : onlineUsers.length === 0 ? (
          <div className="col-span-full">
            <GlassCard className="p-12 text-center">
              <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                No active users
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                There are currently no users active on the platform
              </p>
            </GlassCard>
          </div>
        ) : (
          onlineUsers.map((user) => (
            <GlassCard key={user.user_id} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white font-semibold shadow-lg">
                    {user.avatar_url ? (
                      <Image 
                        src={user.avatar_url} 
                        alt={user.full_name || 'User'} 
                        className="h-12 w-12 rounded-full"
                        width={48}
                        height={48}
                      />
                    ) : (
                      user.full_name?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">
                      {user.full_name || 'Unknown User'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user.email || 'No email'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 dark:text-green-400">Active</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Online</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Online Since:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {new Date(user.online_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Session Duration:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {formatDuration(user.online_at)}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Status:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">Online</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {formatDuration(user.online_at)}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">Session Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-slate-900 dark:text-white">Active</div>
                    <div className="text-slate-500 dark:text-slate-400">Status</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/20 dark:border-slate-700/50">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Joined: {new Date(user.online_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
} 