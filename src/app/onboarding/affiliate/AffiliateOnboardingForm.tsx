"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Award, Home, User, Sun, Moon } from "lucide-react";
import Link from "next/link";

interface AffiliateOnboardingFormProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onComplete: () => void;
}

export default function AffiliateOnboardingForm({ 
  currentStep, 
  setCurrentStep, 
  onComplete 
}: AffiliateOnboardingFormProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Welcome (no data needed)
    
    // Step 2: Public Identity
    username: "",
    
    // Step 3: Audience Information
    websiteUrl: "",
    promotionMethods: [] as string[],
    
    // Step 4: Personal Information (Optional)
    fullName: "",
    nationality: "",
    gender: "",
    
    // Step 5: Profile Picture
    profilePicture: null as File | null,
    
    // Step 6: Success (no data needed)
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 6;

  const handleInputChange = (field: string, value: string | string[] | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // TODO: Submit onboarding data
    console.log("Submitting affiliate onboarding:", formData);
    onComplete();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Welcome to the Wish Consult Affiliate Program!
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Let&apos;s set up your partner account. It&apos;ll just take a moment to get you ready to start earning.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">
                What you&apos;ll get:
              </h3>
              <ul className="text-left space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Your unique referral link to share
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Commission tracking dashboard
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Marketing materials and support
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Secure payment setup when you&apos;re ready to withdraw
                </li>
              </ul>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Choose Your Unique Username
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                This will be your public identity and part of your referral link
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Username *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-transparent border-b-2 ${
                      errors.username 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400'
                    } text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors text-lg`}
                    placeholder="Enter your username"
                  />
                </div>
                {errors.username && (
                  <p className="text-red-600 dark:text-red-400 text-sm">{errors.username}</p>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm">
                  Your referral link will be:
                </h4>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                  <code className="text-sm text-blue-700 dark:text-blue-300">
                    {formData.username ? `https://wishconsult.com/?ref=${formData.username}` : 'https://wishconsult.com/?ref=your-username'}
                  </code>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 text-sm">
                  Username Requirements:
                </h4>
                <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                  <li>• At least 3 characters long</li>
                  <li>• Only letters, numbers, and underscores</li>
                  <li>• Must be unique across all users</li>
                  <li>• Cannot be changed later</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                How Will You Promote Us?
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Help us understand your marketing approach
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="websiteUrl" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Website/Social Media Link (Optional)
                </label>
                <input
                  type="url"
                  id="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors text-lg"
                  placeholder="https://your-blog.com or @your-handle"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Promotion Methods *
                </label>
                <div className="space-y-2">
                  {[
                    "Blog or Website Content",
                    "Social Media (Instagram, Twitter, etc.)",
                    "YouTube Channel",
                    "Email Newsletter",
                    "Word of Mouth / Direct Sharing",
                    "Other"
                  ].map((method) => (
                    <label key={method} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.promotionMethods.includes(method)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleInputChange("promotionMethods", [...formData.promotionMethods, method]);
                          } else {
                            handleInputChange("promotionMethods", formData.promotionMethods.filter(m => m !== method));
                          }
                        }}
                        className="w-4 h-4 text-purple-600 bg-transparent border-slate-300 dark:border-slate-600 rounded focus:ring-purple-500 dark:focus:ring-purple-400"
                      />
                      <span className="text-slate-700 dark:text-slate-300">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                About You (Optional)
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Help us understand our affiliate community better
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors text-lg"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="nationality" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Nationality
                </label>
                <select
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange("nationality", e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400 text-slate-900 dark:text-white focus:outline-none transition-colors text-lg"
                >
                  <option value="">Select your nationality</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="IN">India</option>
                  <option value="BR">Brazil</option>
                  <option value="MX">Mexico</option>
                  <option value="NG">Nigeria</option>
                  <option value="KE">Kenya</option>
                  <option value="ZA">South Africa</option>
                  <option value="GH">Ghana</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Gender
                </label>
                <div className="space-y-2">
                  {["Male", "Female", "Prefer not to say"].map((gender) => (
                    <label key={gender} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className="w-4 h-4 text-purple-600 bg-transparent border-slate-300 dark:border-slate-600 focus:ring-purple-500 dark:focus:ring-purple-400"
                      />
                      <span className="text-slate-700 dark:text-slate-300">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Upload Your Profile Picture
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Add a professional photo to your affiliate profile
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full border-2 border-dashed border-purple-300 dark:border-purple-600 flex items-center justify-center cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
                  {formData.profilePicture ? (
                    <img
                      src={URL.createObjectURL(formData.profilePicture)}
                      alt="Profile preview"
                      className="w-full h-full rounded-full object-cover"
                      // eslint-disable-next-line @next/next/no-img-element
                    />
                  ) : (
                    <div className="text-center">
                      <User className="h-8 w-8 text-purple-400 dark:text-purple-500 mx-auto mb-2" />
                      <p className="text-xs text-purple-600 dark:text-purple-400">Upload Photo</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center">
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleInputChange("profilePicture", file);
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="profilePicture"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-purple-300 dark:border-purple-600 rounded-xl text-sm font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 cursor-pointer"
                >
                  Choose File
                </label>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm">
                  Photo Requirements:
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• JPG, PNG, or GIF format</li>
                  <li>• Maximum 5MB file size</li>
                  <li>• Square aspect ratio recommended</li>
                  <li>• Professional appearance preferred</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      case 6:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                You&apos;re Ready to Start Earning!
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Your affiliate account is now set up. Here&apos;s your unique referral link:
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">
                Your Referral Link:
              </h3>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700 flex items-center justify-between">
                <code className="text-sm text-purple-700 dark:text-purple-300 flex-1 text-left">
                  {formData.username ? `https://wishconsult.com/?ref=${formData.username}` : 'https://wishconsult.com/?ref=your-username'}
                </code>
                <button className="ml-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors">
                  Copy Link
                </button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Next Steps:
              </h3>
              <ul className="text-left space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Share your referral link with your audience
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Track your performance in your dashboard
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Access marketing materials and resources
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Set up payment details when ready to withdraw
                </li>
              </ul>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center text-slate-600 dark:text-slate-400">
            Step {currentStep} content coming soon...
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-lg">
            <Home className="h-5 w-5" /> Wish Consult
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 backdrop-blur-sm"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              )}
            </button>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl p-8">
          {/* Step Content */}
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="flex items-center gap-3">
              {currentStep === 4 && (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Skip This Step
                </button>
              )}
              
              {currentStep === 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Begin Setup
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : currentStep === 4 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Save & Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : currentStep === 6 ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Go to My Affiliate Dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Complete Setup
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}