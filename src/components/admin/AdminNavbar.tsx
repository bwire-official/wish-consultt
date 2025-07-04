"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Settings, 
  LogOut,
  User,
  Moon,
  Sun,
  Menu,
  X,
  Search,
  ChevronDown,
  HelpCircle,
  Shield,
  BarChart3,
  FileText,
  Zap
} from "lucide-react";
import { useTheme } from "next-themes";
import { ButtonLoader } from "@/components/ui/loaders";
import { signOut } from "@/app/auth/actions/actions";
import NotificationBell from "@/components/shared/HybridNotificationBell";

interface AdminNavbarProps {
  profile: {
    id: string;
    full_name?: string;
    username?: string;
    avatar_url?: string;
    role?: string;
    email?: string;
  };
}

export function AdminNavbar({ profile }: AdminNavbarProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fix hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickActions = [
    { name: "Create Course", href: "/admin/courses/create", icon: FileText },
    { name: "View Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Manage Users", href: "/admin/users", icon: User },
    { name: "System Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-white/20 dark:border-slate-700/50 shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-lg hover:text-teal-700 dark:hover:text-teal-300 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="hidden sm:inline">Wish Consult Admin</span>
              <span className="sm:hidden">Admin</span>
            </Link>
          </div>

          {/* Desktop Center - Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search admin panel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Desktop Right Side - Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* AI Assistant */}
            <div className="relative">
              <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-300 group backdrop-blur-sm">
                <Zap className="h-5 w-5 group-hover:animate-pulse" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-teal-500 rounded-full animate-pulse"></span>
              </button>
            </div>

            {/* Theme Toggle - Fixed Hydration Issue */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )
              ) : (
                <div className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <NotificationBell userId={profile.id} userRole="admin" />

            {/* User Profile Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-300 backdrop-blur-sm"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center overflow-hidden shadow-lg">
                  {profile?.avatar_url ? (
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${profile.avatar_url})` }}
                    />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {profile?.full_name || profile?.username || 'Admin'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {profile?.role}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 backdrop-blur-lg bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-xl border border-white/20 dark:border-slate-700/50 z-[9999]">
                  <div className="p-4 border-b border-white/20 dark:border-slate-700/50">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {profile?.full_name || profile?.username || 'Admin'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {profile?.role} • {profile?.email}
                    </div>
                  </div>
                  <div className="py-2">
                    <Link href="/admin/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50">
                      <User className="h-4 w-4" />
                      Profile Settings
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50">
                      <Settings className="h-4 w-4" />
                      System Settings
                    </Link>
                    <Link href="/admin/help" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50">
                      <HelpCircle className="h-4 w-4" />
                      Help & Support
                    </Link>
                  </div>
                  <div className="py-2 border-t border-white/20 dark:border-slate-700/50">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isLoggingOut ? (
                        <ButtonLoader />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Right Side */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Search Toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications - Mobile */}
            <NotificationBell userId={profile.id} userRole="admin" />

            {/* Theme Toggle - Fixed Hydration Issue */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )
              ) : (
                <div className="h-5 w-5" />
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="lg:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search admin panel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
              />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden backdrop-blur-lg bg-white/90 dark:bg-slate-800/90 border-t border-white/20 dark:border-slate-700/50">
            <div className="px-4 py-3 space-y-3">
              {/* Quick Actions */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="flex items-center gap-2 p-3 rounded-lg bg-white/30 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-600/50 transition-colors backdrop-blur-sm"
                    >
                      <action.icon className="h-4 w-4" />
                      <span className="text-sm">{action.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/30 dark:bg-slate-700/50 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center shadow-lg">
                  {profile?.avatar_url ? (
                    <div 
                      className="w-full h-full bg-cover bg-center rounded-full"
                      style={{ backgroundImage: `url(${profile.avatar_url})` }}
                    />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {profile?.full_name || profile?.username || 'Admin'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {profile?.role}
                  </div>
                </div>
              </div>

              {/* Mobile Menu Links */}
              <div className="space-y-1">
                <Link href="/admin/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                  <User className="h-4 w-4" />
                  Profile Settings
                </Link>
                <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                  <Settings className="h-4 w-4" />
                  System Settings
                </Link>
                <Link href="/admin/help" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                  <HelpCircle className="h-4 w-4" />
                  Help & Support
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <ButtonLoader />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
 
