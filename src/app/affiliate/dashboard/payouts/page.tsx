"use client";

import { 
  DollarSign, 
  CreditCard, 
  Banknote, 
 
  Download,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Wallet,
  TrendingUp,
  History
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";

export default function PayoutsPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("bank");

  // Mock payout data
  const payoutData = {
    availableBalance: 450.75,
    pendingPayouts: 125.50,
    totalEarned: 2450.00,
    totalPaid: 1873.75,
    minimumPayout: 50.00
  };

  const payoutHistory = [
    {
      id: "1",
      amount: 500.00,
      method: "Bank Transfer",
      status: "completed",
      date: "2024-01-15",
      reference: "PAY-2024-001",
      account: "****1234"
    },
    {
      id: "2",
      amount: 350.25,
      method: "PayPal",
      status: "completed",
      date: "2024-01-08",
      reference: "PAY-2024-002",
      account: "john.doe@email.com"
    },
    {
      id: "3",
      amount: 275.50,
      method: "Bank Transfer",
      status: "processing",
      date: "2024-01-22",
      reference: "PAY-2024-003",
      account: "****1234"
    },
    {
      id: "4",
      amount: 200.00,
      method: "PayPal",
      status: "failed",
      date: "2024-01-20",
      reference: "PAY-2024-004",
      account: "john.doe@email.com"
    },
    {
      id: "5",
      amount: 548.00,
      method: "Bank Transfer",
      status: "completed",
      date: "2024-01-01",
      reference: "PAY-2024-005",
      account: "****1234"
    }
  ];

  const paymentMethods = [
    {
      id: "bank",
      name: "Bank Transfer",
      icon: <Banknote className="h-5 w-5" />,
      account: "****1234",
      isDefault: true,
      lastUsed: "2024-01-15"
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <CreditCard className="h-5 w-5" />,
      account: "john.doe@email.com",
      isDefault: false,
      lastUsed: "2024-01-08"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'processing': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'pending': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Payouts</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your earnings and payment methods</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 w-full sm:w-auto">
          <Download className="h-4 w-4" />
          Export History
        </button>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <GlassCard className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Available Balance</p>
              <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">${payoutData.availableBalance.toFixed(2)}</p>
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                Ready for payout
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Pending Payouts</p>
              <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">${payoutData.pendingPayouts.toFixed(2)}</p>
              <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                Processing
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Total Earned</p>
              <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">${payoutData.totalEarned.toFixed(2)}</p>
              <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                Lifetime earnings
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Total Paid</p>
              <p className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">${payoutData.totalPaid.toFixed(2)}</p>
              <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-1">
                <History className="h-3 w-3 sm:h-4 sm:w-4" />
                All time payouts
              </p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Request Payout */}
      <GlassCard className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-4">Request Payout</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
              You have <span className="font-semibold text-slate-900 dark:text-white">${payoutData.availableBalance.toFixed(2)}</span> available for withdrawal.
              Minimum payout amount is <span className="font-semibold text-slate-900 dark:text-white">${payoutData.minimumPayout.toFixed(2)}</span>.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Payout Amount
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Payment Method
                </label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.id}>
                      {method.name} - {method.account}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
                disabled={payoutData.availableBalance < payoutData.minimumPayout}
              >
                Request Payout
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-4">Payment Methods</h3>
            <div className="space-y-3">
              {paymentMethods.map(method => (
                <div key={method.id} className="flex items-center justify-between p-3 sm:p-4 bg-white/30 dark:bg-slate-800/30 rounded-lg border border-white/20 dark:border-slate-700/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                      {method.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">{method.name}</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">{method.account}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                        Default
                      </span>
                    )}
                    <button className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-purple-500 hover:text-purple-500 transition-colors">
                <Plus className="h-4 w-4" />
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Payout History */}
      <GlassCard className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-4">Payout History</h2>
        <div className="space-y-4">
          {payoutHistory.map((payout) => (
            <div key={payout.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white/30 dark:bg-slate-800/30 rounded-lg border border-white/20 dark:border-slate-700/20 gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate">{payout.method}</p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {payout.date} • {payout.reference}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                <div className="text-right">
                  <p className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">${payout.amount.toFixed(2)}</p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">{payout.account}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(payout.status)}`}>
                    {payout.status}
                  </span>
                  {getStatusIcon(payout.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <GlassCard className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4">Payout Schedule</h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
            Set up automatic payouts or schedule recurring payments.
          </p>
          <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300">
            Configure Schedule
          </button>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4">Tax Documents</h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
            Download your tax documents and earnings reports for the year.
          </p>
          <button className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
            Download Documents
          </button>
        </GlassCard>
      </div>
    </div>
  );
} 