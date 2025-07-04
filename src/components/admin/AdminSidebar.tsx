"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  Users2,
  DollarSign,
  Settings,
  BarChart3,
  FileText,
  ChevronDown,
  Menu,
  X,
  Database,
  Activity,
  TrendingUp,
  Award,
  Calendar,
  HelpCircle,
  Megaphone,
  Plus
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: NavItem[];
}

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  const navigation: NavItem[] = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: Users,
      children: [
        { name: "All Users", href: "/admin/users", icon: Users },
        { name: "Active Users", href: "/admin/users/active", icon: Activity },
        { name: "Paying Users", href: "/admin/users/premium", icon: Award },
        { name: "User Analytics", href: "/admin/users/analytics", icon: BarChart3 },
      ]
    },
    {
      name: "Course Management",
      href: "/admin/courses",
      icon: BookOpen,
      children: [
        { name: "All Courses", href: "/admin/courses", icon: BookOpen },
        { name: "Create Course", href: "/admin/courses/create", icon: FileText },
        { name: "Course Analytics", href: "/admin/courses/analytics", icon: BarChart3 },
        { name: "Categories", href: "/admin/courses/categories", icon: Database },
      ]
    },
    {
      name: "Announcements",
      href: "/admin/announcements",
      icon: Megaphone,
      children: [
        { name: "View Announcements", href: "/admin/announcements", icon: Megaphone },
        { name: "Create Announcement", href: "/admin/announcements/create", icon: Plus },
      ]
    },
    {
      name: "Feedback & Reviews",
      href: "/admin/feedback",
      icon: MessageSquare,
      children: [
        { name: "All Feedback", href: "/admin/feedback", icon: MessageSquare },
        { name: "Feedback Analytics", href: "/admin/feedback/analytics", icon: BarChart3 },
      ]
    },
    {
      name: "Affiliate Program",
      href: "/admin/affiliates",
      icon: Users2,
      children: [
        { name: "All Affiliates", href: "/admin/affiliates", icon: Users2 },
        { name: "Performance", href: "/admin/affiliates/performance", icon: TrendingUp },
        { name: "Payouts", href: "/admin/affiliates/payouts", icon: DollarSign },
      ]
    },
    {
      name: "Content Management",
      href: "/admin/content",
      icon: FileText,
      children: [
        { name: "Blog Posts", href: "/admin/blog", icon: FileText },
        { name: "Resources", href: "/admin/resources", icon: Database },
        { name: "Media Library", href: "/admin/media", icon: FileText },
      ]
    },
    {
      name: "Analytics & Reports",
      href: "/admin/analytics",
      icon: BarChart3,
      children: [
        { name: "Overview", href: "/admin/analytics", icon: BarChart3 },
        { name: "Revenue Reports", href: "/admin/analytics/revenue", icon: DollarSign },
        { name: "User Reports", href: "/admin/analytics/users", icon: Users },
        { name: "Course Reports", href: "/admin/analytics/courses", icon: BookOpen },
        { name: "Affiliate Reports", href: "/admin/analytics/affiliates", icon: Users2 },
      ]
    },
    {
      name: "System Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    // For parent menu items, check if the current path starts with the href but is not exactly the same
    // This prevents both parent and child from being active at the same time
    if (pathname === href) {
      return true;
    }
    // For child items, only highlight if the path exactly matches
    return false;
  };

  const isParentActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    // For parent menu items, check if any child path starts with the parent href
    return pathname.startsWith(href) && pathname !== href;
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const active = level === 0 ? isParentActive(item.href) : isActive(item.href);
    const Icon = item.icon;

    return (
      <div key={item.name}>
        <Link
          href={hasChildren ? "#" : item.href}
          onClick={hasChildren ? (e) => { e.preventDefault(); toggleExpanded(item.name); } : undefined}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group backdrop-blur-sm ${
            active
              ? "bg-gradient-to-r from-teal-500/20 to-blue-500/20 border border-teal-300/30 dark:border-teal-600/30 text-teal-700 dark:text-teal-300 shadow-sm"
              : "text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-white/40 dark:hover:border-slate-600/60"
          } ${level > 0 ? "ml-4" : ""}`}
        >
          <Icon className={`h-5 w-5 flex-shrink-0 ${
            active ? "text-teal-600 dark:text-teal-400" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-100"
          }`} />
          {!isCollapsed && (
            <>
              <span className="truncate flex-1">{item.name}</span>
              {hasChildren && (
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`} />
              )}
            </>
          )}
        </Link>
        
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-16 h-full backdrop-blur-lg bg-white/80 dark:bg-slate-800/80 border-r border-white/20 dark:border-slate-700/50 transition-all duration-300 z-30 shadow-xl ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => renderNavItem(item))}
          </nav>

          {/* Bottom Section */}
          <div className="p-3 border-t border-white/20 dark:border-slate-700/50 space-y-2">
            {/* Quick Actions */}
            {!isCollapsed && (
              <div className="space-y-1">
                <Link
                  href="/admin/help"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-all duration-200 backdrop-blur-sm"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Help & Support</span>
                </Link>
                <Link
                  href="/admin/calendar"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white transition-all duration-200 backdrop-blur-sm"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Calendar</span>
                </Link>
              </div>
            )}

            {/* Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/30 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200 backdrop-blur-sm"
            >
              <div className={`h-4 w-4 border-2 border-current rounded transition-transform duration-200 ${
                isCollapsed ? 'rotate-180' : ''
              }`} />
              {!isCollapsed && <span>Collapse</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-20 left-4 z-50 lg:hidden p-2 backdrop-blur-lg bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-slate-700/50 rounded-lg shadow-xl"
      >
        {isMobileOpen ? (
          <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        ) : (
          <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        )}
      </button>
    </>
  );
}