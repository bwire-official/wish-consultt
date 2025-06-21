"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Settings,
  Shield,
  CreditCard,
  Zap,
  Palette,
  Bell,
  Database,
  Save,
  CheckCircle
} from "lucide-react";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const sections = [
    { id: "general", label: "General", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "ai", label: "AI Settings", icon: Zap },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "integrations", label: "Integrations", icon: Database }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">System Settings</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-300">Manage platform configuration and preferences</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {showSuccess && (
          <GlassCard className="p-4 mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Settings saved successfully!</span>
            </div>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <GlassCard className="p-4">
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeSection === section.id
                          ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-300/30 dark:border-blue-600/30 text-blue-700 dark:text-blue-300"
                          : "text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </GlassCard>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <GlassCard className="p-6">
              {activeSection === "general" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">General Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Wish Consult"
                        className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Platform URL
                      </label>
                      <input
                        type="url"
                        defaultValue="https://wishconsult.com"
                        className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Platform Description
                      </label>
                      <textarea
                        className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300"
                        rows={3}
                        defaultValue="AI-Powered Healthcare Education Platform"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "security" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Security Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-700/50">
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Require 2FA for all admin accounts</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Enable
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-700/50">
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">Session Timeout</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Auto-logout after 30 minutes of inactivity</p>
                      </div>
                      <button className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors">
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "payments" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Payment Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-700/50">
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">Stripe Integration</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Primary payment processor</p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 rounded-full">
                        Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-700/50">
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">PayPal Integration</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Alternative payment method</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "ai" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">AI Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-700/50">
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">AI Course Recommendations</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Enable AI-powered course suggestions</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Enable
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-700/50">
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">AI Content Generation</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Generate course content with AI</p>
                      </div>
                      <button className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors">
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "appearance" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Appearance Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Theme
                      </label>
                      <select className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Primary Color
                      </label>
                      <select className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-all duration-300">
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="purple">Purple</option>
                        <option value="orange">Orange</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Notification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-700/50">
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">Email Notifications</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive email alerts for important events</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Configure
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-700/50">
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">System Alerts</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Get notified about system issues</p>
                      </div>
                      <button className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors">
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "integrations" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Integrations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">Google Analytics</h3>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 rounded-full">
                          Connected
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Website analytics and tracking</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">Mailchimp</h3>
                        <button className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-full">
                          Connect
                        </button>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Email marketing automation</p>
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
} 