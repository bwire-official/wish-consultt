"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, Sun, Moon, Home, Award, Shield, CheckCircle, Clock, Lock } from "lucide-react";
import { useTheme } from "next-themes";
import { ButtonLoader } from '@/components/ui/loaders';

export default function AffiliateVerifyEmailPage() {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join("");
    
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Implement verification logic
      console.log('Verifying code:', code);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setIsLoading(false);
    } catch (error) {
      console.error('Verification error:', error);
      setError('Invalid verification code. Please try again.');
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setResendCountdown(60);
      // TODO: Implement resend logic
      console.log('Resending verification code');
    } catch {
      setError('Failed to resend code. Please try again.');
    }
  };

  const benefits = [
    {
      icon: Shield,
      title: "Secure Verification",
      description: "Your email is verified with bank-level security"
    },
    {
      icon: Clock,
      title: "Quick Process",
      description: "Complete verification in under 2 minutes"
    },
    {
      icon: Lock,
      title: "Account Protection",
      description: "Keep your affiliate account safe and secure"
    },
    {
      icon: CheckCircle,
      title: "Instant Access",
      description: "Get immediate access to your dashboard"
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
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Email Verification
                  </h1>
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Verify your email to complete your affiliate account setup
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
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">6-digit</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Security Code</div>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">&lt;2min</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Verification</div>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                  <div className="text-xl font-bold text-teal-600 dark:text-teal-400">100%</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Secure</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Verify Email Form */}
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
                    Verify Your Email
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Verification Code Input */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">
                      Verification Code
                    </label>
                    <div className="flex justify-center gap-3">
                      {verificationCode.map((digit, index) => (
                        <input
                          key={index}
                          id={`code-${index}`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleCodeChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-12 h-12 text-center text-lg font-semibold bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors rounded-lg"
                          placeholder="0"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || verificationCode.join("").length !== 6}
                    className="w-full flex justify-center items-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <>
                        <ButtonLoader />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Email
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Resend Code */}
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Didn&apos;t receive the code?
                  </p>
                  <button
                    onClick={handleResendCode}
                    disabled={resendCountdown > 0}
                    className="text-sm text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendCountdown > 0 
                      ? `Resend in ${resendCountdown}s` 
                      : "Resend verification code"
                    }
                  </button>
                </div>

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
                    <span>Secure email verification</span>
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