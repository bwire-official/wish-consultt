"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from '@/lib/supabase/client';
import { InlineLoader } from '@/components/ui/loaders';
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

interface AffiliateProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  role: string;
  email: string | null;
  avatar_url: string | null;
}

interface AffiliateNavbarProps {
  profile: AffiliateProfile;
  onSidebarToggle: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}



export function AffiliateNavbar({ profile, onSidebarToggle, isDarkMode, onThemeToggle }: AffiliateNavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();



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



  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      router.push('/affiliate/login');
    } catch (error) {
      console.error('Sign out error:', error);
      setIsSigningOut(false); // Re-enable button on error
    }
  };

  // Format role for display
  const formatRole = (role: string) => {
    if (!role) return 'User';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
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
        <div className="relative">
          <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-lg transition-all duration-300 backdrop-blur-sm">
            <Bell className="h-5 w-5" />
          </button>
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || profile.username || 'User'}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {profile.full_name 
                      ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
                      : profile.username 
                      ? profile.username.charAt(0).toUpperCase()
                      : 'A'
                    }
                  </span>
                </div>
              )}
            </div>
            
            {/* Name and Role */}
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {profile.full_name || profile.username || 'User'}
              </span>
              <span className="text-xs px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md font-medium">
                {formatRole(profile.role)}
              </span>
            </div>
            
            <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50">
              {profile.username && (
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-600 dark:text-slate-400">@{profile.username}</p>
                </div>
              )}
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Profile</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Settings</span>
                </button>
                <button 
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSigningOut ? (
                    <>
                      <InlineLoader width={16} />
                      <span className="text-sm">Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Sign Out</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 