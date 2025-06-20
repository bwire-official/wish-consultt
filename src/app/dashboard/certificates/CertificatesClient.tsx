"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { ButtonLoader } from "@/components/ui/loaders";
import { 
  Award, 
  Download, 
  Eye, 
  Star,
  Filter,
  Search,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export function CertificatesClient() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  // Mock certificates data
  const certificates = [
    {
      id: "1",
      title: "Advanced Cardiac Life Support (ACLS)",
      issuer: "American Heart Association",
      issueDate: "2024-01-15",
      expiryDate: "2026-01-15",
      status: "active",
      category: "emergency",
      score: 95,
      hours: 16,
      image: "/certificates/acls.png"
    },
    {
      id: "2",
      title: "Basic Life Support (BLS)",
      issuer: "American Heart Association",
      issueDate: "2023-11-20",
      expiryDate: "2025-11-20",
      status: "active",
      category: "emergency",
      score: 98,
      hours: 8,
      image: "/certificates/bls.png"
    },
    {
      id: "3",
      title: "Pediatric Advanced Life Support (PALS)",
      issuer: "American Heart Association",
      issueDate: "2024-02-10",
      expiryDate: "2026-02-10",
      status: "active",
      category: "pediatrics",
      score: 92,
      hours: 14,
      image: "/certificates/pals.png"
    },
    {
      id: "4",
      title: "Advanced Trauma Life Support (ATLS)",
      issuer: "American College of Surgeons",
      issueDate: "2023-09-05",
      expiryDate: "2025-09-05",
      status: "active",
      category: "trauma",
      score: 89,
      hours: 20,
      image: "/certificates/atls.png"
    },
    {
      id: "5",
      title: "Neonatal Resuscitation Program (NRP)",
      issuer: "American Academy of Pediatrics",
      issueDate: "2023-12-01",
      expiryDate: "2025-12-01",
      status: "expired",
      category: "neonatal",
      score: 94,
      hours: 12,
      image: "/certificates/nrp.png"
    }
  ];

  const filters = [
    { value: "all", label: "All Certificates" },
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
    { value: "emergency", label: "Emergency Medicine" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "trauma", label: "Trauma" },
    { value: "neonatal", label: "Neonatal" }
  ];

  const filteredCertificates = certificates.filter(cert => {
    const matchesFilter = selectedFilter === "all" || cert.status === selectedFilter || cert.category === selectedFilter;
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDownload = async (certificateId: string) => {
    setIsDownloading(certificateId);
    try {
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Here you would implement actual download logic
      console.log(`Downloading certificate ${certificateId}`);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      case "expired":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "emergency":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
      case "pediatrics":
        return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30";
      case "trauma":
        return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30";
      case "neonatal":
        return "text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30";
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
                My Certificates
              </h1>
              <p className="text-lg text-slate-700 dark:text-slate-300">
                Manage and track your professional certifications
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 px-3 py-1 rounded-full">
                {filteredCertificates.length} of {certificates.length} certificates
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
                placeholder="Search certificates..."
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
                <span className="hidden sm:inline">
                  {filters.find(f => f.value === selectedFilter)?.label || "Filter"}
                </span>
                {isFilterOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-xl shadow-xl z-10">
                  <div className="p-2">
                    {filters.map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => {
                          setSelectedFilter(filter.value);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedFilter === filter.value
                            ? "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => (
            <GlassCard key={certificate.id} className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              {/* Certificate Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg leading-tight">
                      {certificate.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {certificate.issuer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {certificate.score}%
                  </span>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(certificate.status)}`}>
                    {certificate.status === "active" ? "Active" : "Expired"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Category:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(certificate.category)}`}>
                    {certificate.category.charAt(0).toUpperCase() + certificate.category.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Duration:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {certificate.hours}h
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Issued:</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {new Date(certificate.issueDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Expires:</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {new Date(certificate.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Certificate Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => handleDownload(certificate.id)}
                  disabled={isDownloading === certificate.id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isDownloading === certificate.id ? (
                    <>
                      <ButtonLoader width={16} />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download
                    </>
                  )}
                </button>
                
                <button className="flex items-center justify-center px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Empty State */}
        {filteredCertificates.length === 0 && (
          <GlassCard className="p-12 text-center">
            <Award className="h-20 w-20 text-slate-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              No certificates found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
              {searchQuery || selectedFilter !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "You haven't earned any certificates yet. Complete courses to earn your first certificate!"
              }
            </p>
            {!searchQuery && selectedFilter === "all" && (
              <button className="px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg">
                Browse Courses
              </button>
            )}
          </GlassCard>
        )}
      </div>
    </div>
  );
} 