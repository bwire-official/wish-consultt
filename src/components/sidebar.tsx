"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart2,
  Settings,
  Menu,
  X,
  MessageSquare,
  ChevronDown,
  UserPlus,
  BookOpenCheck,
  CreditCard,
  Bot,
  Megaphone,
  FileText,
  Shield,
  Star,
  Key,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin",
    },
    {
      name: "Users",
      icon: Users,
      current: pathname.startsWith("/admin/users"),
      subItems: [
        {
          name: "All Users",
          href: "/admin/users",
          icon: UserPlus,
          current: pathname === "/admin/users",
        },
        {
          name: "Active Users",
          href: "/admin/users/active",
          icon: Shield,
          current: pathname === "/admin/users/active",
        },
        {
          name: "Paying Users",
          href: "/admin/users/premium",
          icon: CreditCard,
          current: pathname === "/admin/users/premium",
        },
      ],
    },
    {
      name: "Courses",
      icon: BookOpen,
      current: pathname.startsWith("/admin/courses"),
      subItems: [
        {
          name: "All Courses",
          href: "/admin/courses",
          icon: BookOpenCheck,
          current: pathname === "/admin/courses",
        },
        {
          name: "Create Course",
          href: "/admin/courses/create",
          icon: Star,
          current: pathname === "/admin/courses/create",
        },
        {
          name: "Course Analytics",
          href: "/admin/courses/analytics",
          icon: BarChart2,
          current: pathname === "/admin/courses/analytics",
        },
      ],
    },
    {
      name: "Announcements",
      icon: Megaphone,
      current: pathname.startsWith("/admin/announcements"),
      subItems: [
        {
          name: "All Announcements",
          href: "/admin/announcements",
          icon: FileText,
          current: pathname === "/admin/announcements",
        },
        {
          name: "Create Announcement",
          href: "/admin/announcements/create",
          icon: Star,
          current: pathname === "/admin/announcements/create",
        },
      ],
    },
    {
      name: "Claude AI Settings",
      icon: Bot,
      current: pathname.startsWith("/admin/claude"),
      subItems: [
        {
          name: "API Keys",
          href: "/admin/claude/api-keys",
          icon: Key,
          current: pathname === "/admin/claude/api-keys",
        },
        {
          name: "Usage Logs",
          href: "/admin/claude/logs",
          icon: FileText,
          current: pathname === "/admin/claude/logs",
        },
      ],
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart2,
      current: pathname === "/admin/analytics",
    },
    {
      name: "Feedback",
      href: "/admin/feedback",
      icon: MessageSquare,
      current: pathname === "/admin/feedback",
    },
    {
      name: "Affiliates",
      icon: Star,
      current: pathname.startsWith("/admin/affiliates"),
      subItems: [
        {
          name: "All Affiliates",
          href: "/admin/affiliates",
          icon: Users,
          current: pathname === "/admin/affiliates",
        },
        {
          name: "Payout Requests",
          href: "/admin/affiliates/payouts",
          icon: CreditCard,
          current: pathname === "/admin/affiliates/payouts",
        },
        {
          name: "Performance",
          href: "/admin/affiliates/performance",
          icon: BarChart2,
          current: pathname === "/admin/affiliates/performance",
        },
      ],
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: pathname === "/admin/settings",
    },
  ];

  const SidebarContent = () => (
    <div
      className={`flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-full overflow-y-auto ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-700">
        {!isCollapsed && (
          <span className="text-xl font-semibold text-slate-900 dark:text-white">
            Wish Consult
          </span>
        )}
        {!isMobile && (
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            {isCollapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.subItems ? (
              <button
                type="button"
                onClick={() => toggleExpand(item.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium focus:outline-none transition-colors ${
                  item.current
                    ? "bg-teal-50 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <item.icon className={`h-5 w-5 ${isCollapsed ? "mx-auto" : ""}`} />
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
                {!isCollapsed && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expandedItems.includes(item.name) ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  item.current
                    ? "bg-teal-50 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isCollapsed ? "mx-auto" : ""}`} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )}

            {!isCollapsed && item.subItems && expandedItems.includes(item.name) && (
              <div className="mt-1 ml-4 space-y-1">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg ${
                      subItem.current
                        ? "bg-teal-50 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <subItem.icon className="h-4 w-4" />
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 lg:hidden"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Sidebar */}
        {isOpen && (
          <div className="fixed inset-0 z-30 lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 h-full overflow-y-auto">
              <SidebarContent />
            </div>
          </div>
        )}
      </>
    );
  }

  // Fixed sidebar for desktop
  return (
    <div
      className={`fixed inset-y-0 left-0 z-20 ${
        isCollapsed ? "w-20" : "w-64"
      } h-full`}
    >
      <SidebarContent />
    </div>
  );
}