"use client";

import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  Download,
  BarChart3
  
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function EarningsPage() {
  // Mock earnings data
  const earningsData = {
    totalEarnings: 2450,
    thisMonth: 890,
    lastMonth: 756,
    pendingPayout: 450,
    totalCommissions: 156,
    conversionRate: 12.5,
    monthlyGrowth: {
      total: 18,
      thisMonth: 15,
      conversion: 2.1
    }
  };

  const recentTransactions = [
    {
      id: "1",
      type: "commission",
      amount: 45.00,
      description: "Commission from invite #1234",
      date: "2024-01-15",
      status: "completed",
      invite: "John Doe"
    },
    {
      id: "2",
      type: "commission",
      amount: 32.50,
      description: "Commission from invite #1235",
      date: "2024-01-14",
      status: "completed",
      invite: "Sarah Wilson"
    },
    {
      id: "3",
      type: "payout",
      amount: -500.00,
      description: "Payout to bank account",
      date: "2024-01-10",
      status: "completed",
      invite: null
    },
    {
      id: "4",
      type: "commission",
      amount: 78.75,
      description: "Commission from invite #1236",
      date: "2024-01-13",
      status: "completed",
      invite: "Mike Johnson"
    },
    {
      id: "5",
      type: "commission",
      amount: 23.00,
      description: "Commission from invite #1237",
      date: "2024-01-12",
      status: "pending",
      invite: "Emily Chen"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'commission' ? (
      <DollarSign className="h-5 w-5 text-white" />
    ) : (
      <CreditCard className="h-5 w-5 text-white" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Earnings</h1>
          <p className="text-slate-600 dark:text-slate-400">Track your affiliate commissions and payouts</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 w-full sm:w-auto">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <GlassCard className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Total Earnings</p>
              <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">${earningsData.totalEarnings.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                +{earningsData.monthlyGrowth.total}% this month
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">This Month</p>
              <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">${earningsData.thisMonth.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                +{earningsData.monthlyGrowth.thisMonth}% vs last month
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Pending Payout</p>
              <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">${earningsData.pendingPayout.toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1 mt-1">
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                Ready for withdrawal
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Conversion Rate</p>
              <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">{earningsData.conversionRate}%</p>
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                +{earningsData.monthlyGrowth.conversion}% this month
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Transactions */}
      <GlassCard className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white/30 dark:bg-slate-800/30 rounded-xl border border-white/20 dark:border-slate-700/20 gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'commission' 
                    ? 'bg-green-500' 
                    : 'bg-blue-500'
                }`}>
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">{transaction.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    <span>{transaction.date}</span>
                    {transaction.invite && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="truncate">From: {transaction.invite}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
                <div className="text-right">
                  <p className={`font-bold text-base sm:text-lg ${
                    transaction.amount > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <GlassCard className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4">Request Payout</h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
            You have ${earningsData.pendingPayout.toLocaleString()} available for withdrawal.
          </p>
          <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300">
            Request Payout
          </button>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4">Earnings History</h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
            View detailed earnings reports and analytics.
          </p>
          <button className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
            View Reports
          </button>
        </GlassCard>
      </div>
    </div>
  );
} 