"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, Sun, Moon, Home, Award, Users, Shield, CheckCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { ButtonLoader } from '@/components/ui/loaders';

export default function AffiliateForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // TODO: Implement forgot password logic
      console.log('Sending reset email to:', email);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setSuccess(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Failed to send reset email. Please try again.');
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: Shield,
      title: "Secure Reset Process",
      description: "Your password reset is protected with bank-level security"
    },
    {
      icon: Mail,
      title: "Instant Delivery",
      description: "Reset instructions sent immediately to your email"
    },
    {
      icon: CheckCircle,
      title: "Easy Recovery",
      description: "Simple steps to regain access to your account"
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Get help anytime if you encounter any issues"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-teal-900/20 relative overflow-hidden">
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
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Password Recovery
                  </h1>
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Don&apos;t worry! We&apos;ll help you get back into your affiliate account
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

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">99.9%</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Success Rate</div>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">&lt;1min</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Delivery Time</div>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                  <div className="text-xl font-bold text-teal-600 dark:text-teal-400">24/7</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Forgot Password Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <Link href="/" className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-lg">
                  <Home className="h-5 w-5" /> Wish Consult
                </Link>
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                  >
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>
                )}
              </div>

              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl p-6 space-y-5">
                <div className="text-center mb-5">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    Forgot Password
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Enter your email to reset your password
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                      Password reset email sent! Please check your inbox and follow the instructions.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-lg"
                        placeholder="Enter your email address"
                        disabled={success}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || success}
                    className="w-full flex justify-center items-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <>
                        <ButtonLoader />
                        Sending reset email...
                      </>
                    ) : (
                      <>
                        Send Reset Email
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Back to Login */}
                <div className="text-center">
                  <Link 
                    href="/affiliate/login"
                    className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Link>
                </div>

                {/* Secure Affiliate Logo */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Shield className="h-4 w-4" />
                    <span>Secure password recovery</span>
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