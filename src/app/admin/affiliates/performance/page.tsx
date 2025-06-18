"use client";

import {
  BarChart2,
  TrendingUp,
  UserPlus,
  DollarSign,
  Percent,
  Users,
  Calendar,
} from "lucide-react";

// Mock data for metrics and chart
const metrics = [
  { label: "Total Clicks", value: 1240, icon: <TrendingUp className="h-6 w-6 text-blue-500" /> },
  { label: "Sign-ups", value: 320, icon: <UserPlus className="h-6 w-6 text-green-500" /> },
  { label: "Paid Conversions", value: 75, icon: <DollarSign className="h-6 w-6 text-purple-500" /> },
  { label: "Conversion Rate", value: "23.4%", icon: <Percent className="h-6 w-6 text-orange-500" /> },
  { label: "Commission Earned", value: "$2,150", icon: <DollarSign className="h-6 w-6 text-teal-500" /> },
  { label: "Withdrawable Balance", value: "$1,200", icon: <DollarSign className="h-6 w-6 text-emerald-500" /> },
];

const chartData = [
  { date: "2024-06-01", clicks: 40, signups: 10, conversions: 2 },
  { date: "2024-06-02", clicks: 60, signups: 15, conversions: 4 },
  { date: "2024-06-03", clicks: 80, signups: 20, conversions: 6 },
  { date: "2024-06-04", clicks: 120, signups: 30, conversions: 10 },
  { date: "2024-06-05", clicks: 100, signups: 25, conversions: 8 },
  { date: "2024-06-06", clicks: 90, signups: 18, conversions: 7 },
  { date: "2024-06-07", clicks: 110, signups: 22, conversions: 9 },
];

const recentActivity = [
  { id: 1, affiliate: "John Doe", action: "Requested payout", date: "2024-06-06", amount: "$200" },
  { id: 2, affiliate: "Jane Smith", action: "New paid conversion", date: "2024-06-05", amount: "$50" },
  { id: 3, affiliate: "Mike Lee", action: "New sign-up", date: "2024-06-05", amount: null },
  { id: 4, affiliate: "Sarah Kim", action: "Requested payout", date: "2024-06-04", amount: "$120" },
];

export default function AffiliatePerformancePage() {
  // For chart, just a simple bar chart mockup
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart2 className="h-8 w-8 text-indigo-500" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Affiliate Performance</h1>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white dark:bg-slate-800 rounded-xl p-5 flex flex-col items-center shadow-sm">
            <div className="mb-2">{m.icon}</div>
            <div className="text-lg font-semibold text-slate-900 dark:text-white">{m.value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Chart Section (mocked) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="h-5 w-5 text-indigo-500" />
          <span className="font-semibold text-slate-900 dark:text-white">Weekly Performance</span>
        </div>
        <div className="w-full h-48 flex items-end gap-2">
          {chartData.map((d) => (
            <div key={d.date} className="flex flex-col items-center flex-1">
              <div className="flex gap-1 mb-1">
                <div
                  className="bg-blue-400 rounded w-3"
                  style={{ height: `${d.clicks / 2}px` }}
                  title={`Clicks: ${d.clicks}`}
                />
                <div
                  className="bg-green-400 rounded w-3"
                  style={{ height: `${d.signups * 2}px` }}
                  title={`Signups: ${d.signups}`}
                />
                <div
                  className="bg-purple-400 rounded w-3"
                  style={{ height: `${d.conversions * 4}px` }}
                  title={`Conversions: ${d.conversions}`}
                />
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {new Date(d.date).getDate()}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-400 rounded inline-block" /> Clicks</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded inline-block" /> Sign-ups</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-400 rounded inline-block" /> Conversions</span>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-indigo-500" />
          <span className="font-semibold text-slate-900 dark:text-white">Recent Affiliate Activity</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Affiliate</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Action</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentActivity.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-2 text-slate-900 dark:text-white">{a.affiliate}</td>
                  <td className="px-4 py-2 text-slate-500 dark:text-slate-400">{a.action}</td>
                  <td className="px-4 py-2 text-slate-500 dark:text-slate-400 flex items-center gap-1"><Calendar className="h-4 w-4 mr-1" />{a.date}</td>
                  <td className="px-4 py-2 text-slate-900 dark:text-white">{a.amount || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 