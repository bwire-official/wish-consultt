"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@/lib/supabase/client';
import { InlineLoader } from '@/components/ui/loaders';
import { 
  Home, 
  Users, 
  Link as LinkIcon, 
  BarChart3, 
  FileText, 
  CreditCard, 
  Settings,
  LogOut,
  Award,
  DollarSign,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AffiliateSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AffiliateSidebar({ isOpen, onToggle }: AffiliateSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isSigningOut, setIsSigningOut] = useState(false);

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

  const navigationItems = [
    {
      id: "overview",
      name: "Overview",
      icon: Home,
      href: "/affiliate/dashboard"
    },
    {
      id: "invites",
      name: "My Invites",
      icon: Users,
      href: "/affiliate/dashboard/invites"
    },
    {
      id: "earnings",
      name: "Earnings",
      icon: DollarSign,
      href: "/affiliate/dashboard/earnings"
    },
    {
      id: "links",
      name: "My Links",
      icon: LinkIcon,
      href: "/affiliate/dashboard/links"
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: BarChart3,
      href: "/affiliate/dashboard/analytics"
    },
    {
      id: "materials",
      name: "Marketing Materials",
      icon: FileText,
      href: "/affiliate/dashboard/materials"
    },
    {
      id: "payouts",
      name: "Payouts",
      icon: CreditCard,
      href: "/affiliate/dashboard/payouts"
    },
    {
      id: "settings",
      name: "Settings",
      icon: Settings,
      href: "/affiliate/dashboard/settings"
    }
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 lg:bg-white/3 lg:dark:bg-slate-900/3 border-r border-slate-200 dark:border-slate-700 lg:border-white/20 lg:dark:border-slate-700/20 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 flex flex-col shadow-xl lg:shadow-none`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-700 lg:border-white/20 lg:dark:border-slate-700/20 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 dark:text-white">WishConsult</span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Affiliate</span>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
          >
            <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hover:bg-white/20 lg:dark:hover:bg-slate-800/20'
                }`}
                onClick={() => {
                  // Close sidebar on mobile when clicking a link
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
              >
                <Icon className="h-5 w-5" />
                <span className="font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 lg:border-white/20 lg:dark:border-slate-700/20 flex-shrink-0">
          <button 
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 lg:hover:bg-red-50/50 lg:dark:hover:bg-red-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningOut ? (
              <>
                <InlineLoader width={20} />
                <span className="font-semibold">Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="h-5 w-5" />
                <span className="font-semibold">Sign Out</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
} 