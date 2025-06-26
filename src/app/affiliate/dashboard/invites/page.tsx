"use client";

import { useState } from "react";
import { 
  Users, 
  Search,  
  Plus, 
  Eye, 
  BarChart3, 
  MessageSquare,
  Download,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function InvitesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Mock invites data
  const invites = [
    {
      id: "INV001",
      name: "John Doe",
      email: "john.doe@example.com",
      status: "active",
      joinDate: "2024-01-15",
      commission: 45.00,
      source: "Blog Link",
      lastActivity: "2 hours ago",
      avatar: "JD",
      clicks: 234,
      conversions: 3
    },
    {
      id: "INV002",
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      status: "pending",
      joinDate: "2024-01-14",
      commission: 0.00,
      source: "Instagram",
      lastActivity: "1 day ago",
      avatar: "SW",
      clicks: 156,
      conversions: 0
    },
    {
      id: "INV003",
      name: "Mike Johnson",
      email: "mike.j@example.com",
      status: "active",
      joinDate: "2024-01-13",
      commission: 78.50,
      source: "YouTube",
      lastActivity: "3 hours ago",
      avatar: "MJ",
      clicks: 89,
      conversions: 2
    },
    {
      id: "INV004",
      name: "Emily Chen",
      email: "emily.chen@example.com",
      status: "inactive",
      joinDate: "2024-01-10",
      commission: 23.00,
      source: "Facebook",
      lastActivity: "1 week ago",
      avatar: "EC",
      clicks: 67,
      conversions: 1
    },
    {
      id: "INV005",
      name: "David Brown",
      email: "david.brown@example.com",
      status: "active",
      joinDate: "2024-01-12",
      commission: 156.75,
      source: "LinkedIn",
      lastActivity: "5 hours ago",
      avatar: "DB",
      clicks: 445,
      conversions: 8
    }
  ];

  const filteredInvites = invites.filter(invite => {
    const matchesSearch = invite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invite.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invite.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'inactive': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const totalInvites = invites.length;
  const activeInvites = invites.filter(i => i.status === 'active').length;
  const totalCommission = invites.reduce((sum, i) => sum + i.commission, 0);
  const avgCommission = totalCommission / totalInvites;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Invites</h1>
          <p className="text-slate-600 dark:text-slate-400">Track your referrals and their progress</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300">
          <Plus className="h-4 w-4" />
          Invite New User
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Invites</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalInvites}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Invites</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{activeInvites}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {((activeInvites / totalInvites) * 100).toFixed(1)}% conversion
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Commission</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">${totalCommission.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Commission</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">${avgCommission.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filters and Search */}
      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Invites Management</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search invites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="commission">Sort by Commission</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Invites List */}
      <GlassCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20 dark:border-slate-700/20">
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Invite</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Join Date</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Commission</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Source</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Performance</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Last Activity</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvites.map((invite) => (
                <tr key={invite.id} className="border-b border-white/10 dark:border-slate-700/10 hover:bg-white/5 dark:hover:bg-slate-800/5 transition-all duration-200">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">{invite.avatar}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{invite.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{invite.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invite.status)}`}>
                      {getStatusIcon(invite.status)}
                      <span className="ml-1 capitalize">{invite.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-900 dark:text-white">
                    {new Date(invite.joinDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ${invite.commission.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                    {invite.source}
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <p className="text-slate-900 dark:text-white">{invite.clicks} clicks</p>
                      <p className="text-slate-600 dark:text-slate-400">{invite.conversions} conversions</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                    {invite.lastActivity}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-lg transition-all duration-200">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-lg transition-all duration-200">
                        <BarChart3 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-lg transition-all duration-200">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvites.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">No invites found matching your criteria</p>
          </div>
        )}
      </GlassCard>

      {/* Quick Actions */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg">
            <Plus className="h-5 w-5" />
            <span className="font-semibold">Invite New User</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg">
            <Download className="h-5 w-5" />
            <span className="font-semibold">Export Invites</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg">
            <BarChart3 className="h-5 w-5" />
            <span className="font-semibold">View Analytics</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
} 