"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Clock,
  Play,
  CheckCircle
} from "lucide-react";
import { type Profile } from "@/types";

interface StudentDashboardClientProps {
  profile: Profile;
}

export function StudentDashboardClient({ profile }: StudentDashboardClientProps) {
  const [currentStreak] = useState(7);
  const [totalCourses] = useState(12);
  const [completedCourses] = useState(8);
  const [certificates] = useState(5);
  const [totalHours] = useState(156);

  // Mock data for recent activity
  const recentActivity = [
    {
      id: 1,
      type: "course_completed",
      title: "Advanced Cardiac Life Support (ACLS)",
      description: "You completed the ACLS certification course",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
      id: 2,
      type: "course_started",
      title: "Pediatric Advanced Life Support (PALS)",
      description: "You started the PALS certification course",
      time: "1 day ago",
      icon: Play,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      id: 3,
      type: "certificate_earned",
      title: "Basic Life Support (BLS)",
      description: "You earned a new certificate",
      time: "3 days ago",
      icon: Award,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30"
    }
  ];

  // Mock data for quick actions
  const quickActions = [
    {
      title: "Continue Learning",
      description: "Resume your last course",
      icon: BookOpen,
      color: "from-blue-500 to-purple-500",
      href: "/dashboard/courses"
    },
    {
      title: "View Certificates",
      description: "See your earned certificates",
      icon: Award,
      color: "from-green-500 to-teal-500",
      href: "/dashboard/certificates"
    },
    {
      title: "Course Progress",
      description: "Track your learning journey",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      href: "/dashboard/progress"
    }
  ];

  const getProgressPercentage = () => {
    return Math.round((completedCourses / totalCourses) * 100);
  };

  const getStreakMessage = () => {
    if (currentStreak >= 7) return "Amazing! You're on fire! 🔥";
    if (currentStreak >= 5) return "Great consistency! Keep it up! 💪";
    if (currentStreak >= 3) return "Good start! Building momentum! ⚡";
    return "Start your learning streak today! 📚";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Glowing Lights Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Ready to continue your healthcare education journey?
          </p>
        </div>

        {/* Streak Card */}
        <div className="mb-8">
          <GlassCard className="p-6 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 border-yellow-300/30 dark:border-yellow-600/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">{currentStreak}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Learning Streak
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    {getStreakMessage()}
                  </p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400">Days</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{currentStreak}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalCourses}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Completed
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {completedCourses}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Certificates
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {certificates}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Study Hours
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalHours}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Progress & Quick Actions */}
          <div className="xl:col-span-2 space-y-8">
            {/* Progress Overview */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Course Progress
                </h2>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {getProgressPercentage()}% Complete
                </span>
              </div>
              
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-blue-500 h-4 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>{completedCourses} of {totalCourses} courses completed</span>
                <span>{totalCourses - completedCourses} remaining</span>
              </div>
            </GlassCard>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <GlassCard key={index} className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105">
                      <div className="flex flex-col items-center text-center gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="xl:col-span-1">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Recent Activity
            </h2>
            <GlassCard className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                      <div className={`w-10 h-10 ${activity.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 dark:text-white text-sm leading-tight">
                          {activity.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-tight">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                        {activity.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
} 