"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Users2,
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  ArrowUpRight,
  CheckCircle,
  Clock
} from "lucide-react";
import Image from "next/image";

interface Affiliate {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "active" | "inactive" | "pending" | "suspended";
  tier: "bronze" | "silver" | "gold" | "platinum";
  total_referrals: number;
  total_earnings: number;
  location: string;
  commission_rate: number;
}

const affiliates: Affiliate[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "https://i.pravatar.cc/40?img=1",
    status: "active",
    tier: "platinum",
    total_referrals: 247,
    total_earnings: 15420,
    location: "New York, NY",
    commission_rate: 25
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    email: "michael.chen@email.com",
    avatar: "https://i.pravatar.cc/40?img=2",
    status: "active",
    tier: "gold",
    total_referrals: 189,
    total_earnings: 11250,
    location: "San Francisco, CA",
    commission_rate: 20
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    avatar: "https://i.pravatar.cc/40?img=3",
    status: "active",
    tier: "silver",
    total_referrals: 134,
    total_earnings: 6780,
    location: "Miami, FL",
    commission_rate: 15
  }
];

export default function AffiliatesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    {
      name: "Total Affiliates",
      value: affiliates.length.toString(),
      change: "+12.5%",
      trend: "up",
      icon: Users2,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Active Affiliates",
      value: affiliates.filter(a => a.status === "active").length.toString(),
      change: "+8.2%",
      trend: "up",
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Total Earnings",
      value: `$${affiliates.reduce((sum, a) => sum + a.total_earnings, 0).toLocaleString()}`,
      change: "+15.7%",
      trend: "up",
      icon: DollarSign,
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700";
      case "inactive": return "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
      case "suspended": return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-700";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum": return "bg-gradient-to-r from-slate-500 to-gray-500 text-white";
      case "gold": return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
      case "silver": return "bg-gradient-to-r from-gray-400 to-slate-500 text-white";
      case "bronze": return "bg-gradient-to-r from-orange-600 to-red-600 text-white";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300";
    }
  };

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : null;
  };

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = affiliate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         affiliate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         affiliate.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <Users2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Affiliate Program</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">Manage and monitor affiliate partners</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
            <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Affiliate
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <GlassCard key={stat.name} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${getTrendColor(stat.trend)}`}>
                  {getTrendIcon(stat.trend)}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Commission Settings */}
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Commission Settings</h2>
              <p className="text-slate-600 dark:text-slate-300">Configure commission rates for different affiliate tiers</p>
            </div>
            <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg">
              <Edit className="h-4 w-4 mr-2" />
              Edit Settings
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Avg Commission Rate</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">17.5%</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Commission Paid</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">$5,850</p>
                </div>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending Payouts</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">$1,240</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-800 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-r from-slate-500 to-gray-500 rounded-lg text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Platinum</span>
                <span className="text-2xl font-bold">25%</span>
              </div>
              <p className="text-xs opacity-90">Highest tier commission rate</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Gold</span>
                <span className="text-2xl font-bold">20%</span>
              </div>
              <p className="text-xs opacity-90">Premium tier commission rate</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-gray-400 to-slate-500 rounded-lg text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Silver</span>
                <span className="text-2xl font-bold">15%</span>
              </div>
              <p className="text-xs opacity-90">Standard tier commission rate</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Bronze</span>
                <span className="text-2xl font-bold">10%</span>
              </div>
              <p className="text-xs opacity-90">Basic tier commission rate</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Search affiliates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <select className="appearance-none pl-3 pr-8 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="relative">
                <select className="appearance-none pl-3 pr-8 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300">
                  <option value="all">All Tiers</option>
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                </select>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="overflow-hidden">
          <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Affiliates ({filteredAffiliates.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Affiliate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Referrals
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 dark:divide-slate-700/30">
                {filteredAffiliates.map((affiliate) => (
                  <tr key={affiliate.id} className="hover:bg-white/30 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Image
                          src={affiliate.avatar}
                          alt={affiliate.name}
                          width={40}
                          height={40}
                          className="rounded-full mr-3"
                        />
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {affiliate.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {affiliate.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTierColor(affiliate.tier)}`}>
                        {affiliate.tier.charAt(0).toUpperCase() + affiliate.tier.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {affiliate.total_referrals}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        ${affiliate.total_earnings.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {affiliate.commission_rate}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(affiliate.status)}`}>
                        {affiliate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
} 