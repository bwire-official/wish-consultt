"use client";

import { 
  Download, 
  Copy, 
  Eye, 
  FileText, 
  Image, 
  Video, 
 
  Share2,
  Search,
  Filter,
  BookOpen,
  Megaphone,

} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";

export default function MaterialsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock promotional materials data
  const materials = [
    {
      id: "1",
      name: "Main Landing Page Banner",
      type: "image",
      category: "banners",
      description: "High-quality banner for website headers and social media",
      size: "1200x600px",
      format: "PNG",
      downloads: 45,
      views: 128,
      url: "/materials/banner-main.png",
      thumbnail: "/materials/thumb-banner-main.png",
      tags: ["banner", "landing", "social media"]
    },
    {
      id: "2",
      name: "Product Showcase Video",
      type: "video",
      category: "videos",
      description: "30-second promotional video highlighting key features",
      size: "1920x1080px",
      format: "MP4",
      downloads: 23,
      views: 67,
      url: "/materials/video-showcase.mp4",
      thumbnail: "/materials/thumb-video-showcase.png",
      tags: ["video", "product", "promotional"]
    },
    {
      id: "3",
      name: "Email Template - Welcome Series",
      type: "document",
      category: "email",
      description: "Professional email template for welcome email series",
      size: "A4",
      format: "HTML",
      downloads: 34,
      views: 89,
      url: "/materials/email-welcome.html",
      thumbnail: "/materials/thumb-email-welcome.png",
      tags: ["email", "template", "welcome"]
    },
    {
      id: "4",
      name: "Social Media Post Pack",
      type: "image",
      category: "social",
      description: "Collection of 10 social media posts for different platforms",
      size: "1080x1080px",
      format: "JPG",
      downloads: 56,
      views: 145,
      url: "/materials/social-pack.zip",
      thumbnail: "/materials/thumb-social-pack.png",
      tags: ["social media", "posts", "collection"]
    },
    {
      id: "5",
      name: "Product Brochure",
      type: "document",
      category: "brochures",
      description: "Comprehensive product brochure with features and benefits",
      size: "A4",
      format: "PDF",
      downloads: 28,
      views: 73,
      url: "/materials/brochure-product.pdf",
      thumbnail: "/materials/thumb-brochure-product.png",
      tags: ["brochure", "product", "features"]
    },
    {
      id: "6",
      name: "Testimonial Video Compilation",
      type: "video",
      category: "testimonials",
      description: "Compilation of customer testimonials and success stories",
      size: "1920x1080px",
      format: "MP4",
      downloads: 19,
      views: 52,
      url: "/materials/video-testimonials.mp4",
      thumbnail: "/materials/thumb-video-testimonials.png",
      tags: ["testimonials", "video", "success stories"]
    }
  ];

  const categories = [
    { id: "all", name: "All Materials", icon: <BookOpen className="h-4 w-4" /> },
    { id: "banners", name: "Banners", icon: <Image className="h-4 w-4" /> }, // eslint-disable-line jsx-a11y/alt-text
    { id: "videos", name: "Videos", icon: <Video className="h-4 w-4" /> },
    { id: "email", name: "Email Templates", icon: <FileText className="h-4 w-4" /> },
    { id: "social", name: "Social Media", icon: <Share2 className="h-4 w-4" /> },
    { id: "brochures", name: "Brochures", icon: <FileText className="h-4 w-4" /> },
    { id: "testimonials", name: "Testimonials", icon: <Megaphone className="h-4 w-4" /> }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-5 w-5" />; // eslint-disable-line jsx-a11y/alt-text
      case 'video': return <Video className="h-5 w-5" />;
      case 'document': return <FileText className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-500';
      case 'video': return 'bg-purple-500';
      case 'document': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Promotional Materials</h1>
          <p className="text-slate-600 dark:text-slate-400">Download and share marketing materials</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300">
          <Download className="h-4 w-4" />
          Download All
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-purple-500 text-white'
                : 'bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/50'
            }`}
          >
            {category.icon}
            {category.name}
          </button>
        ))}
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <GlassCard key={material.id} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${getTypeColor(material.type)} rounded-lg flex items-center justify-center`}>
                {getTypeIcon(material.type)}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                <Eye className="h-3 w-3" />
                {material.views}
              </div>
            </div>

            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{material.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{material.description}</p>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
                {material.size}
              </span>
              <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
                {material.format}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                <Download className="h-3 w-3" />
                {material.downloads} downloads
              </div>
              <div className="flex items-center gap-1">
                {material.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
                {material.tags.length > 2 && (
                  <span className="text-xs text-slate-500">+{material.tags.length - 2}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 text-sm">
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={() => copyToClipboard(material.url)}
                className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                title="Copy link"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Request Custom Materials</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Need specific materials for your campaign? Request custom designs and content.
          </p>
          <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300">
            Request Materials
          </button>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Material Guidelines</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Learn how to use our promotional materials effectively and maintain brand consistency.
          </p>
          <button className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
            View Guidelines
          </button>
        </GlassCard>
      </div>

      {/* Stats */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Material Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{materials.length}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Materials</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {materials.reduce((sum, m) => sum + m.downloads, 0)}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Downloads</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {materials.reduce((sum, m) => sum + m.views, 0)}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Views</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {categories.length - 1}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Categories</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
} 