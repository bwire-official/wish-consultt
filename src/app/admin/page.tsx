import { GlassCard } from "@/components/ui/glass-card";
import {
  Users,
  BookOpen,
  MessageSquare,
  Users2,
  DollarSign,
  Star,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  Shield,
  Settings,
  Plus,
  AlertTriangle,
  CheckCircle,
  Info,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import { getProfile } from "@/lib/auth/session";

function getGreeting() {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return "Good morning";
  } else if (hour < 17) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

export default async function AdminDashboard() {
  const profile = await getProfile();
  const greeting = getGreeting();

  // Real-time stats
  const stats = [
    {
      name: "Total Users",
      value: "2,543",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Active Courses",
      value: "24",
      change: "+3.2%",
      trend: "up",
      icon: BookOpen,
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-100 dark:bg-teal-900/30",
      gradient: "from-teal-500 to-emerald-500"
    },
    {
      name: "Total Feedback",
      value: "1,234",
      change: "+8.1%",
      trend: "up",
      icon: MessageSquare,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Active Affiliates",
      value: "156",
      change: "-2.4%",
      trend: "down",
      icon: Users2,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      gradient: "from-orange-500 to-red-500"
    },
  ];

  const quickStats = [
    {
      name: "Average Course Rating",
      value: "4.8",
      icon: Star,
      color: "text-yellow-500",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      name: "Completion Rate",
      value: "87%",
      icon: CheckCircle2,
      color: "text-green-500",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Active Sessions",
      value: "342",
      icon: Activity,
      color: "text-blue-500",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      name: "Revenue This Month",
      value: "$24.5K",
      icon: DollarSign,
      color: "text-emerald-500",
      gradient: "from-emerald-500 to-teal-500"
    },
  ];

  const recentActivity = [
    {
      user: "Sarah Johnson",
      action: "completed",
      course: "Advanced Healthcare Analytics",
      time: "2 hours ago",
      status: "success",
      avatar: "https://i.pravatar.cc/40?img=1"
    },
    {
      user: "Michael Chen",
      action: "enrolled in",
      course: "Medical AI Fundamentals",
      time: "4 hours ago",
      status: "info",
      avatar: "https://i.pravatar.cc/40?img=2"
    },
    {
      user: "Emma Wilson",
      action: "submitted feedback for",
      course: "Healthcare Data Science",
      time: "5 hours ago",
      status: "warning",
      avatar: "https://i.pravatar.cc/40?img=3"
    },
    {
      user: "David Kim",
      action: "completed",
      course: "AI in Medical Imaging",
      time: "6 hours ago",
      status: "success",
      avatar: "https://i.pravatar.cc/40?img=4"
    },
  ];

  const systemAlerts = [
    {
      type: "success",
      title: "System Health",
      message: "All systems operating normally",
      icon: CheckCircle,
      time: "2 min ago"
    },
    {
      type: "warning",
      title: "Storage Usage",
      message: "Storage at 78% capacity",
      icon: AlertTriangle,
      time: "15 min ago"
    },
    {
      type: "info",
      title: "Backup Complete",
      message: "Daily backup completed successfully",
      icon: Info,
      time: "1 hour ago"
    }
  ];

  const quickActions = [
    {
      title: "Create Course",
      description: "Add a new course to the platform",
      icon: Plus,
      color: "from-teal-500 to-blue-500",
      href: "/admin/courses/create"
    },
    {
      title: "View Analytics",
      description: "Check platform performance metrics",
      icon: BarChart3,
      color: "from-purple-500 to-pink-500",
      href: "/admin/analytics"
    },
    {
      title: "Manage Users",
      description: "Handle user accounts and permissions",
      icon: Users,
      color: "from-blue-500 to-indigo-500",
      href: "/admin/users"
    },
    {
      title: "System Settings",
      description: "Configure platform settings",
      icon: Settings,
      color: "from-orange-500 to-red-500",
      href: "/admin/settings"
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Glowing Lights Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              {greeting}, {profile?.full_name || 'Admin'}
            </h1>
          </div>
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-2">
            Today is {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. Here&apos;s what&apos;s happening on your platform.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Platform running smoothly with 99.9% uptime
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat) => (
            <GlassCard key={stat.name} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <GlassCard key={stat.name} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* System Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <GlassCard className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
                <button className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">View all</button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex-shrink-0">
                      <Image src={activity.avatar} alt={activity.user} className="h-10 w-10 rounded-full" width={40} height={40} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {activity.user} <span className="text-xs text-slate-500 dark:text-slate-400">{activity.action}</span> <span className="font-semibold text-teal-600 dark:text-teal-400">{activity.course}</span>
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                    </div>
                    <div>
                      {activity.status === "success" && <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">Success</span>}
                      {activity.status === "info" && <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">Info</span>}
                      {activity.status === "warning" && <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs">Warning</span>}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div>
            <GlassCard className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">System Status</h2>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4">
                {systemAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    {getStatusIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{alert.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{alert.message}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <GlassCard key={action.title} className="p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {action.description}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
} 