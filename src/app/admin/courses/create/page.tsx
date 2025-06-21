"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  ArrowLeft,
  Save,
  Upload,
  Plus,
  X,
  DollarSign,
  Eye,
  BookOpen,
  Settings,
  FileText,
  Image as ImageIcon
} from "lucide-react";

export default function CreateCoursePage() {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    price: "",
    isFree: false,
    featured: false,
    tags: "",
    thumbnail: null as File | null,
    paymentDetails: {
      currency: "USD",
      paymentMethod: "stripe",
      enableInstallments: false,
      maxInstallments: 3,
      earlyBirdDiscount: false,
      earlyBirdPrice: "",
      earlyBirdEndDate: "",
    },
    modules: [
      {
        id: 1,
        title: "",
        description: "",
        video: null as File | null,
        pdf: null as File | null,
        duration: "",
        isPreview: false,
      },
    ],
  });

  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const handleModuleChange = (
    index: number,
    field: keyof typeof courseData.modules[0],
    value: string | boolean | File | null
  ) => {
    const updatedModules = [...courseData.modules];
    updatedModules[index] = {
      ...updatedModules[index],
      [field]: value,
    };
    setCourseData({ ...courseData, modules: updatedModules });
  };

  const addModule = () => {
    setCourseData({
      ...courseData,
      modules: [
        ...courseData.modules,
        {
          id: courseData.modules.length + 1,
          title: "",
          description: "",
          video: null,
          pdf: null,
          duration: "",
          isPreview: false,
        },
      ],
    });
  };

  const removeModule = (index: number) => {
    const updatedModules = courseData.modules.filter((_, i) => i !== index);
    setCourseData({ ...courseData, modules: updatedModules });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle course creation logic here
    console.log(courseData);
  };

  const tabs = [
    { id: "basic", name: "Basic Info", icon: BookOpen },
    { id: "content", name: "Content", icon: FileText },
    { id: "pricing", name: "Pricing", icon: DollarSign },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Glowing Lights Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create New Course</h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400">Add a new course to the platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm"
            >
              <Eye className="h-5 w-5 mr-2" />
              Preview
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Course
            </button>
          </div>
        </div>

        {/* Tabs */}
        <GlassCard className="mb-8">
          <div className="flex space-x-8 border-b border-white/20 dark:border-slate-700/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course Information
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Course Title
                      </label>
                      <input
                        type="text"
                        value={courseData.title}
                        onChange={(e) =>
                          setCourseData({ ...courseData, title: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                        placeholder="Enter course title"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Category
                        </label>
                        <select
                          value={courseData.category}
                          onChange={(e) =>
                            setCourseData({ ...courseData, category: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                          required
                        >
                          <option value="">Select a category</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="AI & ML">AI & ML</option>
                          <option value="Data Science">Data Science</option>
                          <option value="Ethics">Ethics</option>
                          <option value="Anatomy">Anatomy</option>
                          <option value="Physiology">Physiology</option>
                          <option value="Nursing">Nursing</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Level
                        </label>
                        <select
                          value={courseData.level}
                          onChange={(e) =>
                            setCourseData({ ...courseData, level: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                          required
                        >
                          <option value="">Select a level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={courseData.description}
                        onChange={(e) =>
                          setCourseData({ ...courseData, description: e.target.value })
                        }
                        rows={4}
                        className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                        placeholder="Enter course description"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={courseData.tags}
                        onChange={(e) =>
                          setCourseData({ ...courseData, tags: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                        placeholder="Enter tags separated by commas"
                      />
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Course Thumbnail
                  </h3>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                      <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Course Settings
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={courseData.isFree}
                        onChange={(e) =>
                          setCourseData({ ...courseData, isFree: e.target.checked })
                        }
                        className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                        Free Course
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={courseData.featured}
                        onChange={(e) =>
                          setCourseData({ ...courseData, featured: e.target.checked })
                        }
                        className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                        Featured Course
                      </span>
                    </label>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Course Content
              </h2>
              <div className="space-y-6">
                {courseData.modules.map((module, index) => (
                  <div key={module.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                        Module {index + 1}
                      </h3>
                      {courseData.modules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeModule(index)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Module Title
                        </label>
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) => handleModuleChange(index, "title", e.target.value)}
                          className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                          placeholder="Enter module title"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={module.description}
                          onChange={(e) => handleModuleChange(index, "description", e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                          placeholder="Enter module description"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={module.duration}
                            onChange={(e) => handleModuleChange(index, "duration", e.target.value)}
                            className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                            placeholder="e.g., 45 minutes"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={module.isPreview}
                              onChange={(e) => handleModuleChange(index, "isPreview", e.target.checked)}
                              className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                              Preview Module
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addModule}
                  className="w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Plus className="h-6 w-6 mx-auto mb-2" />
                  Add Module
                </button>
              </div>
            </GlassCard>
          )}

          {activeTab === "pricing" && (
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing & Payment
              </h2>
              <div className="space-y-6">
                {!courseData.isFree && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      value={courseData.price}
                      onChange={(e) =>
                        setCourseData({ ...courseData, price: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                      placeholder="Enter course price"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-slate-900 dark:text-white">Payment Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Currency
                      </label>
                      <select
                        value={courseData.paymentDetails.currency}
                        onChange={(e) =>
                          setCourseData({
                            ...courseData,
                            paymentDetails: {
                              ...courseData.paymentDetails,
                              currency: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="NGN">NGN</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Payment Method
                      </label>
                      <select
                        value={courseData.paymentDetails.paymentMethod}
                        onChange={(e) =>
                          setCourseData({
                            ...courseData,
                            paymentDetails: {
                              ...courseData.paymentDetails,
                              paymentMethod: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                      >
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                        <option value="flutterwave">Flutterwave</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === "settings" && (
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Advanced Settings
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-medium text-slate-900 dark:text-white mb-4">Course Visibility</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                          Publish immediately
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                          Allow reviews
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                          Enable discussions
                        </span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-medium text-slate-900 dark:text-white mb-4">Access Control</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                          Require enrollment
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                          Limit access time
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                          Certificate on completion
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </form>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Course Preview
                </h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    {courseData.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {courseData.description}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="px-2 py-1 text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300 rounded-full">
                    {courseData.category}
                  </span>
                  <span className="px-2 py-1 text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300 rounded-full">
                    {courseData.level}
                  </span>
                  {courseData.isFree ? (
                    <span className="px-2 py-1 text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                      Free
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                      {courseData.paymentDetails.currency} {courseData.price}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-md font-medium text-slate-900 dark:text-white mb-2">
                    Course Modules
                  </h4>
                  <div className="space-y-2">
                    {courseData.modules.map((module) => (
                      <div
                        key={module.id}
                        className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-sm font-medium text-slate-900 dark:text-white">
                              {module.title}
                            </h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {module.duration}
                            </p>
                          </div>
                          {module.isPreview && (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full">
                              Preview
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {!courseData.isFree && (
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <h4 className="text-md font-medium text-slate-900 dark:text-white mb-2">
                      Payment Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Course Price
                        </span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {courseData.paymentDetails.currency} {courseData.price}
                        </span>
                      </div>
                      {courseData.paymentDetails.earlyBirdDiscount && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Early Bird Price
                          </span>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {courseData.paymentDetails.currency}{" "}
                            {courseData.paymentDetails.earlyBirdPrice}
                          </span>
                        </div>
                      )}
                      {courseData.paymentDetails.enableInstallments && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Available in
                          </span>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            Up to {courseData.paymentDetails.maxInstallments} installments
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 