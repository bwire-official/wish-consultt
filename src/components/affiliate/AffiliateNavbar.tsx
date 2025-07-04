"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';
import { InlineLoader } from '@/components/ui/loaders';
import NotificationBell from "@/components/shared/HybridNotificationBell";
import { 
  Menu,  
  Search, 
  Sun, 
  Moon, 
  ChevronDown,
  User,
  Settings,
  LogOut,
  Zap,
  Users as UsersIcon
} from "lucide-react";
// import { useTheme } from "next-themes";
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
    <nav className="fixed top-0 left-0 right-0 h-16 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 z-40">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Side */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSidebarToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-white/20 dark:hover:bg-slate-800/20"
            >
              <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
            <Link href="/affiliate/dashboard" className="hidden sm:flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                <UsersIcon className="h-5 w-5 text-white" />
              </div>
              <span className="hidden sm:inline">Affiliate</span>
            </Link>
          </div>

          {/* Center */}
          <div className="hidden lg:flex flex-1 justify-center px-8">
            <div className="w-full max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search affiliate panel..."
                  className="w-full pl-10 pr-4 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg group">
              <Zap className="h-5 w-5 group-hover:animate-pulse" />
            </button>
            <button onClick={onThemeToggle} className="p-2 text-slate-600 dark:text-slate-400 rounded-lg">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <NotificationBell userId={profile.id} userRole="affiliate" />

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-1 rounded-lg">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                    {profile.avatar_url ? (
                        <Image src={profile.avatar_url} alt="User" width={32} height={32} />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">{profile.full_name ? profile.full_name[0] : 'A'}</span>
                        </div>
                    )}
                </div>
                <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {profile.full_name || profile.username || 'User'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatRole(profile.role)}
                    </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border rounded-xl shadow-xl z-50">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{profile.full_name || 'Affiliate User'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{profile.username || profile.email}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <User className="h-4 w-4" /> <span>Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Settings className="h-4 w-4" /> <span>Settings</span>
                    </button>
                    <button onClick={handleSignOut} disabled={isSigningOut} className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                      {isSigningOut ? <InlineLoader /> : <LogOut className="h-4 w-4" />}
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 