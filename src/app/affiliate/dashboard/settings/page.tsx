"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { 
  User, 
  Shield, 
  Bell, 
  Settings as SettingsIcon,
  Camera,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  CreditCard,
  Palette,

  Mail,
  Smartphone,
  Zap
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: "John Doe",
    username: "johndoe",
    email: "john.doe@email.com",
    phone_number: "+1 (555) 123-4567",
    bio: "Affiliate marketer specializing in healthcare education"
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    commissionAlerts: true,
    payoutNotifications: true,
    marketingEmails: false,
    weeklyDigest: true,
    newMaterials: true
  });

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    theme: "system",
    currency: "USD"
  });

  const [paymentSettings, setPaymentSettings] = useState({
    autoPayout: false,
    minimumPayout: 50,
    payoutSchedule: "monthly",
    taxDocuments: true
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "preferences", label: "Preferences", icon: SettingsIcon }
  ];

  const handlePhotoUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Uploading photo:", file.name);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleButton = ({ checked, onChange, disabled = false }: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) => (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
        checked 
          ? 'bg-gradient-to-r from-purple-500 to-indigo-500' 
          : 'bg-slate-200 dark:bg-slate-700'        
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Manage your affiliate account preferences and settings
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg disabled:opacity-50"
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
        <GlassCard className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Settings saved successfully!</span>
          </div>
        </GlassCard>
      )}

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <GlassCard className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </GlassCard>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Profile Information
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Update your personal information and profile details
                </p>
              </div>

              {/* Profile Photo */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-purple-500 rounded-full hover:bg-purple-600 transition-colors cursor-pointer">
                    <Camera className="h-4 w-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload(file);
                      }}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                    Profile Photo
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Upload a new profile photo
                  </p>
                  {isUploading && (
                    <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Uploading...
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                    className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                    className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone_number}
                    onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                    className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Security Settings
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage your password and account security
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                      className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                      className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-700/50">
                <div>
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">Two-Factor Authentication</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Add an extra layer of security to your account</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors">
                  Enable
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Notification Preferences
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Choose how and when you want to be notified
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-700/50">
                    <div className="flex items-center gap-3">
                      {key.includes('email') && <Mail className="h-5 w-5 text-blue-500" />}
                      {key.includes('push') && <Smartphone className="h-5 w-5 text-green-500" />}
                      {key.includes('commission') && <Zap className="h-5 w-5 text-yellow-500" />}
                      {key.includes('payout') && <CreditCard className="h-5 w-5 text-purple-500" />}
                      {key.includes('marketing') && <Bell className="h-5 w-5 text-red-500" />}
                      {key.includes('weekly') && <Bell className="h-5 w-5 text-indigo-500" />}
                      {key.includes('materials') && <Bell className="h-5 w-5 text-purple-500" />}
                      <div>
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Receive notifications about {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <ToggleButton
                      checked={value}
                      onChange={(checked) => setNotificationSettings({...notificationSettings, [key]: checked})}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Payment Settings
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Configure your payout preferences and payment methods
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Minimum Payout Amount
                  </label>
                  <input
                    type="number"
                    value={paymentSettings.minimumPayout}
                    onChange={(e) => setPaymentSettings({...paymentSettings, minimumPayout: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Payout Schedule
                  </label>
                  <select
                    value={paymentSettings.payoutSchedule}
                    onChange={(e) => setPaymentSettings({...paymentSettings, payoutSchedule: e.target.value})}
                    className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-700/50">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">Automatic Payouts</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Automatically process payouts when minimum amount is reached</p>
                  </div>
                  <ToggleButton
                    checked={paymentSettings.autoPayout}
                    onChange={(checked) => setPaymentSettings({...paymentSettings, autoPayout: checked})}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-700/50">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">Tax Documents</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Automatically generate tax documents for earnings</p>
                  </div>
                  <ToggleButton
                    checked={paymentSettings.taxDocuments}
                    onChange={(checked) => setPaymentSettings({...paymentSettings, taxDocuments: checked})}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Account Preferences
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Customize your account settings and preferences
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Language
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                    className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Timezone
                  </label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                    className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                    <option value="GMT">GMT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date Format
                  </label>
                  <select
                    value={preferences.dateFormat}
                    onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
                    className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Currency
                  </label>
                  <select
                    value={preferences.currency}
                    onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                    className="w-full px-3 py-2 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 dark:bg-slate-700/50">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-purple-500" />
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">Theme</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Choose your preferred theme</p>
                  </div>
                </div>
                <select
                  value={preferences.theme}
                  onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                  className="px-3 py-2 bg-transparent border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300"
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 