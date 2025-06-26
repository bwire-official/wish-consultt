"use client";

import { useState } from "react";
import Link from "next/link";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,  
  Globe, 
  ArrowRight, 
  Award,
  Moon,
  Sun,
  Home,
  TrendingUp,
  Users,
  DollarSign,
  Shield,
  CheckCircle
} from "lucide-react";
import { useTheme } from "next-themes";
import { ButtonLoader } from '@/components/ui/loaders';

export default function AffiliateSignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    website: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const { theme, setTheme } = useTheme();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(""); // Clear error when user types
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      phone: value || ""
    }));
    setError("");
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return "Full name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Please enter a valid email";
    if (!formData.phone.trim()) return "Phone number is required";
    return null;
  };

  const validateStep2 = () => {
    const passwordError = validatePassword(formData.password);
    if (passwordError) return passwordError;
    if (formData.password !== formData.confirmPassword) return "Passwords do not match";
    if (!formData.agreeToTerms) return "You must agree to the terms and conditions";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateStep2();
    if (error) {
      setError(error);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Implement affiliate signup logic
      console.log('Affiliate signup:', formData);
      setIsLoading(false);
    } catch (error) {
      console.error('Signup error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    const error = validateStep1();
    if (error) {
      setError(error);
      return;
    }
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "High Commission Rates",
      description: "Earn up to 30% commission on every successful referral"
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Get personalized support from our affiliate team"
    },
    {
      icon: DollarSign,
      title: "Monthly Payouts",
      description: "Receive your earnings monthly via PayPal or bank transfer"
    },
    {
      icon: Shield,
      title: "Secure Tracking",
      description: "Advanced tracking system ensures you get credit for all referrals"
    }
  ];

  const requirements = [
    "Have an active website, blog, or social media presence",
    "Agree to our affiliate terms and conditions",
    "Provide accurate contact and payment information",
    "Maintain ethical marketing practices",
    "Minimum 100 monthly visitors to your platform"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-teal-900/20 relative overflow-hidden">
      {/* Custom styles for phone input */}
      <style jsx global>{`
        .PhoneInput {
          position: relative;
        }
        
        .PhoneInputCountry {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
        }
        
        .PhoneInputInput {
          padding-left: 60px !important;
          background: transparent !important;
          border: none !important;
          border-bottom: 2px solid #cbd5e1 !important;
          border-radius: 0 !important;
          outline: none !important;
          box-shadow: none !important;
          font-size: 1.125rem !important;
          color: #1e293b !important;
          transition: border-color 0.2s !important;
          width: 100% !important;
          padding-top: 12px !important;
          padding-bottom: 12px !important;
        }
        
        .PhoneInputInput:focus {
          border-bottom-color: #8b5cf6 !important;
        }
        
        .dark .PhoneInputInput {
          border-bottom-color: #475569 !important;
          color: #f8fafc !important;
        }
        
        .dark .PhoneInputInput:focus {
          border-bottom-color: #a855f7 !important;
        }
        
        .PhoneInputInput::placeholder {
          color: #94a3b8 !important;
        }
        
        .dark .PhoneInputInput::placeholder {
          color: #64748b !important;
        }
        
        .PhoneInputCountrySelectArrow {
          border-color: #94a3b8 !important;
        }
        
        .dark .PhoneInputCountrySelectArrow {
          border-color: #64748b !important;
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Benefits & Info */}
          <div className="hidden lg:block">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Join Our Affiliate Program
                  </h1>
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Start earning by promoting quality education and helping students succeed
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm">
                        {benefit.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Requirements */}
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Requirements
                </h3>
                <ul className="space-y-1">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">$2K+</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Avg. Monthly</div>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">30%</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Commission</div>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                  <div className="text-xl font-bold text-teal-600 dark:text-teal-400">24h</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Approval</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <Link href="/" className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-lg">
                  <Home className="h-5 w-5" /> Wish Consult
                </Link>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>

              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl p-6 space-y-5">
                <div className="text-center mb-5">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    Create Affiliate Account
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Step {currentStep} of 2
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${currentStep * 50}%` }}
                    ></div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {currentStep === 1 ? (
                    <>
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          </div>
                          <input
                            type="text"
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-lg"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-lg"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Phone Number
                        </label>
                        <div className="relative">
                          <PhoneInput
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            placeholder="Enter your phone number"
                            defaultCountry="US"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="website" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Website (Optional)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Globe className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          </div>
                          <input
                            type="url"
                            id="website"
                            value={formData.website}
                            onChange={(e) => handleInputChange("website", e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-lg"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!formData.fullName || !formData.email || !formData.phone}
                        className="w-full flex justify-center items-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        Next Step
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            className="w-full pl-10 pr-12 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-lg"
                            placeholder="Create a strong password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {formData.password && (
                          <div className={`text-xs ${formData.password.length >= 6 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formData.password.length >= 6 ? '✓ Password meets minimum requirements' : '✗ Password must be at least 6 characters'}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            className="w-full pl-10 pr-12 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-lg"
                            placeholder="Confirm your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        {formData.confirmPassword && (
                          <div className={`text-xs ${formData.password === formData.confirmPassword ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                          </div>
                        )}
                      </div>

                      <div className="flex items-start gap-3 mb-5">
                        <input
                          type="checkbox"
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                          className="mt-1 w-4 h-4 text-purple-500 focus:ring-purple-500 border-slate-300 dark:border-slate-600 rounded bg-transparent"
                          required
                        />
                        <label htmlFor="agreeToTerms" className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          I agree to the{" "}
                          <a href="#" className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 font-medium">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 font-medium">
                            Privacy Policy
                          </a>
                        </label>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex-1 py-3 px-6 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 backdrop-blur-sm"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading || !formData.password || !formData.confirmPassword || !formData.agreeToTerms}
                          className="flex-1 flex justify-center items-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                        >
                          {isLoading ? (
                            <>
                              <ButtonLoader />
                              Creating account...
                            </>
                          ) : (
                            <>
                              Create Account
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </form>

                <div className="text-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Already have an affiliate account? </span>
                  <Link 
                    href="/affiliate/login"
                    className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </div>

                {/* Secure Affiliate Logo */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Shield className="h-4 w-4" />
                    <span>Secure affiliate registration</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
