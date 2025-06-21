"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Star,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Grid,
  List,
  CheckCircle,
  AlertCircle,
  XCircle,
  Sparkles,
  FolderOpen
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  icon: string;
  total_courses: number;
  total_students: number;
  total_revenue: number;
  average_rating: number;
  status: "active" | "inactive" | "archived";
  created_at: string;
  updated_at: string;
  featured: boolean;
  sort_order: number;
}

const categories: Category[] = [
  {
    id: "1",
    name: "Healthcare Analytics",
    description: "Data analysis and insights for healthcare professionals",
    slug: "healthcare-analytics",
    color: "blue",
    icon: "📊",
    total_courses: 8,
    total_students: 5200,
    total_revenue: 98000,
    average_rating: 4.8,
    status: "active",
    created_at: "2024-01-15",
    updated_at: "2024-03-10",
    featured: true,
    sort_order: 1
  },
  {
    id: "2",
    name: "AI & Machine Learning",
    description: "Artificial intelligence applications in medical diagnosis and treatment",
    slug: "ai-machine-learning",
    color: "purple",
    icon: "🤖",
    total_courses: 6,
    total_students: 3800,
    total_revenue: 72000,
    average_rating: 4.7,
    status: "active",
    created_at: "2024-01-20",
    updated_at: "2024-03-08",
    featured: true,
    sort_order: 2
  },
  {
    id: "3",
    name: "Data Science",
    description: "Fundamentals of data science in healthcare contexts",
    slug: "data-science",
    color: "green",
    icon: "📈",
    total_courses: 5,
    total_students: 2900,
    total_revenue: 55000,
    average_rating: 4.6,
    status: "active",
    created_at: "2024-02-01",
    updated_at: "2024-03-05",
    featured: false,
    sort_order: 3
  },
  {
    id: "4",
    name: "Medical Ethics",
    description: "Ethical considerations in AI-powered healthcare",
    slug: "medical-ethics",
    color: "orange",
    icon: "⚖️",
    total_courses: 3,
    total_students: 1800,
    total_revenue: 34000,
    average_rating: 4.5,
    status: "active",
    created_at: "2024-02-10",
    updated_at: "2024-03-12",
    featured: false,
    sort_order: 4
  },
  {
    id: "5",
    name: "Emergency Medicine",
    description: "Critical care and emergency response training",
    slug: "emergency-medicine",
    color: "red",
    icon: "🚑",
    total_courses: 4,
    total_students: 2100,
    total_revenue: 42000,
    average_rating: 4.9,
    status: "active",
    created_at: "2024-02-15",
    updated_at: "2024-03-14",
    featured: false,
    sort_order: 5
  },
  {
    id: "6",
    name: "Pediatrics",
    description: "Specialized training for pediatric care",
    slug: "pediatrics",
    color: "pink",
    icon: "👶",
    total_courses: 3,
    total_students: 1500,
    total_revenue: 28000,
    average_rating: 4.4,
    status: "inactive",
    created_at: "2024-02-20",
    updated_at: "2024-03-01",
    featured: false,
    sort_order: 6
  }
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const stats = [
    {
      name: "Total Categories",
      value: categories.length.toString(),
      change: "+2",
      trend: "up",
      icon: FolderOpen,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Active Categories",
      value: categories.filter(c => c.status === "active").length.toString(),
      change: "+1",
      trend: "up",
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Total Courses",
      value: categories.reduce((sum, cat) => sum + cat.total_courses, 0).toString(),
      change: "+8",
      trend: "up",
      icon: BookOpen,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Total Revenue",
      value: `$${categories.reduce((sum, cat) => sum + cat.total_revenue, 0).toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      gradient: "from-yellow-500 to-orange-500"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700";
      case "inactive": return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-700";
      case "archived": return "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const getColorGradient = (color: string) => {
    switch (color) {
      case "blue": return "from-blue-500 to-cyan-500";
      case "purple": return "from-purple-500 to-pink-500";
      case "green": return "from-green-500 to-emerald-500";
      case "orange": return "from-orange-500 to-red-500";
      case "red": return "from-red-500 to-pink-500";
      case "pink": return "from-pink-500 to-purple-500";
      default: return "from-slate-500 to-gray-500";
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || category.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Course Categories</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">Organize and manage course categories</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
            <button 
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Category
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
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>

              <button className="px-3 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all duration-200 backdrop-blur-sm">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="overflow-hidden">
          <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Categories ({filteredCategories.length})
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="group relative bg-white/80 dark:bg-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 hover:scale-[1.02]">
                    <div className="relative h-48 overflow-hidden">
                      <div className={`w-full h-full bg-gradient-to-br ${getColorGradient(category.color)} flex items-center justify-center`}>
                        <span className="text-6xl">{category.icon}</span>
                      </div>
                      
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(category.status)}`}>
                          {category.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {category.status === "inactive" && <AlertCircle className="h-3 w-3 mr-1" />}
                          {category.status === "archived" && <XCircle className="h-3 w-3 mr-1" />}
                          {category.status}
                        </span>
                      </div>

                      {category.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Featured
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-3 right-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white shadow-lg">
                          {category.total_courses} courses
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                        {category.name}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                        {category.description}
                      </p>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">{category.total_students.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{category.average_rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          ${category.total_revenue.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Courses
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
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-white/30 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getColorGradient(category.color)} rounded-xl flex items-center justify-center shadow-lg mr-4`}>
                            <span className="text-2xl">{category.icon}</span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                              {category.name}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {category.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {category.total_courses}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {category.total_students.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          ${category.total_revenue.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {category.average_rating}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(category.status)}`}>
                          {category.status}
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
        </GlassCard>
      </div>
    </div>
  );
} 