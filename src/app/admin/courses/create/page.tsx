"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Save,
  Upload,
  Plus,
  X,
  Clock,
  DollarSign,
  CreditCard,
  Eye,
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
    paymentDetails: {
      currency: "NGN",
      paymentMethod: "flutterwave",
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
        video: null,
        pdf: null,
        duration: "",
        isPreview: false,
      },
    ],
  });

  const [showPaymentSettings, setShowPaymentSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Create New Course
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Add a new course to the platform
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <Eye className="h-5 w-5 mr-2" />
            Preview
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Course
          </button>
        </div>
      </div>

      {/* Course Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
            Course Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter course title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <select
                value={courseData.category}
                onChange={(e) =>
                  setCourseData({ ...courseData, category: e.target.value })
                }
                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                <option value="healthcare">Healthcare</option>
                <option value="anatomy">Anatomy</option>
                <option value="physiology">Physiology</option>
                <option value="nursing">Nursing</option>
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
                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="">Select a level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={courseData.description}
                onChange={(e) =>
                  setCourseData({ ...courseData, description: e.target.value })
                }
                rows={4}
                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter course description"
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white">
              Pricing & Payment
            </h2>
            <button
              type="button"
              onClick={() => setShowPaymentSettings(!showPaymentSettings)}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Payment Settings
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Course Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  value={courseData.price}
                  onChange={(e) =>
                    setCourseData({ ...courseData, price: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                  disabled={courseData.isFree}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={courseData.isFree}
                  onChange={(e) =>
                    setCourseData({ ...courseData, isFree: e.target.checked })
                  }
                  className="rounded border-slate-300 dark:border-slate-600 text-teal-500 focus:ring-teal-500"
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
                  className="rounded border-slate-300 dark:border-slate-600 text-teal-500 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                  Featured Course
                </span>
              </label>
            </div>

            {showPaymentSettings && (
              <div className="md:col-span-2 space-y-4">
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <h3 className="text-md font-medium text-slate-900 dark:text-white mb-4">
                    Payment Settings
                  </h3>
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
                        className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        <option value="NGN">Nigerian Naira (NGN)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="GBP">British Pound (GBP)</option>
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
                        className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        <option value="flutterwave">Flutterwave</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={courseData.paymentDetails.enableInstallments}
                          onChange={(e) =>
                            setCourseData({
                              ...courseData,
                              paymentDetails: {
                                ...courseData.paymentDetails,
                                enableInstallments: e.target.checked,
                              },
                            })
                          }
                          className="rounded border-slate-300 dark:border-slate-600 text-teal-500 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                          Enable Installment Payments
                        </span>
                      </label>
                    </div>

                    {courseData.paymentDetails.enableInstallments && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Maximum Installments
                        </label>
                        <select
                          value={courseData.paymentDetails.maxInstallments}
                          onChange={(e) =>
                            setCourseData({
                              ...courseData,
                              paymentDetails: {
                                ...courseData.paymentDetails,
                                maxInstallments: parseInt(e.target.value),
                              },
                            })
                          }
                          className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="2">2 installments</option>
                          <option value="3">3 installments</option>
                          <option value="4">4 installments</option>
                          <option value="6">6 installments</option>
                        </select>
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={courseData.paymentDetails.earlyBirdDiscount}
                          onChange={(e) =>
                            setCourseData({
                              ...courseData,
                              paymentDetails: {
                                ...courseData.paymentDetails,
                                earlyBirdDiscount: e.target.checked,
                              },
                            })
                          }
                          className="rounded border-slate-300 dark:border-slate-600 text-teal-500 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                          Enable Early Bird Discount
                        </span>
                      </label>
                    </div>

                    {courseData.paymentDetails.earlyBirdDiscount && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Early Bird Price
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <DollarSign className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                              type="number"
                              value={courseData.paymentDetails.earlyBirdPrice}
                              onChange={(e) =>
                                setCourseData({
                                  ...courseData,
                                  paymentDetails: {
                                    ...courseData.paymentDetails,
                                    earlyBirdPrice: e.target.value,
                                  },
                                })
                              }
                              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Early Bird End Date
                          </label>
                          <input
                            type="date"
                            value={courseData.paymentDetails.earlyBirdEndDate}
                            onChange={(e) =>
                              setCourseData({
                                ...courseData,
                                paymentDetails: {
                                  ...courseData.paymentDetails,
                                  earlyBirdEndDate: e.target.value,
                                },
                              })
                            }
                            className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modules Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-lg font-medium text-slate-900 dark:text-white">
              Course Modules
            </h2>
            <button
              type="button"
              onClick={addModule}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Module
            </button>
          </div>

          <div className="space-y-4">
            {courseData.modules.map((module) => (
              <div
                key={module.id}
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <h3 className="text-md font-medium text-slate-900 dark:text-white">
                    Module {module.id}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={module.isPreview}
                        onChange={(e) =>
                          handleModuleChange(module.id - 1, "isPreview", e.target.checked)
                        }
                        className="rounded border-slate-300 dark:border-slate-600 text-teal-500 focus:ring-teal-500"
                      />
                      <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                        Preview
                      </span>
                    </label>
                    {courseData.modules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeModule(module.id - 1)}
                        className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Module Title
                    </label>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) =>
                        handleModuleChange(module.id - 1, "title", e.target.value)
                      }
                      className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter module title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Duration
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        value={module.duration}
                        onChange={(e) =>
                          handleModuleChange(module.id - 1, "duration", e.target.value)
                        }
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="e.g., 45 minutes"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={module.description}
                      onChange={(e) =>
                        handleModuleChange(module.id - 1, "description", e.target.value)
                      }
                      rows={2}
                      className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter module description"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Video Lecture
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="flex items-center px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Video
                      </button>
                      {module.video && (
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          Video uploaded
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      PDF Material
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="flex items-center px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload PDF
                      </button>
                      {module.pdf && (
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          PDF uploaded
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>

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