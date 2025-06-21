"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  BookOpen,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Star,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Grid,
  List,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Sparkles,
  Filter,
  RefreshCw,
  Download
} from "lucide-react";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_name: string;
  category: string;
  level: string;
  price: number;
  enrolled_students: number;
  rating: number;
  total_reviews: number;
  status: "draft" | "published" | "archived";
  modules: number;
  total_duration: string;
  completion_rate: number;
  is_free: boolean;
  featured: boolean;
  thumbnail_url: string;
  revenue: number;
  growth: number;
}

const courses: Course[] = [
  {
    id: "1",
    title: "Introduction to Healthcare Analytics",
    description: "A comprehensive introduction to healthcare fundamentals and data analysis",
    instructor_name: "Dr. Sarah Johnson",
    category: "Healthcare",
    level: "Beginner",
    price: 99.99,
    enrolled_students: 1245,
    rating: 4.8,
    total_reviews: 234,
    status: "published",
    modules: 12,
    total_duration: "8 hours",
    completion_rate: 85,
    is_free: false,
    featured: true,
    thumbnail_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
    revenue: 124500,
    growth: 15.3,
  },
  {
    id: "2",
    title: "Advanced Medical AI Applications",
    description: "Deep dive into AI applications in medical diagnosis and treatment",
    instructor_name: "Prof. Michael Chen",
    category: "AI & ML",
    level: "Advanced",
    price: 149.99,
    enrolled_students: 892,
    rating: 4.9,
    total_reviews: 156,
    status: "published",
    modules: 15,
    total_duration: "12 hours",
    completion_rate: 78,
    is_free: false,
    featured: true,
    thumbnail_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
    revenue: 133800,
    growth: 22.1,
  },
  {
    id: "3",
    title: "Healthcare Data Science Fundamentals",
    description: "Learn the basics of data science in healthcare contexts",
    instructor_name: "Dr. Emily Rodriguez",
    category: "Data Science",
    level: "Intermediate",
    price: 79.99,
    enrolled_students: 1567,
    rating: 4.7,
    total_reviews: 298,
    status: "published",
    modules: 10,
    total_duration: "6 hours",
    completion_rate: 82,
    is_free: false,
    featured: false,
    thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    revenue: 125360,
    growth: 8.7,
  },
  {
    id: "4",
    title: "Medical Ethics in AI Era",
    description: "Ethical considerations and best practices in AI-powered healthcare",
    instructor_name: "Dr. James Wilson",
    category: "Ethics",
    level: "Intermediate",
    price: 89.99,
    enrolled_students: 743,
    rating: 4.6,
    total_reviews: 167,
    status: "published",
    modules: 8,
    total_duration: "5 hours",
    completion_rate: 91,
    is_free: false,
    featured: false,
    thumbnail_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
    revenue: 66870,
    growth: 12.4,
  },
  {
    id: "5",
    title: "Emergency Medicine Analytics",
    description: "Data-driven approaches to emergency medicine and critical care",
    instructor_name: "Dr. Lisa Thompson",
    category: "Emergency",
    level: "Advanced",
    price: 129.99,
    enrolled_students: 567,
    rating: 4.9,
    total_reviews: 89,
    status: "published",
    modules: 14,
    total_duration: "10 hours",
    completion_rate: 76,
    is_free: false,
    featured: false,
    thumbnail_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
    revenue: 73710,
    growth: 18.9,
  },
  {
    id: "6",
    title: "Pediatric Healthcare Data",
    description: "Specialized analytics for pediatric care and child health",
    instructor_name: "Dr. Robert Davis",
    category: "Pediatrics",
    level: "Intermediate",
    price: 69.99,
    enrolled_students: 432,
    rating: 4.5,
    total_reviews: 78,
    status: "draft",
    modules: 9,
    total_duration: "7 hours",
    completion_rate: 88,
    is_free: false,
    featured: false,
    thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    revenue: 30240,
    growth: 5.2,
  },
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 8;

  const stats = [
    {
      name: "Total Courses",
      value: courses.length.toString(),
      change: "+12.5%",
      trend: "up",
      icon: BookOpen,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Active Students",
      value: courses.reduce((sum, course) => sum + course.enrolled_students, 0).toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: Users,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Average Rating",
      value: (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1),
      change: "+0.3",
      trend: "up",
      icon: Star,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      name: "Total Revenue",
      value: `$${courses.reduce((sum, course) => sum + course.revenue, 0).toLocaleString()}`,
      change: "+18.7%",
      trend: "up",
      icon: DollarSign,
      gradient: "from-purple-500 to-pink-500"
    },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "AI & ML", label: "AI & ML" },
    { value: "Data Science", label: "Data Science" },
    { value: "Ethics", label: "Ethics" },
    { value: "Emergency", label: "Emergency" },
    { value: "Pediatrics", label: "Pediatrics" }
  ];

  const levels = [
    { value: "all", label: "All Levels" },
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" }
  ];

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700";
      case "draft": return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-700";
      case "archived": return "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner": return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700";
      case "intermediate": return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-700";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-700";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Healthcare": return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
      case "AI & ML": return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30";
      case "Data Science": return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      case "Ethics": return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30";
      case "Emergency": return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      case "Pediatrics": return "text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30";
      default: return "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800";
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    const matchesStatus = selectedStatus === "all" || course.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const featuredCourses = filteredCourses.filter(course => course.featured);
  const regularCourses = paginatedCourses.filter(course => !course.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1500"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Course Management</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">Manage and monitor all courses in your platform</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
            <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Course
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <GlassCard key={stat.name} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses, instructors, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all duration-200 backdrop-blur-sm"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <button className="px-3 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all duration-200 backdrop-blur-sm">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/20 dark:border-slate-700/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                >
                  {levels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard className="overflow-hidden">
          <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Courses ({filteredCourses.length})
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-300/30 dark:border-blue-600/30" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-300/30 dark:border-blue-600/30" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="p-6">
              {/* Featured Courses */}
              {featuredCourses.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                    Featured Courses
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {featuredCourses.map((course) => (
                      <div key={course.id} className="group relative bg-white/80 dark:bg-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 hover:scale-[1.02]">
                        {/* Course Image */}
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={course.thumbnail_url}
                            alt={course.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          
                          <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Featured
                            </span>
                          </div>

                          <div className="absolute top-4 right-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(course.status)}`}>
                              {course.status === "published" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {course.status === "draft" && <AlertCircle className="h-3 w-3 mr-1" />}
                              {course.status === "archived" && <XCircle className="h-3 w-3 mr-1" />}
                              {course.status}
                            </span>
                          </div>

                          <div className="absolute bottom-4 right-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white shadow-lg">
                              ${course.price}
                            </span>
                          </div>
                        </div>

                        {/* Course Info */}
                        <div className="p-6">
                          <div className="flex items-center gap-2 flex-wrap mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
                              {course.category}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                              {course.level}
                            </span>
                          </div>

                          <h3 className="font-semibold text-slate-900 dark:text-white text-xl leading-tight mb-2">
                            {course.title}
                          </h3>
                          
                          <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                            {course.description}
                          </p>

                          <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400 mb-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{course.total_duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{course.modules} modules</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {course.rating}
                              </span>
                              <span className="text-sm text-slate-500 dark:text-slate-400">
                                ({course.total_reviews})
                              </span>
                            </div>
                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                              ${course.revenue.toLocaleString()}
                            </div>
                          </div>

                          {/* Course Actions */}
                          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg">
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                            
                            <button className="flex items-center justify-center px-3 py-3 border border-slate-300 dark:border-slate-600 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            
                            <button className="flex items-center justify-center px-3 py-3 border border-slate-300 dark:border-slate-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Courses */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                  All Courses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {regularCourses.map((course) => (
                    <div key={course.id} className="group relative bg-white/80 dark:bg-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 hover:scale-[1.02]">
                      {/* Course Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={course.thumbnail_url}
                          alt={course.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(course.status)}`}>
                            {course.status}
                          </span>
                        </div>

                        <div className="absolute bottom-3 right-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white shadow-lg">
                            ${course.price}
                          </span>
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
                            {course.category}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                            {course.level}
                          </span>
                        </div>

                        <h3 className="font-semibold text-slate-900 dark:text-white text-lg leading-tight mb-2">
                          {course.title}
                        </h3>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                          {course.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.total_duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{course.modules} modules</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {course.rating}
                            </span>
                          </div>
                          <div className="text-lg font-bold text-slate-900 dark:text-white">
                            ${course.revenue.toLocaleString()}
                          </div>
                        </div>

                        {/* Course Actions */}
                        <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300 text-sm">
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          
                          <button className="flex items-center justify-center px-3 py-2 border border-slate-300 dark:border-slate-600 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button className="flex items-center justify-center px-3 py-2 border border-slate-300 dark:border-slate-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Instructor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 dark:divide-slate-700/30">
                  {paginatedCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-white/30 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                              {course.title}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {course.category} • {course.level}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {course.instructor_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {course.enrolled_students.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          ${course.revenue.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {course.rating}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(course.status)}`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-white/20 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCourses.length)} of {filteredCourses.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === page
                          ? "bg-blue-500 text-white shadow-lg"
                          : "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
} 