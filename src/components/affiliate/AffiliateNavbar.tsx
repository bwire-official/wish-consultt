"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Menu, 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  ChevronDown,
  User,
  Settings,
  LogOut,
  Zap
} from "lucide-react";
// import { useTheme } from "next-themes";
// import Link from "next/link";
//import { GlassCard } from "@/components/ui/glass-card";

interface Profile {
  id: string;
  full_name: string;
  username: string;
  role: string;
  email: string;
}

interface AffiliateNavbarProps {
  profile: Profile;
  onSidebarToggle: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function AffiliateNavbar({ profile, onSidebarToggle, isDarkMode, onThemeToggle }: AffiliateNavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Mock notifications
  const notifications: Notification[] = [
    {
      id: "1",
      type: "success",
      title: "New Commission Earned",
      message: "You earned $45.00 from invite #1234",
      time: "2 hours ago",
      read: false
    },
    {
      id: "2",
      type: "info",
      title: "New Invite Signed Up",
      message: "John Doe joined through your blog link",
      time: "5 hours ago",
      read: false
    },
    {
      id: "3",
      type: "warning",
      title: "Payment Pending",
      message: "Your payout request is being processed",
      time: "1 day ago",
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <div className="h-4 w-4 bg-green-500 rounded-full" />;
      case 'warning': return <div className="h-4 w-4 bg-yellow-500 rounded-full" />;
      case 'error': return <div className="h-4 w-4 bg-red-500 rounded-full" />;
      default: return <div className="h-4 w-4 bg-blue-500 rounded-full" />;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 backdrop-blur-xl bg-white/3 dark:bg-slate-900/3 border-b border-white/20 dark:border-slate-700/20 flex items-center justify-between px-6 z-40">
      {/* Left Side - Sidebar Toggle */}
      <button
        onClick={onSidebarToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-white/20 dark:hover:bg-slate-800/20 transition-all duration-300"
      >
        <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      </button>

      {/* Center - Search (Desktop) */}
      <div className="hidden lg:flex items-center justify-center flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search affiliate panel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
          />
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-2">
        {/* AI Assistant */}
        <div className="relative">
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-lg transition-all duration-300 group backdrop-blur-sm">
            <Zap className="h-5 w-5 group-hover:animate-pulse" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-purple-500 rounded-full animate-pulse"></span>
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-lg transition-all duration-300 backdrop-blur-sm"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-xl shadow-xl z-50">
              <div className="p-4 border-b border-white/20 dark:border-slate-700/50">
                <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-4 border-b border-white/20 dark:border-slate-700/50 ${!notification.read ? 'bg-purple-50 dark:bg-purple-900/20' : ''}`}>
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">{notification.title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{notification.message}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {profile.full_name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-xl shadow-xl z-50">
              <div className="p-4 border-b border-white/20 dark:border-slate-700/50">
                <p className="font-semibold text-slate-900 dark:text-white">{profile.full_name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Affiliate Partner</p>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Profile</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200">
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 