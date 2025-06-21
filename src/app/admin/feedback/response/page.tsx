"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  MessageSquare,
  Reply,
  Send,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Smile,
  Meh,
  Frown,
  ArrowLeft,
  Save,
  Search,
  Download
} from "lucide-react";
import Image from "next/image";

interface FeedbackResponse {
  id: string;
  feedback_id: string;
  student_name: string;
  student_avatar: string;
  course_name: string;
  rating: number;
  comment: string;
  sentiment: "positive" | "neutral" | "negative";
  date: string;
  status: "pending" | "responded" | "resolved" | "archived";
  admin_response?: string;
  response_date?: string;
  tags: string[];
  priority: "low" | "medium" | "high";
}

const feedbackResponses: FeedbackResponse[] = [
  {
    id: "1",
    feedback_id: "fb_001",
    student_name: "John Doe",
    student_avatar: "https://i.pravatar.cc/40?img=1",
    course_name: "Introduction to Healthcare Analytics",
    rating: 4,
    comment: "Great course content, but the video quality could be improved. Some sections were hard to follow due to audio issues.",
    sentiment: "positive",
    date: "2024-03-15T10:30:00",
    status: "pending",
    tags: ["video quality", "audio", "content"],
    priority: "medium"
  },
  {
    id: "2",
    feedback_id: "fb_002",
    student_name: "Jane Smith",
    student_avatar: "https://i.pravatar.cc/40?img=2",
    course_name: "Advanced Medical AI Applications",
    rating: 2,
    comment: "The course was too advanced for the advertised beginner level. I struggled to keep up and felt overwhelmed.",
    sentiment: "negative",
    date: "2024-03-14T15:45:00",
    status: "responded",
    admin_response: "Thank you for your feedback. We're reviewing the course difficulty and will make adjustments to better match the target audience.",
    response_date: "2024-03-15T09:15:00",
    tags: ["difficulty", "beginner", "overwhelming"],
    priority: "high"
  },
  {
    id: "3",
    feedback_id: "fb_003",
    student_name: "Mike Johnson",
    student_avatar: "https://i.pravatar.cc/40?img=3",
    course_name: "Healthcare Data Science Fundamentals",
    rating: 5,
    comment: "Excellent course! The instructor was very clear and the practical examples were very helpful.",
    sentiment: "positive",
    date: "2024-03-13T12:20:00",
    status: "resolved",
    admin_response: "Thank you for the positive feedback! We're glad you found the course helpful.",
    response_date: "2024-03-13T14:30:00",
    tags: ["instructor", "examples", "helpful"],
    priority: "low"
  },
  {
    id: "4",
    feedback_id: "fb_004",
    student_name: "Sarah Wilson",
    student_avatar: "https://i.pravatar.cc/40?img=4",
    course_name: "Medical Ethics in AI Era",
    rating: 3,
    comment: "The content was good but the platform had some technical issues. Videos wouldn't load properly sometimes.",
    sentiment: "neutral",
    date: "2024-03-12T08:15:00",
    status: "pending",
    tags: ["technical", "platform", "videos"],
    priority: "medium"
  }
];

export default function FeedbackResponsePage() {
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackResponse | null>(null);
  const [responseText, setResponseText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  const stats = [
    {
      name: "Pending Responses",
      value: feedbackResponses.filter(f => f.status === "pending").length.toString(),
      icon: Clock,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      name: "Responded",
      value: feedbackResponses.filter(f => f.status === "responded").length.toString(),
      icon: Reply,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Resolved",
      value: feedbackResponses.filter(f => f.status === "resolved").length.toString(),
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "High Priority",
      value: feedbackResponses.filter(f => f.priority === "high").length.toString(),
      icon: AlertCircle,
      gradient: "from-red-500 to-pink-500"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700";
      case "responded": return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700";
      case "resolved": return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700";
      case "archived": return "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-700";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <Smile className="h-4 w-4 text-green-500" />;
      case "neutral": return <Meh className="h-4 w-4 text-yellow-500" />;
      case "negative": return <Frown className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const filteredFeedback = feedbackResponses.filter(feedback => {
    const matchesSearch = feedback.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feedback.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feedback.course_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || feedback.status === selectedStatus;
    const matchesPriority = selectedPriority === "all" || feedback.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSendResponse = () => {
    if (selectedFeedback && responseText.trim()) {
      // Here you would typically send the response to your backend
      console.log(`Sending response to feedback ${selectedFeedback.id}:`, responseText);
      setResponseText("");
      setSelectedFeedback(null);
    }
  };

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
                <Reply className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Feedback Responses</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">Manage and respond to user feedback</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm">
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <GlassCard key={stat.name} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback List */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search feedback..."
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
                    <option value="pending">Pending</option>
                    <option value="responded">Responded</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archived</option>
                  </select>

                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="px-3 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredFeedback.map((feedback) => (
                  <div
                    key={feedback.id}
                    onClick={() => setSelectedFeedback(feedback)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedFeedback?.id === feedback.id
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600"
                        : "bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-700/70"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={feedback.student_avatar}
                          alt={feedback.student_name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {feedback.student_name}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {feedback.course_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {feedback.rating}
                          </span>
                        </div>
                        {getSentimentIcon(feedback.sentiment)}
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 line-clamp-2">
                      {feedback.comment}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(feedback.status)}`}>
                          {feedback.status}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(feedback.priority)}`}>
                          {feedback.priority}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(feedback.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Response Panel */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 h-fit">
              {selectedFeedback ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Respond to Feedback</h3>
                    <button
                      onClick={() => setSelectedFeedback(null)}
                      className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Response
                      </label>
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Type your response here..."
                        rows={6}
                        className="w-full px-3 py-2 bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-600/50 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm resize-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSendResponse}
                        disabled={!responseText.trim()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      >
                        <Send className="h-4 w-4" />
                        Send Response
                      </button>
                      <button className="px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Save className="h-4 w-4" />
                      </button>
                    </div>

                    {selectedFeedback.admin_response && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-green-800 dark:text-green-300">
                            Previous Response
                          </span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          {selectedFeedback.admin_response}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                          {selectedFeedback.response_date && new Date(selectedFeedback.response_date).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Select Feedback
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Choose a feedback item from the list to respond to it
                  </p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
} 