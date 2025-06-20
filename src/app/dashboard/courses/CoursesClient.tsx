"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { ButtonLoader } from "@/components/ui/loaders";
import { 
  BookOpen, 
  Clock, 
  Star, 
  Users, 
  Play,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Heart,
  Bookmark
} from "lucide-react";

export function CoursesClient() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState<string | null>(null);

  // Mock courses data
  const courses = [
    {
      id: "1",
      title: "Advanced Cardiac Life Support (ACLS)",
      instructor: "Dr. Sarah Johnson",
      category: "emergency",
      level: "advanced",
      price: 299,
      rating: 4.8,
      students: 1247,
      duration: "16 hours",
      lessons: 24,
      image: "/courses/acls.jpg",
      description: "Comprehensive ACLS certification course covering advanced cardiovascular life support protocols.",
      featured: true
    },
    {
      id: "2",
      title: "Basic Life Support (BLS) for Healthcare Providers",
      instructor: "Dr. Michael Chen",
      category: "emergency",
      level: "beginner",
      price: 149,
      rating: 4.9,
      students: 2156,
      duration: "8 hours",
      lessons: 12,
      image: "/courses/bls.jpg",
      description: "Essential BLS training for healthcare professionals and first responders.",
      featured: true
    },
    {
      id: "3",
      title: "Pediatric Advanced Life Support (PALS)",
      instructor: "Dr. Emily Rodriguez",
      category: "pediatrics",
      level: "advanced",
      price: 349,
      rating: 4.7,
      students: 892,
      duration: "14 hours",
      lessons: 18,
      image: "/courses/pals.jpg",
      description: "Specialized training for managing pediatric emergencies and resuscitation.",
      featured: false
    },
    {
      id: "4",
      title: "Advanced Trauma Life Support (ATLS)",
      instructor: "Dr. James Wilson",
      category: "trauma",
      level: "advanced",
      price: 449,
      rating: 4.6,
      students: 567,
      duration: "20 hours",
      lessons: 28,
      image: "/courses/atls.jpg",
      description: "Comprehensive trauma assessment and management for healthcare providers.",
      featured: false
    },
    {
      id: "5",
      title: "Neonatal Resuscitation Program (NRP)",
      instructor: "Dr. Lisa Thompson",
      category: "neonatal",
      level: "intermediate",
      price: 199,
      rating: 4.8,
      students: 743,
      duration: "12 hours",
      lessons: 16,
      image: "/courses/nrp.jpg",
      description: "Essential skills for neonatal resuscitation and newborn care.",
      featured: false
    },
    {
      id: "6",
      title: "Emergency Medicine Fundamentals",
      instructor: "Dr. Robert Davis",
      category: "emergency",
      level: "beginner",
      price: 99,
      rating: 4.5,
      students: 1892,
      duration: "10 hours",
      lessons: 14,
      image: "/courses/emergency-fundamentals.jpg",
      description: "Core concepts and principles of emergency medicine practice.",
      featured: false
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "emergency", label: "Emergency Medicine" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "trauma", label: "Trauma" },
    { value: "neonatal", label: "Neonatal" },
    { value: "cardiology", label: "Cardiology" },
    { value: "neurology", label: "Neurology" }
  ];

  const levels = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" }
  ];

  const prices = [
    { value: "all", label: "All Prices" },
    { value: "free", label: "Free" },
    { value: "paid", label: "Paid" },
    { value: "0-100", label: "$0 - $100" },
    { value: "100-300", label: "$100 - $300" },
    { value: "300+", label: "$300+" }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    const matchesPrice = selectedPrice === "all" || 
      (selectedPrice === "free" && course.price === 0) ||
      (selectedPrice === "paid" && course.price > 0) ||
      (selectedPrice === "0-100" && course.price >= 0 && course.price <= 100) ||
      (selectedPrice === "100-300" && course.price > 100 && course.price <= 300) ||
      (selectedPrice === "300+" && course.price > 300);
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesLevel && matchesPrice && matchesSearch;
  });

  const featuredCourses = courses.filter(course => course.featured);
  const regularCourses = filteredCourses.filter(course => !course.featured);

  const handleEnroll = async (courseId: string) => {
    setIsEnrolling(courseId);
    try {
      // Simulate enrollment delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Here you would implement actual enrollment logic
      console.log(`Enrolling in course ${courseId}`);
    } catch (error) {
      console.error('Enrollment failed:', error);
    } finally {
      setIsEnrolling(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "emergency":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      case "pediatrics":
        return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30";
      case "trauma":
        return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30";
      case "neonatal":
        return "text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30";
      case "cardiology":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
      case "neurology":
        return "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30";
      default:
        return "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      case "intermediate":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
      case "advanced":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800";
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Available Courses
              </h1>
              <p className="text-lg text-slate-700 dark:text-slate-300">
                Explore our comprehensive healthcare education courses
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 px-3 py-1 rounded-full">
                {filteredCourses.length} courses available
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses, instructors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 transition-all duration-300"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {isFilterOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-xl shadow-xl z-10">
                  <div className="p-4 space-y-4">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-teal-500 dark:focus:border-teal-400"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Level Filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Level
                      </label>
                      <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-teal-500 dark:focus:border-teal-400"
                      >
                        {levels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Price
                      </label>
                      <select
                        value={selectedPrice}
                        onChange={(e) => setSelectedPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-teal-500 dark:focus:border-teal-400"
                      >
                        {prices.map((price) => (
                          <option key={price.value} value={price.value}>
                            {price.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Courses */}
        {featuredCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
              Featured Courses
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredCourses.map((course) => (
                <GlassCard key={course.id} className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  {/* Course Image */}
                  <div className="relative mb-6">
                    <div className="w-full h-56 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <BookOpen className="h-20 w-20 text-white" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-full shadow-lg">
                        Featured
                      </span>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
                        {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      </span>
                    </div>

                    <h3 className="font-semibold text-slate-900 dark:text-white text-xl leading-tight">
                      {course.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {course.rating}
                        </span>
                      </div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">
                        ${course.price}
                      </div>
                    </div>

                    {/* Course Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => handleEnroll(course.id)}
                        disabled={isEnrolling === course.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      >
                        {isEnrolling === course.id ? (
                          <>
                            <ButtonLoader width={16} />
                            Enrolling...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            Enroll Now
                          </>
                        )}
                      </button>
                      
                      <button className="flex items-center justify-center px-3 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Heart className="h-4 w-4" />
                      </button>
                      
                      <button className="flex items-center justify-center px-3 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* All Courses */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
            All Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {regularCourses.map((course) => (
              <GlassCard key={course.id} className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                {/* Course Image */}
                <div className="relative mb-4">
                  <div className="w-full h-48 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="h-16 w-16 text-white" />
                  </div>
                </div>

                {/* Course Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
                      {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-900 dark:text-white text-lg leading-tight">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.lessons} lessons</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {course.rating}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      ${course.price}
                    </div>
                  </div>

                  {/* Course Actions */}
                  <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={isEnrolling === course.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isEnrolling === course.id ? (
                        <>
                          <ButtonLoader width={14} />
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Enroll
                        </>
                      )}
                    </button>
                    
                    <button className="flex items-center justify-center px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                    
                    <button className="flex items-center justify-center px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <Bookmark className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 