"use client";

import { useState } from "react";
import {
  Users,
  Eye,
  UserCheck,
  UserX,
  DollarSign,
  CheckCircle2,
  XCircle,
  Download,
  BarChart2,
  BookOpen,
  Award,
  Star,
  Filter,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Profile } from '@/types';

// Define Payment type for payment history
interface Payment {
  id: string;
  created_at: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  course_id: string;
  course_name: string;
  status: "pending" | "completed" | "failed" | "refunded";
}

interface UserCourses {
  enrolled: number;
  completed: number;
  in_progress: number;
  certificates: number;
}

interface PremiumUser extends Profile {
  avatar_url: string | null;
  phone_number: string | null;
  location: string | null;
  registration_date: string;
  last_login: string | null;
  premium_since: string;
  total_spent: number;
  status: "active" | "inactive";
  courses: UserCourses;
  payments: Payment[];
  warnings: number;
  last_warning: string | null;
  is_premium: boolean;
  onboarding_completed: boolean;
}

// Mock data - replace with actual backend data
const payingUsers: PremiumUser[] = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    username: "johndoe",
    full_name: "John Doe",
    email: "john@example.com",
    avatar_url: null,
    role: "student",
    is_premium: true,
    onboarding_completed: true,
    onboarding_data: {},
    phone_number: "+1 (555) 123-4567",
    location: "New York, USA",
    registration_date: "2024-01-10",
    last_login: "2024-06-07",
    premium_since: "2024-02-15",
    total_spent: 249.98,
    status: "active",
    courses: {
      enrolled: 3,
      completed: 2,
      in_progress: 1,
      certificates: 1,
    },
    payments: [
      { 
        id: "1", 
        created_at: "2024-02-15T10:30:00Z",
        user_id: "1",
        amount: 99.99, 
        currency: "USD",
        payment_method: "card", 
        course_id: "1",
        course_name: "Intro to Healthcare", 
        status: "completed" 
      },
      { 
        id: "2", 
        created_at: "2024-03-10T14:20:00Z",
        user_id: "1",
        amount: 149.99, 
        currency: "USD",
        payment_method: "card", 
        course_id: "2",
        course_name: "Basic Anatomy", 
        status: "completed" 
      },
    ],
    warnings: 0,
    last_warning: null,
    referred_by: null,
  },
  {
    id: "2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    username: "janesmith",
    full_name: "Jane Smith",
    email: "jane@example.com",
    avatar_url: null,
    role: "student",
    is_premium: true,
    onboarding_completed: true,
    onboarding_data: {},
    phone_number: "+1 (555) 987-6543",
    location: "London, UK",
    registration_date: "2024-02-01",
    last_login: "2024-06-06",
    premium_since: "2024-03-10",
    total_spent: 149.99,
    status: "inactive",
    courses: {
      enrolled: 2,
      completed: 1,
      in_progress: 1,
      certificates: 1,
    },
    payments: [
      { 
        id: "1", 
        created_at: "2024-03-10T00:00:00Z",
        user_id: "2",
        amount: 149.99, 
        currency: "USD",
        payment_method: "card", 
        course_id: "2",
        course_name: "Basic Anatomy", 
        status: "completed" 
      },
    ],
    warnings: 1,
    last_warning: "2024-05-01",
    referred_by: null,
  },
  // Add more mock users as needed
];

const stats = {
  totalPaying: 234,
  totalRevenue: 24999,
  avgSpend: 107,
  active: 210,
  inactive: 24,
};

export default function PayingUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<PremiumUser | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filteredUsers = payingUsers.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone_number?.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Bulk select logic
  const toggleRow = (id: string) => {
    setSelectedRows((rows) =>
      rows.includes(id) ? rows.filter((row) => row !== id) : [...rows, id]
    );
  };
  const toggleAll = () => {
    if (selectedRows.length === filteredUsers.length) setSelectedRows([]);
    else setSelectedRows(filteredUsers.map((u) => u.id));
  };

  return (
    <div className="space-y-8">
      {/* Stats/Analytics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex items-center gap-3">
          <Users className="h-6 w-6 text-teal-500" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Paying Users</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{stats.totalPaying}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-green-500" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Revenue</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">${stats.totalRevenue.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex items-center gap-3">
          <BarChart2 className="h-6 w-6 text-blue-500" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Avg. Spend</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">${stats.avgSpend}</div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Active / Inactive</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{stats.active} / {stats.inactive}</div>
          </div>
        </div>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Advanced
          </button>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center gap-2" disabled={selectedRows.length === 0}>
            <UserX className="h-4 w-4" />
            Deactivate
          </button>
          <button className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center gap-2" disabled={selectedRows.length === 0}>
            <UserCheck className="h-4 w-4" />
            Reactivate
          </button>
          <button className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="px-4 py-3">
                <input type="checkbox" checked={selectedRows.length === filteredUsers.length && filteredUsers.length > 0} onChange={toggleAll} />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Premium Since</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Spent</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Courses</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  No paying users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-4">
                    <input type="checkbox" checked={selectedRows.includes(user.id)} onChange={() => toggleRow(user.id)} />
                  </td>
                  <td className="px-4 py-4 text-slate-900 dark:text-white font-medium">{user.full_name}</td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{user.email}</td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{user.premium_since}</td>
                  <td className="px-4 py-4 text-slate-900 dark:text-white">${user.total_spent.toFixed(2)}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-2 text-xs">
                      <BookOpen className="h-4 w-4 text-blue-400" /> {user.courses.enrolled} enrolled
                      <Award className="h-4 w-4 text-yellow-400 ml-2" /> {user.courses.certificates} certs
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }`}>
                      {user.status === "active" ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Profile"
                        onClick={() => { setSelectedUser(user); setShowProfile(true); }}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        className="p-1 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                        title="Payment History"
                        onClick={() => { setSelectedUser(user); setShowPayments(true); }}
                      >
                        <DollarSign className="h-5 w-5" />
                      </button>
                      {user.status === "active" ? (
                        <button
                          className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Deactivate User"
                        >
                          <UserX className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                          title="Reactivate User"
                        >
                          <UserCheck className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        className="p-1 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                        title="Send Message"
                      >
                        <Mail className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Profile Modal */}
      {showProfile && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-lg p-8 relative">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" onClick={() => setShowProfile(false)}>
              <XCircle className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-4 mb-4">
              <Users className="h-8 w-8 text-teal-500" />
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">{selectedUser.full_name}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{selectedUser.email}</div>
                <div className="text-xs text-slate-400 mt-1">{selectedUser.location}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Phone</div>
                <div className="font-medium text-slate-900 dark:text-white">{selectedUser.phone_number}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Registered</div>
                <div className="font-medium text-slate-900 dark:text-white">{selectedUser.registration_date}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Last Login</div>
                <div className="font-medium text-slate-900 dark:text-white">{selectedUser.last_login}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Premium Since</div>
                <div className="font-medium text-slate-900 dark:text-white">{selectedUser.premium_since}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Course Progress</div>
              <div className="flex gap-4">
                <span className="inline-flex items-center gap-1 text-xs"><BookOpen className="h-4 w-4 text-blue-400" /> {selectedUser.courses.enrolled} enrolled</span>
                <span className="inline-flex items-center gap-1 text-xs"><Award className="h-4 w-4 text-yellow-400" /> {selectedUser.courses.certificates} certs</span>
                <span className="inline-flex items-center gap-1 text-xs"><Star className="h-4 w-4 text-purple-400" /> {selectedUser.courses.completed} completed</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Warnings</div>
              <div className="text-sm text-slate-900 dark:text-white">{selectedUser.warnings} {selectedUser.last_warning && `(Last: ${selectedUser.last_warning})`}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-teal-500 text-white font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4" />Send Message</button>
              <button className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold flex items-center gap-2"><Mail className="h-4 w-4" />Email</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment History Modal */}
      {showPayments && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md p-8 relative">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" onClick={() => setShowPayments(false)}>
              <XCircle className="h-6 w-6" />
            </button>
            <div className="mb-4">
              <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">Payment History</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{selectedUser.full_name}</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">Date</th>
                    <th className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">Amount</th>
                    <th className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">Method</th>
                    <th className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">Course</th>
                    <th className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUser.payments.map((p: Payment) => (
                    <tr key={p.id}>
                      <td className="px-3 py-2 text-sm">{p.created_at}</td>
                      <td className="px-3 py-2 text-sm">${p.amount.toFixed(2)}</td>
                      <td className="px-3 py-2 text-sm">{p.payment_method}</td>
                      <td className="px-3 py-2 text-sm">{p.course_name}</td>
                      <td className="px-3 py-2 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          p.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}>
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 