"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User, ArrowRight, Sun, Moon, Home, Award, TrendingUp, Users, DollarSign, Shield, CheckCircle, AlertTriangle, Mail } from "lucide-react";
import { useTheme } from "next-themes";
import { ButtonLoader } from '@/components/ui/loaders';
import { loginAffiliate, resendAffiliateVerification } from '@/app/affiliate/actions';

function AffiliateLoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [sendingVerification, setSendingVerification] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const message = searchParams.get('message');
    if (message) {
      setError(message);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('identifier', identifier);
      formData.append('password', password);

      const result = await loginAffiliate(formData);

      if (result.success) {
        // Scenario 1: Happy Path - Redirect to appropriate page
        router.push(result.redirectTo!);
      } else if (result.needsVerification) {
        // Scenario 4: Unverified Affiliate - Show verification modal
        setVerificationEmail(result.email || '');
        setShowVerificationModal(true);
      } else if (result.wrongRole) {
        // Scenario 2: Wrong Door - Stay on page with specific error
        setError(result.error || 'Access denied for this account type.');
      } else {
        // Scenario 3: Wrong Password or other errors
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationContinue = async () => {
    setSendingVerification(true);
    try {
      const result = await resendAffiliateVerification(verificationEmail);
      if (result.success) {
        // Redirect to verification page with email
        router.push(`/affiliate/verify-email?email=${encodeURIComponent(verificationEmail)}`);
             } else {
        setError(result.error || 'Failed to send verification email.');
        setShowVerificationModal(false);
      }
    } catch {
      setError('Failed to send verification email. Please try again.');
      setShowVerificationModal(false);
    } finally {
      setSendingVerification(false);
    }
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "Earn Commission",
      description: "Get up to 30% commission on every successful referral"
    },
    {
      icon: Users,
      title: "Track Referrals",
      description: "Monitor your referrals and earnings in real-time"
    },
    {
      icon: DollarSign,
      title: "Flexible Payouts",
      description: "Withdraw your earnings anytime with multiple payment options"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data and earnings are protected with bank-level security"
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
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Affiliate Portal
                  </h1>
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Join our affiliate program and start earning by promoting quality education
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
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">500+</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Active Affiliates</div>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">$50K+</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Total Payouts</div>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                  <div className="text-xl font-bold text-teal-600 dark:text-teal-400">4.9★</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
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
                    Welcome Back
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Sign in to your affiliate account
                  </p>
                </div>
                
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 backdrop-blur-sm">
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="identifier" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email or Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                      </div>
                      <input
                        id="identifier"
                        name="identity"
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-lg"
                        placeholder="Enter your email or username"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-lg"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember"
                        type="checkbox"
                        className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-slate-300 dark:border-slate-600 rounded bg-transparent"
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                        Remember me
                      </label>
                    </div>

                    <Link 
                      href="/affiliate/forgot-password"
                      className="text-sm text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    {loading ? (
                      <>
                        <ButtonLoader />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="text-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Don&apos;t have an affiliate account? </span>
                    <Link 
                      href="/affiliate/signup"
                      className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
                    >
                      Apply now
                    </Link>
                  </div>
                </form>

                {/* Secure Affiliate Logo */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Shield className="h-4 w-4" />
                    <span>Secure affiliate portal</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/20 dark:border-slate-700/50">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Email Verification Required
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Your email has not been verified yet. Would you like to continue with verification?
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Verification email will be sent to:
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {verificationEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerificationContinue}
                  disabled={sendingVerification}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sendingVerification ? (
                    <>
                      <ButtonLoader />
                      Sending...
                    </>
                  ) : (
                    'Continue Verification'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AffiliateLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AffiliateLoginForm />
    </Suspense>
  );
} 