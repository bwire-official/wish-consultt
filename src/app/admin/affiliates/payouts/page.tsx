"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  CreditCard,
  DollarSign,
  Users2,
  Download,
  Edit,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Search,
  Eye,
  XCircle,
  AlertCircle
} from "lucide-react";
import Image from "next/image";

interface PayoutRequest {
  id: string;
  affiliate_id: string;
  affiliate_name: string;
  affiliate_avatar: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  request_date: string;
  payment_method: string;
  account_details: string;
  commission_rate: number;
  total_earnings: number;
  notes?: string;
}

const payoutRequests: PayoutRequest[] = [
  {
    id: "1",
    affiliate_id: "1",
    affiliate_name: "Dr. Sarah Johnson",
    affiliate_avatar: "https://i.pravatar.cc/40?img=1",
    tier: "platinum",
    amount: 2840,
    status: "pending",
    request_date: "2024-03-15",
    payment_method: "Bank Transfer",
    account_details: "****1234",
    commission_rate: 25,
    total_earnings: 15420,
    notes: "Monthly payout request"
  },
  {
    id: "2",
    affiliate_id: "2",
    affiliate_name: "Prof. Michael Chen",
    affiliate_avatar: "https://i.pravatar.cc/40?img=2",
    tier: "gold",
    amount: 1950,
    status: "processing",
    request_date: "2024-03-14",
    payment_method: "PayPal",
    account_details: "michael.chen@email.com",
    commission_rate: 20,
    total_earnings: 11250,
    notes: "Processing payment"
  },
  {
    id: "3",
    affiliate_id: "3",
    affiliate_name: "Dr. Emily Rodriguez",
    affiliate_avatar: "https://i.pravatar.cc/40?img=3",
    tier: "silver",
    amount: 1200,
    status: "completed",
    request_date: "2024-03-13",
    payment_method: "Bank Transfer",
    account_details: "****5678",
    commission_rate: 15,
    total_earnings: 6780,
    notes: "Payment completed successfully"
  },
  {
    id: "4",
    affiliate_id: "4",
    affiliate_name: "James Wilson",
    affiliate_avatar: "https://i.pravatar.cc/40?img=4",
    tier: "bronze",
    amount: 450,
    status: "pending",
    request_date: "2024-03-12",
    payment_method: "PayPal",
    account_details: "james.wilson@email.com",
    commission_rate: 10,
    total_earnings: 450,
    notes: "First payout request"
  }
];

export default function AffiliatePayoutsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTier, setSelectedTier] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700";
      case "processing": return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700";
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700";
      case "failed": return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-700";
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

  const filteredPayouts = payoutRequests.filter(payout => {
    const matchesSearch = payout.affiliate_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payout.payment_method.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || payout.status === selectedStatus;
    const matchesTier = selectedTier === "all" || payout.tier === selectedTier;
    
    return matchesSearch && matchesStatus && matchesTier;
  });

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
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Payout Requests</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">Manage and process affiliate payout requests</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
            <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg">
              <Edit className="h-5 w-5 mr-2" />
              Process All
            </button>
          </div>
        </div>

        {/* Basic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
                <ArrowUpRight className="h-4 w-4" />
                <span>+14.2%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Total Payouts
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                $6,440
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Users2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
                <ArrowUpRight className="h-4 w-4" />
                <span>+3</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Pending Requests
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {payoutRequests.filter(p => p.status === "pending").length}
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                <span>Due Today</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Pending Amount
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                $3,290
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400">
                <ArrowUpRight className="h-4 w-4" />
                <span>+2.1%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Success Rate
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                98.5%
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Search and Filters */}
        <GlassCard className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Search payouts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="relative">
                <select 
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                >
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

        {/* Payout Requests Table */}
        <GlassCard className="overflow-hidden">
          <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Payout Requests ({filteredPayouts.length})
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
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Commission Rate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 dark:divide-slate-700/30">
                {filteredPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-white/30 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Image
                          src={payout.affiliate_avatar}
                          alt={payout.affiliate_name}
                          width={40}
                          height={40}
                          className="rounded-full mr-3"
                        />
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {payout.affiliate_name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {payout.account_details}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTierColor(payout.tier)}`}>
                        {payout.tier.charAt(0).toUpperCase() + payout.tier.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        ${payout.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {payout.commission_rate}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-white">
                        {payout.payment_method}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payout.status)}`}>
                        {payout.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                        {payout.status === "processing" && <AlertCircle className="h-3 w-3 mr-1" />}
                        {payout.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {payout.status === "failed" && <XCircle className="h-3 w-3 mr-1" />}
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {new Date(payout.request_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        {payout.status === "pending" && (
                          <>
                            <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors">
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
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