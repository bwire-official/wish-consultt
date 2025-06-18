"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Eye,
  Edit,
  Trash2,
  Mail,
  BookOpen,
  Award,
  Star,
  Clock,
  UserPlus,
  Send,
  Ban,
  XCircle,
  BarChart2,
} from "lucide-react";
import Image from "next/image";
import { Profile } from '@/types';

interface User extends Profile {
  avatar_url: string;
  phone_number: string | null;
  location: string | null;
  status: "active" | "inactive" | "suspended" | "warned";
  last_active: string | null;
  joined_date: string;
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

// Mock data - replace with actual data from your backend
const users: User[] = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    referred_by: null,
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
    courses: {
      enrolled: 3,
      completed: 1,
      in_progress: 2,
      certificates: 1,
    },
    progress: {
      current_course: "Introduction to Healthcare",
      completion_rate: 65,
      average_score: 85,
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
  // Add more mock users here
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [newUser, setNewUser] = useState<{
    name: string;
    username: string;
    email: string;
    phone: string;
    role: "student" | "instructor" | "admin";
    status: boolean;
  }>({
    name: "",
    username: "",
    email: "",
    phone: "",
    role: "student",
    status: true,
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Users</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage and monitor user accounts</p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
            <BarChart2 className="h-5 w-5 mr-2" />Analytics
          </button>
          <button
            className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600"
            onClick={() => { setShowAddUser(true); setAddStep(1); setNewUser({ name: "", username: "", email: "", phone: "", role: "student", status: true }); }}
          >
            <UserPlus className="h-5 w-5 mr-2" />Add User
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Users</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">1,234</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Today</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">156</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Course Enrollments</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">3,456</p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Certificates Issued</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">789</p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
          className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avatar</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Username</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Active</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No users found.</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-4"><Image src={user.avatar_url} alt={user.full_name || 'User avatar'} className="h-8 w-8 rounded-full" width={32} height={32} /></td>
                  <td className="px-4 py-4 text-slate-900 dark:text-white font-medium">{user.full_name}</td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{user.username}</td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{user.email}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : user.status === "inactive"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        : user.status === "suspended"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400 capitalize">{user.role}</td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{user.progress.last_activity}</td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Profile"
                        onClick={() => { setSelectedUser(user); setShowProfile(true); }}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300" title="Edit User">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" title="Suspend User">
                        <Ban className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300" title="Delete User">
                        <Trash2 className="h-5 w-5" />
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
              <Image src={selectedUser.avatar_url} alt={selectedUser.full_name || 'User avatar'} className="h-12 w-12 rounded-full" width={48} height={48} />
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">{selectedUser.full_name}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">@{selectedUser.username}</div>
                <div className="text-xs text-slate-400 mt-1">{selectedUser.email}</div>
                <div className="text-xs text-slate-400 mt-1">{selectedUser.location}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Phone</div>
                <div className="font-medium text-slate-900 dark:text-white">{selectedUser.phone_number}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Joined</div>
                <div className="font-medium text-slate-900 dark:text-white">{selectedUser.joined_date}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Status</div>
                <div className="font-medium text-slate-900 dark:text-white capitalize">{selectedUser.status}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Role</div>
                <div className="font-medium text-slate-900 dark:text-white capitalize">{selectedUser.role}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Course Stats</div>
              <div className="flex gap-4">
                <span className="inline-flex items-center gap-1 text-xs"><BookOpen className="h-4 w-4 text-blue-400" /> {selectedUser.courses.enrolled} enrolled</span>
                <span className="inline-flex items-center gap-1 text-xs"><Award className="h-4 w-4 text-yellow-400" /> {selectedUser.courses.certificates} certs</span>
                <span className="inline-flex items-center gap-1 text-xs"><Star className="h-4 w-4 text-purple-400" /> {selectedUser.courses.completed} completed</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Preferences</div>
              <div className="text-sm text-slate-900 dark:text-white">Language: {selectedUser.preferences.language}, Theme: {selectedUser.preferences.theme}, Notifications: {selectedUser.preferences.notifications ? "On" : "Off"}</div>
            </div>
            <div className="mb-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Warnings</div>
              <div className="text-sm text-slate-900 dark:text-white">{selectedUser.warnings} {selectedUser.last_warning && `(Last: ${selectedUser.last_warning})`}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-teal-500 text-white font-semibold flex items-center gap-2"><Mail className="h-4 w-4" />Email</button>
              <button className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold flex items-center gap-2"><Send className="h-4 w-4" />Message</button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Wizard Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md p-8 relative">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" onClick={() => setShowAddUser(false)}>
              <XCircle className="h-6 w-6" />
            </button>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New User</h2>
              <div className="flex gap-2 mt-2">
                {[1,2,3,4].map((step) => (
                  <div key={step} className={`h-2 w-8 rounded-full ${addStep >= step ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                ))}
              </div>
            </div>
            {addStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                  <input type="text" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white" value={newUser.name} onChange={e => setNewUser(u => ({...u, name: e.target.value}))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Username</label>
                  <input type="text" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white" value={newUser.username} onChange={e => setNewUser(u => ({...u, username: e.target.value}))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Email</label>
                  <input type="email" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white" value={newUser.email} onChange={e => setNewUser(u => ({...u, email: e.target.value}))} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Phone</label>
                  <input type="text" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white" value={newUser.phone} onChange={e => setNewUser(u => ({...u, phone: e.target.value}))} />
                </div>
                <div className="flex justify-end">
                  <button className="px-4 py-2 rounded-lg bg-teal-500 text-white font-semibold" onClick={() => setAddStep(2)}>Next</button>
                </div>
              </div>
            )}
            {addStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Role</label>
                  <div className="flex gap-2">
                    <button className={`px-4 py-2 rounded-lg border ${newUser.role === 'student' ? 'bg-teal-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600'}`} onClick={() => setNewUser(u => ({...u, role: 'student'}))}>Student</button>
                    <button className={`px-4 py-2 rounded-lg border ${newUser.role === 'instructor' ? 'bg-teal-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600'}`} onClick={() => setNewUser(u => ({...u, role: 'instructor'}))}>Instructor</button>
                    <button className={`px-4 py-2 rounded-lg border ${newUser.role === 'admin' ? 'bg-teal-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600'}`} onClick={() => setNewUser(u => ({...u, role: 'admin'}))}>Admin</button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Make this user an Admin?</span>
                  <button
                    className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${newUser.role === 'admin' ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                    onClick={() => setNewUser(u => ({...u, role: u.role === 'admin' ? 'student' : 'admin'}))}
                  >
                    <span className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${newUser.role === 'admin' ? 'translate-x-6' : ''}`}></span>
                  </button>
                </div>
                <div className="flex justify-between">
                  <button className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold" onClick={() => setAddStep(1)}>Back</button>
                  <button className="px-4 py-2 rounded-lg bg-teal-500 text-white font-semibold" onClick={() => setAddStep(3)}>Next</button>
                </div>
              </div>
            )}
            {addStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Status</span>
                  <button
                    className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${newUser.status ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                    onClick={() => setNewUser(u => ({...u, status: !u.status}))}
                  >
                    <span className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${newUser.status ? 'translate-x-6' : ''}`}></span>
                  </button>
                </div>
                <div className="flex justify-between">
                  <button className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold" onClick={() => setAddStep(2)}>Back</button>
                  <button className="px-4 py-2 rounded-lg bg-teal-500 text-white font-semibold" onClick={() => setAddStep(4)}>Next</button>
                </div>
              </div>
            )}
            {addStep === 4 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Review Details</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Name: <span className="text-slate-900 dark:text-white">{newUser.name}</span></div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Username: <span className="text-slate-900 dark:text-white">{newUser.username}</span></div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Email: <span className="text-slate-900 dark:text-white">{newUser.email}</span></div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Phone: <span className="text-slate-900 dark:text-white">{newUser.phone}</span></div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Role: <span className="text-slate-900 dark:text-white capitalize">{newUser.role}</span></div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Status: <span className="text-slate-900 dark:text-white">{newUser.status ? 'Active' : 'Inactive'}</span></div>
                </div>
                <div className="flex justify-between">
                  <button className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold" onClick={() => setAddStep(3)}>Back</button>
                  <button className="px-4 py-2 rounded-lg bg-teal-500 text-white font-semibold" onClick={() => { setShowAddUser(false); /* TODO: Add user to backend */ }}>Create User</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 